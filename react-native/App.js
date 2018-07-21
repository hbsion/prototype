import PropTypes             from 'prop-types'
import React                 from 'react'
import Config                from 'react-native-config'
import Meteor, {withTracker} from 'react-native-meteor'
import { StyleSheet, View } from 'react-native'
import { NativeRouter, Route, Switch, BackButton, Link, withRouter } from 'react-router-native'

import Disconnected      from './components/Disconnected'
import Home              from './components/Home'
import Loading           from './components/Loading'
import InsideVenue       from './modules/insideVenue/InsideVenue'
import PlayerProfile     from './modules/insideVenue/PlayerProfile'
import Chat              from './modules/chat/Chat'
import SignIn            from './modules/login/ui/SignIn'

Meteor.connect(`ws://${Config.SERVER_URL}/websocket`)

@withTracker(() => {
  const user = Meteor.user()
  Meteor.subscribe('players.one')
  const player = !user ? null : Meteor.collection('players').findOne({userId: user._id})
  console.log("refresh")
  return {
    connected: Meteor.status().connected,
    user,
    player,
  }
})
export default class App extends React.PureComponent {
  static propTypes = {
    connected: PropTypes.bool.isRequired,
    player:    PropTypes.object,
    user:      PropTypes.object,
  }
  render() {
    const {connected, player, user} = this.props
    console.log(player, user)
    if(!connected) {
      return <Disconnected {...{connected}} />
    }
    if(!user) {
      return <SignIn />
    }
    if(!player) {
      return <Loading />
    }
    if(!player.venueOsmId) {
      return <Home {...{player}} />
    }
    return (
      <NativeRouter>
        <BackButton>
          <Switch>
            <Route exact path="/player/:playerId" component={PlayerProfile} />
            <Route path="/chat/:room" component={Chat} />
            {!!player.venueOsmId &&
              <Route render={() => <InsideVenue venueOsmId={player.venueOsmId} />} />
            }
          </Switch>
        </BackButton>
      </NativeRouter>
    )
  }
}



function loginRequired(Component) {
  return function(...props) {
    return withRouter(function(authProps) {
      console.log(authProps)
      return <Component {...props} />
    })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
})
