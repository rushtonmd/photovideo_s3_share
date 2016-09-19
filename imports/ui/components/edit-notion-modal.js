import './edit-notion-modal.html';
import './edit-notion-modal.less';

import Notions from '../../api/boards/boards.js';

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

    'click .close-edit-notion-modal': function(event){

        //$('#editNotionModal').modal('hide');
        //console.log("Closing modal!");
        //const clusterID = FlowRouter.getParam('backlogid');

        //FlowRouter.go('/backlogs/' + clusterID + "/stack");
    }


});

Template.App_editNotionModal.helpers({
    currentNotion: function() {
        const notionID = FlowRouter.getParam('notionid');
        return Notions.findOne(notionID);
    },
    assignedToUser: function(){
        return Meteor.users.findOne(this.assignedTo);
    }
});

Template.App_editNotionModal.onCreated(function() {
    const notionID = FlowRouter.getParam('notionid');

    // Ensure all the info needed has been subscribed to
    Meteor.subscribe('editNotionDetails', Meteor.userId(), notionID);

    //console.log("Looking for " + notionId);
});



Template.App_editNotionModal.onRendered(function() {

    // $('#newNotionModal').on('shown.bs.modal', function() {
    //     $('input.title-input').val("");
    //     $('input.title-input').focus();
    // })

    // $('#editNotionModal').on('hidden.bs.modal', function() {
    //     console.log("Closing modal!");
    //     const clusterID = FlowRouter.getParam('backlogid');

    //     FlowRouter.go('/backlogs/' + clusterID + "/stack");
    // });

});
