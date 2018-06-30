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
import {
    Navigator,
    StatusBar
 } from 'react-native-deprecated-custom-components';
import { purple, white } from './utils/colors'
import { Constants } from 'expo'

import Banner from './components/Banner'
//import Live from './components/Live'
import MyApp from './components/MyApp'
import Geolocation from './components/Geolocation'
import SwichExample from './components/SwichExample'


const { StatusBarManager } = NativeModules;




export default class App extends React.Component {
  render() {
    return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
        <Banner
            barStyle="lightContent"
            number_tokens={3}
        />
        <Geolocation />
    </ScrollView>
    );
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
