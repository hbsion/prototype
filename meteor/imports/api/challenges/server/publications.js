import {Meteor} from 'meteor/meteor'
import {Venues}     from '/imports/api/venues/Venues'
import {Challenges} from '../Challenges'

Meteor.publishComposite('challenges.started', function() {
  if(!this.userId) return this.ready()
  const query = {
    cancelledAt: {$exists: false},
    declinedAt:  {$exists: false},
    finishedAt:  {$exists: false},
    startedAt:   {$exists: true},
    players: {
      $elemMatch: {
        userId: this.userId,
      }
    }
  }
  return {
    find() {
      const challenge = Challenges.findOne(query, {fields: {players: 1}})
      const fields = {
        ...Challenges.privateFields,
        ...(challenge && challenge.isValidatingUser(this.userId) ? Challenges.playerOneFields : {})
      }
      if(challenge) {
        console.log(challenge)
        console.log(fields)
      }
      return Challenges.find(query, {fields})
    },
    children: [
      {
        find(challenge) {
          return Venues.find(challenge.venueId, {fields: {location: 1}})
        }
      }
    ]
  }
})
