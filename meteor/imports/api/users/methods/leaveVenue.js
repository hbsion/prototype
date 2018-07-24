import {ValidatedMethod} from 'meteor/mdg:validated-method'
import SimpleSchema      from 'simpl-schema'

import {Venues}  from '/imports/api/venues/Venues'

export default new ValidatedMethod({
  name: 'users.leaveVenue',
  validate: () => {},
  async run() {
    console.log(this.userId)
    const user = Meteor.user()
    console.log(this.userId)
    Meteor.users.update(this.userId, {$set: {venueOsmId: null}})
    Venues.upsert({osmId: user.venueOsmId}, {$set: {
      count: Meteor.users.find({venueOsmId: user.venueOsmId}).count()
    }})
  }
})
