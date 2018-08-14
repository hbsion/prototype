import debounce    from 'lodash/debounce'
import React       from 'react'
import { Button, Image, StyleSheet, Text, TextInput, View } from 'react-native'
import { RNS3 }    from 'react-native-aws3'
import Config      from 'react-native-config'
import ImagePicker from 'react-native-image-crop-picker'
import Meteor, {withTracker} from 'react-native-meteor'

const { accessKey, bucket, keyPrefix, region, secretKey } = JSON.parse(Config.AWS_PHOTOS)
const awsConfig = {
  awsUrl: 's3-eu-west-1.amazonaws.com',
  bucket,
  keyPrefix,
  region,
  accessKey,
  secretKey,
}
@withTracker(() => ({ user: Meteor.user() }))
export default class OwnProfile extends React.Component {
  constructor(props) {
    super(props)
    const { user } = props
    this.state = {
      photo: {
        path: user.profile.photo && `https://${bucket}.s3-${region}.amazonaws.com/${keyPrefix}${user._id}.jpg`
      }
    }
  }
  render() {
    const { photo, photoSaved, usernameSaved } = this.state
    const { user } = this.props
    if(!user) return null
    return (
      <View style={styles.container}>
        <TextInput
          defaultValue={user.username}
          style={styles.input}
          onChangeText={this.saveUsername}
          placeholder="Pseudo"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {usernameSaved && <Text>saved</Text>}
        {photo.path ?
          <View>
            <Image
              source={{uri: photo.path}}
              style={{width: 100, height: 100}} />
            {photoSaved && <Text>saved</Text>}
          </View>
        :
          <View>
            <Button onPress={this.openCamera} title="Appareil photo" />
            <Button onPress={this.openPicker} title="Galerie" />
          </View>
        }
      </View>
    )
  }
  openCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then(this.saveImage)
  }
  openPicker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then(this.saveImage)
  }
  saveImage = async (image) => {
    const userId = this.props.user._id
    console.log("image", Object.keys(image))
    this.setState({photo: image, photoSaved: false})
    const file = {
      uri:  image.path,
      type: image.mime,
      name: `${userId}.jpg`,
    }
    await RNS3.put(file, awsConfig).progress((e) => this.setState({photoSaving: e.percent}))
      .then((response) => {
        if (response.status !== 201)
          throw new Error("Failed to upload image to S3")
        console.log(response.body)
        const {bucket, key, etag} = response.body.postResponse
        if(response.body.postResponse.key) {
          Meteor.collection('users').update(
            this.props.user._id,
            {$set: {'profile.photo': {
              bucket, etag, key
            }}}
          )
          this.setState({photoSaved: true})
        }
      })
  }
  saveUsername = debounce(
    (username) => {
      Meteor.collection('users').update(
        this.props.user._id,
        {$set: { username }}
      )
      this.setState({usernameSaved: true})
    },
    1000
  )
  updateUsername = (username) => {
    this.setState({username, usernameSaved: false})
    this.saveUsername(username)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  input: {
    padding: 10,
    width: 200,
    backgroundColor: '#FFFFFF',
    borderColor: '#888888',
    borderWidth: 1,
    marginHorizontal: 20,
    marginBottom: 10,
  },
})
