package com.outstudio.plan.service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.bson.types.ObjectId;

import com.jfinal.aop.Duang;
import com.jfinal.ext.plugin.monogodb.MongoKit;
import com.jfinal.plugin.ehcache.CacheKit;
import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.WriteConcern;
import com.mongodb.WriteResult;
import com.outstudio.plan.util.MD5Util;
import com.outstudio.plan.util.TimeUtil;

/**
 * 
 * @author Grandfather3
 *
 */
public class UserService {
	public static final UserService me = Duang.duang(UserService.class);

	public Map<String, Object> login(String phone, String password) {
		Map<String, Object> infos = new HashMap<>();
		DBCollection users = MongoKit.getCollection("user");
		DBObject userToFind = new BasicDBObject("phone", phone);
		DBObject user = users.findOne(userToFind);
		if (user == null) {
			infos.put("info", "noUser");
			return infos;
		}
		String truePwd = MD5Util.MD5(password);// truePwd散列之后的密码
		if (truePwd.equals(user.get("password").toString())) {
			infos.put("info", "success");
			String _id = user.get("_id").toString();
			String token = UUID.randomUUID().toString();
			CacheKit.put("user_token", _id, token);
			infos.put("_id", _id);
			infos.put("deadTimestamp", user.get("dead_timestamp").toString());
			infos.put("token", token);
			infos.put("uuid", user.get("uuid"));
		} else {
			infos.put("info", "wrongPwd");
		}
		return infos;
	}

	public boolean usernameIsExisted(String username) {
		DBCollection users = MongoKit.getCollection("user");
		DBObject userToFind = new BasicDBObject("username", username);
		return users.find(userToFind).count() != 0;
	}

	public boolean phoneIsExisted(String phone) {
		DBCollection users = MongoKit.getCollection("user");
		DBObject userToFind = new BasicDBObject("phone", phone);
		return users.find(userToFind).count() != 0;
	}

	public Map<String, Object> regist(String phone, String password, String checkCode, String uuid, String key) {
		Map<String, Object> infos = new HashMap<>();
		DBCollection users = MongoKit.getCollection("user");
		DBObject userToInsert = new BasicDBObject();
		DBCollection serials = MongoKit.getCollection("serial");
		DBObject serial = serials.findOne(new BasicDBObject("key", key));
		if (serial == null) {
			infos.put("info", "keyNotExist");
			return infos;
		}
		if (!serial.get("status").equals("未激活")) {
			infos.put("info", "keyUsed");
			return infos;
		}
		if (phoneIsExisted(phone)) {
			infos.put("info", "phoneHasExisted");
			return infos;
		}
		if (!checkCode.equals(CacheKit.get("user_checkCode", phone))) {
			if (CacheKit.get("user_checkCode", phone) != null) {
				CacheKit.remove("user_checkCode", phone);
			}
			infos.put("info", "notMatch");
			return infos;
		}
		userToInsert.put("phone", phone);
		userToInsert.put("password", MD5Util.MD5(password));
		userToInsert.put("regist_time", TimeUtil.getFormattedTime());
		userToInsert.put("dead_timestamp", System.currentTimeMillis() + 365 * 24 * 3600 * 1000L);
		userToInsert.put("uuid", uuid);
		userToInsert.put("purchase_status", "已购买");
		userToInsert.put("key", key);
		WriteResult wr = users.insert(userToInsert, WriteConcern.ACKNOWLEDGED);
		if (wr.wasAcknowledged()) {
			infos.put("info", "success");
			infos.put("userId", userToInsert.get("_id").toString());
			serial.put("status", "已激活");
			serials.update(new BasicDBObject("key", key), serial);
		} else {
			infos.put("info", "fail");
		}
		return infos;
	}

	public Map<String, Object> completeInfo(String userId, Map<String, Object> map) {
		Map<String, Object> infos = new HashMap<>();
		DBCollection users = MongoKit.getCollection("user");
		DBObject userToUpdate = new BasicDBObject("_id", new ObjectId(userId));
		DBObject user = users.findOne(userToUpdate);
		user.putAll(map);
		WriteResult wr = users.update(userToUpdate, user, false, false, WriteConcern.ACKNOWLEDGED);
		if (wr.wasAcknowledged()) {
			infos.put("info", "success");
		} else {
			infos.put("info", "fail");
		}
		return infos;
	}

	public Map<String, Object> changePwd(String phone, String password, String checkCode) {
		Map<String, Object> infos = new HashMap<>();
		if (!checkCode.equals(CacheKit.get("user_checkCode", phone))) {
			if (CacheKit.get("user_checkCode", phone) != null) {
				CacheKit.remove("user_checkCode", phone);
			}
			infos.put("info", "notMatch");
			return infos;
		}
		DBCollection users = MongoKit.getCollection("user");
		DBObject userToFind = new BasicDBObject("phone", phone);
		DBObject user = users.findOne(userToFind);
		user.put("password", MD5Util.MD5(password));
		WriteResult wr = users.update(userToFind, user, false, false, WriteConcern.ACKNOWLEDGED);
		if (wr.wasAcknowledged()) {
			infos.put("info", "success");
		} else {
			infos.put("info", "fail");
		}
		return infos;
	}

	public void intro(String userId, String introNo) {
		DBCollection users = MongoKit.getCollection("user");
		DBCollection salemen = MongoKit.getCollection("admin");
		DBObject userToFind = new BasicDBObject("_id", new ObjectId(userId));
		DBObject user = users.findOne(userToFind);
		DBObject introer = salemen.findOne(new BasicDBObject("intro_no", introNo));// 根据邀请码得到邀请人
		if (introer != null) {// 如果推荐人确定有效的话，多给注册用户两天期限
			user.put("introer", introer.get("_id"));
			users.update(userToFind, user);
			users.update(userToFind,
					new BasicDBObject("$inc", new BasicDBObject("dead_timestamp", 2 * 24 * 3600 * 1000)));
		}
	}

}
