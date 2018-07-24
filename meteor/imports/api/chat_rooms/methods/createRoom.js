import {ValidatedMethod} from 'meteor/mdg:validated-method'
import {Meteor}          from 'meteor/meteor'
import SimpleSchema      from 'simpl-schema'

import {ChatRooms} from '../ChatRooms'

export default new ValidatedMethod({
  name: 'chat.createRoom',
  validate: new SimpleSchema({
    userIds:     Array,
    'userIds.$': String,
  }).validator(),
  async run({userIds}) {
    const users = Meteor.users.find({_id: {$in: userIds}}, {fields: {}})
    if(users.count() !== userIds.length) throw new Meteor.Error('NOT_FOUND')
    const room = ChatRooms.findOne({userIds: {$all: userIds, $size: userIds.length}})
    if(!room) {
      return ChatRooms.insert({userIds})
    }
    return room._id
  }
})
