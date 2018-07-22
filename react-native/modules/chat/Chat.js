import React          from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { View } from 'react-native'
import Meteor, {withTracker} from 'react-native-meteor'

const now = new Date()

@withTracker(({match: {params: {room}}}) => {
  //Meteor.subscribe('players.one')
  const handler = Meteor.subscribe('chat.messages', room)
  const player   = Meteor.collection('players').findOne({userId: Meteor.userId()})
  const notAcked = Meteor.collection('chat_messages').find(
    {room, acks: {$ne: player._id}, playerId: {$ne: player._id}}, {fields: {}}
  )
  const messages = Meteor.collection('chat_messages').find(
    {room},
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
  console.log(room, handler.ready())
  console.log("get", messages)
  return {
    messages,
    player,
    room,
  }
})
export default class Chat extends React.PureComponent {
  constructor(props) {
    super(props)
  }
  render() {
    const { messages, player } = this.props
    if(!player) {
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
    const { messages, player } = this.props
    messages
      .filter(({toAck}) => toAck)
      .map(({_id, text, playerId}) => {
        console.log("ack", text, playerId, player._id)
        Meteor.call('chat.ack', {messageId: _id})
      })
  }
  onSend(messages = []) {
    messages.forEach(({text, user, createdAt, _id}) => {
      Meteor.call('chat.send', {
        text,
        createdAt,
        room: this.props.room,
        playerId: user._id,
        _id,
      })
    })
  }
}
