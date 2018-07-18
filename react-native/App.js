import PropTypes from 'prop-types'
import React from 'react'
import Meteor, {withTracker} from 'react-native-meteor'
import { StyleSheet, Text, View, ScrollView, Button } from 'react-native'

import BannerContainer from './components/BannerContainer'
import Geolocation     from './components/Geolocation'
import SignIn          from './modules/login/ui/SignIn'

const ipaddr = 'localhost'
Meteor.connect(`ws://${ipaddr}:4000/websocket`)

@withTracker(() => ({
  connected: Meteor.status().connected,
  user:      Meteor.user(),
}))
export default class App extends React.PureComponent {
  static propTypes = {
    user: PropTypes.object,
  }
  render() {
    const {user, connected} = this.props
    //console.warn('connected', connected, user)
    if(!connected) {
      return (
        <View style={styles.container}>
          <Text>Disconnected</Text>
        </View>
      )
    }
    if(!user) {
      return <SignIn />
    }
    return (
      <View style={{flex: 1}}>
        <BannerContainer />
        <Geolocation />
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
  contentContainer: {
    paddingVertical: 20
  },
  statusBar: {
    backgroundColor: "#C2185B",
    height:  "50px",
  },
})
