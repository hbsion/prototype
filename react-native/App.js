import PropTypes from 'prop-types'
import React from 'react'
import Meteor, {withTracker} from 'react-native-meteor'
import { StyleSheet, Text, View, Button } from 'react-native'

import SignIn from './modules/login/ui/SignIn'

const ipaddr = 'localhost'
Meteor.connect(`ws://${ipaddr}:4000/websocket`)

@withTracker(() => ({user: Meteor.user()}))
export default class App extends React.Component {
  static propTypes = {
    user: PropTypes.object,
  }
  render() {
    const {user} = this.props
    if(!user) {
      return <SignIn />
    }
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <Text>Open up App.js to start working on your app!</Text>
          <Text>Changes you make will automatically reload.</Text>
          <Text>Shake your phone to open the developer menu.</Text>
        </View>
        <Button title="logout" onPress={() => Meteor.logout()}>logout</Button>
      </View>
    )
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
