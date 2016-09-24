import { AccountsTemplates } from 'meteor/useraccounts:core';
import { Roles } from 'meteor/alanning:roles';

const setUserRolesOnSignUp = (userId, info) => {
  Roles.addUsersToRoles(userId, ['user', 'beginner']);
};

AccountsTemplates.configure({
  postSignUpHook: setUserRolesOnSignUp
});

Accounts.validateNewUser(function (user) {
	return true;
	console.log(user);
    if (user && user.profile && user.profile.invite_token === 'ABC')
        return true;
    throw new Meteor.Error(403, "Invitation token expired!");
});




// Meteor.startup(() => {
//   ServiceConfiguration.configurations.update(
//     { "service": "facebook" },
//     {
//       $set: {
//         "appId": "XXXXXXXXXXXXXXX",
//         "secret": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
//       }
//     },
//     { upsert: true }
//   );
// });


AccountsTemplates.configure({
  defaultLayout: 'App_body',
  defaultLayoutRegions: {},
  defaultContentRegion: 'main',
  confirmPassword: true,
  enablePasswordChange: true,
  forbidClientAccountCreation: false,
  overrideLoginErrors: true,
  enforceEmailVerification: false, 
  sendVerificationEmail: true,
  lowercaseUsername: false,
  focusFirstInput: true,
  showAddRemoveServices: true,
  showForgotPasswordLink: true,
  showLabels: true,
  showPlaceholders: true,
  showResendVerificationEmailLink: true,
  continuousValidation: true,
  negativeFeedback: true,
  negativeValidation: true,
  positiveValidation: true,
  positiveFeedback: true,
  showValidating: true,
  privacyUrl: 'Privacy',
  termsUrl: 'TermsOfUse',
  redirectTimeout: 0,
  texts: {
    button: {
      signUp: 'Create my Profile'
    },
    socialSignUp: 'Create my Profile',
    socialIcons: {
      'meteor-developer': 'fa fa-rocket'
    },
    title: {
      forgotPwd: 'Recover Your Password'
    }
  },
  onLogoutHook: function () {
    FlowRouter.go('App_timeline');
  }
});


AccountsTemplates.addField({
    _id: 'invite_token',
    type: 'hidden'
});

AccountsTemplates.configureRoute('signIn', {
    name: 'signin',
    path: '/signin',
    redirect: '/backlogs'
});

AccountsTemplates.configureRoute('signUp', {
    name: 'join',
    path: '/join',
    redirect: '/backlogs'
});



AccountsTemplates.configureRoute('forgotPwd', {
    name: 'forgotPwd'
});

AccountsTemplates.configureRoute('changePwd', {
    name: 'changePwd'
});

AccountsTemplates.configureRoute('verifyEmail', {
    name: 'verifyEmail'
});

AccountsTemplates.configureRoute('resetPwd', {
     name: 'resetPwd'
 });


