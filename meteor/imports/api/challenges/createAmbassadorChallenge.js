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
          moving:  false,
          role: 'ambassador',
        }
      }},
      {players: {
        $elemMatch: {
          moving: true,
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
        moving:     false,
        reward:     2,
        role:       'ambassador',
        userId:     ambassador._id,
        venueId:    ambassador.venueId,
      },
      {
        moving:  true,
        reward:  20,
        userId:  user._id,
        venueId: user.venueId,
      },
    ],
  })
  newAmbassadorNotif(challengeId, user._id)
}
