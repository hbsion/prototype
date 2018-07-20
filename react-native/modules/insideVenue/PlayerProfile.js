import PropTypes      from 'prop-types'
import React          from 'react'
import {View, FlatList, Text, TouchableOpacity, Button, Alert} from 'react-native'
import { Link, withRouter } from 'react-router-native'

@withRouter
export default class PlayerProfile extends React.Component {
  static propTypes = {
    player: PropTypes.object.isRequired,
  }
  render() {
    const { match: {params: {playerId}}} = this.props
    return (
      <View>
        <Text>{playerId}</Text>
        <Link to={`/player/${playerId}/chat`}><Text>Chat</Text></Link>
      </View>
    )
  }
}
