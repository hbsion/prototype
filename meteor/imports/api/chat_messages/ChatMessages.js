import {Mongo}      from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

export const ChatMessages = new Mongo.Collection('chat_messages')

ChatMessages.schema = new SimpleSchema({
  roomId:     {type: String, regEx: SimpleSchema.RegEx.Id},
  userId:     {type: String, regEx: SimpleSchema.RegEx.Id},
  text:       {type: String},
  acks:       {type: Array, optional: true, defaultValue: []},
  'acks.$':   {type: String},
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

ChatMessages.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
})

ChatMessages.publicFields = {}

ChatMessages.privateFields = {
  acks:         1,
  createdAt:    1,
  userId:       1,
  roomId:       1,
  text:         1,
}
