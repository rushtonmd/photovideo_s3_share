// Amazon S3 Images 
BrowserPolicy.content.allowOriginForAll( '*.s3.amazonaws.com' );
BrowserPolicy.content.allowOriginForAll( '*.s3-us-west-1.amazonaws.com' );
BrowserPolicy.content.allowOriginForAll( '*.s3-us-west-2.amazonaws.com' );

//Blob URLS (camera)
BrowserPolicy.content.allowImageOrigin("blob:");
var constructedCsp = BrowserPolicy.content._constructCsp();
BrowserPolicy.content.setPolicy(constructedCsp +" media-src blob:;");

// Google Fonts
BrowserPolicy.content.allowOriginForAll( 'fonts.googleapis.com' );
BrowserPolicy.content.allowOriginForAll( 'https://fonts.gstatic.com' );
BrowserPolicy.content.allowInlineStyles();
BrowserPolicy.content.allowFontDataUrl();