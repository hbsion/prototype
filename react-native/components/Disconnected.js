import React                 from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Redirect } from 'react-router-native'

export default function Disconnected({connected}) {
  console.log("connected ?", connected)
  if(connected) {
    return <Redirect to="/" />
  }
  return (
    <View style={styles.container}>
      <Text>Disconnected</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
