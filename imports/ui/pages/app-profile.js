// Main HTML
import './app-profile.html';

// Components
// import '../components/backlogs.js';
// import '../components/backlog-view.js';
// import '../components/notion-stack.js';
import '../components/loading.js';
import '../components/oh-noes.js';
import '../components/user-profile-view.js';
import '../components/crop-uploader.js';


Template.App_profile.onRendered(function() {
    console.log("On Rendered");
    //const userid = FlowRouter.getParam('userid');
    // let userID = FlowRouter.getParam('userid');
    // instance.userFound.set(userID === Meteor.userId());
    // console.log("User: " + Meteor.userId());

});

Template.App_profile.onCreated(function() {

    console.log("On Created");

    let instance = Template.instance();
    instance.userFound = new ReactiveVar(true); // Assume the URL is good... until it isn't. 
    instance.waitingForResponse = new ReactiveVar(false);

    instance.autorun(function() {
        //instance.waitingForResponse.set(true);
        let userID = FlowRouter.getParam('userid');
        instance.userFound.set(userID === Meteor.userId());
        console.log("User: " + Meteor.userId());

        //instance.currentCluster.set(Clusters.findOne(clusterID));

    });
});

Template.App_profile.helpers({
    isReady: function(sub) {
        return subscriptionsReady(sub);
    },
    userProfileFound: function() {
        const found = (Template.instance().userFound || {}).get();

        return found;
    },
    templateName: function() {
        return 'userProfileViewTemplate';

    }

});

const subscriptionsReady = (sub) => {
    if (sub) {
        return FlowRouter.subsReady(sub);
    } else {
        return FlowRouter.subsReady();
    }
};
