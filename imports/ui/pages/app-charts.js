// Main HTML
import './app-charts.html';

// Components
import '../components/loading.js';
import '../components/oh-noes.js';

import Clusters from '../../api/boards/clusters.js';
import Notions from '../../api/boards/boards.js';

Template.App_charts.onRendered(function() {
    console.log("On Rendered");
    const clusterID = FlowRouter.getParam('backlogid');
    let instance = Template.instance();

    Meteor.call('clusters.verify', clusterID, function(error, result) {
        instance.clusterFound.set(result);

        console.log(result + " : " + instance.clusterFound.get());
    });
});

Template.App_charts.onCreated(function() {

    console.log("On Created");

    let instance = Template.instance();
    instance.clusterFound = new ReactiveVar(true); // Assume the URL is good... until it isn't. 
    instance.waitingForResponse = new ReactiveVar(false);

    instance.autorun(function() {
    	instance.waitingForResponse.set(true);
        let clusterID = FlowRouter.getParam('backlogid');
        //instance.currentCluster.set(Clusters.findOne(clusterID));

        Meteor.call('clusters.verify', clusterID, function(error, result) {
            instance.clusterFound.set(result);
            instance.waitingForResponse.set(false);

            console.log(result + " : " + instance.clusterFound.get());
        });
    });
});

Template.App_charts.helpers({
    isReady: function(sub) {
        return subscriptionsReady(sub) && !Template.instance().waitingForResponse.get();
    },
    backlogFound: function() {
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
    templateName: function() {
        let backlogID = FlowRouter.getParam('backlogid');
        const pathName = FlowRouter.getRouteName();

        console.log(backlogID + " : " + pathName);

        return 'backlogChartsTemplate'

    }

});

const subscriptionsReady = (sub) => {
    if (sub) {
        return FlowRouter.subsReady(sub);
    } else {
        return FlowRouter.subsReady();
    }
};