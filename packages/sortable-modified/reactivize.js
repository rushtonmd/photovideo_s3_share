/*
Make a Sortable reactive by binding it to a Mongo.Collection.
Calls `rubaxa:sortable/collection-update` on the server to update the sortField of affected records.

TODO:
  * supply consecutive values if the `order` field doesn't have any
  * .get(DOMElement) - return the Sortable object of a DOMElement
  * create a new _id automatically onAdd if the event.from list had pull: 'clone'
  * support arrays
    * sparse arrays
  * tests
    * drop onto existing empty lists
    * insert back into lists emptied by dropping
    * performance on dragging into long list at the beginning
  * handle failures on Collection operations, e.g. add callback to .insert
  * when adding elements, update ranks just for the half closer to the start/end of the list
  * revisit http://programmers.stackexchange.com/questions/266451/maintain-ordered-collection-by-updating-as-few-order-fields-as-possible
  * reproduce the insidious bug where the list isn't always sorted (fiddle with dragging #1 over #2, then back, then #N before #1)

 */

Template.sortable.created = function() {
    var templateInstance = this;
    // `this` is a template instance that can store properties of our choice - http://docs.meteor.com/#/full/template_inst
    if (templateInstance.setupDone) return; // paranoid: only run setup once
    // this.data is the data context - http://docs.meteor.com/#/full/template_data
    // normalize all options into templateInstance.options, and remove them from .data
    templateInstance.options = templateInstance.data.options || {};
    Object.keys(templateInstance.data).forEach(function(key) {
        if (key === 'options' || key === 'items') return;
        templateInstance.options[key] = templateInstance.data[key];
        delete templateInstance.data[key];
    });
    templateInstance.options.sortField = templateInstance.options.sortField || 'order';
    // We can get the collection via the .collection property of the cursor, but changes made that way
    // will NOT be sent to the server - https://github.com/meteor/meteor/issues/3271#issuecomment-66656257
    // Thus we need to use dburles:mongo-collection-instances to get a *real* collection
    if (templateInstance.data.items && templateInstance.data.items.collection) {
        // cursor passed via items=; its .collection works client-only and has a .name property
        templateInstance.collectionName = templateInstance.data.items.collection.name;
        templateInstance.collection = Mongo.Collection.get(templateInstance.collectionName);
    } else if (templateInstance.data.items) {
        // collection passed via items=; does NOT have a .name property, but _name
        templateInstance.collection = templateInstance.data.items;
        templateInstance.collectionName = templateInstance.collection._name;
    } else if (templateInstance.data.collection) {
        // cursor passed directly
        templateInstance.collectionName = templateInstance.data.collection.name;
        templateInstance.collection = Mongo.Collection.get(templateInstance.collectionName);
    } else {
        templateInstance.collection = templateInstance.data; // collection passed directly
        templateInstance.collectionName = templateInstance.collection._name;
    }

    // TODO if (Array.isArray(templateInstance.collection))

    // What if user filters some of the items in the cursor, instead of ordering the entire collection?
    // Use case: reorder by preference movies of a given genre, a filter within all movies.
    // A: Modify all intervening items **that are on the client**, to preserve the overall order
    // TODO: update *all* orders via a server method that takes not ids, but start & end elements - mild security risk
    delete templateInstance.data.options;

    /**
     * When an element was moved, adjust its orders and possibly the order of
     * other elements, so as to maintain a consistent and correct order.
     *
     * There are three approaches to this:
     * 1) Using arbitrary precision arithmetic and setting only the order of the moved
     *    element to the average of the orders of the elements around it -
     *    http://programmers.stackexchange.com/questions/266451/maintain-ordered-collection-by-updating-as-few-order-fields-as-possible
     *    The downside is that the order field in the DB will increase by one byte every
     *    time an element is reordered.
     * 2) Adjust the orders of the intervening items. This keeps the orders sane (integers)
     *    but is slower because we have to modify multiple documents.
     *    TODO: we may be able to update fewer records by only altering the
     *    order of the records between the newIndex/oldIndex and the start/end of the list.
     * 3) Use regular precision arithmetic, but when the difference between the orders of the
     *    moved item and the one before/after it falls below a certain threshold, adjust
     *    the order of that other item, and cascade doing so up or down the list.
     *    This will keep the `order` field constant in size, and will only occasionally
     *    require updating the `order` of other records.
     *
     * For now, we use approach #2.
     *
     * @param {String} itemId - the _id of the item that was moved
     * @param {Number} orderPrevItem - the order of the item before it, or null
     * @param {Number} orderNextItem - the order of the item after it, or null
     */
    templateInstance.adjustOrders = function adjustOrders(itemId, orderPrevItem, orderNextItem, newList) {
        /* 
			I would like to modify this method to include the discovery from my stand-alone 
			method. The order field is created from the Date().getTime() method, which returns
			a number in milliseconds. This will ensure there are no collisions, and that there
			is a sufficient number of whole number values between the sorted items that 
			precision won't be a practical issue. 

			Only item in list: If there is no orderPrevItem and no orderNextItem, then nothing needs to
			be updated since the global order hasn't changed. 

			Top of the list: If there is no orderPrevItem, then the item is at the top of the list.
			- Search the collection to see if there is an item whose order value is less than that 
			  of the orderNextItem. If so, set that value as the orderPrevItem. If not, then use
			  the orderNextItem value minus 1000 <- makes sure it's not negative. 

			Middle of the list: If there are values for both orderPrevItem and orderNextItem.
			- This is the ideal case. If this happens, we'll just do the arithmetic below.

			End of the list: If there is an orderPrevItem, but no orderNextItem value. 
			- Search the collection to see if there is an item whose order value is greater than that
			  of the orderPrevItem. If so, se the value of the orderNextItem. If not, then use the 
			  current timestamp as the order. 

			Final Arithmetic:
			- If the difference between orderPrevItem and orderNextItem is > 2, take the arithmetic 
			  mean and round it to the next whole number (to keep precision in check)
			- If the difference between orderPrevItem and orderNextItem is < 2, take the arithmetic
			  mean and use that number. This should be crazy rare, in theory. 
			
		*/


        // Only item in list
        const onlyItemInList = !orderPrevItem && !orderNextItem;
        const topOfList = !orderPrevItem && !(!orderNextItem);
        const bottomOfList = !(!orderPrevItem) && !orderNextItem;
        const middleOfList = !(!orderPrevItem) && !(!orderNextItem);

        console.log(orderPrevItem + " : " + orderNextItem);
        console.log(onlyItemInList + " : " + topOfList + " : " + bottomOfList + " : " + middleOfList);

        console.log(Mongo.Collection.get(templateInstance.collectionName).find({}).fetch());

        var orderField = templateInstance.options.sortField;
        var selector = templateInstance.options.selector || {},
            modifier = { $set: {} };
        var newOrder = 0;

        // Top of list
        if (topOfList) {

            orderPrevItem = (Mongo.Collection.get(templateInstance.collectionName).findOne({ 'order': { '$lt': Number(orderNextItem) } }, { sort: { order: -1 } }) || {}).order;

            /* I started out by just dividing by 2, but that decreases the number too fast. More often than not, we'll
               be moving things to the top of the list, so this needs to decrease much slower. 
               since the timestamp is used for ordering, we can theoretically decrease by 10000 each time
               and it would take like 14 million times a person would move the notion to the top of 
               the list before we'd go negative. I think we're fine.
             */
            orderPrevItem = orderPrevItem || (Number(orderNextItem) - 20000);

            if (orderPrevItem < 0) orderPrevItem = (Number(orderNextItem) / 2); // Just in the super rare case this number gets below 10000

        }

        // Bottom of List
        else if (bottomOfList) {

            orderNextItem = (Mongo.Collection.get(templateInstance.collectionName).findOne({ 'order': { '$gt': Number(orderPrevItem) } }, { sort: { order: 1 } }) || {}).order;

            orderNextItem = orderNextItem || (Number(orderPrevItem) + 20000);

        }

        // Final Arithmetic
        newOrder = (orderPrevItem + orderNextItem) / 2;

         // Rounding keeps the precision in check.
        if ((orderNextItem - orderPrevItem) > 2) newOrder = Math.round(newOrder);

        if (!onlyItemInList) {
            modifier.$set[orderField] = newOrder;
        }

        if (newList && newList.parentListField && newList.parentListValue){
        	modifier.$set[newList.parentListField] = newList.parentListValue;
        }

        templateInstance.collection.update(itemId, modifier);

        return;

    };

    templateInstance.setupDone = true;
};


Template.sortable.rendered = function() {
    var templateInstance = this;
    var orderField = templateInstance.options.sortField;

    // sorting was changed within the list
    var optionsOnUpdate = templateInstance.options.onUpdate;
    templateInstance.options.onUpdate = function sortableUpdate( /**Event*/ event) {

        /*

    	The parent list will never change with just an onUpdate event, it will
    	only change during an on Add event. So, for this one we only need to worry
    	about the order, and not the list. 

    	*/

        var selectedItem = event.item;
        var selectedItemData = Blaze.getData(selectedItem);
        var orderPrevItem2 = (selectedItem.previousElementSibling && Blaze.getData(selectedItem.previousElementSibling) || {})[orderField];
        var orderNextItem2 = (selectedItem.nextElementSibling && Blaze.getData(selectedItem.nextElementSibling) || {})[orderField];

        templateInstance.adjustOrders(selectedItemData._id, orderPrevItem2, orderNextItem2, null);

        if (optionsOnUpdate) optionsOnUpdate(event);
    };

    // element was added from another list
    var optionsOnAdd = templateInstance.options.onAdd;
    templateInstance.options.onAdd = function sortableAdd( /**Event*/ event) {

    	console.log("On Add!");

        // let the user decorate the object with additional properties before insertion
        if (optionsOnAdd) optionsOnAdd(event);

        var selectedItem = event.item;
        var selectedItemData = Blaze.getData(selectedItem);
        var orderPrevItem = (selectedItem.previousElementSibling && Blaze.getData(selectedItem.previousElementSibling) || {})[orderField];
        var orderNextItem = (selectedItem.nextElementSibling && Blaze.getData(selectedItem.nextElementSibling) || {})[orderField];
        var parentListField = Blaze.getData(event.to).field;
        var parentListValue = Blaze.getData(event.to).columnName;

        console.log(Blaze.getData(event.to));

        templateInstance.adjustOrders(selectedItemData._id, orderPrevItem, orderNextItem, {parentListField: parentListField, parentListValue: parentListValue});

        // remove the dropped HTMLElement from the list because we have inserted it in the collection, which will update the template
        //itemEl.parentElement.removeChild(itemEl);
    };

    // element was removed by dragging into another list
    var optionsOnRemove = templateInstance.options.onRemove;
    templateInstance.options.onRemove = function sortableRemove( /**Event*/ event) {
        /*
        	I'm taking out the onRemove actions that remove items from the collection. In my
        	implementation, all items are from the same collection, and different lists are
        	formed by reading an object value. e.g. lists are based on Status: To Do, In Progress, Done

        	With that, things are never deleted from the database (which is super scary anyway), only 
        	the value of the field is changed which will then reactively show up in the correct list.

        	This value change will happen on the onAdd method. 
        */

        // This method calls any decorator functions from the front end implementation 
        if (optionsOnRemove) optionsOnRemove(event);
    };

    // just compute the `data` context
    ['onStart', 'onEnd', 'onSort', 'onFilter'].forEach(function(eventHandler) {
        if (templateInstance.options[eventHandler]) {
            var userEventHandler = templateInstance.options[eventHandler];
            templateInstance.options[eventHandler] = function( /**Event*/ event) {
                var itemEl = event.item; // dragged HTMLElement
                event.data = Blaze.getData(itemEl);
                userEventHandler(event);
            };
        }
    });

    templateInstance.sortable = Sortable.create(templateInstance.firstNode.parentElement, templateInstance.options);
    // TODO make the object accessible, e.g. via Sortable.getSortableById() or some such
};


Template.sortable.destroyed = function() {
    if (this.sortable) this.sortable.destroy();
};
