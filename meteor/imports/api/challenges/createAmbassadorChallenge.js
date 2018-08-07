import {Challenges} from './Challenges'

export default (ambassador, user) => {
  const challenge = Challenges.findOne({
    state: {$in: ['waiting', 'started']},
    $and: [
      {players: {
        $elemMatch: {
          userId:  ambassador._id,
          role:    'unmoving',
          subrole: 'ambassador',
        }
      }},
      {players: {
        $elemMatch: {
          userId: user._id,
          role:   'moving',
        }
      }},
    ]
  }, {fields: {}})
  if(challenge) {
    console.log("Challenge already exists (createAmbassadorChallenge)", ambassador._id, user._id)
    return
  }
  Challenges.insert({
    players: [
      {userId: ambassador._id, role: 'unmoving', subrole: 'ambassador'},
      {userId: user._id,       role: 'moving'},
    ]
  })
}
