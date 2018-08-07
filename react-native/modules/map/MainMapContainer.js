import osmtogeojson                  from 'osmtogeojson'
import PropTypes                     from 'prop-types'
import React, { Component }          from 'react'
import { Alert, PermissionsAndroid } from 'react-native'
import Meteor, {withTracker}         from 'react-native-meteor'

import venuesCache  from '/modules/cache/venues'
import isInsideBbox from './isInsideBbox'
import MainMap      from './MainMap'

@withTracker((...props) => {
  Meteor.subscribe('venues.count')
  const venues = Meteor.collection('venues').find({})
  return {
    ...props,
    venues,
  }
})
export default class MainMapContainer extends Component {
  static propTypes = {
    user:   PropTypes.object,
    venues: PropTypes.array,
  }
  constructor(props) {
    super(props)
    this.state = {
      error:     null,
      latitude:  undefined,
      longitude: undefined,
      venues:    undefined,
    }
  }
  async componentDidMount() {
    this.requestGeolocationPermission()
  }
  render() {
    const { user } = this.props
    const { latitude, longitude } = this.state
    const venues = !this.state.venues ? null : {
      ...this.state.venues,
      features: this.state.venues.features.map((feature) => {
        const {count} = this.props.venues.find(({osmId}) => osmId === feature.id.split('/')[1]) || {}
        if(count) {
          return {
            ...feature,
            properties: {
              ...feature.properties,
              count,
            }
          }
        }
        return feature
      })
    }
    return (
      <MainMap
        enterVenue={this.enterVenue}
        getVenues={this.getVenues}
        hideVenues={this.hideVenues}
        latitude={latitude}
        longitude={longitude}
        userId={user._id}
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
    const id = venue.properties.id
    Meteor.call('users.enterInsideVenue', {venueOsmId: id}, (err, venueId) => {
      if(err) {
        console.log(err)
      } else {
        venuesCache.setItem(venueId, venue)
      }
    })
  }
  getPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("position", position)
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
    const TIMEOUT = 25
    const TYPES = ['node', 'way', 'relation']
    const amenities = ['pub', 'bar', 'cafe', 'restaurant', 'fast_food', ]
    const baseUrl = 'http://overpass-api.de/api/interpreter?data='
    const queryStart = `[out:json][timeout:${TIMEOUT}];area[name="${cityName}"]["boundary"="administrative"];area._(if:t["admin_level"] == _.max(t["admin_level"]))->.s;(`
    const queryMain = []
    TYPES.map(type => amenities.map(amenity => {
      queryMain.push(`${type}["amenity"="${amenity}"](area.s)`)
    }))
    TYPES.map(type => {
      queryMain.push(`${type}["shop"](area.s)`)
    })
    const queryEnd = ';);out geom;'
    const query = baseUrl + queryStart + queryMain.join(';') + queryEnd
    const cacheItemName = `${cityName}-${query.length}`
    let venues = await venuesCache.getItem(cacheItemName)
    if(!venues || (venues.loading && venues.timeout && Date.now() > venues.timeout)) {
      await venuesCache.setItem(cacheItemName, {loading: true, data: {}, timeout: Date.now() + (TIMEOUT + 5) * 1000})
      console.log(query)
      try {
        const data = await (await fetch(query)).json()
        await venuesCache.setItem(cacheItemName, {loading: false, data})
      } catch(error) {
        console.log(error)
        venuesCache.clearItem(cacheItemName)
      }
    }
    venues = await venuesCache.getItem(cacheItemName)
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
