/* 
The shared directory contains JavaScript files which can be accessed from both the client and the cloud.

Shared files can be included from client-side html files using a standard script tag as if they were in 
the same directory as the client side file - e.g.:
<script src="config.js" type="text/javascript"></script>

Shared files are automatically loaded and made available to the cloud script executor. This means that any
functions of variables contained in files within the shared directory can be accessed as if they were in the
cloud directory.
*/

/* 
This file - config.js - is used to demonstrate the best practice method for allowing configuration information
to be bundled with the app when it is built, but also allowing the latest version of the configuration to be 
retrieved by the app from the cloud on start up.
*/


var config = {
//    "analyticsTag":{
//        "tag_name":"",
//        "updated":1400844912084
//    },
    "appid":"Nb1beF43RO6RxvWKVZxDjl8D",
    "appkey":"d8f2c452cfddaa34324cc54dc7530c3af7bf2b24",
    "host":"https://keenansystem.feedhenry.com",
    "mode":"dev"
};

exports.config = config;