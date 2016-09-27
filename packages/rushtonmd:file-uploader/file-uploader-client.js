Template.fileUploader.onCreated(function() {

    let instance = Template.instance();
    let options = instance.data.options;
    instance.uploader = new ReactiveVar();
    instance.uploadName = new ReactiveVar();
    instance.targetUrl = new ReactiveVar();
    instance.canCrop = new ReactiveVar();


    FileUploader.createDirective(options.name, options.allowedFileTypes, options.maxSize, options.folder);

});

Template.fileUploader.onRendered(function() {

    console.log("FileUpRendered");

    let instance = Template.instance();

    let options = instance.data.options;

    instance.targetUrl.set();
    instance.uploadName.set(options.name);
    instance.canCrop.set(options.canCrop);

    // Ensure that the cropper is destroyed first
    $('div.file-cropper').croppie('destroy');

});

function b64toBlob(dataURI) {

    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/png' });
}

function resetFormElement(e) {
    $(e).wrap('<form>').closest('form').get(0).reset();
    $(e).unwrap();
}

Template.fileUploader.events({
    'change input.uploadFile': function(event, template) {

        event.preventDefault();

        let instance = Template.instance();

        var upload = new Slingshot.Upload(instance.uploadName.get());

        upload.send(template.find("input.uploadFile").files[0], function(error, downloadUrl) {
            instance.uploader.set();
            if (error) {
                console.error('Error uploading');
                alert(error);
            } else {
                console.log("Success!");
                console.log('uploaded file available here: ' + downloadUrl);
                instance.targetUrl.set(downloadUrl);
                $('div.file-cropper').croppie({
                    url: instance.targetUrl.get(),
                    viewport: { width: 200, height: 200 }
                });
            }
        });
        instance.uploader.set(upload);
    },
    'click .save-profile-photo': function(event, template) {

        event.preventDefault();

        let instance = template;

        $('div.file-cropper').croppie('result', 'canvas').then(function(base64Image) {

            //let instance = Template.instance();

            var upload = new Slingshot.Upload(instance.uploadName.get());

            upload.send(b64toBlob(base64Image), function(error, downloadUrl) {
                instance.uploader.set();
                if (error) {
                    console.error('Error uploading');
                    alert(error);
                } else {
                    console.log("Success!");
                    console.log('uploaded file available here: ' + downloadUrl);

                    instance.data.uploadCallback(downloadUrl);

                    instance.targetUrl.set();

                    resetFormElement(template.find('.file-uploader'));

                    $('div.file-cropper').croppie('destroy');

                }
            });
            instance.uploader.set(upload);

        });

    },
    'click .cancel-profile-photo': function(event, template) {
        event.preventDefault();

        let instance = template;

        instance.targetUrl.set();

        resetFormElement(template.find('.file-uploader'));

        // Ensure that the cropper is destroyed first
        $('div.file-cropper').croppie('destroy');

        instance.data.cancelCallback();
    }
});

Template.fileUploader.helpers({

    isUploading: function() {
        let instance = Template.instance();
        return Boolean(instance.uploader.get());
    },

    progress: function() {
        let instance = Template.instance();
        var upload = instance.uploader.get();
        if (upload)
            return Math.round(upload.progress() * 100);
    },
    showCropped: function() {
        let instance = Template.instance();
        if (instance.canCrop.get() && instance.targetUrl.get()) return "";

        return "hidden";
    },
    showFilePicker: function() {
        let instance = Template.instance();
        if (instance.targetUrl.get()) return "hidden";
    }

    // url: function() {

    //     return imageDetails.findOne({ uploadedBy: currentUserId }, { sort: { time: -1 } });

    // },

});
