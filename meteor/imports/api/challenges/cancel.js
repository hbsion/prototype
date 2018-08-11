import challengeCancelledNotif from './notifications/challengeCancelled'
import {Challenges}            from './Challenges'

export default function cancel(userId) {
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
}
