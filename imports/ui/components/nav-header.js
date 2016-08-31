import { ActiveRoute } from 'meteor/zimme:active-route';
import Clusters from '../../api/boards/clusters.js';

import './nav-header.html';
import './nav-header.less';

Template.App_navHeader.onCreated(function(){
	Session.set( "SidebarOpen", false );
});

Template.App_navHeader.helpers({
	backlogName: function() {
    	//const cluster = Template.instance().currentCluster.get() || {};
    	let clusterID = FlowRouter.getParam('backlogid');
    	let cluster = Clusters.findOne(clusterID) || {};
    	console.log("WTF" + clusterID);
        return cluster.name || '';
    }
});

Template.App_navHeader.events({
    'click .toggle-sidebar-button': function(event, template) {
    	const currentValue = Session.get('SidebarOpen');
        Session.set( "SidebarOpen", !currentValue );
        //return Template.instance().showExtraFields.get();
    }
});
