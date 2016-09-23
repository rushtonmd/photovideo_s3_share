import './nav-header-v2.html';
import './nav-header-v2.less';

Template.App_navHeaderv2.onCreated(function() {
    Meteor.subscribe('userData');

    this.profileFixed = new ReactiveVar(false);

    let self = this;

    window.addEventListener('resize', function() {
        self.profileFixed.set($('div.profile-link').css('position') === 'fixed');
    });
});

Template.App_navHeaderv2.onRendered(function() {

    Template.instance().profileFixed.set($('div.profile-link').css('position') === 'fixed');

});


Template.App_navHeaderv2.helpers({
    backlogName: function() {
        //const cluster = Template.instance().currentCluster.get() || {};
        let clusterID = FlowRouter.getParam('backlogid');
        let cluster = Clusters.findOne(clusterID) || {};
        console.log("WTF" + clusterID);
        return cluster.name || '';
    },
    showCenterNav: function() {
        return FlowRouter.getParam('backlogid');
    },
    currentUserPhoto: function() {
        return Meteor.user().photo;
    },
    currentUserID: function() {
        return Meteor.userId();
    },
    profileOnBottomNav: function() {
        return Template.instance().profileFixed.get();
    }
});

Template.App_navHeaderv2.events({
    'click .home-link': function(event, template) {

        FlowRouter.go('backlogInfo');
    }
});

Template.centerNavLinkTemplate.events({
    'click .nav-link': function(event, template) {
        console.log("routing to " + this.routeName + " : " + FlowRouter.getParam('backlogid'));
        let params = { backlogid: FlowRouter.getParam('backlogid') };
        FlowRouter.go(this.routeName, params);
        //return Template.instance().showExtraFields.get();
    }
});

Template.centerNavLinkTemplate.helpers({
    isNavActive: function() {
        //const cluster = Template.instance().currentCluster.get() || {};
        //console.log("route: " + this.routeName + " : " + FlowRouter.getRouteName());
        //console.log("group: " + this.groupName + " : " + FlowRouter.current().route.group.name);

        return (this.routeName === FlowRouter.getRouteName()) || (this.groupName && this.groupName === (FlowRouter.current().route.group || {}).name);

    }
});
