//Uploadcare browser policy
BrowserPolicy.content.allowOriginForAll('https://ucarecdn.com');
BrowserPolicy.content.allowEval('https://ucarecdn.com');
BrowserPolicy.content.allowScriptOrigin('https://ucarecdn.com');
BrowserPolicy.content.allowImageOrigin('https://ucarecdn.com');

BrowserPolicy.content.allowOriginForAll('http://ucarecdn.com');
BrowserPolicy.content.allowEval('http://ucarecdn.com');
BrowserPolicy.content.allowScriptOrigin('http://ucarecdn.com');
BrowserPolicy.content.allowImageOrigin('http://ucarecdn.com');

// Amazon S3 Images 
BrowserPolicy.content.allowOriginForAll( '*.s3.amazonaws.com' );
BrowserPolicy.content.allowOriginForAll( '*.s3-us-west-1.amazonaws.com' );

//Blob URLS (camera)
BrowserPolicy.content.allowImageOrigin("blob:");
var constructedCsp = BrowserPolicy.content._constructCsp();
BrowserPolicy.content.setPolicy(constructedCsp +" media-src blob:;");

// Google Fonts
BrowserPolicy.content.allowOriginForAll( 'fonts.googleapis.com' );
BrowserPolicy.content.allowOriginForAll( 'https://fonts.gstatic.com' );
BrowserPolicy.content.allowInlineStyles();
BrowserPolicy.content.allowFontDataUrl();