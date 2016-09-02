import './backlogs.html';
import './backlogs.less';


import Clusters from '../../api/boards/clusters.js';

// Meteor.subscribe('clusters', function() {
//     //console.log(Clusters.find({}).fetch());
//     //buildView();
// });

Template.backlogsTemplate.helpers({
    backlogs: function() {
        console.log(Clusters.find({}).fetch());
        return Clusters.find({});
    }

});

Template.backlogsTemplate.events({
    'click .backlog-card' : function(event, template) {

        let clusterID = template.$('.backlog-card').data('id');

        FlowRouter.go('/backlogs/' + clusterID + "/stack");
        //return Template.instance().showExtraFields.get();
    }
})