import PropTypes    from 'prop-types'
import React        from 'react'
import {View, StyleSheet, Text, Button, Alert, TouchableOpacity} from 'react-native'

export default class VenuesDetails extends React.Component {
  static propTypes = {
    canEnter:   PropTypes.func.isRequired,
    enterVenue: PropTypes.func.isRequired,
    venue:      PropTypes.object,
  }
  render() {
    const { canEnter, enterVenue, venue } = this.props
    if(!venue) return null
    return (
      <View style={styles.container}>
        <Text>{venue.properties.name}</Text>
        {canEnter(venue.geometry.coordinates) &&
          <Button title="enter" onPress={enterVenue(venue)}>enter</Button>
        }
        {venue.properties.users.map(user => (
          <Text key={user.username}>{user.username}</Text>
        ))}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    bottom: 30,
    left: 0,
    width: 100,
    backgroundColor: 'white'
  },
})
