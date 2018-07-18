import PropTypes from 'prop-types'
import React from 'react'
import {Marker} from 'react-native-maps'
import MapView  from 'react-native-map-clustering'
import {View, StyleSheet} from 'react-native'


const data = {
  me_marker : {
    latlng: {
      latitude: 45.76944,
      longitude: 4.83418,
    },
  },
  otherMarkers : [
    {
      latlng: {
        latitude: 45.76944,
        longitude: 4.83418,
      },
    },
    {
      latlng: {
        latitude: 45.76944,
        longitude: 4.83418,
      },
    },
    {
      latlng: {
        latitude: 45.76944,
        longitude: 4.83418,
      },
    },
    {
      latlng: {
        latitude: 45.76944,
        longitude: 4.83418,
      },
    },
    {
      latlng: {
        latitude: 45.76944,
        longitude: 4.83418,
      },
    },
    {
      latlng: {
        latitude: 45.76944,
        longitude: 4.83418,
      },
    },

    {
      latlng: {
        latitude: 45.76926,
        longitude: 4.83424,
      },
    },
    {
      latlng: {
        latitude: 45.76926,
        longitude: 4.83424,
      },
    },
    {
      latlng: {
        latitude: 45.76926,
        longitude: 4.83424,
      },
    },
    {
      latlng: {
        latitude: 45.76926,
        longitude: 4.83424,
      },
    },
    {
      latlng: {
        latitude: 45.76926,
        longitude: 4.83424,
      },
    },
    {
      latlng: {
        latitude: 45.76926,
        longitude: 4.83424,
      },
    },
  ]
}


export default class MainMap extends React.Component {
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
    //console.warn(latitude, longitude)
    const region = {
      latitude: latitude || 45.76944,
      longitude: longitude || 4.83418,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
    }
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={region}
        >
          <Marker
            coordinate={data.me_marker.latlng}
          />
          {data.otherMarkers.map((marker, idx) => (
            <Marker
              key={idx}
              coordinate={marker.latlng}
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
