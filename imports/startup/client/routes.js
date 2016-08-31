import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { AccountsTemplates } from 'meteor/useraccounts:core';

import '../../ui/layouts/app-body.js';
import '../../ui/pages/root-redirector.js';
import '../../ui/pages/app-not-found.js';
import '../../ui/pages/app-timeline.js';
import '../../ui/pages/app-board.js';
import '../../ui/pages/app-backlogs.js';

FlowRouter.route('/', {
    name: 'App_timeline',
    action() {
        BlazeLayout.render('App_body', { main: 'App_timeline' });
    },
});


// Notions View
FlowRouter.route('/backlogs/:backlogid/views/:viewid/notion/:notionid', {
    name: 'Show Notions',
    action() {
        BlazeLayout.render('App_body', { main: 'App_board' });
    },
});

// Backlogs View
FlowRouter.route('/backlogs/:backlogid/views/:viewid', {
    name: 'backlogViews',
    subscriptions: function(params) {
        this.register('userClusters', Meteor.subscribe('clusters'));
        this.register('userClusterViews', Meteor.subscribe('views'));
        this.register('userNotions', Meteor.subscribe('notions'));
        this.register('userData', Meteor.subscribe('userData'));
        // this.register('currentPost', Meteor.subscribe('post', params.pageId));
        // this.register('currentComments', Meteor.subscribe('comments', params.pageId));
    },
    action() {
        BlazeLayout.render('App_body', { main: 'App_board' });
    },
});

// Backlogs Dashboard / Edit 
FlowRouter.route('/backlogs/:backlogid', {
    name: 'backlogInfo',
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

// Backlogs Dashboard / Edit 
FlowRouter.route('/backlogs/:backlogid/stack', {
    name: 'backlogStack',
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

// View All Backlogs
FlowRouter.route('/backlogs', {
    name: 'viewBacklogs',
    action() {
        BlazeLayout.render('App_body', { main: 'App_backlogs' });
    },
});

FlowRouter.notFound = {
    action() {
        BlazeLayout.render('App_body', { main: 'App_notFound' });
    },
};

AccountsTemplates.configureRoute('signIn', {
    name: 'signin',
    path: '/signin',
});

AccountsTemplates.configureRoute('signUp', {
    name: 'join',
    path: '/join',
});

AccountsTemplates.configureRoute('forgotPwd');

AccountsTemplates.configureRoute('resetPwd', {
    name: 'resetPwd',
    path: '/reset-password',
});
