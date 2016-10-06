import MediaItems from '../../api/media-items.js';



Meteor.setInterval(function() {

    console.log("Running AWS Script...");

    if (Meteor.settings.private.S3Bucket && Meteor.settings.private.region && Meteor.settings.private.awsAccessKeyId && Meteor.settings.private.awsSecretKey) {
        AWS.config.update({
            accessKeyId: Meteor.settings.private.awsAccessKeyId,
            secretAccessKey: Meteor.settings.private.awsSecretKey
        });
    } else {
        console.warn("AWS settings missing");
        return;
    }

    let s3 = new AWS.S3();

    let list = s3.listObjectsSync({
        Bucket: Meteor.settings.private.S3Bucket,
        Prefix: 'uploads/'
    });

    let keysFromAWS = _.map(list.Contents, function(item) {
        return item.Key;
    });

    let allMediaItems = _.map(MediaItems.find({}, { fields: { domainlessUrl: 1 } }).fetch(), function(item) {
        return item.domainlessUrl;
    });

    var difference = _.difference(keysFromAWS, allMediaItems);

    // 'difference' is an array of files on S3 not found in the current MediaItems collection
    // We will add all of these items to the MediaItems collection

    let baseUrl = 'https://s3-us-west-2.amazonaws.com/assets.teamrushton.com/';

    _.each(difference, function(item) {

        let fullUrl = baseUrl + item;

        Meteor.call('mediaItems.addMediaItem', { url: fullUrl });

    });

    console.log("AWS Script Complete! Added " + difference.length);

}, 10 * 60 * 1000); // every 10 mi



Meteor.setInterval(function() {

    console.log("Running AWS Delete Script...");

    if (!Meteor.settings.private.deleteFromS3) return;

    if (Meteor.settings.private.S3Bucket && Meteor.settings.private.region && Meteor.settings.private.awsAccessKeyId && Meteor.settings.private.awsSecretKey) {
        AWS.config.update({
            accessKeyId: Meteor.settings.private.awsAccessKeyId,
            secretAccessKey: Meteor.settings.private.awsSecretKey
        });
    } else {
        console.warn("AWS settings missing");
        return;
    }

    let s3 = new AWS.S3();

    let deletedMediaItems = _.map(MediaItems.find({ deleted: true }).fetch(), function(item) {
        return { _id: item._id, key: item.domainlessUrl };
    });

    console.log("Delete These Items");
    console.log(deletedMediaItems);

    _.each(deletedMediaItems, function(item) {
        if (item && item.key) {
            var params = {
                Bucket: Meteor.settings.private.S3Bucket,
                CopySource: Meteor.settings.private.S3Bucket + "/" + item.key,
                Key: "deleted/" + item.key.substring(item.key.lastIndexOf('/') + 1)
            };

            //var originalKey = item.key;
            //var itemId = item._id;

            s3.copyObject(params, Meteor.bindEnvironment(function(err, data) {
                if (err) {
                    console.log("Error copying object!");
                    MediaItems.remove(itemId);
                } else {
                	var originalKey = item.key;
                	var itemId = item._id;
                    console.log("Successfully Copied!");
                    console.log("Deleting Object " + params.Bucket + " : " + originalKey);
                    //var originalKey = originalKey;
                    s3.deleteObject({ Bucket: params.Bucket, Key: originalKey }, Meteor.bindEnvironment(function(err, data) {
                        if (err) {
                            console.log("Error deleting!");
                        } else {
                            console.log("Successfully Deleted! ");
                            console.log("Deleting from collection: " + itemId);
                            MediaItems.remove(itemId);
                        }
                    }));
                }
            }));
        } else {
            MediaItems.remove(item._id);
        }

    });

}, 5000);//60 * 60 * 1000); // run every hour
