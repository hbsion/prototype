import PropTypes      from 'prop-types'
import React          from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Meteor, {withTracker} from 'react-native-meteor'

@withTracker(() => {
  Meteor.subscribe('challenges.started')
  const startedChallenge = Meteor.collection('challenges').findOne()
  return {
    startedChallenge
  }
})
export default class ChallengeLayer extends React.PureComponent {
  render() {
    const { startedChallenge } = this.props
    if(!startedChallenge) return null
    return (
      <View style={styles.container}>
        <Text style={styles.countdown}>Countdown</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top:      0,
    right:    0,
    padding:  30,
    width:   '50%',
  },
  countdown: {
    textAlign: 'right',
  },
})
