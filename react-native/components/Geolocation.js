import React, { Component } from 'react';
import { View, Text } from 'react-native';
import MyApp from './MyApp'



class Geolocation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: null,
      longitude: null,
      error: null,
    };
  }

  componentDidMount() {
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
    
  }

  render() {
    return (
      <View>
        
        
        
        <View>
        
        <Text>Latitude: {this.state.latitude}</Text>
        <Text>Longitude: {this.state.longitude}</Text>
        {this.state.error ? <Text>Error: {this.state.error}</Text> : null}
        
        
        </View>
        
        <View>
        
        <MyApp 
            latitude={this.state.latitude}
            longitude={this.state.longitude}
        />
      
        </View>
      
      </View>
      
      
        
      
      
      
    );
  }
}

export default Geolocation;