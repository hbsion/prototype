import MapboxGL     from '@mapbox/react-native-mapbox-gl'
import React        from 'react'
import {Button, StyleSheet, Text, View} from 'react-native'

export default function VenuesLayer({canEnter, enterVenue, venues}){
  if(!venues) return null
  if(venues.features.length > 30) {
    return (
      <MapboxGL.ShapeSource
        id="venues"
        shape={venues}>
        <MapboxGL.CircleLayer
          id="venuesPoints"
          belowLayerID="userSinglePoint"
          style={layerStyles.singlePoint}
        />
      </MapboxGL.ShapeSource>
    )
  }
  return venues.features.map(({geometry, id, properties}, idx) => {
    const _canEnter = canEnter(geometry.coordinates)
    return (
      <MapboxGL.PointAnnotation
        key={`city-${idx}`}
        id={`city-${idx}`}
        coordinate={geometry.coordinates}
      >
        {properties.count &&
          <View style={_canEnter ? styles.canEnter : styles.annotationContainer}>
            <View style={styles.occupiedVenue}>
              <Text style={styles.annotationText}>{properties.count}</Text>
            </View>
          </View>
        ||
          <View style={_canEnter ? styles.canEnter : styles.annotationContainer}>
            <View style={styles.emptyVenue} />
          </View>
        }
        <MapboxGL.Callout title={properties.name} style={styles.popup}>
          <View>
            <Text>{properties.name}</Text>
            {_canEnter &&
              <Button title="enter" onPress={enterVenue({geometry, id, properties})}>enter</Button>
            }
          </View>
        </MapboxGL.Callout>
      </MapboxGL.PointAnnotation>
    )
  })
}

const styles = StyleSheet.create({
  annotationContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
  },
  annotationText: {
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 30,
  },
  canEnter: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    borderRadius: 15,
  },
  emptyVenue: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'yellow',
    transform: [{ scale: 0.6 }],
  },
  occupiedVenue: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'orange',
    transform: [{ scale: 0.6 }],
  },
  popup: {
    width: 150,
    height: 150,
    padding: 20,
    backgroundColor: 'white',
  }
})
const layerStyles = MapboxGL.StyleSheet.create({
  singlePoint: {
    circleColor: 'green',
    circleOpacity: 0.84,
    circleStrokeWidth: 2,
    circleStrokeColor: 'white',
    circleRadius: 5,
    circlePitchAlignment: 'map',
  },
})
