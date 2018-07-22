import PropTypes             from 'prop-types'
import React                 from 'react'
import {View, Text}          from 'react-native'
import { Link, withRouter }  from 'react-router-native'
import Meteor, {withTracker} from 'react-native-meteor'
import getRoomId from '/modules/chat/getRoomId'

@withRouter
@withTracker(({match: {params: {playerId}}}) => {
  Meteor.subscribe('players.one')
  const currentPlayer = Meteor.collection('players').findOne({userId: Meteor.userId()})
  let newMessages
  if(currentPlayer) {
    const room = getRoomId(playerId, currentPlayer._id)
    Meteor.subscribe('chat.messages', room)
    newMessages = Meteor.collection('chat_messages').find(
      {room, acks: {$ne: currentPlayer._id}, playerId: {$ne: currentPlayer._id}},
      {fields: {room: 1}, sort: {createdAt: -1}}
    ).length
  }
  console.log("currentPlayer", currentPlayer)
  return {
    currentPlayer,
    newMessages,
    playerId,
  }
})
export default class PlayerProfile extends React.Component {
  static propTypes = {
    playerId:      PropTypes.string.isRequired,
    currentPlayer: PropTypes.object,
  }
  render() {
    const { currentPlayer, newMessages, playerId } = this.props
    if(!currentPlayer) {
      return null
    }
    const room = getRoomId(currentPlayer._id, playerId)
    return (
      <View>
        <Text>{playerId}</Text>
        <Link to={`/chat/${room}`}><Text>Chat ({newMessages})</Text></Link>
      </View>
    )
  }
}
