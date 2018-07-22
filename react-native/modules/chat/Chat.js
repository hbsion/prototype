import PropTypes      from 'prop-types'
import React          from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { View } from 'react-native'
import Meteor, {withTracker} from 'react-native-meteor'

@withTracker(({history, match: {params: {roomId}}}) => {
  const player = Meteor.collection('players').findOne({userId: Meteor.userId()})
  if(roomId.substr(0, 4) === 'new_') {
    const playerIds = roomId.split('_').slice(1)
    playerIds.push(player._id)
    Meteor.call('chat.createRoom', {playerIds}, function(err, roomId) {
      if(err) {
        console.error(err)
        return
      }
      console.log("new", roomId)
      history.replace(`/chat/${roomId}`)
    })
    return {}
  }
  Meteor.subscribe('chat.messages', roomId)
  const notAcked = Meteor.collection('chat_messages').find(
    {roomId, acks: {$ne: player._id}, playerId: {$ne: player._id}}, {fields: {}}
  )
  const messages = Meteor.collection('chat_messages').find(
    {roomId},
    {sort: {createdAt: -1}, limit: Math.max(10, notAcked.length)}
  ).map(({_id, acks, text, createdAt, playerId}) => ({
    _id,
    toAck: acks.indexOf(player._id) === -1 && playerId !== player._id,
    text,
    createdAt,
    user: (() => {
      const { _id } = Meteor.collection('players').findOne(playerId)
      return {
        _id,
        name: _id === player._id ? 'Moi' : 'Toto',
        //avatar: 'https://facebook.github.io/react/img/logo_og.png',
      }
    })(),
    //image: 'https://facebook.github.io/react/img/logo_og.png',
    // Any additional custom parameters are passed through
  }))
  console.log("get", messages)
  return {
    messages,
    player,
    roomId,
  }
})
export default class Chat extends React.PureComponent {
  static propTypes = {
    messages: PropTypes.array,
    roomId:   PropTypes.string,
    player:   PropTypes.object,
  }
  constructor(props) {
    super(props)
  }
  render() {
    const { messages, player, roomId } = this.props
    if(!player || !roomId) {
      return <View></View>
    }
    this.ack()
    return (
      <GiftedChat
        messages={messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: player._id,
        }}
      />
    )
  }
  ack() {
    const { messages } = this.props
    messages
      .filter(({toAck}) => toAck)
      .map(({_id, text}) => {
        console.log("ack", text)
        Meteor.call('chat.ack', {messageId: _id})
      })
  }
  onSend(messages = []) {
    messages.forEach(({text, user, _id}) => {
      Meteor.call('chat.send', {
        text,
        roomId: this.props.roomId,
        playerId: user._id,
        _id,
      })
    })
  }
}
