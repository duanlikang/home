package com.outstudio.plan.service;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.imageio.ImageIO;

import org.apache.commons.io.IOUtils;

import com.jfinal.aop.Duang;
import com.jfinal.ext.plugin.monogodb.MongoKit;
import com.jfinal.upload.UploadFile;
import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.outstudio.plan.util.ImageUtil;
import com.outstudio.plan.util.StaticUtil;

public class PictureService {

	private final String ORIGIN_PATH = "/file/origin/";
	private final String FIRST_CUT_PATH = "/file/first_cut/";
	private final String SECOND_CUT_PATH = "/file/second_cut/";
	public static final PictureService me = Duang.duang(new PictureService());

	public Map<String, Object> upload(UploadFile uploadFile, String pictureId) throws IOException {
		Map<String, Object> infos = new HashMap<>();
		File fromFile = uploadFile.getFile();
		File toFile = new File(StaticUtil.root + ORIGIN_PATH + pictureId + "." + ImageUtil.IMAGE_TYPE_JPG);
		FileInputStream fis = new FileInputStream(fromFile);
		FileOutputStream fos = new FileOutputStream(toFile);
		IOUtils.copy(fis, fos);
		fis.close();
		fos.close();
		infos.put("toFile", toFile);
		return infos;
	}

	public void save(String pictureId) {
		DBCollection pictures = MongoKit.getCollection("picture");
		DBObject pictureToFound = new BasicDBObject("_id", pictureId);
		if (!existed(pictureId)) {
			pictures.insert(pictureToFound);
		}
	}

	public void delelte(String pictureId) {
		DBCollection pictures = MongoKit.getCollection("picture");
		DBObject pictureToFound = new BasicDBObject("_id", pictureId);
		if (existed(pictureId)) {
			pictures.remove(pictureToFound);
		}
	}

	public boolean existed(String pictureId) {
		DBCollection pictures = MongoKit.getCollection("picture");
		DBObject pictureToFound = new BasicDBObject("_id", pictureId);
		return (pictures.getCount(pictureToFound) > 0);
	}

	public Map<String, Object> firstCut(File fromFile, int height, int width) throws IOException {
		Map<String, Object> infos = new HashMap<>();
		File toFile = new File(StaticUtil.root + FIRST_CUT_PATH + fromFile.getName());
		ImageUtil.scale(fromFile, toFile, height, width, ImageUtil.IMAGE_TYPE_JPG, false);
		BufferedImage bi = ImageIO.read(toFile);
		infos.put("url", FIRST_CUT_PATH + toFile.getName());
		infos.put("width", bi.getWidth());
		infos.put("height", bi.getHeight());
		return infos;
	}

	public Map<String, Object> secondCut(File fromFile, int x, int y, int width, int height) throws IOException {
		Map<String, Object> infos = new HashMap<>();
		File toFile = new File(StaticUtil.root + SECOND_CUT_PATH + fromFile.getName());
		ImageUtil.cut(fromFile, toFile, x, y, width, height, ImageUtil.IMAGE_TYPE_JPG);
		infos.put("url", SECOND_CUT_PATH + toFile.getName());
		return infos;
	}
}
