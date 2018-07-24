import {ValidatedMethod} from 'meteor/mdg:validated-method'
import SimpleSchema      from 'simpl-schema'

import {ChatRooms}    from '/imports/api/chat_rooms/ChatRooms'
import {ChatMessages} from '../ChatMessages'

export default new ValidatedMethod({
  name: 'chat.ack',
  validate: new SimpleSchema({
    messageId: String,
  }).validator(),
  async run({messageId}) {
    console.log("ack", messageId)
    const message = ChatMessages.findOne(messageId)
    if(message.acks.indexOf(this.userId) > -1) return
    if(this.userId === message.userId) return
    const room = ChatRooms.findOne(message.roomId)
    if(room.userIds.indexOf(this.userId) === -1) throw new Meteor.Error('WRONG_ROOM')
    message.acks.push(this.userId)
    ChatMessages.update(message._id, {$addToSet: {acks: this.userId}})
  }
})
