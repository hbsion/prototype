import PropTypes      from 'prop-types'
import React          from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { View } from 'react-native'
import Meteor, {withTracker} from 'react-native-meteor'

@withTracker(({history, match: {params: {roomId}}}) => {
  const user = Meteor.user()
  if(roomId.substr(0, 4) === 'new_') {
    const userIds = roomId.split('_').slice(1)
    userIds.push(user._id)
    Meteor.call('chat.createRoom', {userIds}, function(err, roomId) {
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
    {roomId, acks: {$ne: user._id}, userId: {$ne: user._id}}, {fields: {}}
  )
  const messages = Meteor.collection('chat_messages').find(
    {roomId},
    {sort: {createdAt: -1}, limit: Math.max(10, notAcked.length)}
  ).map(({_id, acks, text, createdAt, userId}) => ({
    _id,
    toAck: acks.indexOf(userId) === -1 && userId !== user._id,
    text,
    createdAt,
    user: (() => {
      return {
        _id: userId,
        name: userId === user._id ? 'Moi' : 'Toto',
        //avatar: 'https://facebook.github.io/react/img/logo_og.png',
      }
    })(),
    //image: 'https://facebook.github.io/react/img/logo_og.png',
    // Any additional custom parameters are passed through
  }))
  console.log("get", messages)
  return {
    messages,
    user,
    roomId,
  }
})
export default class Chat extends React.PureComponent {
  static propTypes = {
    messages: PropTypes.array,
    roomId:   PropTypes.string,
    user:     PropTypes.object,
  }
  constructor(props) {
    super(props)
  }
  render() {
    const { messages, user, roomId } = this.props
    if(!user || !roomId) {
      return <View></View>
    }
    this.ack()
    return (
      <GiftedChat
        messages={messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: user._id,
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
        userId: user._id,
        _id,
      })
    })
  }
}
