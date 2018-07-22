import {Meteor} from 'meteor/meteor'
import {ChatRooms}    from '/imports/api/chat_rooms/ChatRooms'
import {Players}      from '/imports/api/players/Players'
import {ChatMessages} from '../ChatMessages'


Meteor.publishComposite('chat.messages', function(roomId) {
  if(!this.userId) return this.ready()
  const player = Players.findOne({userId: this.userId})
  const room = ChatRooms.findOne(roomId)
  if(room.playerIds.indexOf(player._id) === -1) return this.ready()
  return {
    find() {
      return ChatMessages.find({
        roomId
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
