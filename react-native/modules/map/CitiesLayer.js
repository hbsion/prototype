import MapboxGL     from '@mapbox/react-native-mapbox-gl'
import React        from 'react'

export default function CitiesLayer({cities}){
  return (
    <MapboxGL.ShapeSource
      id="cities"
      shape={cities}>
      <MapboxGL.CircleLayer
        id="citiesPoints"
        style={layerStyles.clusteredPoints}
      />
    </MapboxGL.ShapeSource>
  )
}
const layerStyles = MapboxGL.StyleSheet.create({
  userSinglePoint: {
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
    circleColor: MapboxGL.StyleSheet.source(
      [
        [25, 'yellow'],
        [50, 'red'],
        [75, 'blue'],
        [100, 'orange'],
        [300, 'pink'],
        [750, 'white'],
      ],
      'point_count',
      MapboxGL.InterpolationMode.Exponential,
    ),
    circleRadius: MapboxGL.StyleSheet.source(
      [[0, 15], [100, 20], [750, 30]],
      'point_count',
      MapboxGL.InterpolationMode.Exponential,
    ),
    circleOpacity: 0.84,
    circleStrokeWidth: 2,
    circleStrokeColor: 'white',
  },
})
