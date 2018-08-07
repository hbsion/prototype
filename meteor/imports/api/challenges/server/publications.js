import {Meteor} from 'meteor/meteor'
import {Challenges} from '../Challenges'


Meteor.publish('challenges.started', function() {
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

})
