import sendToUsers from '/imports/modules/pushNotif/sendToUsers'

export default (challengeId, userId) => {
  const response = sendToUsers({
    body:    `Tu veux gagner des ZYMs ? Un ambassadeur vient de s'activer près de toi !`,
    data:    {
      challengeId,
    },
    groupBy: 'challenge',
    type:    'newChallenge',
    query:    userId,
    title:   'Ambassadeur actif près de toi !',
  })
}
