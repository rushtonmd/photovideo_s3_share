import Notions from '../../api/boards/boards.js';
import Clusters from '../../api/boards/clusters.js';
import Views from '../../api/boards/views.js';
import { Accounts } from 'meteor/accounts-base'


Sortable.collections = ['notions'];



Notions.remove({});
Clusters.remove({});
Meteor.users.remove({});

console.log(Clusters.findOne());


Meteor.startup(function() {


    console.log('Initialized clusters. ' + Clusters.find().count());

    if (Notions.find().count() === 0) {


        let createdUserID = Accounts.createUser({
            email: "abc@123.com",
            password: '123qweasd'
        });

        let createdUserID2 = Accounts.createUser({
            email: "def@123.com",
            password: '123qweasd'
        });


        Meteor.users.update(createdUserID, {
            $set: {
                photo: 'http://cdn.americanbanker.com/media/newspics/bohne-david-broadway-365.jpg'
            }
        });

        Meteor.users.update(createdUserID2, {
            $set: {
                photo: 'https://blog.linkedin.com/content/dam/blog/en-us/corporate/blog/2014/07/Anais_Saint-Jude_L4388_SQ.jpg.jpeg'
            }
        });



        console.log(Meteor.users.findOne({}));

        Clusters.insert({
            name: 'Test Team 123',
            description: 'Test backlog for Team 123.'
        });

        let cluster = Clusters.findOne({});

        Views.insert({
            clusterId: cluster._id,
            name: 'Filter One',
            type: 'filter',
            field: 'status'
        });

        Views.insert({
            clusterId: cluster._id,
            name: 'KanBan',
            type: 'kanban',
            field: 'status',
            columns: ['To Do', 'In Progress', 'Done']
        });

        [{
            title: 'As a power user, I can specify files or folders to backup based on file size, date created and date modified.',
            listid: '1',
            status: 'To Do',
            blocked: true,
            assignedTo: createdUserID
        }, {
            title: "As a user, I can indicate folders not to backup so that my backup drive isn't filled up with things I don't need saved.",
            listid: '1',
            status: 'To Do'
        }, {
            title: 'Category',
            listid: '1',
            status: 'To Do'
        }, {
            title: 'Number',
            listid: '1',
            status: 'In Progress er'
        }, {
            title: 'Date',
            listid: '1',
            status: 'In Progress',
            assignedTo: createdUserID2
        }, {
            title: 'Hyperlink',
            listid: '2',
            status: 'In Progress',
            blocked: true,
            assignedTo: createdUserID
        }, {
            title: 'Image',
            listid: '2',
            status: 'In Progress'
        }, {
            title: 'Progress',
            listid: '2',
            status: 'In Progress',
            blocked: true,
            assignedTo: createdUserID2
        }, {
            title: 'Duration',
            listid: '2',
            status: 'In Progress'
        }, {
            title: 'Map address',
            listid: '2',
            status: 'Done',
            assignedTo: createdUserID
        }, {
            title: 'Relationship',
            listid: '2',
            status: 'Done'
        }].forEach(function(type, i) {
            Notions.insert({
                title: type.title,
                status: type.status,
                assignedTo: type.assignedTo,
                blocked: type.blocked,
                order: new Date().getTime()
            });
        });
        console.log('Initialized notions.');
    }
});
