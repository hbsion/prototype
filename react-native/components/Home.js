import React                 from 'react'
import { Button, View } from 'react-native'
import Meteor                from 'react-native-meteor'
import { Redirect } from 'react-router-native'

import MainMapContainer  from '/modules/map/MainMapContainer'
import ChallengeLayer    from '/modules/challenge/ChallengeLayer'
import Banner            from './Banner'

export default function Home({user}) {
  if(!!user && !!user.venueId) {
    return <Redirect to={`/venue/${user.venueId}`} />
  }
  return (
    <View style={{flex: 1}}>
      <MainMapContainer user={user} />
      <Banner />
      <Button title="logout" onPress={() => Meteor.logout()}>logout</Button>
      <ChallengeLayer />
    </View>
  )
}
