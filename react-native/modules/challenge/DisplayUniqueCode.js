import PropTypes from 'prop-types'
import React     from 'react'
import {
  StyleSheet,
  Text,
  View,
} from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import Meteor, {withTracker} from 'react-native-meteor'
import { withRouter } from 'react-router-native'
import logo from '/utils/logo.png'

@withTracker(() => {
  const userId = Meteor.userId()
  Meteor.subscribe('uniqueCodes.getOne')
  return {
    uniqueCode: Meteor.collection('unique_codes').findOne({userId})
  }
})
@withRouter
export default class DisplayUniqueCode extends React.Component {
  static propTypes = {
    history:    PropTypes.object.isRequired,
    uniqueCode: PropTypes.object,
  }
  componentDidUpdate() {
    if(this.props.uniqueCode && (
      this.props.uniqueCode.expired ||
      this.props.uniqueCode.used
    )) {
      this.props.history.goBack()
    }
  }
  render() {
    const { uniqueCode } = this.props
    if(!uniqueCode) {
      return <View><Text>Chargement...</Text></View>
    }
    return (
      <View style={styles.container}>
        <QRCode
          value={uniqueCode.value}
          logo={logo}
          size={250}
          ecl="H"
          logoSize={90}
          logoBackgroundColor='transparent'
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
  }
})
