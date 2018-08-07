import { Meteor } from 'meteor/meteor'
import getEnzymIoDdpConnection from './getEnzymIoDdpConnection'

export default (userId) => {
  const localUser = Meteor.users.findOne(userId)
  if(!localUser.email()) throw new Meteor.Error(`User '${userId}' does not have an email`)
  const handle = getEnzymIoDdpConnection().call(
    'referrers.getForPrototype',
    {email: localUser.email().address},
    (err, userData) => {
      //console.log(err)
      if(!userData) return
      const {
        landingPageUserId, username, ethAddress, referringToken, isAmbassador, profile
      } = userData
      Meteor.users.update(user._id, {
        $set: {
          ethAddress,
          isAmbassador,
          landingPageUserId,
          profile: {
            lang: localUser.profile.lang || profile.lang,
          },
          referringToken,
          username: localUser.username || username,
        }
      })
    }
  )
}
