import PropTypes             from 'prop-types'
import React                 from 'react'
import {View, StyleSheet, Text, Button} from 'react-native'
import Meteor, {withTracker} from 'react-native-meteor'
import { Redirect, withRouter } from 'react-router-native'

import venuesCache from '/modules/cache/venues'
import UserList  from './UserList'

@withTracker(({venueOsmId}) => {
  console.log("inside")
  Meteor.subscribe('users.insideVenue', venueOsmId)
  const userId  = Meteor.userId()
  const users = Meteor.collection('users').find({venueOsmId, _id: {$ne: userId}})
    .map((obj) => {
      const room = Meteor.collection('chat_rooms').findOne({
        userIds: {$all: [obj._id, userId], $size: 2}
      })
      if(!room) return obj
      console.log(room._id)
      Meteor.subscribe('chat.messages', room._id)
      const newMessages = Meteor.collection('chat_messages').find(
        {roomId: room._id, acks: {$ne: userId}, userId: {$ne: userId}},
        {fields: {roomId: 1}, sort: {createdAt: -1}}
      )
      return { ...obj, newMessages: newMessages.length }
    })
  return {
    venueOsmId,
    users,
  }
})
@withRouter
export default class InsideVenue extends React.Component {
  static propTypes = {
    history:     PropTypes.object.isRequired,
    venueOsmId:  PropTypes.string.isRequired,
    users:       PropTypes.array,
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
    const {users} = this.props
    const {venue, venueOsmId} = this.state
    if(!venueOsmId) {
      <Redirect to='/' />
    }
    if(!venue || !users) {
      return (
        <View style={styles.container}>
          <Text>Chargement...</Text>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <Text>{venue.properties.name} ({users.length})</Text>
        <UserList {...{users}} />
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
    Meteor.call('users.leaveVenue')
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
