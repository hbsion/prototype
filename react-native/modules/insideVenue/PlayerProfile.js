import PropTypes             from 'prop-types'
import React                 from 'react'
import {View, Text}          from 'react-native'
import { Link, withRouter }  from 'react-router-native'
import Meteor, {withTracker} from 'react-native-meteor'

@withRouter
@withTracker(({match: {params: {playerId}}}) => {
  Meteor.subscribe('players.one')
  const currentPlayer = Meteor.collection('players').findOne({userId: Meteor.userId()})
  let newMessages = 0
  let roomId
  if(currentPlayer) {
    const room = Meteor.collection('chat_rooms').findOne({
      playerIds: {$all: [playerId, currentPlayer._id], $size: 2}
    }) || {}
    roomId = room._id
    if(roomId) {
      Meteor.subscribe('chat.messages', roomId)
      newMessages = Meteor.collection('chat_messages').find(
        {roomId, acks: {$ne: currentPlayer._id}, playerId: {$ne: currentPlayer._id}},
        {fields: {roomId: 1}, sort: {createdAt: -1}}
      ).length
    } else {
      roomId = 'new_' + playerId
    }
  }
  console.log("currentPlayer", currentPlayer)
  return {
    currentPlayer,
    newMessages,
    playerId,
    roomId
  }
})
export default class PlayerProfile extends React.Component {
  static propTypes = {
    newMessages:   PropTypes.number.isRequired,
    playerId:      PropTypes.string.isRequired,
    roomId:        PropTypes.string.isRequired,
    currentPlayer: PropTypes.object,
  }
  render() {
    const { currentPlayer, newMessages, playerId, roomId } = this.props
    if(!currentPlayer) {
      return null
    }
    return (
      <View>
        <Text>{playerId}</Text>
        <Link to={`/chat/${roomId}`}><Text>Chat ({newMessages})</Text></Link>
      </View>
    )
  }
}
