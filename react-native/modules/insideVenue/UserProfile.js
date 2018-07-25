import PropTypes             from 'prop-types'
import React                 from 'react'
import {View, Text}          from 'react-native'
import { Link, withRouter }  from 'react-router-native'
import Meteor, {withTracker} from 'react-native-meteor'

@withRouter
@withTracker(({match: {params: {userId}}}) => {
  const currentUser = Meteor.user()
  let newMessages = 0
  let roomId
  if(currentUser) {
    const room = Meteor.collection('chat_rooms').findOne({
      userIds: {$all: [userId, currentUser._id], $size: 2}
    }) || {}
    roomId = room._id
    if(roomId) {
      Meteor.subscribe('chat.messages', roomId)
      newMessages = Meteor.collection('chat_messages').find(
        {roomId, acks: {$ne: currentUser._id}, userId: {$ne: currentUser._id}},
        {fields: {roomId: 1}, sort: {createdAt: -1}}
      ).length
    } else {
      roomId = 'new_' + userId
    }
  }
  console.log("currentUser", currentUser)
  return {
    currentUser,
    newMessages,
    userId,
    roomId
  }
})
export default class UserProfile extends React.Component {
  static propTypes = {
    newMessages:   PropTypes.number.isRequired,
    userId:        PropTypes.string.isRequired,
    roomId:        PropTypes.string.isRequired,
    currentUser:   PropTypes.object,
  }
  render() {
    const { currentUser, newMessages, userId, roomId } = this.props
    if(!currentUser) {
      return null
    }
    return (
      <View>
        <Text>{userId}</Text>
        <Link to={`/chat/${roomId}`}><Text>Chat ({newMessages})</Text></Link>
      </View>
    )
  }
}
