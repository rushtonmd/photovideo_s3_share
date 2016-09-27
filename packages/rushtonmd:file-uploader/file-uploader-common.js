
FileUploader = {};
FileUploader.createDirective = function createDirective(name, allowedFileTypes, maxSize, folder){
	Meteor.call('rushtonmd:file-uploader:createDirective', name, allowedFileTypes, maxSize, folder);
};
