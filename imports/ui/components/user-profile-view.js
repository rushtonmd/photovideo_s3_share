import './user-profile-view.html';
import './user-profile-view.less';
import '../lib/uploadcare.js'


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
        console.log(Meteor.user());
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


Template.userProfileViewTemplate.onRendered(function() {
    console.log("Profile On Rendered");

});

Template.userProfileViewTemplate.onCreated(function() {

    console.log("Profile On Created");


});

