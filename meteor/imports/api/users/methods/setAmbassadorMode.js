import {ValidatedMethod} from 'meteor/mdg:validated-method'
import SimpleSchema      from 'simpl-schema'

export default new ValidatedMethod({
  name: 'users.setAmbassadorMode',
  validate: new SimpleSchema({
    mode: Boolean,
  }).validator(),
  async run({mode}) {
    const user = Meteor.user()
    console.log(mode, user._id)
    if(!user._id || !user.isAmbassador) return
    Meteor.users.update(user._id, {$set: {
      ambassadorMode: mode
    }})
  }
})
