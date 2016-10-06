import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { AccountsTemplates } from 'meteor/useraccounts:core';

import '../../ui/layouts/app-body.js';
import '../../ui/pages/root-redirector.js';
import '../../ui/pages/app-not-found.js';
import '../../ui/pages/app-profile.js';
import '../../ui/pages/app-admin.js';
import '../../ui/pages/app-landing.js';

const exposed = FlowRouter.group({});


FlowRouter.route('/', {
    name: 'App_landing',
    subscriptions: function(params) {
        this.register('mediaitems', Meteor.subscribe('mediaitems', params));
    },
    action() {
        BlazeLayout.render('App_body', { main: 'App_landing' });
    },
});

FlowRouter.route('/admin', {
    name: 'App_admin',
    triggersEnter: ([AccountsTemplates.ensureSignedIn]),
    subscriptions: function(params) {
        this.register('mediaitems', Meteor.subscribe('mediaitems', params));
    },
    action() {
        BlazeLayout.render('App_body', { main: 'App_admin' });
    },
});


/*  User Profile View

    This route is for a single profile view of a user.
*/
FlowRouter.route('/profiles/:userid', {
    name: 'userProfile',
    subscriptions: function(params) {
        this.register('userData', Meteor.subscribe('userData', params));
    },
    action() {
        BlazeLayout.render('App_body', { main: 'App_profile' });
    },
});


FlowRouter.notFound = {
    action() {
        BlazeLayout.render('App_body', { main: 'App_notFound' });
    }
};

