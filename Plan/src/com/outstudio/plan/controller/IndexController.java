package com.outstudio.plan.controller;

import org.bson.types.ObjectId;

import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.ext.plugin.monogodb.MongoKit;
import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.WriteConcern;
import com.mongodb.WriteResult;
import com.outstudio.plan.filter.TokenInterceptor;

public class IndexController extends Controller {
	public void index() {
		render("index.html");
	}

	@Before(TokenInterceptor.class)
	public void error() {
		String date = getPara("date");
		String error = getPara("error");
		String userId = getPara("user_id");
		DBCollection errors = MongoKit.getCollection("error");
		WriteResult wr = errors.insert(
				new BasicDBObject().append("time", date).append("error", error).append("user_id", new ObjectId(userId)),
				WriteConcern.ACKNOWLEDGED);
		if (wr.wasAcknowledged()) {
			renderText("{\"info\" : \"success\"}");
		} else {
			renderText("{\"info\" : \"fail\"}");
		}
	}
}
