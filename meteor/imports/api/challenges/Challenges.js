import {Mongo}      from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import stateFromDates from './stateFromDates'

export const Challenges = new Mongo.Collection('challenges')

const Participant = new SimpleSchema({
  userId:     {type: String, regEx: SimpleSchema.RegEx.Id},
  role:       {type: String, allowedValues: ['moving', 'unmoving']},
  subrole:    {type: String, optional: true},
  acceptedAt: {type: Date, optional: true},
})

Challenges.schema = new SimpleSchema({
  players:     Array,
  'players.$': Participant,
  state:       {
    type:          String,
    allowedValues: ['waiting', 'started', 'finished', 'cancelled'],
    defaultValue:  'waiting',
  },
  startedAt:   {type: Date, optional: true},
  finishedAt:  {type: Date, optional: true},
  cancelledAt: {type: Date, optional: true},
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

Challenges.attachSchema(Challenges.schema)

Challenges.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
})

Challenges.publicFields = {}

Challenges.helpers({
  cancel() {
    Challenges.update({
      _id:        thid._id,
      finishedAt: {$exists: false}
    }, {
      $set: {cancelledAt: new Date()}
    })
  },
  state() {
    return stateFromDates(this)
  }
})
