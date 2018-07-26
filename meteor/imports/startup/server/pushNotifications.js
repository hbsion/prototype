import {Meteor} from 'meteor/meteor'
import firebaseAdmin from 'firebase-admin'

if(Meteor.settings.firebase) {
  firebaseAdmin.initializeApp({
    credential:  firebaseAdmin.credential.cert(Meteor.settings.firebase),
    databaseURL: "https://enzym-proto.firebaseio.com"
  })
}
