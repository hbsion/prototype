import {ValidatedMethod} from 'meteor/mdg:validated-method'
import {Meteor}          from 'meteor/meteor'
import SimpleSchema      from 'simpl-schema'

import {Challenges} from '../Challenges'

export default new ValidatedMethod({
  name:     'challenges.validate',
  validate: new SimpleSchema({
    code: {type: String},
  }).validator(),
  async run({code}) {
    const challenge = Challenges.findOne({validationCode: code})
    challenge.validate()
  }
})
