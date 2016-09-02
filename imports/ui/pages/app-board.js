// Main HTML
import './app-board.html';

 // Components
import '../components/board.js';
import '../components/view-list.js';


Template.App_board.helpers({
    templateName: function() {
    	const backlogID = FlowRouter.getParam('backlogid');
    	const viewID = FlowRouter.getParam('viewid');

    	if (backlogID && viewID) return 'boardTemplate';

    	return 'backlogViewListTemplate'

    }

});