// Boards are essentially the main container for all things within the project.

// Views are pre-defined configurations of a board (what cards show, what columns, etc.)

// Lists are vertical columns on a board. It'd be awesome if these can be ad-hoc, and configured to a particular notion value. Status, assigned person, etc.

// Swimlanes are horizontal groupings of notions. Not quite sure about this one. 

// Notions are the main construct within the system. Everything revolves around notions. 


const Views = new Mongo.Collection('views');
Views.allow({
    update: function(userId, task) {
        return false;
    }
});
Views.allow({
    insert: function(userId, task) {
        return false;
    }
});
Views.allow({
    remove: function(userId, task) {
        return false;
    }
});
// Types.allow({
//   insert: () => true,
//   update: () => true,
//   remove: () => true
// });

Views.deny({
    insert: () => false,
    update: () => false,
    remove: () => false
});

// Meteor.methods({
//     'CreateNotion': function(notion) {
//         console.log("Hello world " + notion.title);
//         Notions.insert({
//             title: notion.title,
//             status: 'Backlog',
//             order: new Date().getTime()
//         });
//     }
// });

if (Meteor.isServer) {
    Meteor.methods({
        'views.types': function() {
            return ['filter', 'kanban'];
        },
        'views.verify': function(viewID) {
            return (typeof Views.findOne(viewID) != 'undefined');
        },
        'views.add': function(type, name, field) {
            Views.insert({
                type: type,
                name: name,
                field: field,
                columns: ['Backlog', 'In Progress', 'Done']
            });
        }
    });
}


export default Views;
