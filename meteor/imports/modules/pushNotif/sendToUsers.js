import firebaseAdmin     from 'firebase-admin'

export default ({body, data, fcmToken, groupBy, query, title, type, ttl}) => {
  Meteor.users.find(query, {fields: {profile: 1}})
  .forEach(({_id, profile: {fcmToken}}) => {
    console.log("notify", _id)
    if(!fcmToken) {
      console.warn("no fcmToken")
      return
    }
    try {
      const message = {
        android: {
          notification: {
            tag: groupBy,
          },
          priority:    'high',
          ttl:         1000 * (ttl || 60 * 60),
        },
        data: {
          ...(data || {}),
          type,
        },
        notification: {
          body,
          title,
        },
        token: fcmToken,
      }
      console.log(message)
      return firebaseAdmin.messaging().send(message)
    } catch(error) {
      console.log('Error sending notification:', error)
    }
  })
}
