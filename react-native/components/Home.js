import React                 from 'react'
import { Button, View } from 'react-native'
import Meteor                from 'react-native-meteor'
import { Redirect } from 'react-router-native'

import MainMapContainer  from '/modules/map/MainMapContainer'
import BannerContainer   from './BannerContainer'

export default function Home({user}) {
  if(!!user && !!user.venueId) {
    return <Redirect to={`/venue/${user.venueId}`} />
  }
  return (
    <View style={{flex: 1}}>
      <MainMapContainer user={user} />
      <BannerContainer />
      <Button title="logout" onPress={() => Meteor.logout()}>logout</Button>
    </View>
  )
}
