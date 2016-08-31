import './new-notion-modal.html';

Template.App_newNotionModal.events({
    'click button.create-action': function(event) {
        console.log("Button Clicked!");
        var title = $('input.title-input').val();
        Meteor.call('CreateNotion', { title: title });
        $('#newNotionModal').modal('toggle');
    },
    'submit .create-notion-form': function(event){
    	event.preventDefault();
    	console.log("Enter Typed!");
    	var title = $('input.title-input').val();
        Meteor.call('CreateNotion', { title: title });
        $('#newNotionModal').modal('toggle');
    }
});

Template.App_newNotionModal.onRendered(function() {
    $('#newNotionModal').on('shown.bs.modal', function() {
        $('input.title-input').focus();
    })

});
