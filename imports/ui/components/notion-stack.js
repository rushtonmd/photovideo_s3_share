import './notion-stack.html';
import './notion-stack.less';

// import './loading.js';

import '../lib/rubaxa-sortable.js'


import Notions from '../../api/boards/boards.js';
import Clusters from '../../api/boards/clusters.js';
import Views from '../../api/boards/views.js';


Template.notionStackTemplate.onRendered(function() {
    // console.log("On Rendered");
    // const clusterID = FlowRouter.getParam('backlogid');
    // let instance = Template.instance();
    // Meteor.call('clusters.verify', clusterID, function(error, result) {
    //     instance.clusterFound.set(result);

    //     console.log(result + " : " + instance.clusterFound.get());
    // });
});

Template.notionStackTemplate.onCreated(function() {

    console.log("On Created");

    // let instance = Template.instance();
    // instance.clusterFound = new ReactiveVar(true); // Assume the URL is good... until it isn't. 

});

Template.notionStackTemplate.helpers({
    // isReady: function(sub) {
    //     return subscriptionsReady(sub);
    // },
    // backlogFound: function() {
    //     //let clusterID = FlowRouter.getParam('backlogid');
    //     //let cluster = Clusters.findOne(clusterID);
    //     const found = (Template.instance().clusterFound || {}).get();
    //     return found;
    // },
    backlogName: function() {
        //const cluster = Template.instance().currentCluster.get() || {};
        let clusterID = FlowRouter.getParam('backlogid');
        let cluster = Clusters.findOne(clusterID) || {};
        return cluster.name;
    }

});

Template.backlogStackContentTemplate.helpers({
    filteredNotions: function() {
        //console.log("Status: " + this.columnName);
        return Notions.find({}, { sort: { order: 1 } });
    }
});

Template.backlogStackContentTemplate.onRendered(function() {
	console.log("HERE!");
	console.log(this.firstNode);
    //createSortableList(this.firstNode);
});


const createSortableList = (domElement) => {
    Sortable.create(domElement, {
        group: {
            name: "GROUP"
        },
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
            //event.item.setAttribute("style", randomRotateStyle());
        }
    });
};

const updateIndexes = (event) => {

    // 3 Scenarios:
    // Moved to TOP of list
    // Moved to MIDDLE of list
    // Moved to BOTTOM of list

    // TOP of List
    // Get the value of the item that is 1 down from the top
    // Get the next greated value in the entire list
    // Set a new index for the item between those values

    const parentList = event.to;
    const parentListValue = (event.to.attributes['column-value'] || {}).value;
    const parentListField = (event.to.attributes['column-field'] ||{}).value;
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
        if (parentListValue) set[parentListField] = parentListValue;
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
    if (parentListValue) set[parentListField] = parentListValue;
    Notions.update(itemID, { '$set': set });

    //console.log(Notions.find({}).fetch());

};
