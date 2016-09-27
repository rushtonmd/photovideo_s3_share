

Meteor.methods({
    'rushtonmd:file-uploader:createDirective': function(name, allowedFileTypes, maxSize, folder) {

    	//maxSize is in MB so we need to multiply it by 1024 * 1024 to get bytes
    	//allowedFileTypes: ["image/png", "image/jpeg", "image/gif"]

    	// console.log("Creating file uploader directive!");
    	// console.log(name + " : " + allowedFileTypes + " : " + maxSize);
    	// console.log(Slingshot.getDirective(name));

    	// If the name already exists, return with no action. This will happen if the templates is destroyed
    	// and created over and over.
    	if (Slingshot.getDirective(name)) return;

        Slingshot.fileRestrictions(name, {
            allowedFileTypes: allowedFileTypes,
            maxSize: maxSize * 1024 * 1024,
        });

        Slingshot.createDirective(name, Slingshot.S3Storage, {
            bucket: Meteor.settings.private.S3Bucket,
            region: Meteor.settings.private.region,
            AWSAccessKeyId: Meteor.settings.private.awsAccessKeyId,
            AWSSecretAccessKey: Meteor.settings.private.awsSecretKey,
            acl: "public-read",

            authorize: function() {
                if (!this.userId) {
                    var message = "Please login before posting images";
                    throw new Meteor.Error("Login Required", message);
                }

                return true;
            },

            key: function(file) {
                var currentUserId = Meteor.userId();
                var actualFileName =  (file.name || "cropped.png").replace(/[^0-9a-zA-Z.]/g, '');
                var fileName = (new Date().getTime().toString()) + "_" + actualFileName;
                return folder + '/' + currentUserId + "/" + fileName;
            }

        });

    }
});
