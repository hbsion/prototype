import newAmbassadorNotif from './notifications/newAmbassador'
import {Challenges}       from './Challenges'

export default (ambassadorId, userId) => {
  const challenge = Challenges.findOne({
    cancelledAt: {$exists: false},
    declinedAt:  {$exists: false},
    finishedAt:  {$exists: false},
    $and: [
      {players: {
        $elemMatch: {
          userId:  ambassadorId,
          role:    'unmoving',
          subrole: 'ambassador',
        }
      }},
      {players: {
        $elemMatch: {
          userId,
          role:   'moving',
        }
      }},
    ]
  }, {fields: {}})
  if(challenge) {
    console.log("Challenge already exists (createAmbassadorChallenge)", ambassadorId, userId)
    return
  }
  const challengeId = Challenges.insert({
    players: [
      {userId: ambassadorId, role: 'unmoving', subrole: 'ambassador', acceptedAt: new Date()},
      {userId: userId,       role: 'moving'},
    ]
  })
  newAmbassadorNotif(challengeId, userId)
}
