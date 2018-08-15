import {Mongo}      from 'meteor/mongo'
import {Random}     from 'meteor/random'
import SimpleSchema from 'simpl-schema'

import accept         from './accept'
import cancel         from './cancel'
import decline        from './decline'
import stateFromDates from './stateFromDates'

export const Challenges = new Mongo.Collection('challenges')

const Participant = new SimpleSchema({
  userId:     {type: String, regEx: SimpleSchema.RegEx.Id},
  cost:       {type: Number, min: 0, defaultValue: 0},
  reward:     {type: Number, min: 0, defaultValue: 0},
  venueId:    {type: String, regEx: SimpleSchema.RegEx.Id},
  role:       {type: String, optional: true},
  acceptedAt: {type: Date, optional: true},
  declinedAt: {type: Date, optional: true},
  moving:       {
    type: Boolean,
    // autoValue() {
    //   this.unset()
    //   const destinationVenueId = this.parentField()
    //   const currentVenueId = this.siblingField('venueId')
    //   if(!destinationVenueId.isSet || !currentVenueId.isSet) return
    //   const value = destinationVenueId.value.venueId !== currentVenueId.value
    //   if(this.isInsert) return value
    //   if(this.isUpsert) return {$setOnInsert: value}
    // }
  },
})

Challenges.schema = new SimpleSchema({
  players:     Array,
  'players.$': Participant,
  venueId:     {type: String, regEx: SimpleSchema.RegEx.Id},
  cancelledAt: {type: Date, optional: true},
  declinedAt:  {type: Date, optional: true},
  finishedAt:  {type: Date, optional: true},
  startedAt:   {type: Date, optional: true},
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
      console.log(this.field('venueId').value)
      return new Date()
    }
  },
  validationCode: {
    type: String,
    autoValue: () => Random.secret()
  }
})

Challenges.attachSchema(Challenges.schema)

Challenges.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
})

Challenges.queryStarted = (userId) => ({
  cancelledAt: {$exists: false},
  declinedAt:  {$exists: false},
  finishedAt:  {$exists: false},
  startedAt:   {$exists: true},
  players: {
    $elemMatch: {
      userId,
    }
  }
})
Challenges.queryStartedAndInside = (userId, venueId) => ({
  ...Challenges.queryStarted(userId),
  venueId,
})

Challenges.privateFields = {
  cancelledAt: 1,
  createdAt:   1,
  declinedAt:  1,
  finishedAt:  1,
  'players.cost':   1,
  'players.reward': 1,
  'players.moving': 1,
  'players.userId': 1,
  startedAt:   1,
  venueId:     1,
}
Challenges.playerOneFields = {
  validationCode: 1,
}

Challenges.helpers({
  accept,
  cancel,
  decline,
  isValidatingUser(userId) {
    return this.players.findIndex((p) => p.userId === userId) === 1
  },
  state() {
    return stateFromDates(this)
  },
  validate() {
    Challenges.update({
      _id: this._id,
    }, {
      $set: {
        finishedAt: new Date()
      }
    })
    this.players.forEach(({cost, reward, userId}) => {
      console.log("reward", reward)
      if(!reward) return
      Meteor.users.update(userId, {
        $inc: {zyms: reward - cost}
      })
    })
  }
})
