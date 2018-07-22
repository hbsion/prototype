import {Meteor} from 'meteor/meteor'
import {Players}   from '/imports/api/players/Players'
import {ChatRooms} from '../ChatRooms'


Meteor.publish('chat.myRooms', function() {
  if(!this.userId) return this.ready()
  const player = Players.findOne({userId: this.userId})
  return ChatRooms.find({playerIds: {$eq: player._id}})
})
