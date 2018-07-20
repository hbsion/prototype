import {Mongo}      from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

export const Players = new Meteor.Collection('players')

Players.schema = new SimpleSchema({
  userId:    {type: String, regEx: SimpleSchema.RegEx.Id},
  venueOsmId: {type: String, optional: true},
})

Players.attachSchema(Players.schema)

Players.publicFields = {}

Players.privateFields = {
  userId:     1,
  venueOsmId: 1,
}
