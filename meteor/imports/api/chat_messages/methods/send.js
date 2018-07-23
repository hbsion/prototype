import firebaseAdmin     from 'firebase-admin'
import {ValidatedMethod} from 'meteor/mdg:validated-method'
import SimpleSchema      from 'simpl-schema'

import {ChatRooms}    from '/imports/api/chat_rooms/ChatRooms'
import {Players}      from '/imports/api/players/Players'
import {ChatMessages} from '../ChatMessages'

export default new ValidatedMethod({
  name: 'chat.send',
  validate: new SimpleSchema({
    _id:       String,
    playerId:  String,
    roomId:    String,
    text:      String,
  }).validator(),
  async run({ _id, playerId, roomId, text }) {
    console.log(_id, playerId, roomId, text)
    const player = Players.findOne({userId: this.userId})
    if(player._id !== playerId)                 throw new Meteor.Error('NOT_AUTHORIZED')
    const room = ChatRooms.findOne(roomId)
    if(room.playerIds.indexOf(player._id) === -1) throw new Meteor.Error('WRONG_ROOM')
    ChatMessages.insert({_id, acks: [], playerId, roomId, text})

    const userIds = Players.find({_id: {$in: room.otherPlayerIds(playerId)}}).map(({userId}) => userId)
    Meteor.users.find({_id: {$in: userIds}, 'profile.appState': {$ne: 'active'}})
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
