package com.outstudio.plan.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.jfinal.aop.Duang;
import com.jfinal.ext.plugin.monogodb.MongoKit;
import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
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
public class AdminService {
	public static final AdminService me = Duang.duang(AdminService.class);

	public boolean phoneIsExisted(String phone) {
		DBCollection salemans = MongoKit.getCollection("admin");
		DBObject salemanToFind = new BasicDBObject("phone", phone);
		return salemans.find(salemanToFind).count() != 0;
	}

	public Map<String, Object> login(String phone, String password) {
		Map<String, Object> infos = new HashMap<>();
		DBCollection admins = MongoKit.getCollection("admin");
		DBObject admin = admins.findOne(new BasicDBObject("phone", phone));
		if (admin == null || !MD5Util.MD5(password).equals(admin.get("password").toString())) {
			infos.put("info", "fail");
		} else {
			infos.put("info", "success");
			infos.put("admin", admin);
		}
		return infos;
	}

	public Map<String, Object> regist(String password, String name, String phone, String address, String fatherPhone) {
		Map<String, Object> infos = new HashMap<>();
		DBCollection salemans = MongoKit.getCollection("admin");
		DBObject salemanToInsert = new BasicDBObject();
		if (phoneIsExisted(phone)) {
			infos.put("errorInfo", "手机号已存在");
			infos.put("info", "fail");
			return infos;
		}
		if (!phoneIsExisted(fatherPhone)) {
			infos.put("errorInfo", "上级推广员不存在");
			infos.put("info", "fail");
			return infos;
		}
		salemanToInsert.put("password", MD5Util.MD5(password));
		salemanToInsert.put("name", name);
		salemanToInsert.put("phone", phone);
		salemanToInsert.put("address", address);
		salemanToInsert.put("regist_time", TimeUtil.getFormattedTime());
		salemanToInsert.put("intro_no", UUID.randomUUID().toString().substring(0, 6));// 生成唯一邀请码
		salemanToInsert.put("father_phone", fatherPhone);
		salemanToInsert.put("level",
				Integer.parseInt(salemans.findOne(new BasicDBObject("phone", fatherPhone)).get("level").toString())
						+ 1);
		WriteResult wr = salemans.insert(salemanToInsert, WriteConcern.ACKNOWLEDGED);
		if (wr.wasAcknowledged()) {
			infos.put("info", "success");
		} else {
			infos.put("info", "fail");
		}
		return infos;
	}

	public List<Map<String, Object>> getAdmin(int index, String phone, DBObject admin) {
		DBCollection admins = MongoKit.getCollection("admin");
		DBObject _admin = admins.findOne(new BasicDBObject("phone", phone));
		if (_admin.get("level").toString().compareTo(admin.get("level").toString()) > 0
				|| phone.equals(admin.get("phone"))) {// 访问当前手机号和当前手机号的下一级admin是允许的
			if (_admin.get("level").toString().equals("0")) {// O级是超级管理员，获得所有的admin
				DBCursor adminCursor = admins.find().skip(index * 10).limit(10); // 每次取十个
				List<Map<String, Object>> adminList = new ArrayList<>();
				while (adminCursor.hasNext()) {
					DBObject o = adminCursor.next();
					Map<String, Object> map = o.toMap();
					adminList.add(map);
				}
				return adminList;
			} else {// 一级管理员只能获得自己下属的管理员
				DBCursor adminCursor = admins.find(new BasicDBObject("father_phone", phone)).skip(index * 10).limit(10); // 每次取十个
				List<Map<String, Object>> adminList = new ArrayList<>();
				while (adminCursor.hasNext()) {
					DBObject o = adminCursor.next();
					Map<String, Object> map = o.toMap();
					adminList.add(map);
				}
				return adminList;
			}
		} else {
			return new ArrayList<>();
		}
	}

	public long getAdminCount(String phone) {
		DBCollection admins = MongoKit.getCollection("admin");
		DBObject _admin = admins.findOne(new BasicDBObject("phone", phone));
		if (_admin.get("level").toString().equals("0")) {// O级是超级管理员，获得所有的admin
			return admins.getCount();
		} else {// 一级管理员只能获得自己下属的管理员
			return admins.getCount(new BasicDBObject("father_phone", phone));
		}
	}

	public List<Map<String, Object>> getUser(int index, String phone, DBObject admin) {
		DBCollection admins = MongoKit.getCollection("admin");
		DBObject _admin = admins.findOne(new BasicDBObject("phone", phone));
		if (_admin.get("level").toString().compareTo(admin.get("level").toString()) > 0
				|| phone.equals(admin.get("phone"))) {// 访问当前手机号和当前手机号的下一级admin是允许的
			if (_admin.get("level").toString().equals("0")) {// O级是超级管理员，获得所有的admin
				DBCollection users = MongoKit.getCollection("user");
				DBCursor userCursor = users.find().skip(index * 10).limit(10); // 每次取十个
				List<Map<String, Object>> userList = new ArrayList<>();
				while (userCursor.hasNext()) {
					DBObject o = userCursor.next();
					Map<String, Object> map = o.toMap();
					if (map.containsKey("dead_timestamp")) {
						long timestamp = Long.parseLong(map.get("dead_timestamp").toString());
						map.put("dead_time", TimeUtil.getFormattedTime(timestamp));
					}
					userList.add(map);
				}
				return userList;
			} else {// 一级管理员只能获得自己下属的管理员
				DBCollection users = MongoKit.getCollection("user");
				DBCursor userCursor = users.find(new BasicDBObject("introer", _admin.get("_id"))).skip(index * 10)
						.limit(10); // 每次取十个
				List<Map<String, Object>> userList = new ArrayList<>();
				while (userCursor.hasNext()) {
					DBObject o = userCursor.next();
					Map<String, Object> map = o.toMap();
					if (map.containsKey("dead_timestamp")) {
						long timestamp = Long.parseLong(map.get("dead_timestamp").toString());
						map.put("dead_time", TimeUtil.getFormattedTime(timestamp));
					}
					userList.add(map);
				}
				return userList;
			}
		} else {
			return new ArrayList<>();
		}
	}

	public long getUserCount(String phone) {
		DBCollection admins = MongoKit.getCollection("admin");
		DBCollection users = MongoKit.getCollection("user");
		DBObject _admin = admins.findOne(new BasicDBObject("phone", phone));
		if (_admin.get("level").toString().equals("0")) {// O级是超级管理员，获得所有的user
			return users.getCount();
		} else {// 一级管理员只能获得自己下属的管理员
			return users.getCount(new BasicDBObject("introer", _admin.get("_id")));
		}
	}
}
