import './board.html';
import './board.less';
//import './nav-sidebar.js';
import './nav-overlay-sidebar.js';
// import './new-notion-modal.js';
import '../lib/rubaxa-sortable.js'
import './oh-noes.js';
import './loading.js';

import Notions from '../../api/boards/boards.js';
import Clusters from '../../api/boards/clusters.js';
import Views from '../../api/boards/views.js';



// Define an object type by dragging together attributes
// import Types from '../../api/TESTSORTABLE/types.js';
// import Attributes from '../../api/TESTSORTABLE/attributes.js';

// Meteor.subscribe('notions', function() {
//     //console.log(Notions.find({}, { sort: { order: 1 } }));
// });

// Meteor.subscribe('clusters', function() {
//     //console.log(Clusters.find({}).fetch());
//     //buildView();
// });

// Meteor.subscribe('userData', function() {
//     //console.log(Meteor.users.find({}));
// });

// Meteor.subscribe('views', function() {
//     //console.log(Meteor.users.find({}));
// });

let randomRotateStyle = () => {
    var rNum = Math.random() - 0.5;
    return '-webkit-transform: rotate(' + rNum + 'deg); -moz-transform: rotate(' + rNum + 'deg)';
}

let updateIndexes = (event) => {

    // 3 Scenarios:
    // Moved to TOP of list
    // Moved to MIDDLE of list
    // Moved to BOTTOM of list

    // TOP of List
    // Get the value of the item that is 1 down from the top
    // Get the next greated value in the entire list
    // Set a new index for the item between those values

    const parentList = event.to;
    const parentListValue = event.to.attributes['column-value'].value;
    const parentListField = event.to.attributes['column-field'].value;
    const newIndex = event.newIndex;
    const itemID = event.item.attributes['source-id'].value;
    const itemOrder = event.item.attributes['order'].value;
    const eventType = event.type;

    //console.log(parentList.children.length);
    //console.log(itemID);

    let upperOrderNumber = 0;
    let lowerOrderNumber = 0;

    // If there is only 1 item in the list, no order changes are needed
    if (parentList.children.length <= 1) {
        let set = { 'order': itemOrder };
        set[parentListField] = parentListValue;
        Notions.update(itemID, { '$set': set });
        return;
    }

    // Top of list
    if (newIndex === 0) {

        console.log("Top of list!");

        upperOrderNumber = parentList.children[newIndex + 1].attributes['order'].value;

        lowerOrderNumber = (Notions.findOne({ 'order': { '$lt': Number(upperOrderNumber) } }, { sort: { order: -1 } }) || {}).order;

        lowerOrderNumber = lowerOrderNumber || (Number(upperOrderNumber) / 2);

        //console.log(itemID + " needs to be between " + lowerOrderNumber + " and " + upperOrderNumber);

    }

    // Bottom of List
    else if (newIndex === parentList.children.length - 1) {
        console.log("Bottom of list!");

        lowerOrderNumber = parentList.children[newIndex - 1].attributes['order'].value;

        upperOrderNumber = (Notions.findOne({ 'order': { '$gt': Number(lowerOrderNumber) } }, { sort: { order: 1 } }) || {}).order;

        upperOrderNumber = upperOrderNumber || (Number(lowerOrderNumber) + 2);

    }

    // Middle of list
    else {

        console.log("Middle of list!");

        lowerOrderNumber = parentList.children[newIndex - 1].attributes['order'].value;

        upperOrderNumber = parentList.children[newIndex + 1].attributes['order'].value;

        // If it's already sorted between the 2 points, don't change the value
        if (itemOrder > lowerOrderNumber && itemOrder < upperOrderNumber) return;

    }


    // At this point, we have both our lower and upper bounds, we can now update the order of the item


    // We have to divide by 2 first due to the problems with large numbers in javascript

    let newOrder = (Number(lowerOrderNumber) + Number(upperOrderNumber)) / 2;

    console.log(itemID + " needs to be between " + lowerOrderNumber + " and " + upperOrderNumber);

    console.log("updating " + itemID + " to " + newOrder + " and listID " + parentListValue + " : " + parentListField);

    let set = { 'order': newOrder };
    set[parentListField] = parentListValue;
    Notions.update(itemID, { '$set': set });

    //console.log(Notions.find({}).fetch());

};



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
    console.log("On Rendered");
    const clusterID = FlowRouter.getParam('backlogid');
    const viewID = FlowRouter.getParam('viewid');

    // If there is no viewid, we're in the base "views" route. 
    // We need to get a list of available views for the backlogid then 
    // select one to show
    console.log("View: " + viewID);

    let instance = Template.instance();
    Meteor.call('views.verify', viewID, function(error, result) {
        instance.viewFound.set(result);

        console.log(result + " : " + instance.viewFound.get());
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
        return !this.notion.assignedTo;
    },
    notBlocked: function() {
        return !this.notion.blocked;
    },
    assignedUserPhoto: function() {
        let id = this.notion.assignedTo;
        let usr = Meteor.users.findOne(id);
        if (usr && usr.photo) return usr.photo;
        return "";
    }
});

Template.listContentTemplate.onRendered(function() {
    console.log(this.firstNode.nextElementSibling);
    createSortableList(this.firstNode.nextElementSibling);
});

const createSortableList = (domElement) => {
    Sortable.create(domElement, {
        group: {
            name: "GROUP"
        },
        delay: 400,
        animation: 300,
        ghostClass: 'card-ghost',
        chosenClass: 'card-chosen',
        // Changed sorting within list
        onUpdate: function(event) {
            //var itemEl = event.item;  // dragged HTMLElement
            console.log("onUpdate");
            console.log(event);
            updateIndexes(event);
            // + indexes from onEnd
        },
        onAdd: function(event) {
            console.log("onAdd");
            console.log(event);
            updateIndexes(event);
        },
        // dragging started
        onStart: function(event) {
            //evt.oldIndex;  // element index within parent
            // rotate the card a bit
            console.log("START");
            //event.item.className += ' card-moving';
        },
        onEnd: function(event) {
            // unrotate the card a bit
            event.item.setAttribute("style", randomRotateStyle());
        }
    });
};

Template.listContentTemplate.helpers({
    filteredNotions: function() {
        //console.log("Status: " + this.columnName);
        return Notions.find({ "status": this.columnName }, { sort: { order: 1 } });
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

        console.log(currentView);

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
