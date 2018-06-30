import React, { Component } from 'react'
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { Callout } from 'react-native-maps';
import {
    View,
    StyleSheet,
    Button,
    Alert,
    TouchableOpacity,
    Text,
    TextInput,
    ScrollView,
    AsyncStorage,
    Navigator,
    StatusBar
 } from 'react-native';



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
                description : 3,
            },
            {
                latlng: {
                    latitude: 37.784935,
                    longitude: -122.407416,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                },
                title : 'nombre d utilisateur : ',
                description : 3,
            },
            {
                latlng: {
                    latitude: 37.784935,
                    longitude: -122.405416,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                },
                title : 'nombre d utilisateur : ',
                description : 3,
            },
            {
                latlng: {
                    latitude: 37.786935,
                    longitude: -122.405416,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                },
                title : 'nombre d utilisateur : ',
                description : 3,
            },
            ]

        }


export default class MyApp extends React.Component {




    render() {

    const { region, latitude, longitude } = this.props;
    console.log(this.props);



    var lat = this.props.latitude ? this.props.latitude : 0
    var longit = this.props.longitude ? this.props.longitude : 0
    console.log(lat, longit)


    return (
      <View style ={styles.container}>
            <MapView
              style={styles.map}
              region={{
                latitude: lat,
                longitude: longit,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
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
                      coordinate={marker.latlng}
                      title={marker.title}
                      description={marker.description}
                    />
                ))}
            </MapView>
      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
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
});
