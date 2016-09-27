import './user-profile-view.html';
import './user-profile-view.less';
//import '../lib/uploadcare.js';
import './crop-uploader.js';


Template.userProfileViewTemplate.onRendered(function() {
    console.log("Profile On Rendered");
    $('.display-name-buttons').hide();
    $('.primary-email-buttons').hide();

});

Template.userProfileViewTemplate.onCreated(function() {
    console.log("Profile On Created");

});

const updatePrimaryEmail = function updatePrimaryEmail() {
    Meteor.call('users.setPrimaryEmail', Meteor.userId(), $('input.primary-email').val(), function(error, data) {
        if (error) $('#success-alert').trigger('showAlert', ["There was a problem! Email not updated :(", true, "1.1em"]);
        else $('#success-alert').trigger('showAlert', ["Email updated!", false, "1.1em"]);
    });
};

const updateDisplayName = function updateDisplayName() {
    Meteor.call('users.updateProfile', Meteor.userId(), { displayName: $('input.display-name').val() }, function(error, data) {
        if (error) $('#success-alert').trigger('showAlert', ["There was a problem! Display Name not updated :(", true, "1.1em"]);
        else $('#success-alert').trigger('showAlert', ["Display Name updated!", false, "1.1em"]);
    });
};

Template.userProfileViewTemplate.events({
    'mousedown div.primary-email-buttons>button.accept': function() {
        updatePrimaryEmail();
    },
    'mousedown div.display-name-buttons>button.accept': function() {
        updateDisplayName();
    },
    'focus input.display-name': function(event) {
        $('div.display-name-buttons').show();
    },
    'blur input.display-name': function(event) {
        $('input.display-name').hide().val((Meteor.user() || {}).displayName);
        $('div.display-name-buttons').hide();
        $('input.display-name').fadeIn()
    },
    'focus input.primary-email': function(event) {
        $('div.primary-email-buttons').show();
    },
    'blur input.primary-email': function(event) {
        $('input.primary-email').hide().val(((Meteor.user() || {}).emails[0] || {}).address);
        $('div.primary-email-buttons').hide();
        $('input.primary-email').fadeIn()
    },
    'keypress input.primary-email': function(evt, template) {
        if (evt.which === 13) {
            updatePrimaryEmail();
        }
    },
    'keypress input.display-name': function(evt, template) {
        if (evt.which === 13) {
            updateDisplayName();
        }
    }

});

Template.userProfileViewTemplate.helpers({
    userDisplayName: function() {
        if (Meteor.user()) return Meteor.user().displayName;
    },
    userPrimaryEmail: function() {
        //console(Meteor.user().emails[0]);
        let email = ((Meteor.user() || {}).emails[0] || {}).address;
        return email;
    }
});


// Template.uploadcareTemplate.onRendered(function() {
//     // UploadCare.load(null, function() {
//     //     uploadcare.start();

//     //     let widget = uploadcare.SingleWidget('#file-show');

//     //     widget.onUploadComplete(info => {

//     //         Meteor.call('users.updatePhoto', Meteor.userId(), info.cdnUrl, function(err, data) {
//     //             console.log(data);
//     //         });
            
//     //     });
//     // });

// });

// Template.uploadcareTemplate.onCreated(function() {

// });

Template.uploadcareTemplate.helpers({
    currentUserPhoto: function() {
        return Meteor.user().photo;
    }
});

Template.uploadcareTemplate.events({
    'click .header-profile-photo': function(event, template) {
        $('#profilePhotoUploadModal').modal('show');

    }
});
