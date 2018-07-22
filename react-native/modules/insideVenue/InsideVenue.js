import PropTypes             from 'prop-types'
import React                 from 'react'
import {View, StyleSheet, Text, Button} from 'react-native'
import Meteor, {withTracker} from 'react-native-meteor'
import { Redirect } from 'react-router-native'

import venuesCache from '/modules/cache/venues'
import getRoomId   from '/modules/chat/getRoomId'
import PlayerList  from './PlayerList'

@withTracker(({venueOsmId}) => {
  console.log("inside")
  Meteor.subscribe('players.insideVenue', venueOsmId)
  const player  = Meteor.collection('players').findOne({userId: Meteor.userId()})
  const players = Meteor.collection('players').find({venueOsmId, _id: {$ne: player._id}})
    .map((obj) => {
      const room = getRoomId(obj._id, player._id)
      Meteor.subscribe('chat.messages', room)
      const newMessages = Meteor.collection('chat_messages').find(
        {room, acks: {$ne: player._id}, playerId: {$ne: player._id}},
        {fields: {room: 1}, sort: {createdAt: -1}}
      )
      return { ...obj, room, newMessages: newMessages.length }
    })
  return {
    venueOsmId,
    players,
  }
})
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
  /*componentWillUnmount() {
    this.leaveVenue()
  }*/
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
        <Button title="sortir" onPress={this.leaveVenue} />
      </View>
    )
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
