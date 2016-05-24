package main;

import java.net.URISyntaxException;

import org.json.JSONException;
import org.json.JSONObject;

import com.github.nkzawa.socketio.client.IO;

public class Sockett {
//	
//	public Object objSoc(String type , String[]... argkey) throws JSONException{
//		JSONObject obj = new JSONObject();
//		obj.put("hello", "server");
//		return obj;
//	}
	public void soc(String type, Object arg) {
//		System.out.println(arg[0]);
		final com.github.nkzawa.socketio.client.Socket socket;
		
			try {
				socket = IO.socket("http://localhost:85");
				if (type == "nativeKeyPressed") {
					socket.emit("nativeKeyPressed", arg);
				}
				if (type == "nativeKeyReleased") {
					socket.emit("nativeKeyReleased", arg);
				}
				if (type == "nativeMouseMoved") {
					socket.emit("nativeMouseMoved", arg);
				}
				if (type == "nativeMouseClicked") {
					socket.emit("nativeMouseClicked", arg);
				}
				if (type == "nativeMousePressed") {
					socket.emit("nativeMousePressed", arg);
				}
				if (type == "nativeMouseReleased") {
					socket.emit("nativeMouseReleased", arg);
				}
				if (type == "nativeMouseWheelMoved") {
					socket.emit("nativeMouseWheelMoved", arg);
				}
//				socket.emit("test", arg);
			} catch (URISyntaxException e1) {
				e1.printStackTrace();
			}
		
		
		
	}
}
