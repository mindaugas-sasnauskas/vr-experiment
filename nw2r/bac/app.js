var peer = new Peer('', {key: 'o92xx7ym9rb5ipb9'});
//console.log(peer);
peer.on('open', function () {
    //   $('#my-id').text(peer.id);
    //   console.log(peer.id);
});



//peer


function step2() {
//    $('#step1, #step3').hide();
    $('#step2').show();
}
function step1() {
    // Get audio/video stream
    navigator.getUserMedia({audio: false, video: true}, function (stream) {
        // Set your video displays
        // console.log(stream)
        //  $('#my-video').prop('src', URL.createObjectURL(stream));

        window.localStream = stream;
        step2();
        recon();
    }, function () {
        $('#step1-error').show();
    });
}


//peer


var desktop_sharing = false;
var local_stream = null;
function toggle() {
    if (!desktop_sharing) {
        chrome.desktopCapture.chooseDesktopMedia(["screen", "window"], onAccessApproved);
    } else {
        desktop_sharing = false;

        if (local_stream)
            local_stream.stop();
        local_stream = null;
        recon();
        document.querySelector('button').innerHTML = "Enable Capture";
        console.log('Desktop sharing stopped...');
    }
}

function onAccessApproved(desktop_id) {
    if (!desktop_id) {
        console.log('Desktop Capture access rejected.');
        return;
    }
    desktop_sharing = true;
    document.querySelector('button').innerHTML = "Disable Capture";
    console.log("Desktop sharing started.. desktop_id:" + desktop_id);

    navigator.webkitGetUserMedia({
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: desktop_id,
//                minWidth: 1280,
//                maxWidth: 1280,
//                minHeight: 720,
//                maxHeight: 720
            }
        }
    }, gotStream, getUserMediaError);

    function gotStream(stream) {
        local_stream = stream;
        console.log(stream)

        stream.onended = function () {
            if (desktop_sharing) {
                toggle();
            }
        };
        window.localStreamm = stream;

    }

    function step3(call) {
        // Hang up on an existing call if present
        if (window.existingCall) {
            window.existingCall.close();
        }

        // Wait for stream on the call, then set peer video display
        call.on('stream', function (stream) {
            // $('#their-video').prop('src', URL.createObjectURL(stream));
        });
        // UI stuff
        window.existingCall = call;
        $('#callto-id').text(call.peer);
//        call.on('close', step2);
        call.on('close', recon);
//        recon();
//        $('#step1, #step2').hide();
        $('#step3').show();
    }

    $(function () {
        $('#make-call').click(function () {
            // Initiate a call!
            console.log($('#callto-id').val());
            var call = peer.call($('#callto-id').val(), window.localStreamm);
            var conn = peer.connect($('#callto-id').val());
            dataCon(conn);
            step3(call);
        });

        $('#end-call').click(function () {
            window.existingCall.close();
            step2();
        });

        // Retry if getUserMedia fails
        $('#step1-retry').click(function () {
            $('#step1-error').hide();
            step1();
        });

        // Get things started
        step1();
    });

    stream.onended = function () {
        if (desktop_sharing) {
            toggle();
        }
    };

    function getUserMediaError(e) {
        console.log('getUserMediaError: ' + JSON.stringify(e, null, '---'));
    }

}

/**
 * Click handler to init the desktop capture grab
 */
//document.querySelector('button').addEventListener('click', function (e) {
//    toggle();
//});


function dataCon(conn) {

    conn.on('open', function () {
        // Receive messages
        conn.on('data', function (data) {
            console.log('Received', data);
        });
        $("body").mousemove(function (e) {
            var x = e.pageX;
            var y = e.pageY;
            var data = [x, y];
            //  console.log(x, y);
            conn.send(data);
        });
        // Send messages

    });

}
;

peer.on('disconnected', function () {
    console.log('kkkkk');
    peer.call($('#callto-id').val(), window.localStreamm);
});
//  \\peer
