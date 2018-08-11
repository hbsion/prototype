import newAmbassadorNotif from './notifications/newAmbassador'
import {Challenges}       from './Challenges'

export default (ambassador, user) => {
  const challenge = Challenges.findOne({
    cancelledAt: {$exists: false},
    declinedAt:  {$exists: false},
    finishedAt:  {$exists: false},
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
          role:   'moving',
          userId: user._id,
        }
      }},
    ]
  }, {fields: {}})
  if(challenge) {
    console.log("Challenge already exists (createAmbassadorChallenge)", ambassador._id, user._id)
    return
  }
  const challengeId = Challenges.insert({
    venueId: ambassador.venueId,
    players: [
      {
        acceptedAt: new Date(),
        reward:     2,
        subrole:    'ambassador',
        userId:     ambassador._id,
        venueId:    ambassador.venueId,
      },
      {
        reward:  20,
        userId:  user._id,
        venueId: user.venueId,
      },
    ],
  })
  newAmbassadorNotif(challengeId, user._id)
}
