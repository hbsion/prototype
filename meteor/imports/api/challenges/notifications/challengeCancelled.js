import sendToUsers from '/imports/modules/pushNotif/sendToUsers'

export default ({challengeId, query}) => {
  const response = sendToUsers({
    query,
    body:    `Le défi a été annulé`,
    data:    {
      challengeId: _id,
    },
    groupBy: 'challenge',
    title:   'Défi annulé',
    type:    'challengeCancelled',
  })
}
