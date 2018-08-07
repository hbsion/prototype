import { Alert }   from 'react-native'

import acceptChallenge     from 'modules/challenge/acceptChallenge'
import declineChallenge    from 'modules/challenge/declineChallenge'

export default ({_body, _data, _title}) => {
  console.log("notif", _title, _data)
  let buttons
  let options = {}
  const {challengeId} = _data
  switch(_data.type) {
  case 'newChallenge':
    buttons = [
      {text: 'Non merci', onPress: () => declineChallenge(challengeId), style: 'cancel'},
      {text: 'Oui !',     onPress: () => acceptChallenge(challengeId)},
    ]
    options.cancelable = false
    break
  case 'challengeStarted':
    buttons = [
      {text: 'C\'est parti !'},
    ]
    break
  }
  Alert.alert(
    _title,
    _body,
    buttons,
    options
  )
}
