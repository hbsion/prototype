import MapboxGL       from '@mapbox/react-native-mapbox-gl'
import PropTypes    from 'prop-types'
import React        from 'react'
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native'
import Config       from 'react-native-config'
import KeepAwake    from 'react-native-keep-awake'
import Spinner      from 'react-native-loading-spinner-overlay'
import bearing      from '@turf/bearing'
import distance     from '@turf/distance'
import {point}      from '@turf/helpers'
import throttle     from 'lodash/throttle'

import VenuesLayer  from './VenuesLayer'
import VenueDetails from './VenueDetails'

MapboxGL.setAccessToken(Config.MAPBOX_KEY)


export default class MainMap extends React.Component {
  static propTypes = {
    enterVenue:       PropTypes.func.isRequired,
    getVisibleVenues: PropTypes.func.isRequired,
    hideVenues:       PropTypes.func.isRequired,
    loading:          PropTypes.bool.isRequired,
    latitude:         PropTypes.number,
    longitude:        PropTypes.number,
    venues:           PropTypes.object,
  }
  constructor(props) {
    super(props)
    this.fakeCenter = {
      lat: 45.7578,
      lon: 4.8351,
    }
    this.state = {
      center: {
        lat: this.fakeCenter.lat,
        lon: this.fakeCenter.lon,
      },
      fakeMode: true,
    }
  }
  render() {
    console.log("loading", this.props.loading)
    const { latitude, longitude, venues } = this.props
    const { center, fakeMode, zoom } = this.state
    const lat = fakeMode || !latitude ? this.fakeCenter.lat : latitude
    const lon = fakeMode || !longitude ? this.fakeCenter.lon : longitude
    const userPoint = point([longitude, latitude])
    const centerPoint = point([center.lon, center.lat])
    return (
      <View style={styles.container}>
        <KeepAwake />
        <View style={{flex: 0.9}}>
          <MapboxGL.MapView
            ref={ref => this.mapView = ref}
            styleURL={MapboxGL.StyleURL.Street}
            zoomLevel={17}
            pitchEnabled={false}
            centerCoordinate={[lon, lat]}
            showUserLocation={true}
            userTrackingMode={fakeMode ? MapboxGL.UserTrackingModes.None : MapboxGL.UserTrackingModes.FollowWithHeading}
            onRegionDidChange={this.handleRegionDidChange}
            onUserLocationUpdate={this.handleUserLocationUpdate}
            onPress={() => this.handleSelectVenue(null)}
            style={styles.container}
          >
            {fakeMode &&
              <MapboxGL.PointAnnotation
                key="me"
                id="me"
                coordinate={[center.lon, center.lat]}
              >
                <View style={styles.meAnnotationContainer}>
                  <View style={styles.me} />
                </View>
              </MapboxGL.PointAnnotation>
            }

            <VenuesLayer
              {...{venues, styles}}
              canEnter={this.canEnter}
              selectVenue={this.handleSelectVenue}
            />

          </MapboxGL.MapView>
          <VenueDetails
            canEnter={this.canEnter}
            enterVenue={this.props.enterVenue}
            venue={this.state.selectedVenue}
          />
          <TouchableOpacity style={styles.button} onPress={() => this.setState({fakeMode: !fakeMode})}>
            <Text>{fakeMode ? 'Real mode' : 'Fake mode'}</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 0.1}}>
          <Text>Latitude: {lat}</Text>
          <Text>Longitude: {lon}</Text>
          <Text>{distance(userPoint, centerPoint)} {bearing(userPoint, centerPoint)}</Text>
        </View>
        {this.props.loading &&
          <View style={styles.spinner}>
            <Spinner
              animation="fade"
              textContent={"Chargement..."}
              textStyle={{color: '#FFF'}}
              visible={true}
            />
          </View>
        }
      </View>
    )
  }
  canEnter = ([lon, lat]) => {
    const { center, fakeMode, location } = this.state
    const userLat = fakeMode ? center.lat : location.latitude
    const userLon = fakeMode ? center.lon : location.longitude
    return Math.abs(lat - userLat) < 0.0001 && Math.abs(lon - userLon) < 0.0001
  }
  getVisibleVenues = throttle(this.props.getVisibleVenues, 2000)
  handleSelectVenue = (venue) => {
    console.log(venue)
    this.setState({selectedVenue: venue})
  }
  handleUserLocationUpdate = ({timestamp, coords}) => {
    const {speed, heading, accuracy, altitude, latitude, longitude} = coords
    //console.log({speed, heading, accuracy, altitude, latitude, longitude})
    this.setState({
      location: {timestamp, speed, heading, accuracy, altitude, latitude, longitude},
    })
  }
  handleRegionDidChange = async () => {
    const [lon, lat] = await this.mapView.getCenter()
    const zoom = await this.mapView.getZoom()
    this.setState({center: {lon, lat}, zoom})
    const [[e, n], [w, s]] = await this.mapView.getVisibleBounds()
    this.setState({zoom})
    if(zoom < 14) {
      this.props.hideVenues()
      return
    }
    this.getVisibleVenues({s, w, n, e})
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'white',
  },
  meAnnotationContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  me: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'lightblue',
    transform: [{ scale: 0.7 }],
  },
  spinner: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
})
