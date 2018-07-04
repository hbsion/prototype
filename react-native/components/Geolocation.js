import React, { Component } from 'react'
import { Alert, View, StyleSheet, Text, PermissionsAndroid } from 'react-native'
import MyApp from './MyApp'


export default class Geolocation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      latitude: null,
      longitude: null,
      error: null,
    }
  }
  componentDidMount() {
    this.requestGeolocationPermission()
  }
  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text>Latitude: {this.state.latitude}</Text>
          <Text>Longitude: {this.state.longitude}</Text>
          {this.state.error ? <Text>Error: {this.state.error}</Text> : null}
        </View>
        <View>
          <MyApp
            latitude={this.state.latitude}
            longitude={this.state.longitude}
          />
        </View>
      </View>
    )
  }
  requestGeolocationPermission = async () => {
    console.warn("request")
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Cool Photo App Camera Permission',
          'message': 'Cool Photo App needs access to your camera ' +
                     'so you can take awesome pictures.'
        }
      )
      console.warn(granted)
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.warn("You can use the camera")
        this.getPosition()

      } else {
        console.warn("Camera permission denied")
        Alert.alert("Permission not granted. The application may not work properly")
      }
    } catch (err) {
      console.warn(err)
    }
  }
  getPosition() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        })
      },
      (error) => {
        this.setState({ error: error.message })
        console.error(error.message)
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
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
