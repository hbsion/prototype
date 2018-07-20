import React from 'react'
import Meteor, { withTracker } from 'react-native-meteor'

import Banner from './Banner'

export default withTracker(props => {
  //Meteor.subscribe('referrers.one')
  const referrer = Meteor.collection('referrers').findOne({})
  //console.log(referrer)
  return {
    ...props,
    nbOfTokens: referrer && referrer.referralCount
  }
})(Banner)
