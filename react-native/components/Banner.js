import PropTypes from 'prop-types'
import React from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native'


export default class Banner extends React.Component {
  static propTypes = {
    zyms: PropTypes.number.isRequired,
  }
  render() {
    const { zyms } = this.props
    const percent = Math.min(100, zyms)
    const gaugeSize = percent + "%"
    return (
      <View style={styles.banner}>
        <View style={{flex:1}}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Me</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex:2}}>
          <View style={{flex:1, justifyContent:"center", borderWidth:3, borderColor:"#DF419A", padding:2}}>
            <View style={{width:gaugeSize, height:"100%", backgroundColor:"#FBD531", justifyContent:"center"}}>
              <Text style={{textAlign:"right", marginRight:4}}>{zyms}</Text>
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
  buttonText: {
    padding: 10,
    width: 40,
    backgroundColor: 'white',
  }
})
