var nativeInput = {};
var deviceInput
        = {
            'xx': 0,
            'yy': 0,
            'zz': 0,
            'rotateDegrees': 0,
            'orX': 0,
            'orY': 0,
            'pid': 0,
        }
;
var localvar = {
    'positionCtrlx': 0,
    'positionCtrly': 0,
    'ctrlKeyMousex': 0,
    'ctrlKeyMousey': 0,
    'mousexOnRel': 0,
    'mouseyOnRel': 0,
    'positionShiftx': 0,
    'positionShifty': 0,
    'ShiftKeyMousex': 0,
    'ShiftKeyMousey': 0,
    'zoom': 0,
    'zoomOnRel': 0,
    'mousewhellTurn': 0,
    'deltax': 0,
    'deltay': 0,
    'rt': 0,
    'rt_temp': 0,
    'rt_temp1': 0,
    'rt_temp2': 0,
    'lastXor': 0,
    'lastYor': 0,
    'lastX': 0,
    'lastY': 0,
    'orXcss': 0,
    'orYcss': 0,
    'mousexOnClick': 0,
    'mouseyOnClick': 0,
    'ctrlKeyCount': 0,
    'shiftKey': false,
    'ctrlKey': false,
    'shiftKeyMousex': 0,
    'shiftKeyMousey': 0,
    'shiftKeyCount': 0,
}
var applycss = {
    'lastX': 0,
    'lastY': 0,
    'cursorX': 0,
    'cursorY': 0,
    'zoom': 100
}
var peerID;
var static = require('node-static');
var file = new static.Server('./public');
require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(85);


var WebSocketServer = require('ws').Server
        , wssPeer = new WebSocketServer({port: 8666})
        , wss = new WebSocketServer({port: 8555})
        , wsss = new WebSocketServer({port: 8556})
        , wsapp = new WebSocketServer({port: 8557});

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        client.send(data);
    });
};
wsss.broadcast = function broadcast(data) {
    wsss.clients.forEach(function each(client) {
        client.send(data);
    });
};
wsapp.broadcast = function broadcast(data) {
    wsapp.clients.forEach(function each(client) {
        client.send(data);
    });
};
wssPeer.broadcast = function broadcast(data) {
    wssPeer.clients.forEach(function each(client) {
        client.send(data);
    });
};
var peerID;
wssPeer.on('connection', function(ws) {
//    console.log("message");
    ws.on('message', function(message) { 
//        console.log(message);
        peerID = message;
         ssendd(message)
    });
}); 
function ssendd(message){
    console.log(message)
    wssPeer.broadcast(message);
}
//function ssend(message){
//    console.log(message)
//    wssPeer.broadcast(message);
//    wssPeer.send(message);
//}

wss.on('connection', function (ws) {
    ws.on('message', function incoming(message) {
        deviceInput = JSON.parse(message);
//        console.log(deviceInput);

//        if (deviceInput.pid !== peerID) {
//            peerID = deviceInput.pid;
////            console.log(peerID);
//            wsapp.broadcast(peerID)
//        }
        handleOrientationEvent()
    });
    console.log('browser client connected');
    ws.on('close', function () {
        console.log('browser client disconected');
    })
});
wsss.on('connection', function (ws) {
    ws.on('message', function incoming(message) {
        nativeInput = JSON.parse(message);
//	console.log(nativeInput);

        handleNativeInput()
    });
    console.log('java app client conected');
    ws.on('close', function () {
        console.log('java app client disconected');
    })
});
//console.log(deviceInput.id +'ggggg');
//wsapp.broadcast(deviceInput.id)
wsapp.on('connection', function (ws) {
    ws.on('message', function incoming(message) {
        //deviceInput = JSON.parse(message);
//	console.log(deviceInput);
        console.log(deviceInput.id);
        handleOrientationEvent()
    });
    console.log('app connected');
    ws.on('close', function () {
        console.log('app disconected');
    })
});
function handleOrientationEvent() {
    var orXcss, posxcss1, orYcss, posycss1;
    var rt_temp = deviceInput.rotateDegrees;
    var orX = deviceInput.orX;
    var orY = deviceInput.orY;
    var xx = deviceInput.xx;
    var yy = deviceInput.yy;
    var zz = deviceInput.zz;
    var rt, delta_max, deltax;
    rt = Math.round(rt, 2)
    if (orY > 0)
    {
        rt_temp = rt_temp - 180;
    }
    rt_temp = rt_temp * 3;
    deltax = rt_temp - localvar.rt;

    delta_max = 2;
    if (deltax > delta_max / 2 || deltax < -delta_max / 2) {
        localvar.rt = rt_temp - deltax / 3;
    }

    if (deltax > delta_max || deltax < -delta_max) {
        localvar.rt = rt_temp;
    }
    localvar.lastXor = localvar.rt;


    ///YYYYYYYYYYYYYYYYY


    if (zz > 0) {
        orY = orY + 180
    }
    if (zz < 0) {
        orY = orY
    }


    deltay = orY - localvar.lastYor;
    if (deltay > 50 || deltay < -50) {
        orY = localvar.lastYor;
    }
    delta_max = 2;
    if (deltay > delta_max / 2 || deltay < -delta_max / 2) {
        localvar.lastYor = orY - deltax / 3;
    }

    if (deltay > delta_max || deltay < -delta_max) {
        localvar.lastYor = orY;
    }
    localvar.lastXor = localvar.rt;
    localvar.lastYor = localvar.lastYor;
    localvar.lastYor = 0
    hadlecss()
}
function handleNativeInput() {

    if (nativeInput.type == 'nativeKeyPressed') {

        if (nativeInput.nativeKeyPressed == 29) {
            localvar.ctrlKey = true;
            localvar.mousexOnClick = localvar.mousex;
            localvar.mouseyOnClick = localvar.mousey;
            localvar.ctrlKeyCount = 1;
            hadlecss();
            localvar.ctrlKeyCount = 2;
            hadlecss();
        }

        if (nativeInput.nativeKeyPressed == 42) {
            localvar.shiftKey = true;
            localvar.mousexOnClick = localvar.mousex;
            localvar.mouseyOnClick = localvar.mousey;
            localvar.shiftKeyCount = 1;
            localvar.ctrlKeyCount = 1;
            hadlecss();
            localvar.ctrlKeyCount = 2;
        }
        localvar.shiftKeyCount = 2;
        hadlecss();
    }

    if (nativeInput.type == 'nativeKeyReleased') {
        if (nativeInput.nativeKeyReleased == 29) {
            localvar.ctrlKey = false;
            localvar.mousexOnRel = localvar.ctrlKeyMousex;
            localvar.mouseyOnRel = localvar.ctrlKeyMousey;
            localvar.ctrlKeyCount = 3;
            hadlecss();
            localvar.ctrlKeyCount = 0;
        }
        if (nativeInput.nativeKeyReleased == 42) {
            localvar.shiftKey = false;
            localvar.shiftKeyCount = 3;
            hadlecss();
            localvar.shiftKeyCount = 0;
            localvar.zoomOnRel = applycss.zoom

        }
        hadlecss();
    }

    if (nativeInput.type == 'nativeMouseMoved') {
        localvar.mousex = nativeInput.x;
        localvar.mousey = nativeInput.y;
        if (localvar.ctrlKey == true) {
            localvar.ctrlKeyMousex = localvar.mousex - localvar.mousexOnClick;
            localvar.ctrlKeyMousey = localvar.mousey - localvar.mouseyOnClick;
        }

        hadlecss();
    }

    if (nativeInput.type == 'nativeMouseWheelMoved') {
        localvar.mousewhell = nativeInput.wheel;
        hadlecss();
        localvar.mousewhell = 0;
        hadlecss();

    }
}
function hadlecss() {
    if (localvar.ctrlKeyCount == 3) {
        localvar.mousexOnRel = localvar.lastX - localvar.lastXor;
        localvar.mouseyOnRel = localvar.lastY - localvar.lastYor;
    }
    if (localvar.ctrlKey == true) {

        if (localvar.ctrlKeyCount == 1) {
            localvar.positionCtrlx = applycss.lastX;
            localvar.positionCtrly = applycss.lastY;

            localvar.ctrlKeyMousex = 0;
            localvar.ctrlKeyMousey = 0;
        }

        localvar.lastX = localvar.positionCtrlx + localvar.ctrlKeyMousex;
        localvar.lastY = localvar.positionCtrly + localvar.ctrlKeyMousey;
    } else {
        //  console.log(deviceInput.lastXor);

        localvar.lastX = localvar.lastXor + localvar.mousexOnRel;
        localvar.lastY = localvar.lastYor + localvar.mouseyOnRel;
        applycss.cursorX = localvar.lastX + localvar.mousex / 3;
    }
//        END window movment


//        zoom
    if (localvar.shiftKeyCount == 3 && typeof nativeInput.wheel !== 'undefined') {

        localvar.zoomOnRel = localvar.mousewhellTurn;
    }
    if (localvar.shiftKey == true && typeof nativeInput.wheel !== 'undefined') {
        localvar.mousewhellTurn = localvar.mousewhell * 10 + localvar.mousewhellTurn;
        localvar.zoom = localvar.mousewhellTurn;


    }

    //        ENDzoom

    applycss.cursorX = Math.round(applycss.cursorX, 2);
    applycss.cursorY = Math.round(localvar.mousey, 2);

    applycss.lastX = Math.round(localvar.lastX, 2);
    applycss.lastY = Math.round(localvar.lastY, 2);
    applycss.zoom = localvar.zoom;
//    console.log(applycss);

    wss.broadcast(JSON.stringify(applycss));

}



function clIdget() {
    return  this.slId;
}
