import PropTypes from 'prop-types'
import React from 'react'
import {
  View,
  StyleSheet,
  Text,
  StatusBar
} from 'react-native'
import { Icon } from 'react-native-elements'
import { purple } from '../utils/colors'


export default class Banner extends React.Component {
  static propTypes = {
    nbOfTokens: PropTypes.number.isRequired,
  }
  static defaultProps = {
    nbOfTokens: 0,
  }
  render() {
    const { nbOfTokens } = this.props
    return (
      <View style={styles.banner}>
        <View>
          <StatusBar translucent backgroundColor={purple} {...this.props} />
        </View>
        <View style={styles.title}>
          <Icon
            name='sc-telegram'
            type='evilicon'
            color='blue'
          />
          <Text style={styles.messageBoxTitleText}>
            {nbOfTokens} ZYMs
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  banner: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#87CEFA',
    height : 100,
    flexDirection: 'row'
  },
  title: {
    justifyContent: 'center',
    flexDirection: 'row'
  },
  messageBoxTitleText:{
    fontWeight:'bold',
    color:'#fff',
    fontSize:20,
    height : 20
  },
})
