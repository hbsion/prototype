import {Accounts}  from 'meteor/accounts-base'
import {DDP}       from 'meteor/ddp'
import {Meteor}    from 'meteor/meteor'
import {Mongo}     from 'meteor/mongo'
import {onUserCreate} from '/imports/api/users/server/userHooks'
import {Players}      from '/imports/api/players/Players'
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

onUserCreate('createPlayer', (_id, user) => {
  Players.insert({userId: _id})
})
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

Accounts.onLogin(({type, allowed, user, connection}) => {
  const player = Players.findOne({userId: user._id})
  if(!player) {
    Players.insert({userId: user._id})
  }
})
