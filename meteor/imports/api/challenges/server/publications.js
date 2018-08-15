import {Meteor} from 'meteor/meteor'
import {Venues}     from '/imports/api/venues/Venues'
import {Challenges} from '../Challenges'

Meteor.publishComposite('challenges.started', function() {
  if(!this.userId) return this.ready()
  const query = Challenges.queryStarted(this.userId)
  return {
    find() {
      const challenge = Challenges.findOne(query, {fields: {players: 1}})
      const fields = {
        ...Challenges.privateFields,
        ...(challenge && challenge.isValidatingUser(this.userId) ? Challenges.playerOneFields : {})
      }
      return Challenges.find(query, {fields})
    },
    children: [
      {
        find(challenge) {
          return Venues.find(challenge.venueId, {fields: {location: 1}})
        }
      },
      {
        find(challenge) {
          return Meteor.users.find(
            {_id: {$in: challenge.players.map(p => p.userId)}},
            {fields: {username: 1}}
          )
        }
      }
    ]
  }
})
