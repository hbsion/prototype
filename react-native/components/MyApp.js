import PropTypes from 'prop-types'
import React from 'react'
import MapView, {Marker} from 'react-native-maps'
import {View, StyleSheet} from 'react-native'


const data = {
  region : {
    latlng: {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    },
    title : 'title',
    description : 'description'
  },
  me_marker : {
    latlng: {
      latitude: 37.785834,
      longitude: -122.406417,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    },
    title : 'alex',
    description : 'description'
  },
  other_marker : [
    {
      latlng: {
        latitude: 37.786935,
        longitude: -122.407416,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      title : 'nombre d utilisateur : ',
      description : '3',
    },
    {
      latlng: {
        latitude: 36.784935,
        longitude: -122.407416,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      title : 'nombre d utilisateur : ',
      description : '3',
    },
    {
      latlng: {
        latitude: 37.784935,
        longitude: -122.405416,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      title : 'nombre d utilisateur : ',
      description : '3',
    },
    {
      latlng: {
        latitude: 38.786935,
        longitude: -122.405416,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      title : 'nombre d utilisateur : ',
      description : '3',
    },
  ]
}


export default class MyApp extends React.Component {
  static propTypes = {
    latitude:  PropTypes.number,
    longitude: PropTypes.number,
  }
  static defaultProps = {
    latitude:  0,
    longitude: 0,
  }
  render() {
    const { latitude, longitude } = this.props
    const region = latitude && longitude && {
      latitude,
      longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    }
    return (
      <View style ={styles.container}>
        <MapView
          style={styles.map}
          region={region}
        >
          <Marker draggable
            coordinate={data.me_marker.latlng}
            onDragEnd={(e) => this.setState({ x : e.nativeEvent.coordinate })}
          />
          <Marker
            coordinate={data.me_marker.latlng}
            title={data.me_marker.title}
            description={data.me_marker.description}
          />
          {data.other_marker.map(marker => (
            <Marker
              key={JSON.stringify(marker.latlng)}
              coordinate={marker.latlng}
              title={marker.title}
              description={marker.description}
            />
          ))}
        </MapView>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin : 10,
    borderRadius: 4,
    borderWidth: 3,
    borderColor: 'black',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
})
