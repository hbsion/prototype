import {ValidatedMethod} from 'meteor/mdg:validated-method'
import {Meteor}          from 'meteor/meteor'
import SimpleSchema      from 'simpl-schema'

import {Challenges} from '../Challenges'

export default new ValidatedMethod({
  name:     'challenges.accept',
  validate: new SimpleSchema({
    challengeId: {type: String},
    userId:      {type: String},
  }).validator(),
  async run({challengeId, userId}) {
    const challenge = Challenges.findOne(challengeId)
    challenge.accept(userId)
    return !!challenge.startedAt
  }
})
