import {ValidatedMethod} from 'meteor/mdg:validated-method'
import SimpleSchema      from 'simpl-schema'

import {Cities}    from '/imports/api/cities/Cities'
import {Countries} from '/imports/api/countries/Countries'
import {Venues}    from '/imports/api/venues/Venues'

export default new ValidatedMethod({
  name: 'users.enterInsideVenue',
  validate: new SimpleSchema({
    venueOsmId: String,
  }).validator(),
  run({venueOsmId}) {
    const [osmType, stringOsmId] = venueOsmId.split('/')
    const osmId = parseInt(stringOsmId)
    console.log(osmId, this.userId)
    if(!this.userId) return
    let venue = Venues.findOne({osmId, osmType})
    let venueId = venue && venue._id
    const mustUpdateOsm = venue ? venue.mustUpdateOsm : true
    if(venueId) {
      Venues.update(venueId, {$set: {
        count: Meteor.users.find({venueId}).count()
      }})
    } else {
      venueId = Venues.insert({osmId, osmType, count: 1})
      venue = Venues.findOne(venueId)
    }
    Meteor.users.update(this.userId, {$set: {venueId}})
    Meteor.defer(async () => {
      console.log(venueId, venue)
      if(mustUpdateOsm) {
        await venue.updateFromOsm()
      }
      venue = Venues.findOne(venueId)
      Cities.update(venue.cityId, {$inc: {playerCount: 1}})
      const city = Cities.findOne(venue.cityId)
      Countries.update(city.countryId, {$inc: {playerCount: 1}})
    })
    return venueId
  }
})
