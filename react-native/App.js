import PropTypes             from 'prop-types'
import React                 from 'react'
import { Alert, AppState }   from 'react-native'
import Config                from 'react-native-config'
import firebase              from 'react-native-firebase'
import Meteor, {Accounts, withTracker} from 'react-native-meteor'
import { NativeRouter, Route, Switch, BackButton } from 'react-router-native'

import Disconnected      from './components/Disconnected'
import Home              from './components/Home'
import Loading           from './components/Loading'
import Chat              from './modules/chat/Chat'
import DisplayUniqueCode from './modules/challenge/DisplayUniqueCode'
import ScanQRCode        from './modules/challenge/ScanQRCode'
import InsideVenue       from './modules/insideVenue/InsideVenue'
import PlayerProfile     from './modules/insideVenue/PlayerProfile'
import SignIn            from './modules/login/ui/SignIn'

Meteor.connect(`ws://${Config.SERVER_URL}/websocket`)

@withTracker(() => {
  const user = Meteor.user()
  Meteor.subscribe('players.one')
  Meteor.subscribe('chat.myRooms')
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
  appState = AppState.currentState

  async componentDidMount() {
    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
      this._saveFcmToken(fcmToken)
    })
    AppState.addEventListener('change', this._handleAppStateChange)
    try {
      const enabled = await firebase.messaging().hasPermission()
      if(!enabled) {
        await firebase.messaging().requestPermission()
      }
      console.log("enabled")
      Accounts.onLogin(async () => {
        this._handleAppStateChange(this.appState)
        console.log(this.appState)
        const fcmToken = await firebase.messaging().getToken()
        if(fcmToken) {
          this._saveFcmToken(fcmToken)
        } else {
          console.warning("no token!!")
        }
      })
      this.messageListener = firebase.messaging().onMessage((message) => {
        Alert.alert(message)
      })
      this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
        console.log("notif displayed", notification)
      })
      this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action
        // Get information about the notification that was opened
        const notification = notificationOpen.notification
        console.log("opened")
        console.log(action)
        console.log(notification)
      })
      this.notificationListener = firebase.notifications().onNotification((notification) => {
        console.log("notif", notification)
        Alert.alert(notification._body)
      })
    } catch (error) {
      // User has rejected permissions
      console.log("rejected", error)
    }
  }
  componentWillUnmount() {
    Meteor.call('players.leaveVenue')
    AppState.removeEventListener('change', this._handleAppStateChange)
    this.onTokenRefreshListener()
    this.messageListener()
    this.notificationListener()
    this.notificationDisplayedListener()
  }
  render() {
    const {connected, player, user} = this.props
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
            <Route path="/chat/:roomId"           component={Chat} />
            <Route path="/show-qrcode"            component={DisplayUniqueCode} />
            <Route path="/scan"                   component={ScanQRCode} />
            {!!player.venueOsmId &&
              <Route render={() => <InsideVenue venueOsmId={player.venueOsmId} />} />
            }
          </Switch>
        </BackButton>
      </NativeRouter>
    )
  }
  _handleAppStateChange = (nextAppState) => {
    if(this.appState.match(/inactive|background/)) {
      if(nextAppState === 'active') {
        console.log('foreground!')
      }
    } else {
      if(nextAppState !== 'active') {
        console.log('background!')
      }
    }
    this.appState = nextAppState
    Meteor.collection('users').update(Meteor.userId(), {$set: {
      'profile.appState': this.appState
    }})
  }
  _saveFcmToken = (fcmToken) => {
    Meteor.collection('users').update(Meteor.userId(), {$set: {
      'profile.fcmToken': fcmToken,
    }})
  }
}
