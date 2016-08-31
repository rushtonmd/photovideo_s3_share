// Boards are essentially the main container for all things within the project.

// Views are pre-defined configurations of a board (what cards show, what columns, etc.)

// Lists are vertical columns on a board. It'd be awesome if these can be ad-hoc, and configured to a particular notion value. Status, assigned person, etc.

// Swimlanes are horizontal groupings of notions. Not quite sure about this one. 

// Notions are the main construct within the system. Everything revolves around notions. 


const Notions = new Mongo.Collection('notions');
Notions.allow({ update: function(userId, task) { console.log(task);
        return true; } });
Notions.allow({ insert: function(userId, task) {
        return false; } });
Notions.allow({ remove: function(userId, task) {
        return false; } });
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
    'CreateNotion': function(notion) {
        console.log("Hello world " + notion.title);
        Notions.insert({
            title: notion.title,
            status: 'Backlog',
            order: new Date().getTime()
        });
    }
});



export default Notions;
