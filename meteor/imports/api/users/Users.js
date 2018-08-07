import {Meteor}     from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'

const Schemas = {}

Schemas.UserProfile = new SimpleSchema({
  referrerToken: {
    type:     String,
    optional: true,
  },
  contest: {
    type: Boolean,
    optional: true,
  },
  city: {
    type: String,
    optional: true
  },
  region: {
    type: String,
    optional: true
  },
  country: {
    type: Date,
    optional: true
  },
  geoloc: {
    type: String,
    optional: true
  },
  lang : {
    type: String,
    optional: true
  },
})

Schemas.User = new SimpleSchema({
  ambassadorMode: {type: Boolean, defaultValue:false},
  createdAt: {
    type: Date,
    autoValue: function() {
      if(this.isInsert) return new Date()
      if(this.isUpsert) return {$setOnInsert: new Date()}
      this.unset()
    }
  },
  isAmbassador:        {type: Boolean, defaultValue: false},
  emails:              {type: Array,  optional: true},
  "emails.$":          {type: Object},
  "emails.$.address":  {type: String, regEx: SimpleSchema.RegEx.Email},
  "emails.$.verified": {type: Boolean},
  ethAddress:          {type: String,  optional: true},
  landingPageUserId:   {type: String,  optional: true},
  referringToken:      {type: String,  optional: true},
  username:            {type: String,  optional: true},
  venueId:             {type: String,  optional: true},
  services:            {type: Object,  optional: true, blackbox: true},
  profile: {
    type: Schemas.UserProfile,
    optional: true,
    defaultValue: {},
  },
  authMean: {
    type: String,
    autoValue() {
      this.unset()
      if(!this.field('services').isSet) return
      const services = this.field('services').value
      if(services) {
        if(services.facebook) return 'facebook'
        if(services.google)   return 'google'
        if(services.twitter)  return 'twitter'
      }
      return 'email'
    },
  },
});

Meteor.users.attachSchema(Schemas.User)

Meteor.users.publicFields = {

}
Meteor.users.privateFields = {
  ambassadorMode: 1,
  isAmbassador:   1,
  venueId:        1,
}

Meteor.users.findOneByEmail = (address, options) => Meteor.users.findOne(
  {emails: {$elemMatch: {address}}},
  options
)

Meteor.users.helpers({
  email() {
    if(this.emails && this.emails.length > 0) return this.emails[0]
  },
  isInsideVenue() {
    return !!this.venueId
  }
})
