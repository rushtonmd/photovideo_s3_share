import './nav-overlay-sidebar.html';
import './nav-overlay-sidebar.less';

Template.App_overlaySidebar.helpers({
    isSidebarHidden: function() {
        return !Session.get('SidebarOpen');
    },
    isMenuItemActive: function() {
        return false;
    },
    backlogInformationURL: function() {
        let clusterID = FlowRouter.getParam('backlogid');
        return "/backlogs/" + clusterID;
    },
    backlogViewsURL: function() {
        let clusterID = FlowRouter.getParam('backlogid');
        return "/backlogs/" + clusterID + "/views";
    },
    backlogPlanningURL: function() {
        let clusterID = FlowRouter.getParam('backlogid');
        return "/backlogs/" + clusterID + "/planning";
    }

});

Template.App_overlaySidebar.events({
    'click a.sidebar-link': function(){
    	Session.set('SidebarOpen', false);
    }
});
