import { AccountsTemplates } from 'meteor/useraccounts:core';
import { Roles } from 'meteor/alanning:roles';

const setUserRolesOnSignUp = (userId, info) => {
  Roles.addUsersToRoles(userId, ['user', 'beginner']);
};

AccountsTemplates.configure({
  postSignUpHook: setUserRolesOnSignUp
});

Accounts.validateNewUser(function (user) {

	// Meteor.settings.private.adminUsers are the only allowed users to sign up

	console.log("validateNewUser");
	console.log(user);
	let email = (user.emails[0] || {}).address;

	
	if (Meteor.settings.private.adminUsers && _.contains(Meteor.settings.private.adminUsers, email)) {
		return true;
	} 
	else {
		throw new Meteor.Error(403, "No activation for you!");
	}
	
});

Meteor.startup(function() {
	// Delete all non-admin users
	let users = Meteor.users.find({}).fetch();
	let adminUsers = Meteor.settings.private.adminUsers;

	let rogueUsers = _.map(_.filter(users, function(user){return !(_.contains(adminUsers, user.emails[0].address))}), function(user){return user._id});;

	if (rogueUsers){
		Meteor.users.remove({_id: {$in: rogueUsers}});
	}

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


