import osmtogeojson                  from 'osmtogeojson'
import PropTypes                     from 'prop-types'
import React, { Component }          from 'react'
import { Alert, PermissionsAndroid } from 'react-native'
import Meteor, {withTracker}         from 'react-native-meteor'

import getCityVenues    from './helpers/getCityVenues'
import getVisibleCities from './helpers/getVisibleCities'
import isInsideBbox     from './helpers/isInsideBbox'
import venuesCache      from '/modules/cache/venues'
import Challenges       from '/modules/challenge/Challenges'
import Venues           from '/modules/venue/Venues'
import MainMap          from './MainMap'


@withTracker((...props) => {
  Meteor.subscribe('venues.visibles')
  const venues = Venues.find()
  const startedChallenge = Challenges.findOne()
  const challengeVenue = startedChallenge && startedChallenge.getVenue()
  return {
    ...props,
    challengeDestination: challengeVenue && challengeVenue.location,
    venues,
  }
})
export default class MainMapContainer extends Component {
  static propTypes = {
    challengeDestination: PropTypes.object,
    user:                 PropTypes.object,
    venues:               PropTypes.array,
  }
  constructor(props) {
    super(props)
    this.state = {
      error:     null,
      loading:   false,
      venues:    null,
    }
  }
  async componentDidMount() {
    this.requestGeolocationPermission()
  }
  render() {
    const { challengeDestination, user } = this.props
    const { loading, venues } = this.state
    return (
      <MainMap
        challengeDestination={challengeDestination}
        enterVenue={this.enterVenue}
        getVisibleVenues={this.getVisibleVenues}
        hideVenues={this.hideVenues}
        loading={loading}
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
      if (granted !== true && granted !== PermissionsAndroid.RESULTS.GRANTED) {
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
  getVisibleVenues = async ({s, w, n, e}) => {
    console.log("getVisibleVenues", Date.now())
    await this.loadingWrapper(() => {
      return new Promise(async (resolve) => {
        const cities = await getVisibleCities({s, w, n, e})
        if(!cities) return
        let osmObj = {elements: []}
        let waitingNb = cities.length
        cities.map(async (city) => {
          const cityVenues = await getCityVenues(city.name, s, w, n, e)
          if(!cityVenues) return
          console.log("cityVenues", city.name, cityVenues.elements.length)
          osmObj.elements.push(...cityVenues.elements.filter(({lat, lon}) => {
            return isInsideBbox({lat, lon}, {s, w, n, e})
          }))
          waitingNb--
          //console.log(waitingNb)
          if(waitingNb < cities.length) resolve()
          const osmVenues = osmtogeojson(osmObj)
          const mergedVenues = {
            ...osmVenues,
            features: osmVenues.features.map((feature) => {
              const [osmType, osmId] = feature.id.split('/')
              const venue = Venues.findOne({osmId: parseInt(osmId), osmType})
              const users = venue ? venue.getUsers() : []
              return {
                ...feature,
                properties: {
                  ...feature.properties,
                  count: users.length,
                  users,
                }
              }
            })
          }
          this.setState({venues: mergedVenues})
        })
      })
    })
  }
  loadingWrapper = async (func, timeout = 1500) => {
    this.loading = true
    const time = Date.now()
    setTimeout(() => {
      //console.log("so?", this.loading, Date.now() - time)
      if(this.loading && !this.state.loading) {
        this.setState({loading: true})
      }
    }, timeout)
    const result = await func.call()
    this.loading = false
    //console.log("time", Date.now() - time)
    if(!this.loading && this.state.loading) this.setState({loading: false})
    return result
  }
  hideVenues = () => {
    this.setState({venues: null})
  }
}
