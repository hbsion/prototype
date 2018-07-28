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
        <View style={{flex:1}}>
          <Text>Profile</Text>
        </View>
        <View style={{flex:2}}>
          <View style={{flex:1, justifyContent:"center", borderWidth:3, borderColor:"#DF419A", padding:2}}>
            <View style={{width:gaugeSize, height:"100%", backgroundColor:"#FBD531", justifyContent:"center"}}>
              <Text style={{textAlign:"right", marginRight:4}}>{nbOfTokens}</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  banner: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0)',
    height: 60,
    flexDirection: 'row',
    position:"absolute",
    top:0,
    left:0,
    width:"100%",

  },

})
