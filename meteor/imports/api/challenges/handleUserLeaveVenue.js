import {Challenges} from './Challenges'

export default (user) => {
  Challenges.find({
    players: {
      $elemMatch: {
        userId: user._id,
        role:   'unmoving',
      }
    }
  }, {fields: {}})
  .forEach(challenge => {
    console.log("user left, so challenge is cancelled", challenge._id)
    challenge.cancel()
  })
}
