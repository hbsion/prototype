import {Mongo}      from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

export const Cities = new Mongo.Collection('cities')

Cities.schema = new SimpleSchema({
  osmId:       {type: SimpleSchema.Integer},
  name:        {type: String},
  countryId:   {type: String},
  nameFr:      {type: String, optional: true},
  nameEn:      {type: String, optional: true},
  venueCount:  {type: SimpleSchema.Integer, defaultValue: 0, min: 0},
  playerCount: {type: SimpleSchema.Integer, defaultValue: 0, min: 0},
  createdAt: {
    type: Date,
    autoValue: function() {
      if(this.isInsert) return new Date()
      if(this.isUpsert) return {$setOnInsert: new Date()}
      this.unset()
    }
  },
  updatedAt: {
    type: Date,
    autoValue: function() {
      return new Date()
    }
  },
})

Cities.attachSchema(Cities.schema)

Cities.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
})

Cities.publicFields = {
  name:  1,
  osmId: 1,
}
