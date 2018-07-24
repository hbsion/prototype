import {Meteor} from 'meteor/meteor'
import {Random} from 'meteor/random'
import {UniqueCodes} from '../UniqueCodes'


Meteor.publish('uniqueCodes.getOne', function() {
  const userId = this.userId
  if(!userId) return this.ready()
  const fields = UniqueCodes.privateFields
  const cursor = UniqueCodes.find(
    {userId, used: false},
    {fields, sort: {createdAt: -1}, limit: 1}
  )
  if(cursor.map(({expired}) => !expired).filter(x => x).length > 0) {
    console.log("found one")
    return cursor
  }
  const _id = UniqueCodes.insert({
    userId,
    value: Random.secret(),
  })
  Meteor.setTimeout(
    () => {
      UniqueCodes.update(_id, {$set: {expired: true}})
    },
    30 * 1000
  )
  console.log("new", _id)
  return UniqueCodes.find(_id, {fields})
})
