import {Meteor} from 'meteor/meteor'
import {Venues} from '../Venues'

Meteor.publish('venues.count', function() {
  const fields = Venues.publicFields
  return Venues.find({count: {$gte: 1}}, {fields})
})
