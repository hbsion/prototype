import React     from 'react'
import { StyleSheet, Text, View }  from 'react-native'

export default function Landing() {
  return (
    <View style={styles.container}>
      <Text>Enzym</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    alignItems: 'center',
  },
})
