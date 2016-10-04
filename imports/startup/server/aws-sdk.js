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

    // Difference is an array of files on S3 not found in the collection
    // Need to do an upsert for all of these items
    let baseUrl = 'https://s3-us-west-2.amazonaws.com/assets.teamrushton.com/';

    _.each(difference, function(item) {

        let fullUrl = baseUrl + item;

        Meteor.call('mediaItems.addMediaItem', { url: fullUrl });

    });

    console.log("AWS Script Complete! Added " + difference.length);

}, 60 * 1000);
