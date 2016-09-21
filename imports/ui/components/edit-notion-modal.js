import './edit-notion-modal.html';
import './edit-notion-modal.less';

import Notions from '../../api/boards/boards.js';
import Comments from '../../api/boards/comments.js';

Template.App_editNotionModal.events({
    // 'click button.create-action': function(event) {
    //     console.log("Button Clicked!");
    //     var title = $('input.title-input').val();
    //     Meteor.call('CreateNotion', { title: title });
    //     $('#newNotionModal').modal('toggle');


    //     $('#success-alert').trigger('showAlert', ["Notion added to backlog!", false, "1.1em"]);

    //     //showConfirmationAlert("Notion added to the Backlog!");



    // },
    // 'submit .create-notion-form': function(event) {
    //     event.preventDefault();
    //     console.log("Enter Typed!");
    //     var title = $('input.title-input').val();
    //     Meteor.call('CreateNotion', { title: title });
    //     $('#success-alert').trigger('showAlert', ["Notion added to backlog!", false, "1.1em"]);
    //     $('#newNotionModal').modal('toggle');
    // }

    'click .close-edit-notion-modal': function(event) {

        //$('#editNotionModal').modal('hide');
        //console.log("Closing modal!");
        //const clusterID = FlowRouter.getParam('backlogid');

        //FlowRouter.go('/backlogs/' + clusterID + "/stack");
    },
    'click .add-comment-button': function(event) {
        var comment = $('textarea.comment-input').val();
        console.log("Adding Comment!");
        Meteor.call('comments.createComment', comment, this._id);
        $('textarea.comment-input').val("");
    }


});

Template.App_editNotionModal.helpers({
    currentNotion: function() {
        const notionID = FlowRouter.getParam('notionid');
        //console.log(Notions.findOne(notionID));
        return Notions.findOne(notionID);
    },
    assignedToUser: function() {
        return Meteor.users.findOne(this.assignedTo);
    },
    comments: function() {
        return Comments.find({ parentNotion: this._id }, { sort: { createdDate: -1 } });
    },
    commentsAvailable: function(){
        return Comments.findOne({ parentNotion: this._id });
    }
});

Template.notionCommentTemplate.helpers({
    commentedBy: function() {
        const user = Meteor.users.findOne(this.createdBy);
        return user
    },
    formatDate: function(date) {
        return moment(date).calendar();
    },
    formatName: function() {
        const user = Meteor.users.findOne(this.createdBy);
        return user.displayName || user.emails[0].address;
    },
    rowDecaratorClass: function(index) {
        return "timeline-inverted";
        if (index % 2 === 0) return "timeline-inverted";
    }
});

Template.App_editNotionModal.onCreated(function() {

});



Template.App_editNotionModal.onRendered(function() {

    //const notionID = FlowRouter.getParam('notionid');

    // Ensure all the info needed has been subscribed to
    //Meteor.subscribe('editNotionDetails', Meteor.userId(), notionID);

    //console.log(notionID + " subscribe!");

    // $('#editNotionModal').on('shown.bs.modal', function() {
    //     console.log("In Modal Shown!");
    //     //$('input.title-input').val("");
    //     //$('input.title-input').focus();
    // });

    // $('#editNotionModal').on('hidden.bs.modal', function() {
    //     console.log("Closing modal!");
    //     const clusterID = FlowRouter.getParam('backlogid');

    //     FlowRouter.go('/backlogs/' + clusterID + "/stack");
    // });

});

Template.editNotionAssignedToSelect.helpers({
    availableUsers: function(){
        return Meteor.users.find({});
    },
    primaryEmail: function(userId){
        const user = Meteor.users.findOne(userId);
        return user.displayName || user.emails[0].address;
    }
});

Template.editNotionAssignedToSelect.onRendered(function() {
    // Initialize the select picker
    $('.assignedto-selectpicker').selectpicker();
});

Template.editNotionAssignedToSelect.events({
    'loaded.bs.select .assignedto-selectpicker': function(event) {
        const notionID = FlowRouter.getParam('notionid');

        const notion = Notions.findOne(notionID);

        console.log("Assigned To: " + notion.assignedTo);

        $('.assignedto-selectpicker').selectpicker('val', notion.assignedTo);
    },
    'changed.bs.select .assignedto-selectpicker': function(event) {

        const newAssignedTo = $('.assignedto-selectpicker').val();

        Meteor.call('notions.updateNotionAssignedTo', this.notionId, newAssignedTo);
    }
});


Template.editNotionStatusSelect.onRendered(function() {
    // Initialize the select picker
    $('.status-selectpicker').selectpicker();
});

Template.editNotionStatusSelect.events({
    'loaded.bs.select .status-selectpicker': function(event) {
        const notionID = FlowRouter.getParam('notionid');

        const notion = Notions.findOne(notionID);

        console.log("Status: " + notion.status);

        $('.status-selectpicker').selectpicker('val', notion.status);
    },
    'changed.bs.select .status-selectpicker': function(event) {

        const newStatus = $('.status-selectpicker').val();

        Meteor.call('notions.updateNotionStatus', this.notionId, newStatus);
    }
});
