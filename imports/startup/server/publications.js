import Notions from '../../api/boards/boards.js';
import Clusters from '../../api/boards/clusters.js';
import Views from '../../api/boards/views.js';
import Comments from '../../api/boards/comments.js';

Meteor.publish('notions', function() {
    return Notions.find();
});

Meteor.publish('clusters', function() {
    return Clusters.find();
});

Meteor.publish('userData', function() {
    return Meteor.users.find({});
});

Meteor.publish('views', function() {
    return Views.find({});
});

/* Let's publish

 - Single notion
 - User Profile name and photo
 - Top 20 comments

*/
Meteor.publishComposite('editNotionDetails', function(userId, notionId) {
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
            find: function(notion){
            	return Comments.find({parentNotion: notion._id}, {sort: {addedDate: 1}});
            }
        }]
    }
})
