// Main HTML
import './app-backlogs.html';

 // Components
import '../components/backlogs.js';
import '../components/backlog-view.js';

Template.App_backlogs.onCreated(function() {
	//console.log("TEST");
});

/* Need templates for:

	Backlogs: View list of backlogs
	Backlog: View/Edit a single backlog

*/

Template.App_backlogs.helpers({
    templateName: function() {
    	let backlogID = FlowRouter.getParam('backlogid');

    	if (backlogID) return 'backlogViewTemplate';

    	return 'backlogsTemplate'

    }

});

