import PropTypes      from 'prop-types'
import React          from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Meteor, {withTracker} from 'react-native-meteor'

@withTracker(() => {
  Meteor.subscribe('challenges.started')
  const startedChallenge = Meteor.collection('challenges').findOne()
  const userId = Meteor.userId()
  const idx = startedChallenge && startedChallenge.players.findIndex(
    p => p.userId === userId
  )
  const player = startedChallenge && startedChallenge.players[idx]
  const otherPlayer = startedChallenge && startedChallenge.players[(idx + 1) % 2]
  console.log(otherPlayer)
  return {
    otherPlayer,
    player,
    startedChallenge,
    userId,
  }
})
export default class ChallengeLayer extends React.PureComponent {
  render() {
    const { otherPlayer, startedChallenge, userId } = this.props

    if(!startedChallenge) return null
    return (
      <View style={styles.container}>
        <Text style={styles.countdown}>Countdown</Text>
        <Text style={styles.countdown}>Trouver {otherPlayer.userId}</Text>
        <Text style={styles.countdown}>{startedChallenge.validationCode}</Text>
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
