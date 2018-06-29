import React, { Component } from 'react';
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
import UdaciStatusBar from './UdaciStatusBar'
import { purple, white } from '../utils/colors'
export default class TokenBar extends Component {
	
  	
  render() {
  
	const { number_tokens } = this.props
	console.log(number_tokens)
  
    return (
      	<View style={styles.container}>
      		
      		
      		<UdaciStatusBar backgroundColor={purple} barStyle="light-content" />
      		
      		
		</View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
  	flex : 1,
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: 'white',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    margin : 10
  },
  forbiddenButton: {
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 10,
    margin : 10
  },
  deckInput : {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    margin : 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
    height: 40,
  },
  title : {
    alignItems: 'center',
    textAlign : 'center',
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#DDDDDD',
    padding: 10,
    margin : 10,
    borderColor : 'black',
    borderRadius: 5,
  },
});


















