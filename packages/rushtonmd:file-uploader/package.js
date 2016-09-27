
Package.describe({
  name: 'rushtonmd:file-uploader',
  summary: 'Upload templates for attaching files, cropping images, and saving to S3.',
  version: '0.1.0',
  documentation: 'README.md'
});

Package.on_use(function(api) {
	api.use('ecmascript');
    api.use("templating", "client");
    api.use("reactive-var");
    api.use('less');
    api.use("edgee:slingshot@0.7.1");
    api.export('FileUploader');
    api.addFiles([
    	"croppie.less",
    	"croppie.js",
    	"file-uploader.less",
    	"file-uploader-template.html",
    	"file-uploader-common.js",
    	"file-uploader-client.js",
    	], "client");
    api.addFiles("file-uploader-server.js", "server");
});



/*// Now that we finally have an accurate version number...
Package.describe({
  name: 'rushtonmd:file-uploader',
  summary: 'Upload templates for attaching files, cropping images, and saving to S3.',
  version: '0.0.1',
  //git: 'https://github.com/RubaXa/Sortable.git',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom(['METEOR@0.9.0', 'METEOR@1.0']);
  api.use('templating', 'client');
  api.use('dburles:mongo-collection-instances@0.3.4');  // to watch collections getting created
  api.export('Sortable');  // exported on the server too, as a global to hold the array of sortable collections (for security)
  api.addFiles([
    'Sortable.js',
    'template.html',  // the HTML comes first, so reactivize.js can refer to the template in it
    'reactivize.js'
  ], 'client');
  api.addFiles('methods-client.js', 'client');
  api.addFiles('methods-server.js', 'server');
});
*/
// Package.onTest(function (api) {
//   api.use(packageName, 'client');
//   api.use('tinytest', 'client');

//   api.addFiles('test.js', 'client');
// });
