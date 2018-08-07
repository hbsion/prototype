import {ValidatedMethod} from 'meteor/mdg:validated-method'
import SimpleSchema      from 'simpl-schema'

import {Cities}    from '/imports/api/cities/Cities'
import {Countries} from '/imports/api/countries/Countries'
import {Venues}    from '/imports/api/venues/Venues'

export default new ValidatedMethod({
  name: 'users.leaveVenue',
  validate: () => {},
  async run() {
    const user = Meteor.user()
    if(!user || !user.venueId) return
    console.log("leaveVenue", user._id)
    Meteor.users.update(user._id, {$set: {venueId: null, ambassadorMode: false}})
    const venue = Venues.findOne(user.venueId)
    Venues.update(venue._id, {$set: {
      count: Meteor.users.find({venueId: venue._id}).count(),
    }})
    Cities.update(venue.cityId, {$inc: {playerCount: -1}})
    const city = Cities.findOne(venue.cityId)
    Countries.update(city.countryId, {$inc: {playerCount: -1}})
  }
})
