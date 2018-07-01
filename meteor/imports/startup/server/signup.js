import {DDP}    from 'meteor/ddp'
import {Meteor} from 'meteor/meteor'
import {Mongo}  from 'meteor/mongo'
import {onUserCreate} from '/imports/api/users/server/userHooks'
import './passwordless-config'

const landingPage = DDP.connect(Meteor.settings.landingPageUri)

const Users     = new Mongo.Collection('users',     {connection: landingPage})
const Referrers = new Mongo.Collection('referrers', {connection: landingPage})

onUserCreate('getRemoteAccount', (_id, user) => {
  const email = user.emails[0].address
  const handle = landingPage.subscribe('referrers.getForPrototype', email, {onReady: () => {
    console.log("ready", email)
    const user = Users.findOne({})
    if(!user) {
      handle.stop()
      return
    }
    const referrer = Referrers.findOne({userId: user._id})
    Meteor.users.update(_id, {
      $set: {
        landingPageUserId: user._id,
        username:          user.username,
        ethAddress:        referrer.ethAddress,
        referringToken:    referrer.token,
      }
    })
    handle.stop()
  }})
})
