import MapboxGL     from '@mapbox/react-native-mapbox-gl'
import React        from 'react'
import {StyleSheet, Text, View} from 'react-native'

export default function VenuesLayer({canEnter, selectVenue, venues}){
  if(!venues) return null
  const enterableOrNonEmptyVenues = {...venues, features: []}
  const otherVenues = {...venues, features: []}
  venues.features.forEach(venue => {
    if(canEnter(venue.geometry.coordinates) || venue.properties.count) {
      enterableOrNonEmptyVenues.features.push(venue)
    } else {
      otherVenues.features.push(venue)
    }
  })
  return [
    <MapboxGL.ShapeSource
      id="venues"
      key="venues"
      shape={otherVenues}
      onPress={(event) => selectVenue(event.nativeEvent.payload)}>
      <MapboxGL.CircleLayer
        id="venuesPoints"
        belowLayerID="userSinglePoint"
        style={layerStyles.singlePoint}
      />
    </MapboxGL.ShapeSource>,
    ...enterableOrNonEmptyVenues.features.map(({geometry, id, properties}) => {
      const _canEnter = canEnter(geometry.coordinates)
      return (
        <MapboxGL.PointAnnotation
          key={id}
          id={id}
          coordinate={geometry.coordinates}
          onSelected={() => selectVenue({geometry, id, properties})}
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
        </MapboxGL.PointAnnotation>
      )
    })
  ]
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
