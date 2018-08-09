import osmtogeojson                  from 'osmtogeojson'
import PropTypes                     from 'prop-types'
import React, { Component }          from 'react'
import { Alert, PermissionsAndroid } from 'react-native'
import Meteor, {withTracker}         from 'react-native-meteor'

import getCityVenues    from './helpers/getCityVenues'
import getVisibleCities from './helpers/getVisibleCities'
import isInsideBbox     from './helpers/isInsideBbox'
import venuesCache      from '/modules/cache/venues'
import MainMap          from './MainMap'


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
      loading:   false,
      longitude: undefined,
      venues:    undefined,
    }
  }
  async componentDidMount() {
    this.requestGeolocationPermission()
  }
  render() {
    const { user } = this.props
    const { latitude, loading, longitude } = this.state
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
        getVisibleVenues={this.getVisibleVenues}
        hideVenues={this.hideVenues}
        latitude={latitude}
        longitude={longitude}
        userId={user._id}
        venues={venues}
        loading={loading}
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
  getVisibleVenues = async ({s, w, n, e}) => {
    console.log("getVisibleVenues", Date.now())
    await this.loadingWrapper(() => {
      return new Promise(async (resolve) => {
        const cities = await getVisibleCities({s, w, n, e})
        console.log(cities)
        if(!cities) return
        let osmObj = {elements: []}
        let waitingNb = cities.length
        cities.map(async (city) => {
          const cityVenues = await getCityVenues(city.name, s, w, n, e)
          if(!cityVenues) return
          console.log("cityVenues", city.name, cityVenues.elements.length)
          osmObj.elements.push(...cityVenues.elements.filter(({lat, lon}) => {
            return isInsideBbox({lat, lon}, {s, w, n, e})
            //return isInsideBbox({lat, lon}, {s: s - 0.2, w: w - 0.2, n: n + 0.2, e: e + 0.2})
          }))
          waitingNb--
          console.log(waitingNb)
          if(waitingNb < cities.length) resolve()
          this.setState({venues: osmtogeojson(osmObj)})
        })
      })
    })
  }
  loadingWrapper = async (func, timeout = 1500) => {
    this.loading = true
    const time = Date.now()
    setTimeout(() => {
      console.log("so?", this.loading, Date.now() - time)
      if(this.loading && !this.state.loading) {
        this.setState({loading: true})
      }
    }, timeout)
    const result = await func.call()
    this.loading = false
    console.log("time", Date.now() - time)
    if(!this.loading && this.state.loading) this.setState({loading: false})
    return result
  }
  hideVenues = () => {
    this.setState({venues: null})
  }
}
