import React                 from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import ChallengeLayer from '/modules/challenge/ChallengeLayer'
import Banner         from './Banner'

export default class AppBase extends React.Component {

  render() {
    const { children } = this.props
    return (
      <View style={styles.container}>
        <View stye={styles.banner}>
          <Banner />
        </View>
        <Text>Menu</Text>
        {children}
        <ChallengeLayer />
        <Button title="logout" onPress={() => Meteor.logout()}>logout</Button>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
  },
  childView: {
  }
})
