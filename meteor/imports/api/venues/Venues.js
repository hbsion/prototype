import {Mongo}      from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

export const Venues = new Mongo.Collection('venues')

Venues.schema = new SimpleSchema({
  osmId:  {type: String},
  count:  {type: Number},
})

Venues.attachSchema(Venues.schema)

Venues.publicFields = {
  count: 1,
  osmId: 1,
}
