import {Meteor} from 'meteor/meteor'
import {Players}      from '/imports/api/players/Players'
import {ChatMessages} from '../ChatMessages'


Meteor.publishComposite('chat.messages', function(room) {
  if(!this.userId) return this.ready()
  const player = Players.findOne({userId: this.userId})
  if(room.split('_').indexOf(player._id) === -1) return this.ready()
  console.log(room)
  return {
    find() {
      return ChatMessages.find({
        room
      }, {
        fields: ChatMessages.privateFields,
        sort:   {createdAt: 1},
      })
    },
    children: [{
      find(message) {
        return Players.find(
          message.playerId,
          {fields: Players.publicFields}
        )
      }
    }]
  }
})
