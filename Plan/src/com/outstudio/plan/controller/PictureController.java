package com.outstudio.plan.controller;

import java.io.File;
import java.io.IOException;
import java.util.Map;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.ext.plugin.monogodb.MongoKit;
import com.jfinal.upload.UploadFile;
import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.outstudio.plan.filter.CallBackInterceptor;
import com.outstudio.plan.service.PictureService;
import com.outstudio.plan.util.StaticUtil;

@Before(CallBackInterceptor.class)
public class PictureController extends Controller {

	public String isExsited() {
		String pictureId = getPara("pictureId");
		DBCollection pictures = MongoKit.getCollection("picture");
		DBObject thePicture = new BasicDBObject("id", pictureId);
		boolean existed = pictures.find(thePicture).size() < 1;
		JSONObject jo = new JSONObject();
		jo.put("isExisted", existed);
		return jo.toJSONString();
	}

	public String upload() throws IOException {
		Map<String, Object> infos;
		UploadFile uploadFile = getFile("uploadkey1");
		int viewHeight = (int) Float.parseFloat(getPara("viewHeight"));
		int viewWidth = (int) Float.parseFloat(getPara("viewWidth"));
		String pictureId = getPara("pictureId");
		infos = PictureService.me.upload(uploadFile, pictureId);
		File toFile = (File) infos.get("toFile");
		infos = PictureService.me.firstCut(toFile, viewHeight, viewWidth);
		PictureService.me.save(pictureId);
		return JSON.toJSONString(infos);
	}

	public String cut() throws IOException {
		int editX = (int) Float.parseFloat(getPara("editX"));
		int editY = (int) Float.parseFloat(getPara("editY"));
		int editWidth = (int) Float.parseFloat(getPara("editWidth"));
		int editHeight = (int) Float.parseFloat(getPara("editHeight"));
		String url = getPara("url");
		File fromFile = new File(StaticUtil.root + url);
		Map<String, Object> infos = PictureService.me.secondCut(fromFile, editX, editY, editWidth, editHeight);
		return JSON.toJSONString(infos);
	}

	public static void main(String[] args) {
		System.out.println((int) (Math.random() * (90 - 70) + 70));
	}
}
