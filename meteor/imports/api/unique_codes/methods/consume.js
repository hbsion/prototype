import {ValidatedMethod} from 'meteor/mdg:validated-method'
import SimpleSchema      from 'simpl-schema'

import {UniqueCodes} from '../UniqueCodes'

export default new ValidatedMethod({
  name: 'uniqueCodes.consume',
  validate: new SimpleSchema({
    value:     String,
  }).validator(),
  async run({value}) {
    console.log("consume", value)
    const code = UniqueCodes.findOne({value})
    if(!code) throw new Meteor.Error('NOT_FOUND')
    UniqueCodes.update(code._id, {$set: {used: true}})
  }
})
