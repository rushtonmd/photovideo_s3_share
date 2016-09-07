if (Meteor.isServer) {
    Meteor.methods({
        'users.updatePhoto': function(userid, url) {
            console.log("Update Photo to: " + url + " : " + userid);
            Meteor.users.update(userid, {
                $set: {
                    photo: url
                }
            });
        },
        'users.updateProfile': function(userid, profileInfo) {

            // Check that the display name exists
            let dName = (profileInfo || {}).displayName;

            if (!userid || !dName) return;

            Meteor.users.update(userid, {
                $set: {
                    displayName: dName
                }
            });
        },
        'users.setPrimaryEmail': function(userid, email){
            console.log("Setting primary email to " + email);
            
            // Get the current primary email address (should be the only one)
            let currentEmail = (Meteor.user().emails[0] || {}).address;

            // If the current email address is the same as the one we're trying to update, return with no action
            if (currentEmail && email && (currentEmail === email)) return;

            // Add the new email address to the user account
            Accounts.addEmail(userid, email);

            // If there isn't 2 or more email addresses, return 
            if (Meteor.user().emails.length <= 1) return;

            // Remove the current email address
            if (currentEmail) Accounts.removeEmail(userid, currentEmail);
        }
    });
}
