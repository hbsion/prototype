import {ValidatedMethod} from 'meteor/mdg:validated-method'
import {Meteor}          from 'meteor/meteor'
import SimpleSchema      from 'simpl-schema'

import {Challenges}                  from '/imports/api/challenges/Challenges'
import cancelAllAmbassadorChallenges from '/imports/api/challenges/cancelAllAmbassadorChallenges'
import createAmbassadorChallenge     from '/imports/api/challenges/createAmbassadorChallenge'
import {Venues}                      from '/imports/api/venues/Venues'


export default new ValidatedMethod({
  name: 'users.setAmbassadorMode',
  validate: new SimpleSchema({
    mode: Boolean,
  }).validator(),
  async run({mode}) {
    const user = Meteor.user()
    console.log(mode, user._id)
    if(!user._id || !user.isAmbassador) return
    if(mode && !user.isInsideVenue()) return
    if(mode === user.ambassadorMode) return
    Meteor.users.update(user._id, {$set: {
      ambassadorMode: mode
    }})
    if(mode) {
      const venue = Venues.findOne(user.venueId)
      const nearVenues = Venues.find({
        location: {
          $near: {
            $geometry:    venue.location,
            $maxDistance: 2000,
        }
      }}, {fields: {}})
      const nearVenuesIds = nearVenues.fetch().map(v => v._id)
      console.log(nearVenuesIds)
      const nearUsers = Meteor.users.find({
        venueId: {$in: nearVenuesIds},
        _id:     {$ne: user._id},
      }, {fields: {venueId: 1}})
      console.log(nearUsers.count())
      nearUsers.forEach(nearUser => {
        createAmbassadorChallenge(user, nearUser)
      })
    } else {
      cancelAllAmbassadorChallenges(user._id)
    }
  }
})
