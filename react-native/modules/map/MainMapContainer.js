import osmtogeojson                  from 'osmtogeojson'
import PropTypes                     from 'prop-types'
import React, { Component }          from 'react'
import { Alert, PermissionsAndroid } from 'react-native'
import Meteor                        from 'react-native-meteor'

import venuesCache  from '/modules/cache/venues'
import isInsideBbox from './isInsideBbox'
import MainMap      from './MainMap'

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
      venues:    null,
    }
  }
  componentDidMount() {
    this.requestGeolocationPermission()
  }
  render() {
    const { player } = this.props
    const { latitude, longitude, venues } = this.state
    return (
      <MainMap
        enterVenue={this.enterVenue}
        getVenues={this.getVenues}
        hideVenues={this.hideVenues}
        latitude={latitude}
        longitude={longitude}
        playerId={player._id}
        venues={venues}
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
  enterVenue = (venue) => () => {
    const id = venue.id.split('/')[1]
    Meteor.call('players.enterInsideVenue', {venueOsmId: id}, (err) => {
      if(err) {
        console.log(err)
      } else {
        venuesCache.setItem(id, venue)
      }
    })
  }
  getPosition = () => {
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
  getVenues = async (cityName, s, w, n, e) => {
    console.log(cityName)
    if(!(await venuesCache.getItem(cityName))) {
      venuesCache.setItem(cityName, {loading: true, data: {}})
      const TYPES = ['node', 'way', 'relation']
      const amenities = ['pub', 'bar', 'cafe', 'restaurant', 'fast_food']
      const baseUrl = 'http://overpass-api.de/api/interpreter?data='
      const queryStart = `[out:json][timeout:25];area[name="${cityName}"]["boundary"="administrative"];area._(if:t["admin_level"] == _.max(t["admin_level"]))->.s;(`
      const queryMain = TYPES.map(type => amenities.map(amenity => (
        `${type}["amenity"="${amenity}"](area.s);`
      )).join('')).join('')
      const queryEnd = ');out geom;'
      const query = baseUrl + queryStart + queryMain + queryEnd
      console.log(query)
      const data = await (
        fetch(query)
          .then(res => res.json())
          .catch(error => console.error(error))
      )
      await venuesCache.setItem(cityName, {loading: false, data})
    }
    const venues = await venuesCache.getItem(cityName)
    if(venues.loading) return
    console.log(venues.data.elements.length)
    const osmObj = {
      ...venues.data,
      elements: venues.data.elements.filter(({lat, lon}) => {
        return isInsideBbox({lat, lon}, {s, w, n, e})
        //return isInsideBbox({lat, lon}, {s: s - 0.2, w: w - 0.2, n: n + 0.2, e: e + 0.2})
      })
    }
    console.log(osmObj.elements.length)
    this.setState({venues: osmtogeojson(osmObj)})
  }
  hideVenues = () => {
    this.setState({venues: null})
  }
}
