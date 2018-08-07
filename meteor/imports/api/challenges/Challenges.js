import {Mongo}      from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import stateFromDates          from './stateFromDates'
import challengeAcceptedNotif  from './notifications/challengeAccepted'
import challengeCancelledNotif from './notifications/challengeCancelled'
import challengeStartedNotif   from './notifications/challengeStarted'

export const Challenges = new Mongo.Collection('challenges')

const Participant = new SimpleSchema({
  userId:     {type: String, regEx: SimpleSchema.RegEx.Id},
  role:       {type: String, allowedValues: ['moving', 'unmoving']},
  subrole:    {type: String, optional: true},
  acceptedAt: {type: Date, optional: true},
  declinedAt: {type: Date, optional: true},
})

Challenges.schema = new SimpleSchema({
  players:     Array,
  'players.$': Participant,
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
  accept(userId) {
    const state = this.state()
    if(state === 'finished')  throw new Meteor.Error("CHALLENGE_IS_FINISHED")
    if(state === 'cancelled') throw new Meteor.Error("CHALLENGE_IS_CANCELLED")
    if(state !== 'waiting') return
    let accepted = true
    let found = false
    this.players.forEach(p => {
      if(p.userId === userId) {
        found = true
        return
      }
      if(p.declinedAt || !p.acceptedAt) {
        accepted = false
      }
    })
    if(!found) return
    const startedAt = accepted ? new Date() : undefined
    Challenges.update({
      _id: this._id,
      'players.userId': userId,
    }, {
      $set: {
        'players.$.acceptedAt': new Date(),
        startedAt,
      }
    })
    this.startedAt = startedAt
    if(this.startedAt) {
      challengeStartedNotif(this)
    } else {
      challengeAcceptedNotif({
        challengeId: this._id,
        query: {
          $in: this.players.filter(p => !p.userId == userId).map(p => p._id)
        },
        userId,
      })
    }
  },
  cancel(userId) {
    const cancelledAt = new Date()
    const res = Challenges.update({
      _id:         thid._id,
      players:     {$elemMatch: {userId}},
      cancelledAt: {$exists: false},
      declinedAt:  {$exists: false},
      finishedAt:  {$exists: false},
    }, {
      $set: {cancelledAt}
    })
    console.log(res)
    this.cancelledAt = cancelledAt

    challengeCancelledNotif({
      challengeId: this._id,
      query: {
        $in: this.players.filter(p => p.startedAt && !p.userId == userId).map(p => p._id)
      }
    })
  },
  decline(userId) {
    const state = this.state()
    if(state === 'started') throw new Meteor.Error('CHALLENGE_HAS_STARTED')
    if(state !== 'waiting') return
    let found = false
    if(!this.players.filter(p => p.userId === userId).length) return
    const declinedAt = new Date()
    Challenges.update({
      _id: this._id,
      'players.userId': userId,
    }, {
      $set: {
        'players.$.declinedAt': new Date(),
        declinedAt,
      }
    })
    this.declinedAt = declinedAt
  },
  state() {
    return stateFromDates(this)
  }
})
