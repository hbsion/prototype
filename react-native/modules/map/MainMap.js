import throttle     from 'lodash/throttle'
import MapboxGL     from '@mapbox/react-native-mapbox-gl'
import PropTypes    from 'prop-types'
import React        from 'react'
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native'
import Config       from 'react-native-config'
import KeepAwake    from 'react-native-keep-awake'
import bearing      from '@turf/bearing'
import distance     from '@turf/distance'
import {point}      from '@turf/helpers'

import Loading      from '/components/Loading'
import arrowIcon    from '../challenge/arrow.png'
import VenuesLayer  from './VenuesLayer'
import VenueDetails from './VenueDetails'

MapboxGL.setAccessToken(Config.MAPBOX_KEY)

const LYON = {lat: 45.7578, lon: 4.8351}

export default class MainMap extends React.Component {
  static propTypes = {
    enterVenue:           PropTypes.func.isRequired,
    getVisibleVenues:     PropTypes.func.isRequired,
    hideVenues:           PropTypes.func.isRequired,
    loading:              PropTypes.bool.isRequired,
    challengeDestination: PropTypes.object,
    venues:               PropTypes.object,
  }
  constructor(props) {
    super(props)
    this.fakeCenter = {...LYON}
    this.state = {
      center:   {...this.fakeCenter},
      location: {...this.fakeCenter},
      fakeMode: true,
    }
  }
  render() {
    const { challengeDestination, venues } = this.props
    console.log("venue", challengeDestination)
    const { center, fakeMode, location: {latitude, longitude}, zoom } = this.state
    const lat = fakeMode || !latitude ? this.fakeCenter.lat : latitude
    const lon = fakeMode || !longitude ? this.fakeCenter.lon : longitude
    const userPoint = fakeMode ? point([center.lon, center.lat]) : point([longitude, latitude])
    const challengePoint = challengeDestination && point(challengeDestination.coordinates)
    if(challengeDestination) {
      const size = Math.min(0.05, distance(userPoint, challengePoint) / 2)
      const arrowSize = Math.min(0.2, Math.max(0.2, size / 0.05) / 2)
      const rotate = 90 + bearing(userPoint, challengePoint)
      //const translateX = Math.round(594 / 2 * arrowSize)
      userPoint.properties = {
        ...userPoint.properties,
        rotate,
        size: arrowSize,
        //offset: [594/2,0],
        //translate: [translateX, 0]
      }
    }
    const arrowFeatureCollection = {
      type: 'FeatureCollection',
      features: [userPoint]
    }
    console.log("challenge", challengePoint)
    return (
      <View style={styles.container}>
        <KeepAwake />
        <View style={{flex: 0.9}}>
          <MapboxGL.MapView
            ref={ref => this.mapView = ref}
            styleURL={MapboxGL.StyleURL.Street}
            zoomLevel={17}
            pitchEnabled={false} compassEnabled={false} rotateEnabled={false}
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
            <MapboxGL.ShapeSource
              id="arrowShapeSource"
              shape={arrowFeatureCollection}
              images={{ arrow: arrowIcon, assets: ['pin'] }}>
              <MapboxGL.SymbolLayer id="arrowSymbol" style={layerStyles.icon} />
            </MapboxGL.ShapeSource>

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
            <Text>{fakeMode ? 'Switch to Real Mode' : 'Switch to Fake mode'}</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 0.1}}>
          <Text>Latitude: {lat}</Text>
          <Text>Longitude: {lon}</Text>
        </View>
        <Loading visible={this.props.loading} />
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
  challengeDestinationContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'yellow',
    borderRadius: 20,
  },
  challengeDestination: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: 'green',
    transform: [{ scale: 0.7 }],
  },
})

const layerStyles = MapboxGL.StyleSheet.create({
  progress: {
    lineColor: '#314ccd',
    lineWidth: 3,
  },
  icon: {
    iconImage: 'arrow',
    iconRotate: MapboxGL.StyleSheet.identity('rotate'),
    iconSize: MapboxGL.StyleSheet.identity('size'),
    //iconOffset: [594/2,0],
    //iconTranslate: MapboxGL.StyleSheet.identity('offset'),
    //iconAnchor: 'left'
  },
})
