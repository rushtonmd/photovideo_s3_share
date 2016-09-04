import { AccountsTemplates } from 'meteor/useraccounts:core';
import { Roles } from 'meteor/alanning:roles';

const setUserRolesOnSignUp = (userId, info) => {
  Roles.addUsersToRoles(userId, ['user', 'beginner']);
};

AccountsTemplates.configure({
  postSignUpHook: setUserRolesOnSignUp,
});

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


// Meteor.startup(() => {
//   ServiceConfiguration.configurations.update(
//     { "service": "facebook" },
//     {
//       $set: {
//         "appId": "XXXXXXXXXXXXXXX",
//         "secret": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
//       }
//     },
//     { upsert: true }
//   );
// });
