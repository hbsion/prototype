import {Meteor} from 'meteor/meteor'
import {ChatRooms} from '../ChatRooms'


Meteor.publish('chat.myRooms', function() {
  if(!this.userId) return this.ready()
  return ChatRooms.find({userIds: {$eq: this.userId}})
})
