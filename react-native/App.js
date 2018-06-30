import Meteor from "react-native-meteor"
import React from 'react';
import { SimpleApp } from 'react-navigation';
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
    NativeEventEmitter,
    NativeModules,
 } from 'react-native';
import { purple, white } from './utils/colors'
import { Constants } from 'expo'

import BannerContainer from './components/BannerContainer'
//import Live from './components/Live'
import MyApp from './components/MyApp'
import Geolocation from './components/Geolocation'
import SwichExample from './components/SwichExample'


const { StatusBarManager } = NativeModules;

// adb reverse tcp:3000 tcp:3000 is needed with the emulator
const ipaddr = 'localhost'
Meteor.connect(`ws://${ipaddr}:3000/websocket`)


export default class App extends React.Component {
  render() {
    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <BannerContainer />
        <Geolocation />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    paddingVertical: 20
  },
  statusBar: {
    backgroundColor: "#C2185B",
    height: Constants.statusBarHeight,
  },
});
