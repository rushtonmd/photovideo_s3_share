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
    FlowRouter.go('App_landing');
  }
});


AccountsTemplates.addField({
    _id: 'invite_token',
    type: 'hidden'
});

AccountsTemplates.configureRoute('signIn', {
    name: 'signin',
    path: '/signin',
    redirect: '/admin'
});

FlowRouter.route('/signout', {
    name: 'signout',
    triggersEnter: [function(context, redirect) {
        AccountsTemplates.logout();
    }],
    action: function() {
            // do something you like
        } 
});

AccountsTemplates.configureRoute('signUp', {
    name: 'join',
    path: '/join',
    redirect: '/admin'
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


