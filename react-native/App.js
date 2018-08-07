import PropTypes             from 'prop-types'
import React                 from 'react'
import { Alert, AppState, Linking, View }   from 'react-native'
import Config                from 'react-native-config'
import firebase              from 'react-native-firebase'
import Spinner               from 'react-native-loading-spinner-overlay'
import Meteor, {Accounts, withTracker} from 'react-native-meteor'
import { NativeRouter, Route, Switch, BackButton, DeepLinking } from 'react-router-native'

import Disconnected      from './components/Disconnected'
import Home              from './components/Home'
import Chat              from './modules/chat/Chat'
import DisplayUniqueCode from './modules/challenge/DisplayUniqueCode'
import ScanQRCode        from './modules/challenge/ScanQRCode'
import InsideVenue       from './modules/insideVenue/InsideVenue'
import UserProfile       from './modules/insideVenue/UserProfile'
import SignIn            from './modules/login/ui/SignIn'

Meteor.connect(`ws://${Config.SERVER_URL}/websocket`)

@withTracker(() => {
  const user = Meteor.user()
  const handler = Meteor.subscribe('users.me')
  Meteor.subscribe('chat.myRooms')
  console.log("refresh")
  return {
    connected: Meteor.status().connected,
    isLoading: !handler.ready(),
    user,
  }
})


export default class App extends React.PureComponent {
  static propTypes = {
    connected: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    user:      PropTypes.object,
  }
  appState = AppState.currentState
  state = {isLoading: true}

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
    if(this.state.isLoading) {
      setTimeout(() => {
        this.setState({
          isLoading: this.props.isLoading
        })
      }, 800)
    }
  }
  componentWillUnmount() {
    Meteor.call('users.leaveVenue')
    AppState.removeEventListener('change', this._handleAppStateChange)
    this.onTokenRefreshListener()
    this.messageListener()
    this.notificationListener()
    this.notificationDisplayedListener()
  }

  render() {
    const {connected, user} = this.props
    const { isLoading } = this.state
    if (isLoading) return (
      <View style={{ flex: 1 }}>
        <Spinner
          animation="fade"
          overlayColor="#DF419A"
          textContent={"Chargement..."}
          textStyle={{color: '#FFF'}}
          visible={true}
        />
      </View>
    )
    if(!connected)    return <Disconnected {...{connected}} />
    if(!user)         return <SignIn />
    if(!user.venueId) return <Home {...{user}} />
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
