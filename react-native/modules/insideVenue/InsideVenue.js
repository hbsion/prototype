import PropTypes             from 'prop-types'
import React                 from 'react'
import {View, StyleSheet, Text, Button} from 'react-native'
import Meteor, {withTracker} from 'react-native-meteor'
import { Redirect, withRouter } from 'react-router-native'

import venuesCache from '/modules/cache/venues'
import PlayerList from './PlayerList'

//@withRouter
@withTracker(({venueOsmId}) => {
  console.log("inside")
  console.log(venueOsmId)
  Meteor.subscribe('players.insideVenue', venueOsmId)
  const players = Meteor.collection('players').find({venueOsmId})
  console.log("players", players)
  return {
    venueOsmId,
    players,
  }
})
export default class InsideVenue extends React.Component {
  static propTypes = {
    venueOsmId: PropTypes.string.isRequired,
    players:    PropTypes.array,
  }
  state = {}
  constructor(props) {
    super(props)
    venuesCache.getItem(props.venueOsmId)
      .then(venue => {
        console.log("venue", venue)
        if(!venue) {
          return this.leaveVenue()
        }
        this.setState({venue})
      })
  }
  render() {
    const {players} = this.props
    const {venue, venueOsmId} = this.state
    if(!venueOsmId) {
      <Redirect to='/' />
    }
    if(!venue || !players) {
      return (
        <View style={styles.container}>
          <Text>Chargement...</Text>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <Text>{venue.properties.name} ({players.length})</Text>
        <PlayerList players={players} />
        <Button title="logout" onPress={this.leaveVenue}>sortir</Button>
      </View>
    )
  }
  leaveVenue = () => {
    Meteor.call('players.leaveVenue')
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
