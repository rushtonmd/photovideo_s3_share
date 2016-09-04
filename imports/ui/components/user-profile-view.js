import './user-profile-view.html';
import './user-profile-view.less';

import uploadcare from 'meteor/uploadcare:uploadcare-widget';

// import './loading.js';

// import Clusters from '../../api/boards/clusters.js';
// import Views from '../../api/boards/views.js';

Template.uploadcareTemplate.onRendered(function() {
    let widget = uploadcare.Widget('#file-show')

    widget.onUploadComplete(info => {
        // Handle uploaded file info.
        this.uuid.set(info.uuid);
        this.cdnUrl.set(info.cdnUrl);

        Meteor.call('users.updatePhoto', Meteor.userId(), info.cdnUrl, function(err, data) {
            console.log(data);
        });

        console.log("URL: " + this.cdnUrl.get());
    });
});

Template.uploadcareTemplate.onCreated(function() {
    this.uuid = new ReactiveVar('');
    this.cdnUrl = new ReactiveVar('');
});


Template.userProfileViewTemplate.onRendered(function() {
    console.log("Profile On Rendered");
    // const clusterID = FlowRouter.getParam('backlogid');
    // let instance = Template.instance();
    // Meteor.call('clusters.verify', clusterID, function(error, result){
    //  instance.clusterFound.set(result);

    //  console.log(result + " : " + instance.clusterFound.get());
    // });
});

Template.userProfileViewTemplate.onCreated(function() {

    // Meteor.subscribe('clusters', function() {
    //     //console.log(Clusters.find({}).fetch());
    //     //buildView();
    // });

    console.log("Profile On Created");

    // let instance = Template.instance();
    // instance.clusterFound = new ReactiveVar(true); // Assume the URL is good... until it isn't. 


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



// Template.userProfileViewTemplate.helpers({
//     isReady: function(sub) {
//         return true;
//     }

// });
