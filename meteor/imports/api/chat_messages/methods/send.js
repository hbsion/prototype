import {ValidatedMethod} from 'meteor/mdg:validated-method'
import SimpleSchema      from 'simpl-schema'

import {ChatRooms}    from '/imports/api/chat_rooms/ChatRooms'
import {Players}      from '/imports/api/players/Players'
import {ChatMessages} from '../ChatMessages'

export default new ValidatedMethod({
  name: 'chat.send',
  validate: new SimpleSchema({
    _id:       String,
    playerId:  String,
    roomId:    String,
    text:      String,
  }).validator(),
  async run({ _id, playerId, roomId, text }) {
    console.log(_id, playerId, roomId, text)
    const player = Players.findOne({userId: this.userId})
    if(player._id !== playerId)                 throw new Meteor.Error('NOT_AUTHORIZED')
    const room = ChatRooms.findOne(roomId)
    if(room.playerIds.indexOf(player._id) === -1) throw new Meteor.Error('WRONG_ROOM')
    ChatMessages.insert({_id, acks: [], playerId, roomId, text})
  }
})
