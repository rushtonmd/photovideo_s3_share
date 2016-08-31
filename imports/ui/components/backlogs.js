import './backlogs.html';
import './backlogs.less';


import Clusters from '../../api/boards/clusters.js';

Meteor.subscribe('clusters', function() {
    //console.log(Clusters.find({}).fetch());
    //buildView();
});

Template.backlogsTemplate.helpers({
    isReady: function(sub) {
        //return subscriptionsReady(sub);
    },
    backlogs: function() {
        return Clusters.find({});
    }

});


Template.backlogsTemplate.events({
    'click .backlog-card' : function(event, template) {

        let clusterID = template.$('.backlog-card').data('id');

        FlowRouter.go('/backlogs/' + clusterID);
        //return Template.instance().showExtraFields.get();
    }
})