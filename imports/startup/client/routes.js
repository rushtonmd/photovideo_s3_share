import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { AccountsTemplates } from 'meteor/useraccounts:core';

import '../../ui/layouts/app-body.js';
import '../../ui/pages/root-redirector.js';
import '../../ui/pages/app-not-found.js';
import '../../ui/pages/app-timeline.js';
import '../../ui/pages/app-board.js';
import '../../ui/pages/app-backlogs.js';
import '../../ui/pages/app-profile.js';
import '../../ui/pages/app-charts.js';
import '../../ui/pages/app-users.js';

const exposed = FlowRouter.group({});

FlowRouter.route('/', {
    name: 'App_timeline',
    action() {
        BlazeLayout.render('App_body', { main: 'App_timeline' });
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


/*  Backlog View

    This is a group for all routes the fall under the /backlogs route. 
*/
const backlogsRoutesGroup = FlowRouter.group({
    prefix: '/backlogs',
    name: 'backlogsRoutesGroup',
    triggersEnter: ([AccountsTemplates.ensureSignedIn]),
    subscriptions: function(params, queryParams) {
        this.register('userClusters', Meteor.subscribe('clusters'));
    }
});

/*  The base route /backlogs will take the user to a list of all available backlogs

    The detail route will include a backlogid and take the user to the details for that single backlog.
*/
backlogsRoutesGroup.route('/:backlogid?', {
    name: 'backlogInfo',
    triggersEnter: ([AccountsTemplates.ensureSignedIn]),
    subscriptions: function(params, queryParams) {
        this.register('userClusters', Meteor.subscribe('clusters', params));
    },
    action() {
        BlazeLayout.render('App_body', { main: 'App_backlogs' });
    }
});

// This is the base route group for the backlog views.
const backlogViewsGroup = backlogsRoutesGroup.group({
    prefix: '/:backlogid/views',
    name: 'backlogViewsGroup',
    subscriptions: function(params, queryParams) {
        this.register('userClusters', Meteor.subscribe('clusters', params));
        this.register('userClusterViews', Meteor.subscribe('views', params));
    }
});


// This is the route to either view a list of backlog views, a single view, or edit a notion within a view
backlogViewsGroup.route('/:viewid?/:notionid?', {
    name: 'backlogViews',
    subscriptions: function(params, queryParams) {
        this.register('userNotions', Meteor.subscribe('notions', params));
        this.register('userData', Meteor.subscribe('userData'));
        this.register('editNotionDetails', Meteor.subscribe('editNotionDetails', params));
    },
    action() {
        BlazeLayout.render('App_body', { main: 'App_board' });
    }
});

// This is the stack group
const backlogStackGroup = backlogsRoutesGroup.group({
    prefix: '/:backlogid/stack',
    name: 'backlogStackGroup',
    subscriptions: function(params, queryParams) {
        this.register('userClusters', Meteor.subscribe('clusters', params));
        this.register('userNotions', Meteor.subscribe('notions', params));
    }
});


// This is the route to view the stack or to edit a single notion within the stack
backlogStackGroup.route('/:notionid?', {
    name: 'backlogStack',
    triggersEnter: ([AccountsTemplates.ensureSignedIn]),
    subscriptions: function(params, queryParams) {
        this.register('userData', Meteor.subscribe('userData'));
        this.register('editNotionDetails', Meteor.subscribe('editNotionDetails', params));
    },
    action() {
        BlazeLayout.render('App_body', { main: 'App_backlogs' });
    }
});


// This is the base group for backlog charts
const backlogChartsGroup = backlogsRoutesGroup.group({
    prefix: '/:backlogid/charts',
    name: 'backlogChartsGroup',
    subscriptions: function(params, queryParams) {
        this.register('userClusters', Meteor.subscribe('clusters', params));
        this.register('userNotions', Meteor.subscribe('notions', params));
    }
});


//  This is the route to view the charts or edit an individual chart
backlogChartsGroup.route('/:chartid?', {
    name: 'backlogCharts',
    triggersEnter: ([AccountsTemplates.ensureSignedIn]),
    subscriptions: function(params, queryParams) {
        //this.register('userData', Meteor.subscribe('userData'));
    },
    action() {
        BlazeLayout.render('App_body', { main: 'App_charts' });
    }
});

// This is the base group for backlog users
const backlogUsersGroup = backlogsRoutesGroup.group({
    prefix: '/:backlogid/users',
    name: 'backlogUsersGroup',
    subscriptions: function(params, queryParams) {
        this.register('userClusters', Meteor.subscribe('clusters', params));
        this.register('userNotions', Meteor.subscribe('notions', params));
    }
});


// This is the group to view all the users or edit a single user's permission 
backlogUsersGroup.route('/:userid?', {
    name: 'backlogUsers',
    triggersEnter: ([AccountsTemplates.ensureSignedIn]),
    subscriptions: function(params, queryParams) {
        this.register('userData', Meteor.subscribe('userData'));
    },
    action() {
        BlazeLayout.render('App_body', { main: 'App_users' });
    }
});


FlowRouter.notFound = {
    action() {
        BlazeLayout.render('App_body', { main: 'App_notFound' });
    }
};

FlowRouter.route('/signout', {
    name: 'signout',
    triggersEnter: [function(context, redirect) {
        AccountsTemplates.logout();
    }],
    action: function() {
            // do something you like
        } //,
        // calls when when we decide to move to another route
        // but calls before the next route started
        //triggersExit: [trackRouteClose]
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
