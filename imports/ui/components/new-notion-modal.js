import './new-notion-modal.html';
import './new-notion-modal.less';

const showConfirmationAlert = function showConfirmationAlert(title) {
    console.log("Show Alert!");
    $("#success-alert>strong").text(title);
    $("#success-alert").show().animate({ right: "0" });
    $("#success-alert").fadeTo(3000, 1000).animate({ right: "-50%" }, 500, function() {
        $("#success-alert").hide();
    });


}

Template.App_newNotionModal.events({
    'click button.create-action': function(event) {
        console.log("Button Clicked!");
        var title = $('input.title-input').val();
        Meteor.call('CreateNotion', { title: title });
        $('#newNotionModal').modal('toggle');

        showConfirmationAlert("Notion added to the Backlog!");



    },
    'submit .create-notion-form': function(event) {
        event.preventDefault();
        console.log("Enter Typed!");
        var title = $('input.title-input').val();
        Meteor.call('CreateNotion', { title: title });
        showConfirmationAlert("Notion added to the Backlog!");
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
