// Boards are essentially the main container for all things within the project.

// Views are pre-defined configurations of a board (what cards show, what columns, etc.)

// Lists are vertical columns on a board. It'd be awesome if these can be ad-hoc, and configured to a particular notion value. Status, assigned person, etc.

// Swimlanes are horizontal groupings of notions. Not quite sure about this one. 

// Notions are the main construct within the system. Everything revolves around notions. 


const Notions = new Mongo.Collection('notions');
Notions.allow({
    update: function(userId, task) {
        console.log(task);
        return true;
    }
});
Notions.allow({
    insert: function(userId, task) {
        return false;
    }
});
Notions.allow({
    remove: function(userId, task) {
        return false;
    }
});
// Types.allow({
//   insert: () => true,
//   update: () => true,
//   remove: () => true
// });

Notions.deny({
    insert: () => false,
    update: () => false,
    remove: () => false
});

Meteor.methods({
    'notions.createNotion': function(notion) {
        console.log("Hello world " + notion.title);
        Notions.insert({
            title: notion.title,
            //status: 'Backlog',
            //order: new Date().getTime()
        });
    },
    'notions.updateNotionStatus': function(notionId, status) {
        let modifier = { $set: {} };
        modifier.$set['status'] = status
        console.log(notionId + " : " + modifier);
        Notions.update(notionId, modifier);
    },
    'notions.updateNotionAssignedTo': function(notionId, userId) {
        let modifier = { $set: {} };
        modifier.$set['assignedTo'] = userId
        console.log(modifier);
        Notions.update(notionId, modifier);
    }
});

Notions.before.insert(function(userId, doc) {

    doc.createdBy = userId;
    doc.status = 'Backlog';
    doc.createdDate = Date.now();
    doc.order = new Date().getTime();

    const currentNotionNumber = (Notions.findOne({}, { sort: { notionNumber: -1 } }) || {}).notionNumber || 0;

    doc.notionNumber = currentNotionNumber + 1;
});



export default Notions;
