import PropTypes             from 'prop-types'
import React                 from 'react'
import { AppState, View }    from 'react-native'
import Config                from 'react-native-config'
import firebase              from 'react-native-firebase'

import Meteor, {Accounts, withTracker} from 'react-native-meteor'
import { NativeRouter, Route, Switch, BackButton, DeepLinking } from 'react-router-native'

import Home               from './components/Home'
import Landing            from './components/Landing'
import Chat               from './modules/chat/Chat'
import ChallengeLayer     from './modules/challenge/ChallengeLayer'
import DisplayUniqueCode  from './modules/challenge/DisplayUniqueCode'
import ScanQRCode         from './modules/challenge/ScanQRCode'
import InsideVenue        from './modules/insideVenue/InsideVenue'
import UserProfile        from './modules/insideVenue/UserProfile'
import SignIn             from './modules/user/ui/SignIn'
import OwnProfile         from './modules/user/ui/OwnProfile'
import handleNotification from './modules/notifications/handleNotification'

Meteor.connect(`ws://${Config.SERVER_URL}/websocket`)

@withTracker(() => {
  const user = Meteor.user()
  const handler = Meteor.subscribe('users.me')
  Meteor.subscribe('chat.myRooms')
  console.log("refresh")
  return {
    isLoading: !handler.ready(),
    user,
  }
})
export default class App extends React.PureComponent {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    user:      PropTypes.object,
  }
  appState = AppState.currentState
  state = {minLoadTime: false}

  async componentDidMount() {
    if(!this.state.minLoadTime) {
      setTimeout(() => {
        this.setState({
          minLoadTime: true
        })
      }, 2000)
    }
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
        console.log("onLogin", "appState", this.appState)
        const fcmToken = await firebase.messaging().getToken()
        if(fcmToken) {
          this._saveFcmToken(fcmToken)
        } else {
          console.warning("no token!!")
        }
      })
      this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
        console.log("notif displayed", notification)
      })
      this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
        const action = notificationOpen.action
        console.log("opened")
        console.log(action)
        handleNotification(notificationOpen.notification)
      })
      this.notificationListener = firebase.notifications().onNotification(handleNotification)
    } catch (error) {
      console.log("rejected", error)
    }
  }
  componentWillUnmount() {
    Meteor.call('users.leaveVenue')
    AppState.removeEventListener('change', this._handleAppStateChange)
    this.onTokenRefreshListener()
    this.notificationListener()
    this.notificationDisplayedListener()
  }
  render() {
    const { isLoading, user } = this.props
    const { minLoadTime } = this.state
    if(isLoading || !minLoadTime) return (
      <Landing />
    )
    if(!user)                                 return <SignIn />
    if(!user.username || !user.profile.photo) return <OwnProfile />
    if(!user.venueId)                         return <Home {...{user}} />
    return (
      <NativeRouter>
        <BackButton>
          <DeepLinking />
          <Switch>
            <Route exact path="/user/:userId"     component={UserProfile} />
            <Route path="/chat/:roomId"           component={Chat} />
            <Route path="/show-qrcode"            component={DisplayUniqueCode} />
            <Route path="/scan"                   component={ScanQRCode} />
            {!!user.venueId &&
              <Route render={() => <InsideVenue venueId={user.venueId} />} />
            }
          </Switch>
          <ChallengeLayer />
        </BackButton>
      </NativeRouter>
    )
  }
  _handleAppStateChange = (nextAppState) => {
    this.appState = nextAppState
    Meteor.collection('users').update(Meteor.userId(), {$set: {
      'profile.appState': this.appState
    }})
  }
  _saveFcmToken = (fcmToken) => {
    Meteor.collection('users').update(Meteor.userId(), {$set: {
      'profile.fcmToken': fcmToken,
    }}, {})
  }
}
