// Boards are essentially the main container for all things within the project.

// Views are pre-defined configurations of a board (what cards show, what columns, etc.)

// Lists are vertical columns on a board. It'd be awesome if these can be ad-hoc, and configured to a particular notion value. Status, assigned person, etc.

// Swimlanes are horizontal groupings of notions. Not quite sure about this one. 

// Notions are the main construct within the system. Everything revolves around notions. 


const MediaItems = new Mongo.Collection('mediaitems');
MediaItems.allow({
    update: function(userId, task) {
        return false;
    }
});
MediaItems.allow({
    insert: function(userId, task) {
        return false;
    }
});
MediaItems.allow({
    remove: function(userId, task) {
        return false;
    }
});
// Types.allow({
//   insert: () => true,
//   update: () => true,
//   remove: () => true
// });

MediaItems.deny({
    insert: () => false,
    update: () => false,
    remove: () => false
});

Meteor.methods({
    'mediaItems.addMediaItem': function(item) {
        console.log("Adding Media Item");
        console.log(item);

        let domainlessUrl = item.url.substring(58);
        let thumbnailUrl = item.url.replace(domainlessUrl, "thumbnails/" + domainlessUrl);

        MediaItems.insert({
            fullUrl: item.url,
            domainlessUrl: domainlessUrl,
            thumbnailUrl: thumbnailUrl
        });
    },
    'mediaItems.deleteMediaItem': function(data) {
        console.log("Deleting: " + data._id + " : " + data.isChecked);
        MediaItems.update(data._id, {
            $set: { deleted: data.isChecked },
        });
    },
    'mediaItems.updateMediaItemTag': function(data) {
        console.log(data);
        var setOptions = {};
        var tagLabel = "has" + data.tagName;

        setOptions[tagLabel] = data.isChecked;

        console.log(setOptions);

        MediaItems.update(data._id, {
            $set: setOptions,
        });
    },
    'mediaItems.updateMediaItemDate': function(data) {
        console.log(data);
        var setOptions = {};
        setOptions["createdDate"] = data.createdDate;

        MediaItems.update(data._id, {
            $set: setOptions,
        });
    }
});

MediaItems.before.insert(function(userId, doc) {

    // check the extension to set the type
    console.log(doc);
    let type = "image";
    let extension = doc.fullUrl.split('.').pop();
    if (extension.toLowerCase() === "mp4") type = "video/mp4";
    if (extension.toLowerCase() === "mov") type = "video/quicktime";

    doc.mimeType = type;
    doc.createdBy = userId;
    doc.createdDate = Date.now();
    doc.order = new Date().getTime();
    doc.deleted = false;
    doc.hasBrinkley = false;
    doc.hasMaude = false;
    doc.hasJamie = false;
    doc.hasMark = false;

});



export default MediaItems;
