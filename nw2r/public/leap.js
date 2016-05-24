
console.log("LeapJS v" + Leap.version.full);
var state = 'play';
window.onkeypress = function (e) {
    if (e.charCode == 32) { //spacebar
	if (state == 'play') {
	    state = 'pausing';
	} else {
	    state = 'play';
	}
    }
};
var haveLoggedFrame = false;
var controller = new Leap.Controller({enableGestures: true});
controller.loop(function (frame) {
    if (state == 'paused')
	return;
    if (state == 'pausing') {
	document.getElementById('out').innerHTML = "<p><b>PAUSED</b></p><div>" + frame.dump() + "</div>";
	state = 'paused';
    } else {
	document.getElementById('out').innerHTML = "<p>spacebar to pause</p><div>" + frame.dump() + "</div>";
    }

    if (haveLoggedFrame == false && frame.hands[0]) {
	console.log(frame);
	haveLoggedFrame = true;
    }

});

// Note that this means Leap is connected, but not streaming.  Use streamingStarted for that.
controller.on('ready', function () {
    console.log("ready. Service version: " + controller.connection.protocol.serviceVersion);
});
controller.on('connect', function () {
    console.log("connected with protocol v" + controller.connection.opts.requestProtocolVersion);
});
controller.on('disconnect', function () {
    console.log("disconnect");
});
controller.on('focus', function () {
    console.log("focus");
});
controller.on('blur', function () {
    console.log("blur");
});

controller.on('deviceAttached', function (deviceInfo) {
    console.log("deviceAttached", deviceInfo);
});
controller.on('deviceRemoved', function (deviceInfo) {
    console.log("deviceRemoved", deviceInfo);
});
controller.on('deviceStreaming', function (deviceInfo) {
    console.log("deviceStreaming", deviceInfo);
});
controller.on('deviceStopped', function (deviceInfo) {
    console.log("deviceStopped", deviceInfo);
});
controller.on('streamingStarted', function (deviceInfo) {
    console.log("streamingStarted", deviceInfo);
});
controller.on('streamingStopped', function (deviceInfo) {
    console.log("streamingStopped", deviceInfo);
});

controller.on('deviceConnected', function () {
    console.log("deviceConnected");
});
controller.on('deviceDisconnected', function () {
    console.log("deviceDisconnected");
});

// This event is always called after other frame events, and is ideal for rendering WebGL scenes.
// The timestamp is from requestAnimationFrame and is when the pixels hit the screen.
controller.on('frameEnd', function (timestamp) {

//        console.log('frameEnd', timestamp);

});









//////////////////////





//
//
//

function moveFinger(Finger, posX, posY, posZ) {
    console.log(posX);
    Finger.style.webkitTransform = "translate3d(" + posX + "px, " + posY + "px, " + posZ + "px)";
}

function moveSphere(Sphere, posX, posY, posZ, rotX, rotY, rotZ) {
    Sphere.style.webkitTransform = Sphere.style.mozTransform =
	    Sphere.style.transform = "translateX(" + posX + "px) translateY(" + posY + "px) translateZ(" + posZ + "px) rotateX(" + rotX + "deg) rotateY(0deg) rotateZ(0deg)";
}

var fingers = {};
var spheres = {};
Leap.loop(function (frame) {
    var seenFingers = {};
    var handIds = {};
    if (frame.hands === undefined) {
	var handsLength = 0
    } else {
	var handsLength = frame.hands.length;
    }

    for (var handId = 0, handCount = handsLength; handId != handCount; handId++) {
	var hand = frame.hands[handId];
	var posX = (hand.palmPosition[0] * 3);
	var posY = (hand.palmPosition[2] * 3) - 200;
	var posZ = (hand.palmPosition[1] * 3) - 400;
	var rotX = (hand._rotation[2] * 90);
	var rotY = (hand._rotation[1] * 90);
	var rotZ = (hand._rotation[0] * 90);
	var sphere = spheres[hand.id];
	if (!sphere) {
	    var sphereDiv = document.getElementById("sphere").cloneNode(true);
	    sphereDiv.setAttribute('id', hand.id);
	    sphereDiv.style.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
	    document.getElementById('scene').appendChild(sphereDiv);
	    spheres[hand.id] = hand.id;
	} else {
	    var sphereDiv = document.getElementById(hand.id);
	    if (typeof (sphereDiv) != 'undefined' && sphereDiv != null) {
		moveSphere(sphereDiv, posX, posY, posZ, rotX, rotY, rotZ);
	    }
	}
	handIds[hand.id] = true;
    }
    for (handId in spheres) {
	if (!handIds[handId]) {
	    var sphereDiv = document.getElementById(spheres[handId]);
	    sphereDiv.parentNode.removeChild(sphereDiv);
	    delete spheres[handId];
	}
    }

    for (var pointableId = 0, pointableCount = frame.pointables.length; pointableId != pointableCount; pointableId++) {
	var pointable = frame.pointables[pointableId];
	var newFinger = false;
	if (pointable.finger) {
	    if (!fingers[pointable.id]) {
		fingers[pointable.id] = [];
		newFinger = true;
	    }

	    for (var partId = 0, length; partId != 4; partId++) {
		var posX = (pointable.positions[partId][0] * 3);
		var posY = (pointable.positions[partId][2] * 3) - 200;
		var posZ = (pointable.positions[partId][1] * 3) - 400;

		var id = pointable.id + '_' + partId;

		var finger = fingers[id];
		if (newFinger) {
		    var fingerDiv = document.getElementById("finger").cloneNode(true);
		    fingerDiv.setAttribute('id', id);
		    fingerDiv.style.backgroundColor = '#' + Math.floor(pointable.type * 500).toString(16);
		    document.getElementById('scene').appendChild(fingerDiv);
		    fingers[pointable.id].push(id);
		} else {
		    var fingerDiv = document.getElementById(id);
		    if (typeof (fingerDiv) != 'undefined' && fingerDiv != null) {
			moveFinger(fingerDiv, posX, posY, posZ);
		    }
		}
		seenFingers[pointable.id] = true;
	    }

	    //var dirX = -(pointable.direction[1]*90);
	    //var dirY = -(pointable.direction[2]*90);
	    //var dirZ = (pointable.direction[0]*90);
	}
    }
    for (var fingerId in fingers) {
	if (!seenFingers[fingerId]) {
	    var ids = fingers[fingerId];
	    for (var index in ids) {
		var fingerDiv = document.getElementById(ids[index]);
		fingerDiv.parentNode.removeChild(fingerDiv);
	    }
	    delete fingers[fingerId];
	}
    }
    document.getElementById('showHands').addEventListener('mousedown', function () {
	document.getElementById('app').setAttribute('class', 'show-hands');
    }, false);
    document.getElementById('hideHands').addEventListener('mousedown', function () {
	document.getElementById('app').setAttribute('class', '');
    }, false);
});
