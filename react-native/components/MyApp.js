import React, { Component } from 'react'
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { Callout } from 'react-native-maps';
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
 



export default class MyApp extends React.Component {

	constructor(props){
    	super(props);
    	this.state = {
      	
			region : {
				latlng: {
						latitude: 0,
						longitude: 0,
						latitudeDelta: 0.015,
						longitudeDelta: 0.0121,
					},
					title : 'title',
					description : 'description'
			},
		
			me_marker : {
				latlng: {
					latitude: 37.785834,
					longitude: -122.406417,
					latitudeDelta: 0.015,
					longitudeDelta: 0.0121,
				},
				title : 'alex',
				description : 'description'
			},
		
			other_marker : [
			{
				latlng: {
					latitude: 37.786935,
					longitude: -122.407416,
					latitudeDelta: 0.015,
					longitudeDelta: 0.0121,
				},
				title : 'nombre d utilisateur : ',
				description : 3,
			},
			{
				latlng: {
					latitude: 37.784935,
					longitude: -122.407416,
					latitudeDelta: 0.015,
					longitudeDelta: 0.0121,
				},
				title : 'nombre d utilisateur : ',
				description : 3,
			},
			{
				latlng: {
					latitude: 37.784935,
					longitude: -122.405416,
					latitudeDelta: 0.015,
					longitudeDelta: 0.0121,
				},
				title : 'nombre d utilisateur : ',
				description : 3,
			},
			{
				latlng: {
					latitude: 37.786935,
					longitude: -122.405416,
					latitudeDelta: 0.015,
					longitudeDelta: 0.0121,
				},
				title : 'nombre d utilisateur : ',
				description : 3,
			},
			]
    	
    	}
  	}
	
   

	componentWillMount(){
    
		this.setState({
			region : { latlng : { 
				latitude : this.props.latitude ? this.props.latitude : 0,
				longitude : this.props.longitude ? this.props.longitude : 0, 
				}, 
			},
		})
	}
	
	
	
	


  
  render() {
    
    const { region, latitude, longitude } = this.props;
    console.log(this.props);
    

    
    var lat = this.props.latitude ? this.props.latitude : 0
    var longit = this.props.longitude ? this.props.longitude : 0
    console.log(lat, longit)
    

    return (
      <View style ={styles.container}>
        
        
        <MapView
          style={styles.map}
          region={{
            latitude: lat,
            longitude: longit,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >
        
			
			<Marker draggable
    			coordinate={this.state.me_marker.latlng}
    			onDragEnd={(e) => this.setState({ x : e.nativeEvent.coordinate })}
  			/>
			
			
			
			
			
			
			
			<Marker
				coordinate={this.state.me_marker.latlng}
				title={this.state.me_marker.title}
				description={this.state.me_marker.description}
			/>
			
			
			
		
			
		
			{this.state.other_marker.map(marker => (
				<Marker
				  coordinate={marker.latlng}
				  title={marker.title}
				  description={marker.description}
			  
				/>
			))}
		
		
		
        
        </MapView>
        
        
        
        
      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin : 10,
    borderRadius: 4,
    borderWidth: 3,
    borderColor: 'black',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});



      
      
      
      
      


