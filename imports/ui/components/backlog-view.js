import './backlog-view.html';
import './backlog-view.less';

import './loading.js';

import Clusters from '../../api/boards/clusters.js';
import Views from '../../api/boards/views.js';


Template.backlogViewTemplate.onRendered(function(){
	console.log("On Rendered");
	const clusterID = FlowRouter.getParam('backlogid');
	let instance = Template.instance();
	Meteor.call('clusters.verify', clusterID, function(error, result){
		instance.clusterFound.set(result);

		console.log(result + " : " + instance.clusterFound.get());
	});
});

Template.backlogViewTemplate.onCreated(function() {

    // Meteor.subscribe('clusters', function() {
    //     //console.log(Clusters.find({}).fetch());
    //     //buildView();
    // });

    console.log("On Created");

    let instance = Template.instance();
    instance.clusterFound = new ReactiveVar(true); // Assume the URL is good... until it isn't. 


    // instance.autorun(function() {
    //     let clusterID = FlowRouter.getParam('backlogid');
    //     let cluster = Clusters.findOne(clusterID);
    //     console.log(clusterID + " : " + cluster);
    //     console.log(subscriptionsReady() + " : " + Clusters.find({}).count());
    //     console.log(FlowRouter.current().route);
    //     if (subscriptionsReady() && !cluster) {
    //         //FlowRouter.go('/not-found');
    //     } else {
    //         instance.currentCluster.set(Clusters.findOne(clusterID));
    //     }
    //     // Meteor.call('getCPUChartData', function(err, data) {
    //     //     instance.chartData.set(data);
    //     // });
    // });

});

const subscriptionsReady = (sub) => {
    if (sub) {
        return FlowRouter.subsReady(sub);
    } else {
        return FlowRouter.subsReady();
    }
};


Template.backlogViewTemplate.helpers({
    isReady: function(sub) {
        return subscriptionsReady(sub);
    },
    backlogFound: function(){
    	//let clusterID = FlowRouter.getParam('backlogid');
    	//let cluster = Clusters.findOne(clusterID);
    	const found = (Template.instance().clusterFound || {}).get();
    	return found;
    },
    backlogName: function() {
    	//const cluster = Template.instance().currentCluster.get() || {};
    	let clusterID = FlowRouter.getParam('backlogid');
    	let cluster = Clusters.findOne(clusterID) || {};
        return cluster.name;
    },
    views: function() {
    	let clusterID = FlowRouter.getParam('backlogid');
    	console.log(Views.find({clusterId: clusterID}));
    	return Views.find({clusterId: clusterID});
    },
    viewUrl: function(){
    	let clusterID = FlowRouter.getParam('backlogid');
    	let url = "/backlogs/" + clusterID + "/views/" + this._id;
    	return url;
    }

});
