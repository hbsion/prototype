import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Dimensions } from 'react-native'
import Meteor from 'react-native-meteor'
import oauthLogin from '../oauthLogin'

const { width } = Dimensions.get('window')

export default class SignIn extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      code: '',
      submitted: false,
      waitingCode: false,
      error: null,
    }
  }
  render() {
    const { submitted, waitingCode} = this.state
    if(submitted) {
      return (
        <View></View>
      )
    }
    return (
      <View style={styles.container}>
        <Text>{this.state.error}</Text>
        {!waitingCode &&
          <View>
            <TextInput
              style={styles.input}
              onChangeText={(email) => this.setState({ email: `${email}` })}
              placeholder="Email"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={true}
            />
            <TouchableOpacity style={styles.button} onPress={this.onSignIn}>
              <Text>Get Email code</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={this.oauthLoginAndSave('facebook')}>
              <Text>Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={this.oauthLoginAndSave('google')}>
              <Text>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={this.oauthLoginAndSave('twitter')}>
              <Text>Twitter</Text>
            </TouchableOpacity>
          </View>
        ||
          <View>
            <Text>{`Nous t'avons envoyé un code par e-mails...`}</Text>
            <TextInput
              style={styles.input}
              onChangeText={(code) => this.setState({code})}
              placeholder="Code"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={true}
            />
            <TouchableOpacity style={styles.button} onPress={this.sendCode}>
              <Text>Envoyer</Text>
            </TouchableOpacity>
          </View>
        }
      </View>
    )
  }
  isValid() {
    const { email } = this.state
    let valid = true
    if(email.length === 0) {
      this.setState({ error: 'You must enter an email address' })
      valid = false
    }
    return valid
  }
  oauthLoginAndSave = (provider) => async () => {
    const {user, credentials} = await oauthLogin(provider) || {}
    if(user && credentials) {
      Meteor._login({credentials, provider, user}, (err) => {
        err && console.warn(err)
      })
      this.setState({submitted: true})
    }
  }
  onSignIn = () => {
    const { email } = this.state
    if(this.isValid()) {
      console.log("test")
      Meteor.call('accounts-passwordless.sendVerificationCode', email, {}, {}, (err) => {
        err && console.warn(err)
      })
      this.setState({waitingCode: true})
    }
  }
  sendCode = () => {
    const {code} = this.state
    Meteor._login({code}, (err) => {
      err && console.warn(err)
    })
    this.setState({submitted: true})
  }
}

const ELEMENT_WIDTH = width - 40
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  input: {
    width: ELEMENT_WIDTH,
    fontSize: 16,
    height: 36,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderColor: '#888888',
    borderWidth: 1,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#3B5998',
    width: ELEMENT_WIDTH,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 16,
  }
})
