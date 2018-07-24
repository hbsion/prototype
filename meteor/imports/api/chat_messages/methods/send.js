import firebaseAdmin     from 'firebase-admin'
import {ValidatedMethod} from 'meteor/mdg:validated-method'
import SimpleSchema      from 'simpl-schema'

import {ChatRooms}    from '/imports/api/chat_rooms/ChatRooms'
import {ChatMessages} from '../ChatMessages'

export default new ValidatedMethod({
  name: 'chat.send',
  validate: new SimpleSchema({
    _id:       String,
    userId:    String,
    roomId:    String,
    text:      String,
  }).validator(),
  async run({ _id, userId, roomId, text }) {
    console.log(_id, userId, roomId, text)
    if(this.userId !== userId)                   throw new Meteor.Error('NOT_AUTHORIZED')
    const room = ChatRooms.findOne(roomId)
    if(room.userIds.indexOf(this.userId) === -1) throw new Meteor.Error('WRONG_ROOM')
    ChatMessages.insert({_id, acks: [], userId, roomId, text})
    const userIds = Meteor.users.find(
      {_id: {$in: room.otherUserIds(userId)}, 'profile.appState': {$ne: 'active'}}
    )
    .map(async ({_id, profile: {fcmToken}}) => {
      console.log("notify", _id, fcmToken)
      if(fcmToken) {
        try {
          const response = await firebaseAdmin.messaging().send({
            android: {
              notification: {
                //tag: 'chat',
              },
              priority:    'high',
              ttl:         1000 * 60 * 60,
            },
            notification: {
              body:  `Un message en attente`,
              title: 'Nouveau message',
            },
            token: fcmToken,
          })
        } catch(error) {
          console.log('Error sending message:', error);
        }
      }
    })
  }
})
