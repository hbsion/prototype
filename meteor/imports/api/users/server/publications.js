import {Meteor} from 'meteor/meteor'

Meteor.publish('users.me', function() {
  const userId = this.userId
  if(!userId) return this.ready()
  return Meteor.users.find(userId, {fields: Meteor.users.privateFields})
})

Meteor.publish('users.insideVenue', function(venueId) {
  return Meteor.users.find({venueId}, {fields: Meteor.users.publicFields})
})
