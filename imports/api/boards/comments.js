const Comments = new Mongo.Collection('comments');
Comments.allow({ update: function(userId, comment) { 
        return false; } });
Comments.allow({ insert: function(userId, comment) {
        return false; } });
Comments.allow({ remove: function(userId, comment) {
        return false; } });
// Types.allow({
//   insert: () => true,
//   update: () => true,
//   remove: () => true
// });

Comments.deny({
    insert: () => false,
    update: () => false,
    remove: () => false
});

Meteor.methods({
    'comments.createComment': function(comment, notionID) {
        console.log("Adding Comment: " + comment + " : " + notionID);
        Comments.insert({
        	createdBy: Meteor.userId(),
        	parentNotion: notionID, 
            body: comment,
            createdDate: new Date()
        });
    }
});



export default Comments;