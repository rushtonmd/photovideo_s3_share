import MediaItems from '../../api/media-items.js';


Meteor.publish('mediaitems', function(params) {

    let find = {};

    if (!this.userId) {
        find["deleted"] = false;
    }

    return MediaItems.find(find, { sort: { createdDate: 1 } });

});


Meteor.publish('userData', function(params) {
    const subscriptionParams = params || {};
    const userId = subscriptionParams.userid;

    return Meteor.users.find(userId || {});
});
