import {Challenges} from './Challenges'

export default (user) => {
  Challenges.find({
    cancelledAt: {$exists: false},
    declinedAt:  {$exists: false},
    finishedAt:  {$exists: false},
    players: {
      $elemMatch: {
        userId: user._id,
        role:   'unmoving',
      }
    }
  }, {fields: {}})
  .forEach(challenge => {
    console.log("user left, so challenge is cancelled", challenge._id)
    challenge.cancel(user._id)
  })
}
