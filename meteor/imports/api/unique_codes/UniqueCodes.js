import {Mongo}      from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

export const UniqueCodes = new Mongo.Collection('unique_codes')

UniqueCodes.schema = new SimpleSchema({
  expired:   {type: Boolean, defaultValue: false},
  used:      {type: Boolean, defaultValue: false},
  userId:    {type: String, regEx: SimpleSchema.RegEx.Id},
  value:     {type: String},
  createdAt: {
    type: Date,
    autoValue: function() {
      if(this.isInsert) return new Date()
      if(this.isUpsert) return {$setOnInsert: new Date()}
      this.unset()
    }
  },
})

UniqueCodes.attachSchema(UniqueCodes.schema)

UniqueCodes.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
})

UniqueCodes.privateFields = {
  value:    1,
  used:     1,
  userId:   1,
  expired:  1,
}
