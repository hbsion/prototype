import {ValidatedMethod} from 'meteor/mdg:validated-method'
import SimpleSchema      from 'simpl-schema'

import {ChatRooms}    from '/imports/api/chat_rooms/ChatRooms'
import {Players}      from '/imports/api/players/Players'
import {ChatMessages} from '../ChatMessages'

export default new ValidatedMethod({
  name: 'chat.ack',
  validate: new SimpleSchema({
    messageId: String,
  }).validator(),
  async run({messageId}) {
    console.log("ack", messageId)
    const player = Players.findOne({userId: this.userId})
    const message = ChatMessages.findOne(messageId)
    if(message.acks.indexOf(player._id) > -1) return
    if(player._id === message.playerId) return
    const room = ChatRooms.findOne(message.roomId)
    if(room.playerIds.indexOf(player._id) === -1) throw new Meteor.Error('WRONG_ROOM')
    message.acks.push(player._id)
    ChatMessages.update(message._id, {$addToSet: {acks: player._id}})
  }
})
