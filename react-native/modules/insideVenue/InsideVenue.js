import PropTypes             from 'prop-types'
import React                 from 'react'
import {View, StyleSheet, Text, Button, Modal, TouchableHighlight} from 'react-native'
import Meteor, {withTracker} from 'react-native-meteor'
import { Redirect, withRouter } from 'react-router-native'

import venuesCache   from '/modules/cache/venues'
import EnteringModal from './EnteringModal'
import UserList      from './UserList'

@withTracker(({venueOsmId}) => {
  console.log("inside")
  Meteor.subscribe('users.insideVenue', venueOsmId)
  const user  = Meteor.user()
  const users = Meteor.collection('users').find({venueOsmId, _id: {$ne: user._id}})
    .map((obj) => {
      const room = Meteor.collection('chat_rooms').findOne({
        userIds: {$all: [obj._id, user._id], $size: 2}
      })
      if(!room) return obj
      console.log(room._id)
      Meteor.subscribe('chat.messages', room._id)
      const newMessages = Meteor.collection('chat_messages').find(
        {roomId: room._id, acks: {$ne: user._id}, userId: {$ne: user._id}},
        {fields: {roomId: 1}, sort: {createdAt: -1}}
      )
      return { ...obj, newMessages: newMessages.length }
    })
  return {
    ambassadorMode: user.ambassadorMode,
    isAmbassador:   user.isAmbassador,
    users,
    venueOsmId,
  }
})
@withRouter
export default class InsideVenue extends React.Component {
  static propTypes = {
    ambassadorMode: PropTypes.bool.isRequired,
    history:        PropTypes.object.isRequired,
    isAmbassador:   PropTypes.bool.isRequired,
    venueOsmId:     PropTypes.string.isRequired,
    users:          PropTypes.array,
  }
  constructor(props) {
    super(props)
    this.state = {
      entering: this.props.isAmbassador,
    }
    venuesCache.getItem(props.venueOsmId)
      .then(venue => {
        console.log(venue)
        if(!venue) {
          return this.leaveVenue()
        }
        this.setState({venue})
      })
  }
  render() {
    const {ambassadorMode, isAmbassador, users} = this.props
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
      <View style={ambassadorMode ? styles.ambassadorContainer : styles.container}>
        <Text>{venue.properties.name} ({users.length})</Text>
        <UserList {...{users}} />
        <EnteringModal
          setAmbassadorMode={this.setAmbassadorMode}
          handleBackButton={this.leaveVenue}
          isAmbassador={isAmbassador}
          isOpen={this.state.entering}
        />
        {this.canScan() && <Button title="scanner"  onPress={this.scan} />}
        {this.canFind() && <Button title="trouvé !" onPress={this.found} />}
        {isAmbassador &&
          <Button title="Mode Ambassadeur"  onPress={() => this.setAmbassadorMode(!ambassadorMode)} />
        }
        <Button title="sortir"   onPress={this.leaveVenue} />
      </View>
    )
  }
  canFind = () => true
  canScan = () => this.props.isAmbassador && this.props.ambassadorMode
  found = () => {
    this.props.history.push('/show-qrcode')
  }
  scan = () => {
    this.props.history.push('/scan')
  }
  setAmbassadorMode = (mode) => {
    console.log(mode)
    Meteor.call('users.setAmbassadorMode', {mode})
    this.setState({entering: false})
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
  ambassadorContainer: {
    flex: 1,
    backgroundColor: 'palevioletred',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
