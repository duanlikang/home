package com.outstudio.plan.test;

import java.io.IOException;
import java.util.UUID;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.Mongo;

public class Test {
	public static void main(String[] args) throws IOException {
		Mongo mongo = new Mongo("115.28.53.25", 27017);
		DB db = mongo.getDB("plan");
		DBCollection users = db.getCollection("serial");
		for (int i = 0; i < 1; i++) {
			String s = UUID.randomUUID().toString().substring(4, 23);
			DBObject o = new BasicDBObject().append("status", "已激活");
			DBCursor c = users.find(o);
			System.out.println(c.toArray());
		}
		// String url = "http://115.28.53.25/project/sendProject";
		// String userId = "56d67794d4aaf70710064ef8";
		// String token = "a14c5a50-a608-4ce0-9386-9a99932a183f";
		// long timestamp = System.currentTimeMillis();
		// String[] strs = { userId, token, timestamp + "" };
		// Arrays.sort(strs);
		// String rawSignature = "";
		// for (String string : strs) {
		// rawSignature += string;
		// }
		// String signature = MD5Util.MD5(rawSignature);
		// Connection conn = Jsoup.connect(url);
		// conn.data("user_id", userId).data("token", token).data("timestamp",
		// timestamp + "").data("signature",
		// signature);
		// conn.timeout(0).data("project_id",
		// "3fb69ffe67a7f883dd6c13bb07381efb").data("email",
		// "liuchuanyangyan@126.com");
		// String resp = conn.execute().body();
		// System.out.println(resp);
	}
}
