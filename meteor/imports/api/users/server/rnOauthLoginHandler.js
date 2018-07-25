import {ValidatedMethod} from 'meteor/mdg:validated-method'
import SimpleSchema      from 'simpl-schema'

const USER_WHITELIST = [
  'id', 'email', 'name',
  'lang', 'profile_image_url_https',
  'first_name', 'last_name',
  'given_name', 'family_name', 'picture', 'locale'
]
//BUG: to get twitter email : https://github.com/adamjmcgrath/react-native-simple-auth/issues/61
export default function rnOauthLoginHandler(options) {
  console.log(options)
  if (!options.user || !options.credentials || !options.provider) return undefined
  console.log(options.provider)
  new SimpleSchema({
    provider:    {type: String},
    user:        {type: Object, blackbox: true},
    credentials: {type: Object, blackbox: true},
  }).validate(options)
  const {user, credentials, provider} = options
  console.log(provider, user, credentials)
  const userData = {}
  USER_WHITELIST.forEach(key => userData[key] = user[key])
  const {id, email, locale, lang, ...userFields} = userData
  const {access_token, oauth_token, oauth_token_secret, id_token, expires_in} = credentials
  const expiresIn = expires_in && (typeof expires_in === 'string' ? parseInt(expires_in) : expires_in * 1000)
  const service = {
    ...userFields,
    accessToken:       access_token || oauth_token,
    accessTokenSecret: oauth_token_secret,
    email,
    expiresAt:   expiresIn && Date.now() + expiresIn,
    id,
    idToken:     id_token,
  }
  console.log(service)
  let existingUser = Meteor.users.findOneByEmail(email)
  if(!existingUser) {
    userId = Meteor.users.insert({
      emails:   [{address: email, verified: true}],
      profile:  {},
      services: {
        [provider]: service,
      },
    })
    existingUser = Meteor.users.findOne(userId)
  }
  console.log(existingUser)
  const servicePath = `services.${provider}`
  Meteor.users.update(existingUser._id, {
    $set: {
      [servicePath]: {
        ...(existingUser && existingUser.services ? existingUser.services[provider] : {}),
        ...service,
      },
      'profile.lang': existingUser.lang || locale || lang,
    },
    $addToSet: {
      emails: {address: email, verified: true},
    }
  })
  return { userId: existingUser._id }
}
