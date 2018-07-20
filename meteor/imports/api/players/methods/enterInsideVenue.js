import {ValidatedMethod} from 'meteor/mdg:validated-method'
import SimpleSchema      from 'simpl-schema'

import {Players} from '../Players'

export default new ValidatedMethod({
  name: 'players.enterInsideVenue',
  validate: new SimpleSchema({
    venueOsmId: String,
  }).validator(),
  async run({venueOsmId}) {
    console.log(venueOsmId, this.userId)
    const player = Players.findOne({userId: this.userId})
    console.log(player._id, venueOsmId)
    Players.update(player._id, {$set: {venueOsmId}})
  }
})
