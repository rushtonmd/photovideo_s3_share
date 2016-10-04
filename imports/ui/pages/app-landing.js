// Main HTML
import './app-landing.html';

import '../components/landing.js';

Template.App_landing.helpers({
    isReady: function(sub) {
        return subscriptionsReady(sub);
    },
    templateName: function() {

        return 'landingTemplate';

    }
});

const subscriptionsReady = (sub) => {
    if (sub) {
        return FlowRouter.subsReady(sub);
    } else {
        return FlowRouter.subsReady();
    }
};