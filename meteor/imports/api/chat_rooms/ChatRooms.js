import {Mongo}      from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

export const ChatRooms = new Mongo.Collection('chat_rooms')

ChatRooms.schema = new SimpleSchema({
  playerIds:     {type: Array},
  'playerIds.$': {type: String, regEx: SimpleSchema.RegEx.Id},
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

ChatRooms.publicFields = {}

ChatRooms.privateFields = {
  playerIds:    1,
  createdAt:    1,
}
