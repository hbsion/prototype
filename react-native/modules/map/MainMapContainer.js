import PropTypes                     from 'prop-types'
import React, { Component }          from 'react'
import { Alert, PermissionsAndroid } from 'react-native'
import MainMap from './MainMap'


export default class MainMapContainer extends Component {
  static propTypes = {
    player: PropTypes.object,
  }
  constructor(props) {
    super(props)
    this.state = {
      error:     null,
      latitude:  null,
      longitude: null,
    }
  }
  componentDidMount() {
    this.requestGeolocationPermission()
  }
  render() {
    const { player } = this.props
    const { latitude, longitude } = this.state
    return (
      <MainMap
        latitude={latitude}
        longitude={longitude}
        playerId={player._id}
      />
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
