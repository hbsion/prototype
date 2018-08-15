import Config      from 'react-native-config'

const { bucket, keyPrefix, region } = JSON.parse(Config.AWS_PHOTOS)

export default (storageId) => {
  return `https://${bucket}.s3-${region}.amazonaws.com/${keyPrefix}${storageId}.jpg`
}
