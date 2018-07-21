import PropTypes             from 'prop-types'
import React                 from 'react'
import {View, Text}          from 'react-native'
import { Link, withRouter }  from 'react-router-native'
import Meteor, {withTracker} from 'react-native-meteor'

function getRoomId(playerId1, playerId2) {
  return playerId1 < playerId2 ?
    playerId1 + '_' + playerId2 :
    playerId2 + '_' + playerId1
}

@withRouter
@withTracker(({match: {params: {playerId}}}) => {
  Meteor.subscribe('players.one')
  const currentPlayer = Meteor.collection('players').findOne({userId: Meteor.userId()})
  console.log("currentPlayer", currentPlayer)
  return {
    currentPlayer,
    playerId,
  }
})
export default class PlayerProfile extends React.Component {
  static propTypes = {
    playerId:      PropTypes.string.isRequired,
    currentPlayer: PropTypes.object,
  }
  render() {
    const { currentPlayer, playerId } = this.props
    if(!currentPlayer) {
      return null
    }
    const room = getRoomId(currentPlayer._id, playerId)
    return (
      <View>
        <Text>{playerId}</Text>
        <Link to={`/chat/${room}`}><Text>Chat</Text></Link>
      </View>
    )
  }
}
