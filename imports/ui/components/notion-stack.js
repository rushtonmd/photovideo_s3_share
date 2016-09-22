import './notion-stack.html';
import './notion-stack.less';

import '../lib/swiped.js';
import BootstrapBreakpoints from '../lib/bootstrap-breakpoints.js';

import Notions from '../../api/boards/boards.js';
import Clusters from '../../api/boards/clusters.js';
import Views from '../../api/boards/views.js';

// Since meteor has Jquery ($) out of the box...
// const isBreakpoint = function isBreakpoint( alias ) {
//     return $('.device-' + alias).is(':visible');
// }

Template.notionStackTemplate.onRendered(function() {
    // And then you can do anything that the original package provide, like: 
    //console.log("XS Breakpoint: ", BootstrapBreakpoints.isBreakpoint('xs'));

    // If there is a notionid from the params, we need to popup the edit dialog
    const notionID = FlowRouter.getParam('notionid');
    if (notionID) {
        // Ensure there are no events attached to the edit modal
        $('#editNotionModal').off('hide.bs.modal');

        // Attach an event to the modal to fire when the modal closes
        // to remove the param from the url
        $('#editNotionModal').on('hide.bs.modal', function() {
            FlowRouter.setParams({ "notionid": null });
        });

        // to remove the param from the url
        //Meteor.subscribe('editNotionDetails', Meteor.userId(), notionID);
        $('#editNotionModal').modal('show');
    } else {
        console.log("Hide edit modal!");
        $('#editNotionModal').modal('hide');
    }

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
        if (!BootstrapBreakpoints.isBreakpoint('xs')) {
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

Template.backlogListCardTemplate.onRendered(function() {

    if (BootstrapBreakpoints.isBreakpoint('xs')) {
        Swiped.init({
            query: '.list-group-item.list-card[source-id="' + this.data._id + '"]',
            right: 50
        });
    }
});

Template.backlogListCardTemplate.events({
    'click': function(event, template) {

        // Get the notionid from the template data
        const notionID = template.data._id;

        // Set the param for the notionid
        FlowRouter.setParams({ "notionid": notionID });

        // Ensure there are no events attached to the edit modal
        $('#editNotionModal').off('hide.bs.modal');

        // Attach an event to the modal to fire when the modal closes
        // to remove the param from the url
        $('#editNotionModal').on('hide.bs.modal', function() {
            FlowRouter.setParams({ "notionid": null });
        });

        // to remove the param from the url
        //Meteor.subscribe('editNotionDetails', Meteor.userId(), notionID);

        // Show the edit modal
        $('#editNotionModal').modal('show');

    }
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

        if (!usr) return '/person-placeholder-female2.jpg';

        if (usr && usr.photo) return usr.photo;

        return "";
    }
})
