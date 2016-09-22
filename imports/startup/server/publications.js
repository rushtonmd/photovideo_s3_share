import Notions from '../../api/boards/boards.js';
import Clusters from '../../api/boards/clusters.js';
import Views from '../../api/boards/views.js';
import Comments from '../../api/boards/comments.js';

Meteor.publish('notions', function(params) {
    const subscriptionParams = params || {};
    const parentCluster = subscriptionParams.backlogid;
    const notionId = subscriptionParams.notionid;

    let modifier = {};

    if (parentCluster) {
    	 modifier.clusterId = parentCluster;
    }

    if (notionId) {
    	modifier._id = notionId;
    }

    console.log(params);
    console.log(modifier);

    return Notions.find(modifier);
});

Meteor.publish('clusters', function(params) {
    const subscriptionParams = params || {};
    const clusterId = subscriptionParams.backlogid;

    return Clusters.find(clusterId || {});
});

Meteor.publish('userData', function(params) {
    const subscriptionParams = params || {};
    const userId = subscriptionParams.userid;

    return Meteor.users.find(userId || {});
});

Meteor.publish('views', function(params) {
    const subscriptionParams = params || {};
    const parentCluster = subscriptionParams.backlogid;
    const viewId = subscriptionParams.viewid;

    let modifier = {};

    if (parentCluster) {
    	 modifier.clusterId = parentCluster;
    }

    if (viewId) {
    	modifier._id = viewId;
    }

    return Views.find(modifier);
});

/* Let's publish

 - Single notion
 - User Profile name and photo
 - Top 20 comments

*/
Meteor.publishComposite('editNotionDetails', function(params) {
    const subscriptionParams = params || {};
    const notionId = subscriptionParams.notionid;

    return {
        find: function() {
            return Notions.find(notionId);
        },
        children: [{
            find: function(notion) {
                // Find post author. Even though we only want to return
                // one record here, we use "find" instead of "findOne"
                // since this function should return a cursor.
                return Meteor.users.find({ _id: notion.createdUserID }, { limit: 1, fields: { displayName: 1, photo: 1 } });
            },
            find: function(notion) {
                return Comments.find({ parentNotion: notion._id }, { sort: { addedDate: 1 } });
            }
        }]
    }
})
