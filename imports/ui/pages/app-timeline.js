import './app-timeline.html';
import './app-timeline.less';
// import '../lib/rubaxa-sortable.js'

// // Define an object type by dragging together attributes
// import Types from '../../api/TESTSORTABLE/types.js';
// import Attributes from '../../api/TESTSORTABLE/attributes.js';

// Meteor.subscribe('types', function() {
//     console.log(Types.find({}, { sort: { order: 1 } }).fetch());
// })

// Meteor.subscribe('attributes', function() {
//     //console.log(Attributes.find().fetch());
// })

// let updateIndexes = ( event ) => {

//   // 3 Scenarios:
//   // Moved to TOP of list
//   // Moved to MIDDLE of list
//   // Moved to BOTTOM of list

//   // TOP of List
//   // Get the value of the item that is 1 down from the top
//   // Get the next greated value in the entire list
//   // Set a new index for the item between those values

//   const parentList = event.to; 
//   const parentListID = event.to.attributes['list-id'].value;
//   const newIndex = event.newIndex;
//   const itemID = event.item.attributes['source-id'].value;
//   const itemOrder = event.item.attributes['order'].value;
//   const eventType = event.type;

//   console.log(parentList.children.length);
//   console.log(itemID);

//   let upperOrderNumber = 0;
//   let lowerOrderNumber = 0;

//   // If there is only 1 item in the list, no order changes are needed
//   if (parentList.children.length <= 1 ) return;

//   // Top of list
//   if (newIndex === 0) {

//     console.log("Top of list!");

//     upperOrderNumber = parentList.children[newIndex + 1].attributes['order'].value; 

//     lowerOrderNumber = (Types.findOne({'order': {'$lt': Number(upperOrderNumber) }}, { sort:{order:-1}}) || {}).order;

//     lowerOrderNumber = lowerOrderNumber || (Number(upperOrderNumber) / 2);

//     //console.log(itemID + " needs to be between " + lowerOrderNumber + " and " + upperOrderNumber);

//   }

//   // Bottom of List
//   else if (newIndex === parentList.children.length - 1) {
//     console.log("Bottom of list!");

//     lowerOrderNumber = parentList.children[newIndex - 1].attributes['order'].value; 

//     upperOrderNumber = (Types.findOne({'order': {'$gt': Number(lowerOrderNumber) }}, { sort:{order:1}}) || {}).order;

//     upperOrderNumber = upperOrderNumber || (Number(lowerOrderNumber) + 2);

//   }

//   // Middle of list
//   else {

//     console.log("Middle of list!");

//     lowerOrderNumber = parentList.children[newIndex - 1].attributes['order'].value; 

//     upperOrderNumber = parentList.children[newIndex + 1].attributes['order'].value; 

//     // If it's already sorted between the 2 points, don't change the value
//     if (itemOrder > lowerOrderNumber && itemOrder < upperOrderNumber) return;

//   }


//   // At this point, we have both our lower and upper bounds, we can now update the order of the item


//   // We have to divide by 2 first due to the problems with large numbers in javascript

//   let newOrder = (Number(lowerOrderNumber) + Number(upperOrderNumber)) / 2 ;

//   console.log(itemID + " needs to be between " + lowerOrderNumber + " and " + upperOrderNumber);

//   console.log("updating " + itemID + " to " + newOrder + " and listID " + parentListID);

//   Types.update(itemID, {'$set': { 'order': newOrder, 'listid': parentListID}});



//   // let items = [];

//   // $( `${sortableClass} li` ).each( ( index, element ) => {
//   //   items.push( { _id: $( element ).data( 'id' ), order: index + 1 } );
//   // });

//   // Meteor.call( 'updateBookOrder', items, ( error ) => {
//   //   if ( error ) {
//   //     console.log( error.reason );
//   //   }
//   // });
// };

// Template.testSortableDivs.onRendered(function(){
//   var el1 = document.getElementById('test-raw-items');
//   var sortable1 = Sortable.create(el1, {
//     group: {
//       name: "TESTGROUP"
//     },
//     animation: 300,
//     ghostClass: 'card-ghost',
//     chosenClass: 'card-chosen',
//     // Changed sorting within list
//     onUpdate: function (event) {
//         //var itemEl = event.item;  // dragged HTMLElement
//         console.log("onUpdate");
//         console.log(event);
//         updateIndexes(event);
//         // + indexes from onEnd
//     },
//     onAdd: function(event){
//       console.log("onAdd");
//       console.log(event);
//       updateIndexes(event);
//     },
//     // dragging started
//     onStart: function (event) {
//         //evt.oldIndex;  // element index within parent
//         // rotate the card a bit
//         console.log("START");
//         //event.item.className += ' card-moving';
//     },
//     onEnd: function (event){
//       // unrotate the card a bit

//     }
//   });

//   var el2 = document.getElementById('test-raw-items2');
//   var sortable2 = Sortable.create(el2, {
//     group: {
//       name: "TESTGROUP"
//     },
//     animation: 300,
//     ghostClass: 'card-ghost',
//     chosenClass: 'card-chosen',
//     // Changed sorting within list
//     onUpdate: function (event) {
//         //var itemEl = event.item;  // dragged HTMLElement
//         console.log("onUpdate");
//         console.log(event);
//         updateIndexes(event);
//         // + indexes from onEnd
//     },
//     onAdd: function(event){
//       console.log("onAdd");
//       console.log(event);
//       updateIndexes(event);
//     }
//   });
// });

// Template.testSortableDivs.helpers({
//   types: function () {
//     return Types.find({"listid":'1'}, { sort: { order: 1 } });
//   },
//   types2: function () {
//     //return Types.find({"listid":2}, { sort: { order: 1 } });
//     return Types.find({"listid":'2'}, { sort: { order: 1 } });
//   }
// })


// Template.typeDefinition.helpers({
//   types: function () {
//     return Types.find({}, { sort: { order: 1 } });
//   },
//   typesOptions: {
//     sortField: 'order',  // defaults to 'order' anyway
//     group: {
//       name: 'typeDefinition',
//       pull: true,
//       put: true
//     },
//     sort: true,  // allow reording
//     onSort: function(event){
//       console.log('Item %s went from #%d to #%d',
//           event.data.name, event.oldIndex, event.newIndex
//       );
//     },
//     onAdd: function(event){
//       console.log(event);
//       console.log("Added ");
//       console.log(event.data);
//       delete event.data._id;
//       //console.log(event.data);
//       //event.data.listid = 2;
//     }, 
//     onEnd: function(event){
//       console.log("Ended " + event.data);
//       return false;
//     }
//   },

//   types2: function () {
//     return Types.find({}, { sort: { order: 1 } });
//     //return Types.find({"listid":2}, { sort: { order: 1 } });
//   },

//   attributes: function () {
//     return Attributes.find({}, {
//       sort: { order: 1 },
//       transform: function (doc) {
//         //doc.icon = Types.findOne({name: doc.type}).icon;
//         return doc;
//       }
//     });
//   },
//   attributesOptions: {
//     group: {
//       name: 'typeDefinition',
//       put: true
//     },
//     onAdd: function (event) {
//       delete event.data._id; // Generate a new id when inserting in the Attributes collection. Otherwise, if we add the same type twice, we'll get an error that the ids are not unique.
//       delete event.data.icon;
//       event.data.type = event.data.name;
//       event.data.name = 'Rename me (double click)'
//     },
//     // event handler for reordering attributes
//     onSort: function (event) {
//       console.log('Item %s went from #%d to #%d',
//           event.data.name, event.oldIndex, event.newIndex
//       );
//     }
//   }
// });

// Template.sortableItemTarget.events({
//   'dblclick .name': function (event, template) {
//     // Make the name editable. We should use an existing component, but it's
//     // in a sorry state - https://github.com/arillo/meteor-x-editable/issues/1
//     var name = template.$('.name');
//     var input = template.$('input');
//     if (input.length) {  // jQuery never returns null - http://stackoverflow.com/questions/920236/how-can-i-detect-if-a-selector-returns-null
//       input.show();
//     } else {
//       input = $('<input class="form-control" type="text" placeholder="' + this.name + '" style="display: inline">');
//       name.after(input);
//     }
//     name.hide();
//     input.focus();
//   },
//   'blur input[type=text]': function (event, template) {
//     // commit the change to the name, if any
//     var input = template.$('input');
//     input.hide();
//     template.$('.name').show();
//     // TODO - what is the collection here? We'll hard-code for now.
//     // https://github.com/meteor/meteor/issues/3303
//     if (this.name !== input.val() && this.name !== '')
//       Attributes.update(this._id, {$set: {name: input.val()}});
//   },
//   'keydown input[type=text]': function (event, template) {
//     if (event.which === 27) {
//       // ESC - discard edits and keep existing value
//       template.$('input').val(this.name);
//       event.preventDefault();
//       event.target.blur();
//     } else if (event.which === 13) {
//       // ENTER
//       event.preventDefault();
//       event.target.blur();
//     }
//   }
// });

// // you can add events to all Sortable template instances
// Template.sortable.events({
//   'click .close': function (event, template) {
//     // `this` is the data context set by the enclosing block helper (#each, here)
//     template.collection.remove(this._id);
//     // custom code, working on a specific collection
//     if (Attributes.find().count() === 0) {
//       Meteor.setTimeout(function () {
//         Attributes.insert({
//           name: 'Not nice to delete the entire list! Add some attributes instead.',
//           type: 'String',
//           order: 0
//         })
//       }, 1000);
//     }
//   }
// });

