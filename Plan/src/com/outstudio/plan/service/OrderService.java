package com.outstudio.plan.service;

import java.util.HashMap;
import java.util.Map;

import org.bson.types.ObjectId;

import com.jfinal.aop.Duang;
import com.jfinal.ext.plugin.monogodb.MongoKit;
import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.WriteConcern;
import com.mongodb.WriteResult;
import com.outstudio.plan.util.EmailUtil;
import com.outstudio.plan.util.TimeUtil;

public class OrderService {
	public static final OrderService me = (OrderService) Duang.duang(new OrderService());

	public boolean save(String orderNo, String userId, double total, String type) {
		DBCollection orders = MongoKit.getCollection("order");
		DBObject orderToInsert = new BasicDBObject();
		orderToInsert.put("_id", orderNo);
		orderToInsert.put("user_id", new ObjectId(userId));
		orderToInsert.put("total", Double.valueOf(total));
		orderToInsert.put("type", type);
		orderToInsert.put("pay_status", "未支付");
		orderToInsert.put("create_time", TimeUtil.getFormattedTime());
		WriteResult wr = orders.insert(orderToInsert, WriteConcern.ACKNOWLEDGED);
		if (wr.wasAcknowledged()) {
			return true;
		}
		return false;
	}

	public Map<String, Object> finish(String orderNo) {
		Map<String, Object> infos = new HashMap<String, Object>();
		DBCollection orders = MongoKit.getCollection("order");
		DBObject order = orders.findOne(new BasicDBObject("_id", orderNo));
		if (order.get("pay_status").equals("已支付")) {
			infos.put("info", "fail");
			infos.put("error_msg", "sign");
			return infos;
		}
		order.put("pay_status", "已支付");
		order.put("finish_time", TimeUtil.getFormattedTime());
		orders.update(new BasicDBObject("_id", orderNo), order);
		ObjectId userId = (ObjectId) order.get("user_id");
		DBCollection users = MongoKit.getCollection("user");
		DBObject user = users.findOne(new BasicDBObject("_id", userId));
		String type = order.get("type").toString();
		if ((type.equals("1")) || (type.equals("3"))) {
			long now = Long.parseLong(user.get("dead_timestamp").toString());
			now += 365 * 24 * 3600 * 1000L;
			user.put("dead_timestamp", Long.valueOf(now));
		}
		user.put("purchase_status", "已购买");
		WriteResult wr = users.update(new BasicDBObject("_id", userId), user, false, false, WriteConcern.ACKNOWLEDGED);
		if (wr.wasAcknowledged())
			infos.put("info", "success");
		else {
			infos.put("info", "fail");
		}
		return infos;
	}

	public Map<String, Object> address(String name, String address, String phone, String userId, String orderNo) {
		Map<String, Object> infos = new HashMap<String, Object>();
		DBCollection orders = MongoKit.getCollection("order");
		DBObject order = orders.findOne(new BasicDBObject("_id", orderNo));
		if (order == null) {
			infos.put("info", "fail");
			infos.put("errorInfo", "noOrder");
		} else if (!order.get("user_id").toString().equals(userId)) {
			infos.put("info", "fail");
			infos.put("errorInfo", "userNotMatch");
		} else {
			DBCollection mailOrders = MongoKit.getCollection("mail_order");
			DBObject mailOrder = new BasicDBObject();
			String _id = order.get("_id").toString();
			String type = order.get("type").toString();
			double total = Double.parseDouble(order.get("total").toString());
			mailOrder.put("_id", _id);
			mailOrder.put("address", address);
			mailOrder.put("phone", phone);
			mailOrder.put("user_id", new ObjectId(userId));
			mailOrder.put("type", type);
			mailOrder.put("name", name);
			WriteResult wr = mailOrders.insert(mailOrder, WriteConcern.ACKNOWLEDGED);
			if (wr.wasAcknowledged()) {
				infos.put("info", "success");
				StringBuilder sb = new StringBuilder();
				sb.append("订单号：" + _id + "\n");
				sb.append("订单时间：" + TimeUtil.getFormattedTime() + "\n");
				sb.append("手机号：" + phone + "\n");
				sb.append("邮寄地址：" + address + "\n");
				sb.append("订单金额：" + total + "\n");
				sb.append("姓名：" + name);
				System.out.println(EmailUtil.notify(sb.toString()));
			} else {
				infos.put("info", "fail");
				infos.put("errorInfo", "databaseError");
			}
		}
		return infos;
	}

	public boolean dazhe(String userId) {
		DBCollection orders = MongoKit.getCollection("order");
		long count = orders.getCount(new BasicDBObject().append("user_id", new ObjectId(userId)).append("type", "3")
				.append("pay_status", "已支付"));
		return count > 0L;
	}
}
