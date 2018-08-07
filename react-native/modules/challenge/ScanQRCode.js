import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'
import Meteor, {withTracker} from 'react-native-meteor'
import { withRouter } from 'react-router-native'

@withRouter
export default class ScanQRCode extends React.Component {
  render() {
    return (
      <QRCodeScanner
        onRead={this.onSuccess.bind(this)}
        topContent={
          <Text style={styles.centerText}></Text>
        }
      />
    )
  }
  onSuccess(e) {
    Meteor.call('challenges.validate', {code: e.data}, (err) => {
      if(err) {
        console.log(err)
      } else {
        Alert.alert(e.data)
      }
      this.props.history.goBack()
    })
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
})
