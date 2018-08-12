import {Challenges} from './Challenges'

export default (ambassadorId) => {
  Challenges.update({
    cancelledAt: {$exists: false},
    declinedAt:  {$exists: false},
    finishedAt:  {$exists: false},
    players: {
      $elemMatch: {
        userId: ambassadorId,
        role:   'ambassador'
      }
    }
  }, {
    $set: {
      cancelledAt: new Date()
    }
  }, {
    multi: true
  })
}
