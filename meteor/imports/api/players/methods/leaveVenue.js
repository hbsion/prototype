import {ValidatedMethod} from 'meteor/mdg:validated-method'
import SimpleSchema      from 'simpl-schema'

import {Players} from '../Players'

export default new ValidatedMethod({
  name: 'players.leaveVenue',
  validate: () => {},
  async run() {
    console.log(this.userId)
    const player = Players.findOne({userId: this.userId})
    console.log(player)
    console.log(player._id)
    Players.update(player._id, {$set: {venueOsmId: null}})
  }
})
