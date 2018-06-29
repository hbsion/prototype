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
import { Icon } from 'react-native-elements'
import { purple, white } from '../utils/colors'
import { Constants, Location, Permissions } from 'expo'


export default class Banner extends Component {
	
  	
  render() {
  
	const { number_tokens } = this.props
  
    return (
      	
    <View style={styles.bandeau}>
      		
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
				{this.props.number_tokens} tokens
			</Text>
    	
    	</View>
    	
	</View>

    );
  }
}

const styles = StyleSheet.create({
  bandeau: {
  	flex : 1,
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
  
});


















