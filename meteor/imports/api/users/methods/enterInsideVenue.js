import {ValidatedMethod} from 'meteor/mdg:validated-method'
import SimpleSchema      from 'simpl-schema'

import {Venues}  from '/imports/api/venues/Venues'

export default new ValidatedMethod({
  name: 'users.enterInsideVenue',
  validate: new SimpleSchema({
    venueOsmId: String,
  }).validator(),
  async run({venueOsmId}) {
    console.log(venueOsmId, this.userId)
    const user = Meteor.user()
    Meteor.users.update(this.userId, {$set: {venueOsmId}})
    Venues.upsert({osmId: venueOsmId}, {
      $set: {
        count: Meteor.users.find({venueOsmId}).count()
      },
    })
  }
})
