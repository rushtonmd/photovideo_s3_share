import './crop-uploader.html';
import './crop-uploader.less';


Template.cropUploader.helpers({
    uploaderOptions: function() {
        let options = {};
        options.name = "myImageUploads";
        options.allowedFileTypes = ["image/png", "image/jpeg", "image/gif"];
        options.maxSize = 10;
        options.folder = "profile-photos";
        options.canCrop = true;

        return options;
    },
    uploadCallback: function() {
        return function(downloadUrl) {

            console.log("Finished upload!");

            Meteor.call('users.updatePhoto', Meteor.userId(), downloadUrl);

            $('#profilePhotoUploadModal').modal('hide');
        };
    },
    cancelCallback: function(){
        return function() {
            $('#profilePhotoUploadModal').modal('hide');
        };
    }
});

