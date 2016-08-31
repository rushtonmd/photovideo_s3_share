import './nav-header-v2.html';
import './nav-header-v2.less';


Template.App_navHeaderv2.helpers({
    backlogName: function() {
        //const cluster = Template.instance().currentCluster.get() || {};
        let clusterID = FlowRouter.getParam('backlogid');
        let cluster = Clusters.findOne(clusterID) || {};
        console.log("WTF" + clusterID);
        return cluster.name || '';
    },
    showCenterNav: function(){
    	return FlowRouter.getParam('backlogid');
    }
});

Template.App_navHeaderv2.events({
    'click .home-link': function(event, template) {
    	console.log("WHAT?!?");
        FlowRouter.go('viewBacklogs');
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
        console.log("route: " + this.routeName + " : " + FlowRouter.getRouteName());

        return this.routeName === FlowRouter.getRouteName();

    }
});
