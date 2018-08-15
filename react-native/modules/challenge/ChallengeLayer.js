import PropTypes      from 'prop-types'
import React          from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Meteor, {withTracker} from 'react-native-meteor'
import Challenges from './Challenges'

@withTracker(() => {
  Meteor.subscribe('challenges.started')
  const startedChallenge = Challenges.findOne()
  const userId = Meteor.userId()
  const idx = startedChallenge && startedChallenge.players.findIndex(
    p => p.userId === userId
  )
  const player = startedChallenge && startedChallenge.players[idx]
  const otherPlayerUser = startedChallenge && startedChallenge.otherPlayerUser()
  return {
    otherPlayerUser,
    player,
    startedChallenge,
    userId,
  }
})
export default class ChallengeLayer extends React.PureComponent {
  render() {
    const { otherPlayerUser, startedChallenge, userId } = this.props

    if(!startedChallenge) return null
    return (
      <View style={styles.container}>
        <Text style={styles.countdown}>Countdown</Text>
        <Text style={styles.countdown}>Trouver {otherPlayerUser.username}</Text>
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
