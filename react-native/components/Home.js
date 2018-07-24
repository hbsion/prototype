import React                 from 'react'
import { Button, View } from 'react-native'
import Meteor                from 'react-native-meteor'
import { Redirect } from 'react-router-native'

import MainMapContainer  from '/modules/map/MainMapContainer'
import BannerContainer   from './BannerContainer'

export default function Home({user}) {
  if(!!user && !!user.venueOsmId) {
    return <Redirect to={`/venue/${user.venueOsmId}`} />
  }
  return (
    <View style={{flex: 1}}>
      <BannerContainer />
      <MainMapContainer user={user} />
      <Button title="logout" onPress={() => Meteor.logout()}>logout</Button>
    </View>
  )
}
