var tools = require('./ws-leap');

var WebSocket = require('ws');


var host = 'localhost';
//	    var host = '192.168.0.94';
var ws;
ws = new WebSocket("ws://" + host + ":6437/v4.json");
// Support both the WebSocket and MozWebSocket objects
if ((typeof (WebSocket) == 'undefined') &&
	(typeof (MozWebSocket) != 'undefined')) {
    WebSocket = MozWebSocket;
}
tools.foo;
tools.bar;
//console.log(tools.foo);
//console.log(tools.bar);
//console.log(tools.test1);
//console.log(tools.test2);
//console.log(tools.test1(ws));





console.log("Frame data for " + ttt());






//console.log(tools);
//console.log(tools.foo.connectToWebSocket());
//connectToWebSocket();