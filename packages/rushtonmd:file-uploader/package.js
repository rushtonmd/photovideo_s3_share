// packages/mplatts:simple/package.js

Package.on_use(function(api) {
    api.use("templating", "client");
    api.use("edgee:slingshot@0.7.1");
    api.use("reactive-var");
    api.use('less');
    api.export('FileUploader');
    api.addFiles("file-uploader-common.js");
    api.addFiles("file-uploader-template.html", "client");
    api.addFiles("file-uploader-client.js", "client");
    api.addFiles("file-uploader-server.js", "server");
    api.addFiles("file-uploader.less", "client");
    api.addFiles("croppie.js", "client");
    api.addFiles("croppie.css", "client");

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
