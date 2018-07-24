import {Meteor} from 'meteor/meteor'
import {ChatRooms}    from '/imports/api/chat_rooms/ChatRooms'
import {ChatMessages} from '../ChatMessages'


Meteor.publishComposite('chat.messages', function(roomId) {
  if(!this.userId) return this.ready()
  const room = ChatRooms.findOne(roomId)
  if(room.userIds.indexOf(this.userId) === -1) return this.ready()
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
        return Meteor.users.find(
          message.userId,
          {fields: Meteor.users.publicFields}
        )
      }
    }]
  }
})
