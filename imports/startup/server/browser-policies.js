//Uploadcare browser policy
BrowserPolicy.content.allowOriginForAll('https://ucarecdn.com');
BrowserPolicy.content.allowEval('https://ucarecdn.com');
BrowserPolicy.content.allowScriptOrigin('https://ucarecdn.com');
BrowserPolicy.content.allowImageOrigin('https://ucarecdn.com');

BrowserPolicy.content.allowOriginForAll('http://ucarecdn.com');
BrowserPolicy.content.allowEval('http://ucarecdn.com');
BrowserPolicy.content.allowScriptOrigin('http://ucarecdn.com');
BrowserPolicy.content.allowImageOrigin('http://ucarecdn.com');

//Blob URLS (camera)
BrowserPolicy.content.allowImageOrigin("blob:");
var constructedCsp = BrowserPolicy.content._constructCsp();
BrowserPolicy.content.setPolicy(constructedCsp +" media-src blob:;");

// Google Fonts
BrowserPolicy.content.allowOriginForAll( 'fonts.googleapis.com' );
BrowserPolicy.content.allowOriginForAll( 'https://fonts.gstatic.com' );
BrowserPolicy.content.allowInlineStyles();
BrowserPolicy.content.allowFontDataUrl();