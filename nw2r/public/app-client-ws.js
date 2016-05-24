var deviceInput;
deviceInput = {
    'xx': 0,
    'yy': 0,
    'zz': 0,
    'rotateDegrees': 0,
    'orX': 0,
    'orY': 0,
//    'pid': "lll"
};
var peer = new Peer('', {key: 'o92xx7ym9rb5ipb9', path: '/'});
//var peer = new Peer('c4a6f4a6736d0e07109b28c996dbb17ef471977a11bdaa273202b95640d2c', {key: 'o92xx7ym9rb5ipb9', path: '/'});

peer.on('error', function (err) {
    console.log(err.message);
    $('.err').text(err.message);
});
var peerId;
peer.on('open', function (id) {
    ws.send(id);
});
peer.on('call', function (call) {
    call.answer();
//    console.log(call + 44)
    call.on('stream', function (stream) {
        $('.client-video1').prop('src', URL.createObjectURL(stream));
    });
});

/////////// socket

var ws, wsData;
if ("WebSocket" in window) {
    ws = new WebSocket('ws://192.168.0.94:8666');
    wsData = new WebSocket('ws://192.168.0.94:8555');

    ws.onopen = function (event) {
        console.log('connected');

    };
    ws.onmessage = function (event) {
        console.log(event.data);
//    aplcss = JSON.parse(event.data);
//    applycss();
    };
    ws.onclose = function (event) {
        console.log('err');
        setTimeout(function () {
            location.reload();
        }, 100);
    };
}


/////////////////// device controls




window.addEventListener("devicemotion", devicemotion, true);
window.addEventListener("deviceorientation", deviceorientation, true);

function devicemotion(event) {

    deviceInput.yy = Math.round(event.accelerationIncludingGravity.y, 2);
//    deviceInput.xx = Math.round(event.accelerationIncludingGravity.x, 2);
    deviceInput.zz = Math.round(event.accelerationIncludingGravity.z, 2);
//    console.log(deviceInput);
    wsData.send(JSON.stringify(deviceInput));
}
function deviceorientation(event) {
    deviceInput.rotateDegrees = Math.round(event.alpha, 2);
    deviceInput.orY = Math.round(event.gamma, 2);
//    deviceInput.orX = Math.round(event.beta, 2);
}


var aplcss = {
    'lastX': 0,
    'lastY': 0,
    'cursorX': 0,
    'cursorY': 0,
    'zoom': 100
};

wsData.onmessage = function (event) {

    aplcss = JSON.parse(event.data);
    applycss();
};

function applycss() {

//     console.log(aplcss);
//    $('.cursor-left').css('left', aplcss.cursorX);
//    $('.cursor-right').css('left', aplcss.cursorX - 200);
//    $('.cursor').css('top', aplcss.cursorY);
    $('.container-in-control').css('left', aplcss.lastX);
    $('.container-in-control').css('top', aplcss.lastY);
    $('.container-in-control').css('width', aplcss.zoom + 100 + '%');
    $('.container-in-control').css('margin-left', -aplcss.zoom / 2 + '%');
    $('.container-in-control').css('height', aplcss.zoom + 100 + '%');
    $('.container-in-control').css('margin-top', -aplcss.zoom / 2 + '%');

}







//fisheye

//
//(function () {
//    d3.fisheye = {
//	scale: function (scaleType) {
//	    return d3_fisheye_scale(scaleType(), 3, 0);
//	},
//	circular: function () {
//	    var radius = 200,
//		    distortion = 2,
//		    k0,
//		    k1,
//		    focus = [0, 0];
//
//	    function fisheye(d) {
//		var dx = d.x - focus[0],
//			dy = d.y - focus[1],
//			dd = Math.sqrt(dx * dx + dy * dy);
//		if (!dd || dd >= radius)
//		    return {x: d.x, y: d.y, z: 1};
//		var k = k0 * (1 - Math.exp(-dd * k1)) / dd * .75 + .25;
//		return {x: focus[0] + dx * k, y: focus[1] + dy * k, z: Math.min(k, 10)};
//	    }
//
//	    function rescale() {
//		k0 = Math.exp(distortion);
//		k0 = k0 / (k0 - 1) * radius;
//		k1 = distortion / radius;
//		return fisheye;
//	    }
//
//	    fisheye.radius = function (_) {
//		if (!arguments.length)
//		    return radius;
//		radius = +_;
//		return rescale();
//	    };
//
//	    fisheye.distortion = function (_) {
//		if (!arguments.length)
//		    return distortion;
//		distortion = +_;
//		return rescale();
//	    };
//
//	    fisheye.focus = function (_) {
//		if (!arguments.length)
//		    return focus;
//		focus = _;
//		return fisheye;
//	    };
//
//	    return rescale();
//	}
//    };
//
//    function d3_fisheye_scale(scale, d, a) {
//
//	function fisheye(_) {
//	    var x = scale(_),
//		    left = x < a,
//		    range = d3.extent(scale.range()),
//		    min = range[0],
//		    max = range[1],
//		    m = left ? a - min : max - a;
//	    if (m == 0)
//		m = max - min;
//	    return (left ? -1 : 1) * m * (d + 1) / (d + (m / Math.abs(x - a))) + a;
//	}
//
//	fisheye.distortion = function (_) {
//	    if (!arguments.length)
//		return d;
//	    d = +_;
//	    return fisheye;
//	};
//
//	fisheye.focus = function (_) {
//	    if (!arguments.length)
//		return a;
//	    a = +_;
//	    return fisheye;
//	};
//
//	fisheye.copy = function () {
//	    return d3_fisheye_scale(scale.copy(), d, a);
//	};
//
//	fisheye.nice = scale.nice;
//	fisheye.ticks = scale.ticks;
//	fisheye.tickFormat = scale.tickFormat;
//	return d3.rebind(fisheye, scale, "domain", "range");
//    }
//})();


// END fisheye