import Notions from '../../api/boards/boards.js';
import Clusters from '../../api/boards/clusters.js';
import Views from '../../api/boards/views.js';

Meteor.publish('notions', function() {
    return Notions.find();
});

Meteor.publish('clusters', function() {
    return Clusters.find();
});

Meteor.publish('userData', function(){
	return Meteor.users.find({});
});

Meteor.publish('views', function(){
	return Views.find({});
});
