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
            Meteor.users.update(userid, {
                $set: {
                    displayName: profileInfo.displayName
                }
            });
        }
    });
}
