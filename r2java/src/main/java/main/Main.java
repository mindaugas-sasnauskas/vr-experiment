package main;

import java.net.URISyntaxException;

import javax.swing.SwingUtilities;

import com.github.nkzawa.emitter.Emitter;
import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;

public class Main {

	public static void main(String[] args) {

		SwingUtilities.invokeLater(new Runnable() {
			public void run() {
				new NativeHook();
			}
		});
	
		final Socket socket;
		try {
			socket = IO.socket("http://localhost:85");
			socket.on(Socket.EVENT_CONNECT, new Emitter.Listener() {
				public void call(Object... arg0) {
				}
			}).on("event", new Emitter.Listener() {
				public void call(Object... arg0) {
				}
			}).on(Socket.EVENT_DISCONNECT, new Emitter.Listener() {
				public void call(Object... args) {
				}
			});

			socket.connect();
		} catch (URISyntaxException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

}
