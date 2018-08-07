import {Meteor} from 'meteor/meteor'
import sendToUsers from '/imports/modules/pushNotif/sendToUsers'

export default ({challengeId, query, userId}) => {
  const user = Meteor.users.findOne(userId)
  const username = user.username || "bob"
  const response = sendToUsers({
    query,
    body:    `Le défi a été accepté par ${username}`,
    data:    {
      challengeId: _id,
    },
    groupBy: 'challenge',
    title:   'Défi accepté !',
    type:    'challengeAccepted',
  })
}
