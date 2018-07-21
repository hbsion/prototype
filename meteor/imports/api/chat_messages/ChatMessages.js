import {Mongo}      from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

export const ChatMessages = new Mongo.Collection('chat_messages')

ChatMessages.schema = new SimpleSchema({
  room:       {type: String},
  playerId:   {type: String, regEx: SimpleSchema.RegEx.Id},
  text:       {type: String},
  createdAt: {
    type: Date,
    autoValue: function() {
      if(this.isInsert) return new Date()
      if(this.isUpsert) return {$setOnInsert: new Date()}
      this.unset()
    }
  },
})

ChatMessages.attachSchema(ChatMessages.schema)

ChatMessages.publicFields = {}

ChatMessages.privateFields = {
  playerId:     1,
  room:         1,
  text:         1,
  createdAt:    1,
}
