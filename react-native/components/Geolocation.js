import React, { Component } from 'react'
import { Alert, View, StyleSheet, Text, PermissionsAndroid } from 'react-native'
import MainMap from './MainMap'


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
    const { error, latitude, longitude } = this.state
    return (
      <View style={styles.container}>
        <View style={{flex: 0.1}}>
          <Text>Latitude: {latitude}</Text>
          <Text>Longitude: {longitude}</Text>
          {error ? <Text>Error: {error}</Text> : null}
        </View>
        <View style={{flex: 0.9}}>
          <MainMap
            latitude={latitude}
            longitude={longitude}
          />
        </View>
      </View>
    )
  }
  requestGeolocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': "Autorisation d'accès à la localisation",
          'message': 'Nous autorises-tu à accéder à ta localisation ?'
        }
      )
      console.warn(granted)
      if (granted === true || granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.getPosition()
      } else {
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
  },
})
