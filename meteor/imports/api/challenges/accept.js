import challengeAcceptedNotif  from './notifications/challengeAccepted'
import challengeStartedNotif   from './notifications/challengeStarted'
import {Challenges}            from './Challenges'

export default function accept(userId) {
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
}
