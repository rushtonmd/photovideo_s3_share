import './new-notion-modal.html';
import './new-notion-modal.less';

Template.App_newNotionModal.events({
    'click button.create-action': function(event) {
        console.log("Button Clicked!");
        var title = $('input.title-input').val();
        Meteor.call('CreateNotion', { title: title });
        $('#newNotionModal').modal('toggle');


        $('#success-alert').trigger('showAlert', ["Notion added to backlog!", false, "1.1em"]);

        //showConfirmationAlert("Notion added to the Backlog!");



    },
    'submit .create-notion-form': function(event) {
        event.preventDefault();
        console.log("Enter Typed!");
        var title = $('input.title-input').val();
        Meteor.call('CreateNotion', { title: title });
        $('#success-alert').trigger('showAlert', ["Notion added to backlog!", false, "1.1em"]);
        $('#newNotionModal').modal('toggle');
    }
});

Template.App_newNotionModal.onRendered(function() {

    $('#newNotionModal').on('shown.bs.modal', function() {
        $('input.title-input').val("");
        $('input.title-input').focus();
    })

    $('#newNotionModal').on('hidden.bs.modal', function() {
        $('input.title-input').val("");
    });

});
