import PropTypes from 'prop-types'
import React from 'react'
import {
  View,
  StyleSheet,
  Text,
} from 'react-native'
import { Icon } from 'react-native-elements'
import { purple } from '../utils/colors'


export default class Banner extends React.Component {
  static propTypes = {
    nbOfTokens: PropTypes.number.isRequired,
  }
  static defaultProps = {
    nbOfTokens: 75,
  }

  constructor(props) {
    super(props)
    this.state = {
      nbOfTokens: this.props.nbOfTokens
    }
  }

  render() {
    let nbOfTokens = this.state.nbOfTokens
    if (nbOfTokens > 100) nbOfTokens = 100
    const gaugeSize = nbOfTokens+"%"

    return (
      <View style={styles.banner}>
        <View style={{flex:1, backgroundColor:"#ccc", justifyContent: 'center', alignItems:"center",}}>
          <View style={{width:gaugeSize, height:"10%", backgroundColor:"#000"}}>
          </View>
        </View>
        <View style={{flex:3, backgroundColor:"#fff"}}>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  banner: {
    padding: 10,
    backgroundColor: '#87CEFA',
    height: 100,
    flexDirection: 'row',

  },

})
