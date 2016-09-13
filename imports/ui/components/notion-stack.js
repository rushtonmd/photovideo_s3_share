import './notion-stack.html';
import './notion-stack.less';

import Notions from '../../api/boards/boards.js';
import Clusters from '../../api/boards/clusters.js';
import Views from '../../api/boards/views.js';


Template.notionStackTemplate.onRendered(function() {

});

Template.notionStackTemplate.onCreated(function() {

});

Template.notionStackTemplate.helpers({
    backlogName: function() {
        let clusterID = FlowRouter.getParam('backlogid');
        let cluster = Clusters.findOne(clusterID) || {};
        return cluster.name;
    }

});

Template.backlogStackContentTemplate.helpers({
    filteredNotions: function() {
        return Notions.find({}, { sort: { order: 1 } });
    },
    listOptions: function() {
        return {
            group: {
                name: "GROUP"
            },
            delay: 200,
            animation: 300
        };
    }
});

Template.backlogStackContentTemplate.onRendered(function() {


});

Template.backlogListCardTemplate.helpers({
    noUserAssigned: function() {
        return !this.assignedTo;
    },
    notBlocked: function() {
        return !this.blocked;
    },
    assignedUserPhoto: function() {
        let id = this.assignedTo;
        let usr = Meteor.users.findOne(id);
        if (usr && usr.photo) return usr.photo;
        return "";
    }
})
