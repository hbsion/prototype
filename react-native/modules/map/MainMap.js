import Mapbox       from '@mapbox/react-native-mapbox-gl'
import PropTypes    from 'prop-types'
import React        from 'react'
import {View, StyleSheet, Text, Button, Alert} from 'react-native'
import Config       from 'react-native-config'

import citiesFr     from './citiesFr'
import fakePlayers  from './fakePlayers'
import isInsideBbox from './isInsideBbox'

Mapbox.setAccessToken(Config.MAPBOX_KEY)

const cities = citiesFr()
const players = fakePlayers(cities)

export default class MainMap extends React.Component {
  static propTypes = {
    enterVenue: PropTypes.func.isRequired,
    getVenues:  PropTypes.func.isRequired,
    hideVenues: PropTypes.func.isRequired,
    latitude:   PropTypes.number,
    longitude:  PropTypes.number,
    venues:     PropTypes.object,
  }
  static defaultProps = {
    latitude:  0,
    longitude: 0,
  }
  render() {
    const { enterVenue, /*latitude, longitude,*/ venues } = this.props
    const latitude  = 43.9493143
    const longitude = 4.8060329
    return (
      <View style={styles.container}>
        <View style={{flex: 0.1}}>
          <Text>Latitude: {latitude}</Text>
          <Text>Longitude: {longitude}</Text>
        </View>
        <View style={{flex: 0.9}}>
          <Mapbox.MapView
            ref={ref => this.mapView = ref}
            styleURL={Mapbox.StyleURL.Street}
            zoomLevel={17}
            centerCoordinate={[longitude, latitude]}
            showUserLocation={true}
            onRegionDidChange={this.handleRegionDidChange}
            style={styles.container}
          >
            <Mapbox.ShapeSource
              id="cities"
              shape={cities}>
              <Mapbox.CircleLayer
                id="citiesPoints"
                style={layerStyles.clusteredPoints}
              />
            </Mapbox.ShapeSource>
            <Mapbox.ShapeSource
              id="players"
              cluster
              clusterRadius={50}
              clusterMaxZoom={14}
              shape={players}
            >
              <Mapbox.SymbolLayer
                id="playerPointCount"
                style={layerStyles.clusterCount}
              />
              <Mapbox.CircleLayer
                id="playerClusteredPoints"
                belowLayerID="playerPointCount"
                filter={['has', 'point_count']}
                style={layerStyles.clusteredPoints}
              />
              <Mapbox.CircleLayer
                id="playerSinglePoint"
                belowLayerID="playerClusteredPoints"
                filter={['!has', 'point_count']}
                style={layerStyles.playerSinglePoint}
              />
            </Mapbox.ShapeSource>
            {venues && venues.features.length < 20 && venues.features.map((feature, idx) => (
              <Mapbox.PointAnnotation
                key={`city-${idx}`}
                id={`city-${idx}`}
                coordinate={feature.geometry.coordinates}
              >
                <View style={styles.annotationContainer}>
                  <View style={styles.annotationFill} />
                </View>
                <Mapbox.Callout title={feature.properties.name} style={styles.popup}>
                  <View>
                    <Text>{feature.properties.name}</Text>
                    <Button title="enter" onPress={enterVenue(feature)}>enter</Button>
                  </View>
                </Mapbox.Callout>
              </Mapbox.PointAnnotation>
            ))}
            {venues &&
              <Mapbox.ShapeSource
                id="venues"
                shape={venues}>
                <Mapbox.CircleLayer
                  id="venuesPoints"
                  belowLayerID="playerSinglePoint"
                  style={layerStyles.singlePoint}
                />
              </Mapbox.ShapeSource>
            }
          </Mapbox.MapView>
        </View>
      </View>
    )
  }
  handleRegionDidChange = async () => {
    const [[e, n], [w, s]] = await this.mapView.getVisibleBounds()
    const zoom = await this.mapView.getZoom()
    if(zoom < 14) {
      this.props.hideVenues()
      return
    }
    const displayable = cities.features.filter(({geometry: {coordinates: [lon, lat]}}) => (
      isInsideBbox({lat, lon}, {s: s - 0.2, w: w - 0.2, n: n + 0.2, e: e + 0.2})
    ))
    if(displayable.length) {
      this.props.getVenues(displayable[0].properties.name, s, w, n, e)
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  annotationContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
  },
  annotationFill: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'orange',
    transform: [{ scale: 0.6 }],
  },
  annotationFill2: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'green',
    transform: [{ scale: 0.6 }],
  },
  popup: {
    width: 150,
    height: 150,
    padding: 20,
    backgroundColor: 'white',
  }
})
const layerStyles = Mapbox.StyleSheet.create({
  playerSinglePoint: {
    circleColor: 'blue',
    circleOpacity: 0.84,
    circleStrokeWidth: 2,
    circleStrokeColor: 'white',
    circleRadius: 8,
    circlePitchAlignment: 'map',
  },
  singlePoint: {
    circleColor: 'green',
    circleOpacity: 0.84,
    circleStrokeWidth: 2,
    circleStrokeColor: 'white',
    circleRadius: 5,
    circlePitchAlignment: 'map',
  },

  clusteredPoints: {
    circlePitchAlignment: 'map',
    circleColor: Mapbox.StyleSheet.source(
      [
        [25, 'yellow'],
        [50, 'red'],
        [75, 'blue'],
        [100, 'orange'],
        [300, 'pink'],
        [750, 'white'],
      ],
      'point_count',
      Mapbox.InterpolationMode.Exponential,
    ),

    circleRadius: Mapbox.StyleSheet.source(
      [[0, 15], [100, 20], [750, 30]],
      'point_count',
      Mapbox.InterpolationMode.Exponential,
    ),

    circleOpacity: 0.84,
    circleStrokeWidth: 2,
    circleStrokeColor: 'white',
  },
  clusterCount: {
    textField: '{point_count}',
    textSize: 12,
    textPitchAlignment: 'map',
  },
})
