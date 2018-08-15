import Meteor  from 'react-native-meteor'
import MeteorClass from 'modules/meteor/MeteorClass'
import getPhotoUrl from 'modules/user/getPhotoUrl'

export default class Challenges extends MeteorClass {
  static _name = 'challenges'
  static find(...args) {
    const list = Meteor.collection(Challenges._name).find(...args) || []
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
  getPhoto() {
    const userId = this.otherPlayerUserId()
    console.log("playerUserId", userId)
    const user = Meteor.collection('users').findOne(userId)
    console.log(user)
    if(!user.profile || !user.profile.photo) return
    return getPhotoUrl(user.profile.photo.storageId)
  }
  otherPlayerUser() {
    return Meteor.collection('users').findOne(
      this.otherPlayerUserId()
    )
  }
  otherPlayerUserId() {
    return this.players.find(p => p.userId != Meteor.userId()).userId
  }
}
