import { AccountsTemplates } from 'meteor/useraccounts:core';
import { Roles } from 'meteor/alanning:roles';

const setUserRolesOnSignUp = (userId, info) => {
  Roles.addUsersToRoles(userId, ['user', 'beginner']);
};

AccountsTemplates.configure({
  postSignUpHook: setUserRolesOnSignUp
});

Accounts.validateNewUser(function (user) {
	console.log(user);
    if (user && user.profile && user.profile.invite_token === 'ABC')
        return true;
    throw new Meteor.Error(403, "Invitation token expired!");
});




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
