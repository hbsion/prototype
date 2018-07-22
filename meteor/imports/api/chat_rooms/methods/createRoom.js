import {ValidatedMethod} from 'meteor/mdg:validated-method'
import SimpleSchema      from 'simpl-schema'

import {Players}   from '/imports/api/players/Players'
import {ChatRooms} from '../ChatRooms'

export default new ValidatedMethod({
  name: 'chat.createRoom',
  validate: new SimpleSchema({
    playerIds:     Array,
    'playerIds.$': String,
  }).validator(),
  async run({playerIds}) {
    const players = Players.find({_id: {$in: playerIds}}, {fields: {}}).fetch()
    console.log(players)
    if(players.length !== playerIds.length) throw new Meteor.Error('NOT_FOUND')
    const room = ChatRooms.findOne({playersIds: {$all: playerIds, $size: playerIds.length}})
    if(!room) {
      return ChatRooms.insert({playerIds})
    }
    return room._id
  }
})
