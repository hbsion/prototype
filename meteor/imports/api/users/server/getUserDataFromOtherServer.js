import meteor from 'meteor/meteor'
import getEnzymIoDdpConnection from './getEnzymIoDdpConnection'

export default (userId) => {
  const localUser = Meteor.users.findOne(userId)
  const handle = getEnzymIoDdpConnection().call(
    'referrers.getForPrototype',
    {email: localUser.email()},
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
