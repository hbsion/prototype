import {Mongo}      from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

export const Countries = new Mongo.Collection('countries')

Countries.schema = new SimpleSchema({
  osmId:             {type: SimpleSchema.Integer},
  name:              {type: String},
  nameFr:            {type: String, optional: true},
  nameEn:            {type: String, optional: true},
  venueCount:        {type: SimpleSchema.Integer, defaultValue: 0, min: 0},
  playerCount:       {type: SimpleSchema.Integer, defaultValue: 0, min: 0},
  osmCityAdminLevel: {type: String, optional: true},
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

Countries.attachSchema(Countries.schema)

Countries.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
})

Countries.publicFields = {}
