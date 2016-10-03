// Main HTML
import './app-admin.html';

import '../components/admin.js';

Template.App_admin.helpers({
    isReady: function(sub) {
        return subscriptionsReady(sub);
    },
    templateName: function() {

        return 'adminComponentTemplate';

    }
});

const subscriptionsReady = (sub) => {
    if (sub) {
        return FlowRouter.subsReady(sub);
    } else {
        return FlowRouter.subsReady();
    }
};
