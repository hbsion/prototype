import {Accounts}  from 'meteor/accounts-base'
import {DDP}       from 'meteor/ddp'
import {Meteor}    from 'meteor/meteor'
import {Mongo}     from 'meteor/mongo'
import getEnzymIoDdpConnection    from '/imports/api/users/server/getEnzymIoDdpConnection'
import getUserDataFromOtherServer from '/imports/api/users/server/getUserDataFromOtherServer'
import rnOauthLoginHandler        from '/imports/api/users/server/rnOauthLoginHandler'
import './passwordless-config'

getEnzymIoDdpConnection()

Accounts.registerLoginHandler('rn-oauth', rnOauthLoginHandler)

Accounts.onLogin(({type, allowed, user, connection}) => {
  getUserDataFromOtherServer(user._id)
})
