import {Challenges}            from './Challenges'

export default function decline(userId) {
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
}
