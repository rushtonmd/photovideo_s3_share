// Main HTML
import './app-backlogs.html';

// Components
import '../components/backlogs.js';
import '../components/backlog-view.js';
import '../components/notion-stack.js';
import '../components/loading.js';

import Notions from '../../api/boards/boards.js';
import Clusters from '../../api/boards/clusters.js';
import Views from '../../api/boards/views.js';

// Template.App_backlogs.onCreated(function() {
//     //console.log("TEST");
// });

// /* Need templates for:

// 	Backlogs: View list of backlogs
// 	Backlog: View/Edit a single backlog

// */

// // Template.App_backlogs.helpers({
// //     templateName: function() {
// //         let backlogID = FlowRouter.getParam('backlogid');
// //         const pathName = FlowRouter.getRouteName();

// //         if (backlogID) {
// //             if (pathName === 'backlogStack') return 'notionStackTemplate';
// //             return 'backlogViewTemplate';
// //         }

// //         return 'backlogsTemplate'

// //     }

// // });

Template.App_backlogs.onRendered(function() {
    console.log("On Rendered");
    const clusterID = FlowRouter.getParam('backlogid');
    let instance = Template.instance();

    Meteor.call('clusters.verify', clusterID, function(error, result) {
        instance.clusterFound.set(result);

        console.log(result + " : " + instance.clusterFound.get());
    });
});

Template.App_backlogs.onCreated(function() {

    console.log("On Created");

    let instance = Template.instance();
    instance.clusterFound = new ReactiveVar(true); // Assume the URL is good... until it isn't. 

});

Template.App_backlogs.helpers({
    isReady: function(sub) {
        return subscriptionsReady(sub);
    },
    backlogFound: function() {
        //let clusterID = FlowRouter.getParam('backlogid');
        //let cluster = Clusters.findOne(clusterID);
        
        if (FlowRouter.getRouteName() === 'viewBacklogs') return true; // we don't care if the specific backlog exists

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

        if (backlogID) {
            if (pathName === 'backlogStack') return 'notionStackTemplate';
            return 'backlogViewTemplate';
        }

        return 'backlogsTemplate'

    }

});

const subscriptionsReady = (sub) => {
    if (sub) {
        return FlowRouter.subsReady(sub);
    } else {
        return FlowRouter.subsReady();
    }
};
