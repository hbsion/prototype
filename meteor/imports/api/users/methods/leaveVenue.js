import {ValidatedMethod} from 'meteor/mdg:validated-method'
import SimpleSchema      from 'simpl-schema'

import {Venues}  from '/imports/api/venues/Venues'

export default new ValidatedMethod({
  name: 'users.leaveVenue',
  validate: () => {},
  async run() {
    const user = Meteor.user()
    if(!user) return
    console.log("leaveVenue", user._id)
    Meteor.users.update(user._id, {$set: {venueOsmId: null}})
    Venues.upsert({osmId: user.venueOsmId}, {$set: {
      count: Meteor.users.find({venueOsmId: user.venueOsmId}).count()
    }})
  }
})
