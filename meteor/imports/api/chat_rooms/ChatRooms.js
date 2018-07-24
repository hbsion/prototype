import {Mongo}      from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

export const ChatRooms = new Mongo.Collection('chat_rooms')

ChatRooms.schema = new SimpleSchema({
  userIds:     {type: Array},
  'userIds.$': {type: String, regEx: SimpleSchema.RegEx.Id},
  createdAt: {
    type: Date,
    autoValue: function() {
      if(this.isInsert) return new Date()
      if(this.isUpsert) return {$setOnInsert: new Date()}
      this.unset()
    }
  },
})

ChatRooms.attachSchema(ChatRooms.schema)

ChatRooms.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
})

ChatRooms.publicFields = {}

ChatRooms.privateFields = {
  userIds:    1,
  createdAt:  1,
}

ChatRooms.helpers({
  otherUserIds(userId) {
    return this.userIds.filter(id => id !== userId)
  }
})
