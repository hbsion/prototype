import {Accounts} from 'meteor/accounts-base'

import emailVerificationTemplate from './emailVerificationTemplate'


Accounts.passwordless.config = {
  ...Accounts.passwordless.config,
  codeType:            'code',
  emailFrom:           Meteor.settings.emailFrom,
  tokenLifeTime:       15 * 60,
}
Accounts.passwordless.emailTemplates.sendVerificationCode = emailVerificationTemplate
