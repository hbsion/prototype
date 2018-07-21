import {ValidatedMethod} from 'meteor/mdg:validated-method'
import SimpleSchema      from 'simpl-schema'

import {Players}      from '/imports/api/players/Players'
import {ChatMessages} from '../ChatMessages'

export default new ValidatedMethod({
  name: 'chat.send',
  validate: new SimpleSchema({
    text: String,
    createdAt: Date,
    room: String,
    playerId: String,
    _id: String,
  }).validator(),
  async run({text, createdAt, room, playerId, _id}) {
    console.log(text, createdAt, room, playerId, _id)
    const player = Players.findOne({userId: this.userId})
    if(player._id !== playerId) throw new Meteor.Error('NOT_AUTHORIZED')
    ChatMessages.insert({text, createdAt, room, playerId, _id})
  }
})
