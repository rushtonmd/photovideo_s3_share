import './notion-stack.html';
import './notion-stack.less';

import Notions from '../../api/boards/boards.js';
import Clusters from '../../api/boards/clusters.js';
import Views from '../../api/boards/views.js';

// Since meteor has Jquery ($) out of the box...
const viewport = ResponsiveBootstrapToolkit($);

Template.notionStackTemplate.onRendered(function() {
    // And then you can do anything that the original package provide, like: 
    console.log("New one", viewport.current());
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
        // For xs screens, set this to 200 to aid in scrolling
        let delay = 200;

        // If the screen isn't xs, set the delay to 0
        if (viewport.current() !== "xs") {
            delay = 0;
        }
        
        return {
            group: {
                name: "GROUP"
            },
            delay: delay,
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
