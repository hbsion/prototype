import {ValidatedMethod} from 'meteor/mdg:validated-method'
import SimpleSchema      from 'simpl-schema'

import {ChatRooms}     from '/imports/api/chat_rooms/ChatRooms'
import newMessageNotif from '../notifications/newMessage'
import {ChatMessages}  from '../ChatMessages'

export default new ValidatedMethod({
  name: 'chat.send',
  validate: new SimpleSchema({
    _id:       String,
    userId:    String,
    roomId:    String,
    text:      String,
  }).validator(),
  async run({ _id, userId, roomId, text }) {
    console.log(_id, userId, roomId, text)
    if(this.userId !== userId)                   throw new Meteor.Error('NOT_AUTHORIZED')
    const room = ChatRooms.findOne(roomId)
    if(room.userIds.indexOf(this.userId) === -1) throw new Meteor.Error('WRONG_ROOM')
    ChatMessages.insert({_id, acks: [], userId, roomId, text})
    newMessageNotif({
      query: {_id: {$in: room.otherUserIds(userId)}}
    })
  }
})
