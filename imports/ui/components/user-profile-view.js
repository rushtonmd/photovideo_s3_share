import './user-profile-view.html';
import './user-profile-view.less';
import '../lib/uploadcare.js'


Template.userProfileViewTemplate.onRendered(function() {
    console.log("Profile On Rendered");
    $('.display-name-buttons').hide();
    $('.primary-email-buttons').hide();

});

Template.userProfileViewTemplate.onCreated(function() {
    console.log("Profile On Created");

});

Template.userProfileViewTemplate.events({
'focus input.display-name':function(event){
     //var id = $(event.target).attr(id).split('_')[0];
     //$("#" + id + '_save').show();
     //$('div.input-group.display-name').removeClass('full-width-input');
     $('div.display-name-buttons').show();
 },
 'blur input.display-name':function(event){
     //var id = $(event.target).attr(id).split('_')[0];
     //$("#" + id + '_save').show();
     //$('div.input-group.display-name').addClass('full-width-input');
     $('div.display-name-buttons').hide();
 },
 'focus input.primary-email':function(event){
     //var id = $(event.target).attr(id).split('_')[0];
     //$("#" + id + '_save').show();
     //$('div.input-group.display-name').removeClass('full-width-input');
     $('div.primary-email-buttons').show();
 },
 'blur input.primary-email':function(event){
     //var id = $(event.target).attr(id).split('_')[0];
     //$("#" + id + '_save').show();
     //$('div.input-group.display-name').addClass('full-width-input');
     $('div.primary-email-buttons').hide();
 }
});

Template.userProfileViewTemplate.helpers({
    userDisplayName: function() {
        if (Meteor.user()) return Meteor.user().displayName;
    },
    userPrimaryEmail: function() {
        //console(Meteor.user().emails[0]);
        if (Meteor.user() && Meteor.user().emails[0]) return Meteor.user().emails[0].address;
    }
});


Template.uploadcareTemplate.onRendered(function() {
    UploadCare.load(null, function(){
        uploadcare.start();

        let widget = uploadcare.SingleWidget('#file-show');

            widget.onUploadComplete(info => {

            Meteor.call('users.updatePhoto', Meteor.userId(), info.cdnUrl, function(err, data) {
                console.log(data);
            });

            console.log("URL: " + this.cdnUrl.get());
        });  


    });

});

Template.uploadcareTemplate.onCreated(function() {

});

Template.uploadcareTemplate.helpers({
    currentUserPhoto: function() {
        return Meteor.user().photo;
    }
});

Template.uploadcareTemplate.events({
    'click .header-profile-photo': function(event, template) {
        var singleWidget = uploadcare.SingleWidget('[role=uploadcare-uploader]');
        singleWidget.value(null); // ensure the widget is in the default state
        singleWidget.openDialog();
    }
});




