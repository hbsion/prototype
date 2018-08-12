import sendToUsers from '/imports/modules/pushNotif/sendToUsers'

export default ({_id, players}) => {
  players.forEach((player, idx) => {
    const otherPlayer = players[(idx + 1) % 2]
    const username = Meteor.users.findOne(player.userId).username || "Maria"
    let body
    console.log(player.moving, otherPlayer.moving)
    if(player.moving) {
      body = `Tu dois trouver ${username} !`
    } else {
      if(otherPlayer.moving) {
        body = `${username} va essayer de te trouver !`
      } else {
        body = `${username} est dans le même établissement que toi !`
      }
    }
    const response = sendToUsers({
      body,
      data:    {
        challengeId: _id,
      },
      groupBy: 'challenge',
      query:   player.userId,
      title:   'Le défi commence !',
      type:    'challengeStarted',
    })
  })

}
