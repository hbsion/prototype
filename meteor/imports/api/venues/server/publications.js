import {Meteor} from 'meteor/meteor'
import {Challenges} from '/imports/api/challenges/Challenges'
import {Venues}     from '../Venues'

Meteor.publishComposite('venues.visibles', function() {
  return {
    find() {
      return Venues.find(
        {},
        {fields: Venues.publicFields}
      )
    },
    children: [{
      find(venue) {
        const startedChallenge = Challenges.findOne(
          Challenges.queryStarted(this.userId)
        )
        const challengeUserIds = !startedChallenge ? [] : startedChallenge.players.map(p => p.userId)
        const removeUserIds = [
          this.userId,
          ...challengeUserIds,
        ]
        return Meteor.users.find(
          {$and: [
            {venueId: venue._id},
            {_id: {$nin: removeUserIds}}
          ]},
          {fields: Meteor.users.publicFields}
        )
      }
    }]
  }
})

Meteor.publishComposite('venues.inside', function() {
  if(!this.userId) return this.ready()
  const user = Meteor.users.findOne(this.userId)
  return {
    find() {
      return Challenges.find(
        Challenges.queryStartedAndInside(user._id, user.venueId),
        {fields: Challenges.insideVenue}
      )
    },
    children: [{
      find(challenge) {
        console.log(challenge)
        return Meteor.users.find(
          {_id: {$in: challenge.players.map(p => p.userId)}},
          {fields: {'profile.photo.storageId': 1}}
        )
      }
    }]
  }
})
