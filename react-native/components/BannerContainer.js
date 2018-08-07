import React from 'react'
import Meteor, { withTracker } from 'react-native-meteor'

import Banner from './Banner'

export default withTracker(props => {
  return {
    ...props,
    zyms: 75,
  }
})(Banner)
