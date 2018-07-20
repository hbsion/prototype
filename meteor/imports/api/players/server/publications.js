import {Meteor} from 'meteor/meteor'
import {Players} from '../Players'

Meteor.publishComposite('players.one', function() {
  const userId = this.userId
  if(!userId) return this.ready()
  return {
    find() {
      const fields = {}
      return Meteor.users.find(userId, {fields})
    },
    children: [{
      find(user) {
        const fields = Players.privateFields
        return Players.find(
          {userId: user._id},
          {fields}
        )
      }
    }]
  }
})

Meteor.publish('players.insideVenue', function(venueOsmId) {
  const fields = Players.publicFields
  return Players.find({venueOsmId}, {fields})
})
