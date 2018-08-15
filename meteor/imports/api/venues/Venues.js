import {Email}      from 'meteor/email'
import {Mongo}      from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'
import getOFromOsmId from '/imports/modules/osm/getFromOsmId'
import {Cities}      from '/imports/api/cities/Cities'
import {Countries}   from '/imports/api/countries/Countries'

export const Venues = new Mongo.Collection('venues')
Venues.rawDatabase().collection('venues').createIndex({location: '2dsphere'})

const GeoJSON = new SimpleSchema({
  type:            {type: String, defaultValue: 'Point'},
  coordinates:     {type: Array, minCount: 2, maxCount: 2},
  'coordinates.$': Number,
})

Venues.schema = new SimpleSchema({
  osmId:               {type: SimpleSchema.Integer},
  osmType:             {type: String},
  count:               {type: SimpleSchema.Integer, min: 0},
  amenity:             {type: String, optional: true},
  cityId:              {type: String, optional: true},
  location:            {type: GeoJSON, optional: true},
  mustUpdateOsm:       {type: Boolean, defaultValue: true},
  name:                {type: String, optional: true},
  'ISO3166-1':         {type: String, optional: true},
  'ISO3166-1:alpha2':  {type: String, optional: true},
  'ISO3166-1:numeric': {type: String, optional: true},
  createdAt: {
    type: Date,
    autoValue: function() {
      if(this.isInsert) return new Date()
      if(this.isUpsert) return {$setOnInsert: new Date()}
      this.unset()
    }
  },
  updatedAt: {
    type: Date,
    autoValue: function() {
      return new Date()
    }
  },
})

Venues.attachSchema(Venues.schema)

Venues.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
})

Venues.publicFields = {
  count:    1,
  osmId:    1,
  osmType:  1,
}

Venues.helpers({
  async updateFromOsm() {
    const {
      cityArea, countryArea, lat, lon, name, amenity
    } = await getOFromOsmId(this.osmType, this.osmId)
    console.log(cityArea.id, cityArea.tags.name)
    console.log(lat, lon, name, amenity)
    const country = Countries.findOne({ osmId: countryArea.id })
    let countryId = country && country._id
    if(countryId) {
      Countries.update(countryId, {$inc: {venueCount: 1}})
    } else {
      countryId = Countries.insert({
        osmId:               countryArea.id,
        name:                countryArea.tags.name,
        nameFr:              countryArea.tags['name:fr'],
        nameEn:              countryArea.tags['name:en'],
        'ISO3166-1':         countryArea.tags['ISO3166-1'],
        'ISO3166-1:alpha3':  countryArea.tags['ISO3166-1:alpha3'],
        'ISO3166-1:numeric': countryArea.tags['ISO3166-1:numeric'],
        venueCount:          1,
      })
      Meteor.defer(() => {
        Email.send({
          to:      Meteor.settings.adminEmail,
          from:    Meteor.settings.emailFrom,
          subject: `New country! ${countryArea.tags.name}`,
          text:    JSON.stringify(countryArea),
        })
      })
    }
    const city = Cities.findOne({ osmId: cityArea.id })
    let cityId = city && city._id
    if(cityId) {
      Cities.update(cityId, {$inc: {venueCount: 1}})
    } else {
      cityId = Cities.insert({
        countryId,
        osmId:       cityArea.id,
        name:        cityArea.tags.name,
        nameFr:      cityArea.tags['name:fr'],
        nameEn:      cityArea.tags['name:en'],
        venueCount:  1,
      })
    }
    const location = {coordinates: [lon, lat]}
    Venues.update(this._id, {$set: {
      location, cityId, name, amenity, mustUpdateOsm: false
    }})
  }
})
