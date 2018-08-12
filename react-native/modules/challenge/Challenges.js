import Meteor  from 'react-native-meteor'
import MeteorClass from 'modules/meteor/MeteorClass'

export default class Challenges extends MeteorClass {
  static _name = 'challenges'
  static find(...args) {
    const list = Meteor.collection(this._name).find(...args) || []
    // console.log("find", ...args, list.length)
    return list.map(item => new Challenges(item))
  }
  static findOne(query = {}, options = {}, ...args) {
    return this.find(query, {...options, limit: 1}, ...args)[0]
  }
  static subscribe(name, ...args) {
    return Meteor.subscribe(`${Challenges._name}.${name}`, ...args)
  }

  getVenue() {
    return Meteor.collection('venues').findOne(this.venueId)
  }
}
