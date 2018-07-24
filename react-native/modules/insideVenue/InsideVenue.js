import PropTypes             from 'prop-types'
import React                 from 'react'
import {View, StyleSheet, Text, Button} from 'react-native'
import Meteor, {withTracker} from 'react-native-meteor'
import { Redirect, withRouter } from 'react-router-native'

import venuesCache from '/modules/cache/venues'
import PlayerList  from './PlayerList'

@withTracker(({venueOsmId}) => {
  console.log("inside")
  Meteor.subscribe('players.insideVenue', venueOsmId)
  const player  = Meteor.collection('players').findOne({userId: Meteor.userId()})
  const players = Meteor.collection('players').find({venueOsmId, _id: {$ne: player._id}})
    .map((obj) => {
      const room = Meteor.collection('chat_rooms').findOne({
        playerIds: {$all: [obj._id, player._id], $size: 2}
      })
      if(!room) return obj
      console.log(room._id)
      Meteor.subscribe('chat.messages', room._id)
      const newMessages = Meteor.collection('chat_messages').find(
        {roomId: room._id, acks: {$ne: player._id}, playerId: {$ne: player._id}},
        {fields: {roomId: 1}, sort: {createdAt: -1}}
      )
      return { ...obj, newMessages: newMessages.length }
    })
  return {
    venueOsmId,
    players,
  }
})
@withRouter
export default class InsideVenue extends React.Component {
  static propTypes = {
    venueOsmId:  PropTypes.string.isRequired,
    players:     PropTypes.array,
  }
  state = {}
  constructor(props) {
    super(props)
    venuesCache.getItem(props.venueOsmId)
      .then(venue => {
        if(!venue) {
          return this.leaveVenue()
        }
        this.setState({venue})
      })
  }
  render() {
    const {players} = this.props
    const {venue, venueOsmId} = this.state
    if(!venueOsmId) {
      <Redirect to='/' />
    }
    if(!venue || !players) {
      return (
        <View style={styles.container}>
          <Text>Chargement...</Text>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <Text>{venue.properties.name} ({players.length})</Text>
        <PlayerList {...{players}} />
        <Button title="scanner"  onPress={this.scan} />
        <Button title="trouvé !" onPress={this.found} />
        <Button title="sortir"   onPress={this.leaveVenue} />
      </View>
    )
  }
  found = () => {
    this.props.history.push('/show-qrcode')
  }
  scan = () => {
    this.props.history.push('/scan')
  }
  leaveVenue = () => {
    Meteor.call('players.leaveVenue')
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
