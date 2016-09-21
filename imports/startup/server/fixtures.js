import Notions from '../../api/boards/boards.js';
import Clusters from '../../api/boards/clusters.js';
import Views from '../../api/boards/views.js';
import Comments from '../../api/boards/comments.js';
import { Accounts } from 'meteor/accounts-base'


Sortable.collections = ['notions'];



// Notions.remove({});
// Clusters.remove({});
// Meteor.users.remove({});
// Comments.remove({});

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
            title: 'As a job seeker, I want to search for a job, so I can advance my career.',
            listid: '1',
            status: 'To Do'
        }, {
            title: 'As a recruiter, I want to post a job vacancy, so I can find a new team member.',
            listid: '1',
            status: 'In Progress er'
        }, {
            title: 'As a user, I am able to able to provide best support service to my customer.',
            listid: '1',
            status: 'In Progress',
            assignedTo: createdUserID2
        }, {
            title: 'As a consumer, I want shopping cart functionality to easily purchase items online.',
            listid: '2',
            status: 'In Progress',
            blocked: true,
            assignedTo: createdUserID
        }, {
            title: 'As an executive, I want to generate a report to understand which departments need to improve their productivity.',
            listid: '2',
            status: 'In Progress'
        }, {
            title: 'A team member can view or hide the tasks under the stories.',
            listid: '2',
            status: 'In Progress',
            blocked: true,
            assignedTo: createdUserID2
        }, {
            title: 'A team member can view the current burndown chart on the status page, and can click it for a larger view.',
            listid: '2',
            status: 'In Progress'
        }, {
            title: 'A team member can edit a task from the iteration status page.',
            listid: '2',
            status: 'Done',
            assignedTo: createdUserID
        }, {
            title: 'As a person I would like to be stoked so that I could stoke.',
            listid: '2',
            status: 'Done'
        }].forEach(function(type, i) {
            Notions.insert({
                title: type.title,
                status: type.status,
                assignedTo: type.assignedTo,
                blocked: type.blocked,
                order: new Date().getTime() + (i *1000)
            });
        });
        console.log('Initialized notions.');
    }
});
