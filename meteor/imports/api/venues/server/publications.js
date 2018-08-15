import {Meteor} from 'meteor/meteor'
import {Challenges} from '/imports/api/challenges/Challenges'
import {Venues}     from '../Venues'

Meteor.publish('venues.count', function() {
  const fields = Venues.publicFields
  return Venues.find({count: {$gte: 1}}, {fields})
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
