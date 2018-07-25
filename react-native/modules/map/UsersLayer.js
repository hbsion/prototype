import MapboxGL     from '@mapbox/react-native-mapbox-gl'
import React        from 'react'

export default function UsersLayer({users}){
  return (
    <MapboxGL.ShapeSource
      id="users"
      cluster
      clusterRadius={50}
      clusterMaxZoom={14}
      shape={users}
    >
      <MapboxGL.SymbolLayer
        id="userPointCount"
        style={layerStyles.clusterCount}
      />
      <MapboxGL.CircleLayer
        id="userClusteredPoints"
        belowLayerID="userPointCount"
        filter={['has', 'point_count']}
        style={layerStyles.clusteredPoints}
      />
      <MapboxGL.CircleLayer
        id="userSinglePoint"
        belowLayerID="userClusteredPoints"
        filter={['!has', 'point_count']}
        style={layerStyles.userSinglePoint}
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
  clusterCount: {
    textField: '{point_count}',
    textSize: 12,
    textPitchAlignment: 'map',
  },
})
