import React                 from 'react'
import { Button, View } from 'react-native'
import Meteor                from 'react-native-meteor'
import { Redirect } from 'react-router-native'

import MainMapContainer  from '/modules/map/MainMapContainer'
import BannerContainer   from './BannerContainer'

export default function Home({player}) {
  if(!!player && !!player.venueOsmId) {
    return <Redirect to={`/venue/${player.venueOsmId}`} />
  }
  return (
    <View style={{flex: 1}}>
      <BannerContainer />
      <MainMapContainer player={player} />
      <Button title="logout" onPress={() => Meteor.logout()}>logout</Button>
    </View>
  )
}
