if (Meteor.isServer) {
    Meteor.methods({
        'users.updatePhoto': function(userid, url) {
            console.log("Update Photo to: " + url + " : " + userid);
            Meteor.users.update(userid, {
                $set: {
                    photo: url
                }
            });
        }
    });
}
