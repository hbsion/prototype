import React          from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { View } from 'react-native'
import Meteor, {withTracker} from 'react-native-meteor'

const now = new Date()

@withTracker(({match: {params: {room}}}) => {
  //Meteor.subscribe('players.one')
  const handler = Meteor.subscribe('chat.messages', room)
  const player   = Meteor.collection('players').findOne({userId: Meteor.userId()})
  const messages = Meteor.collection('chat_messages').find(
    {room, createdAt: {$gt: now}},
    {sort: {createdAt: -1}}
  )
  console.log(room, handler.ready())
  console.log("get", messages)
  return {
    messages,
    player,
    room,
  }
})
export default class Chat extends React.PureComponent {
  state = {
    messages: []
  }
  constructor(props) {
    super(props)
  }
  componentDidUpdate(prevProps) {
    const { messages, player } = this.props
    console.log(prevProps.messages, messages)
    if(messages.length !== prevProps.messages.length) {
      console.log("update")
      this.setState(previousState => ({
        messages: messages.map(({_id, text, createdAt, playerId}) => ({
          _id,
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
      }))
    }
  }
  render() {
    const { player } = this.props
    if(!player) {
      return <View></View>
    }
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: player._id,
        }}
      />
    )
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
