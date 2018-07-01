import {DDP}    from 'meteor/ddp'
import {Meteor} from 'meteor/meteor'
import {Mongo}  from 'meteor/mongo'
import {onUserCreate} from '/imports/api/users/server/userHooks'
import './passwordless-config'

const {uri, username, password} = Meteor.settings.landingPageDdp
const landingPage = DDP.connect(uri)
DDP.onReconnect(connection => {
  connection.call('login', {user: {username}, password}, (err, res) => {
    console.log(err)
    console.log(res)
  })
})


const Users     = new Mongo.Collection('users',     {connection: landingPage})
const Referrers = new Mongo.Collection('referrers', {connection: landingPage})

onUserCreate('getRemoteAccount', (_id, user) => {
  const email = user.emails[0].address
  const handle = landingPage.call('referrers.getForPrototype', {email}, (err, userData) => {
    console.log(err)
    if(!userData) return
    const {landingPageUserId, username, ethAddress, referringToken} = userData
    Meteor.users.update(_id, {
      $set: {landingPageUserId, username, ethAddress, referringToken}
    })
  })
})
