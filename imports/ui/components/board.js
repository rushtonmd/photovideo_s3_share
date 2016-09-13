import './board.html';
import './board.less';

import './oh-noes.js';
import './loading.js';

import Notions from '../../api/boards/boards.js';
import Clusters from '../../api/boards/clusters.js';
import Views from '../../api/boards/views.js';


// Since meteor has Jquery ($) out of the box...
const viewport = ResponsiveBootstrapToolkit($);


Template.boardTemplate.onCreated(function() {
    let instance = Template.instance();
    instance.currentCluster = new ReactiveVar();
    instance.viewFound = new ReactiveVar(true);



    instance.autorun(function() {
        let clusterID = FlowRouter.getParam('backlogid');
        instance.currentCluster.set(Clusters.findOne(clusterID));
        // Meteor.call('getCPUChartData', function(err, data) {
        //     instance.chartData.set(data);
        // });
    });

});

Template.boardTemplate.onRendered(function() {
    //console.log("On Rendered");
    const clusterID = FlowRouter.getParam('backlogid');
    const viewID = FlowRouter.getParam('viewid');

    // If there is no viewid, we're in the base "views" route. 
    // We need to get a list of available views for the backlogid then 
    // select one to show
    // console.log("View: " + viewID);

    let instance = Template.instance();
    Meteor.call('views.verify', viewID, function(error, result) {
        instance.viewFound.set(result);

        //console.log(result + " : " + instance.viewFound.get());
    });

});

const subscriptionsReady = (sub) => {
    if (sub) {
        return FlowRouter.subsReady(sub);
    } else {
        return FlowRouter.subsReady();
    }
};

Template.listCardTemplate.helpers({
    style: function() {
        //return randomRotateStyle();
        return "";
    },
    noUserAssigned: function() {
        return !this.assignedTo;
    },
    notBlocked: function() {
        return !this.blocked;
    },
    assignedUserPhoto: function() {
        let id = this.assignedTo;
        let usr = Meteor.users.findOne(id);
        if (usr && usr.photo) return usr.photo;
        return "";
    }
});

Template.listContentTemplate.onRendered(function() {

});


Template.listContentTemplate.helpers({
    filteredNotions: function() {
        //console.log("Status: " + this.columnName);
        return Notions.find({ "status": this.columnName }, { sort: { order: 1 } });
    },
    listOptions: function() {
        // For xs screens, set this to 200 to aid in scrolling
        let delay = 200;

        // If the screen isn't xs, set the delay to 0
        if (viewport.current() !== "xs") {
            delay = 0;
        }

        return {
            group: {
                name: "GROUP"
            },
            delay: 200,
            animation: 300
        };
    }
});

Template.listWrapperTemplate.helpers({
    columnPositionClass: function() {
        //console.log(this.columns);

        //if (this.columnName === "To Do" || this.columnName === "Done") return "start-end-lists";
    }
});

Template.listHeaderTemplate.helpers({
    columnCount: function() {
        let qString = {};
        qString[this.field] = this.columnName;
        return Notions.find(qString).count();
    }
});

Template.boardTemplate.helpers({
    isReady: function(sub) {
        return subscriptionsReady(sub);
    },
    viewFound: function() {
        //let clusterID = FlowRouter.getParam('backlogid');
        //let cluster = Clusters.findOne(clusterID);
        const found = (Template.instance().viewFound || {}).get();
        return found;
    },
    currentCluster: function() {
        return Template.instance().currentCluster.get().name;
    },
    viewsList: function() {
        return [{ name: 'KanBan', type: 'kanban' }, { name: 'Filter', type: 'filter' }];
    },
    columns: function() {

        if (Notions.find({}).count() <= 0) return [];

        let viewID = FlowRouter.getParam('viewid');
        let currentView = Views.findOne(viewID);




        //if (!clusterViews) return [];

        //console.log(currentView);

        let viewFieldFilter = currentView.field;
        let viewFieldType = currentView.type;
        let viewFieldAvailable = currentView.columns;

        let notions = Notions.find({}).fetch();
        let statuses = _.pluck(notions, viewFieldFilter);

        if (viewFieldFilter) {

            //viewFieldAvailable = _.map(viewFieldAvailable, function(name){ return {name:name, count:0, field: viewFieldFilter }});


            let countedColumns = _.countBy(statuses);

            if (viewFieldType == 'kanban') {
                return _.map(viewFieldAvailable, function(value) {
                    return { name: value, count: countedColumns[value] || 0, field: viewFieldFilter }
                });
            }


            return _.sortBy(_.map(countedColumns, function(value, key) {
                return { name: key, count: value, field: viewFieldFilter };
            }), 'name');


        }

        return [];

    }

})
