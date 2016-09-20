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

const exposed = FlowRouter.group({});

FlowRouter.route('/', {
    name: 'App_timeline',
    action() {
        BlazeLayout.render('App_body', { main: 'App_timeline' });
    },
});

FlowRouter.route('/profiles/:userid', {
    name: 'userProfile',
    subscriptions: function(params) {
        this.register('userData', Meteor.subscribe('userData'));
    },
    action() {
        BlazeLayout.render('App_body', { main: 'App_profile' });
    },
});


const backlogViewRoutes = FlowRouter.group({
    name: 'backlogViewsGroup',
    triggersEnter: ([AccountsTemplates.ensureSignedIn]),
    subscriptions: function(params) {
        this.register('userClusters', Meteor.subscribe('clusters'));
        this.register('userClusterViews', Meteor.subscribe('views'));
        this.register('userNotions', Meteor.subscribe('notions'));
        this.register('userData', Meteor.subscribe('userData'));
        // this.register('currentPost', Meteor.subscribe('post', params.pageId));
        // this.register('currentComments', Meteor.subscribe('comments', params.pageId));
    }
});

// Notions View
FlowRouter.route('/backlogs/:backlogid/views/:viewid/notions/:notionid', {
    name: 'editSingleViewNotion',
    action() {
        BlazeLayout.render('App_body', { main: 'App_board' });
    }
});

backlogViewRoutes.route('/backlogs/:backlogid/views', {
    name: 'backlogViewsList',
    action() {
        BlazeLayout.render('App_body', { main: 'App_board' });
    }
});

// Backlogs View
backlogViewRoutes.route('/backlogs/:backlogid/views/:viewid', {
    name: 'backlogViewsInfo',
    action() {
        BlazeLayout.render('App_body', { main: 'App_board' });
    },
});

// Backlogs Dashboard / Edit 
FlowRouter.route('/backlogs/:backlogid', {
    name: 'backlogInfo',
    triggersEnter: ([AccountsTemplates.ensureSignedIn]),
    subscriptions: function(params) {
        this.register('userClusters', Meteor.subscribe('clusters'));
        this.register('userClusterViews', Meteor.subscribe('views'));
        // this.register('currentPost', Meteor.subscribe('post', params.pageId));
        // this.register('currentComments', Meteor.subscribe('comments', params.pageId));
    },
    action() {
        BlazeLayout.render('App_body', { main: 'App_backlogs' });
    },
});

// // Backlogs Dashboard / Edit 
// FlowRouter.route('/backlogs/:backlogid/stack', {
//     name: 'backlogStack',
//     triggersEnter: ([AccountsTemplates.ensureSignedIn]),
//     subscriptions: function(params) {
//         this.register('userClusters', Meteor.subscribe('clusters'));
//         this.register('userClusterViews', Meteor.subscribe('views'));
//         this.register('userNotions', Meteor.subscribe('notions'));
//         this.register('userData', Meteor.subscribe('userData'));
//         // this.register('currentPost', Meteor.subscribe('post', params.pageId));
//         // this.register('currentComments', Meteor.subscribe('comments', params.pageId));
//     },
//     action() {
//         BlazeLayout.render('App_body', { main: 'App_backlogs' });
//     },
// });

// Backlogs Dashboard / Edit 
FlowRouter.route('/backlogs/:backlogid/stack/:notionid?', {
    name: 'editSingleBacklogNotion',
    triggersEnter: ([AccountsTemplates.ensureSignedIn]),
    subscriptions: function(params) {
        this.register('userClusters', Meteor.subscribe('clusters'));
        this.register('userClusterViews', Meteor.subscribe('views'));
        this.register('userNotions', Meteor.subscribe('notions'));
        this.register('userData', Meteor.subscribe('userData'));
        // this.register('currentPost', Meteor.subscribe('post', params.pageId));
        // this.register('currentComments', Meteor.subscribe('comments', params.pageId));
    },
    action() {
        BlazeLayout.render('App_body', { main: 'App_backlogs' });
    },
});

// // Notions View
// FlowRouter.route('/backlogs/:backlogid/stack/notions/:notionid', {
//     name: 'editSingleBacklogNotion',
//     action() {
//         BlazeLayout.render('App_body', { main: 'App_board' });
//     }
// });

// View All Backlogs
FlowRouter.route('/backlogs', {
    name: 'viewBacklogs',
    triggersEnter: ([AccountsTemplates.ensureSignedIn]),
    subscriptions: function(params) {
        this.register('userClusters', Meteor.subscribe('clusters'));
        this.register('userClusterViews', Meteor.subscribe('views'));
        this.register('userNotions', Meteor.subscribe('notions'));
        this.register('userData', Meteor.subscribe('userData'));
        // this.register('currentPost', Meteor.subscribe('post', params.pageId));
        // this.register('currentComments', Meteor.subscribe('comments', params.pageId));
    },
    action() {
        BlazeLayout.render('App_body', { main: 'App_backlogs' });
    },
});

FlowRouter.notFound = {
    action() {
        BlazeLayout.render('App_body', { main: 'App_notFound' });
    },
};

FlowRouter.route('/signout', {
    name: 'signout',
    triggersEnter: [function(context, redirect) {
        AccountsTemplates.logout();
  }],
  action: function() {
    // do something you like
  }//,
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

// AccountsTemplates.configureRoute('resetPwd', {
//     name: 'resetPwd',
//     path: '/forgot-password',
// });

