package com.outstudio.plan.util;

import java.io.File;
import java.io.IOException;
import java.util.Iterator;

import net.sf.json.JSONObject;

import org.apache.commons.io.FileUtils;

public class FileOp {

	public static void deleteDir(String tempDir) {
		File dir = new File(tempDir);
		if (dir.exists()) {
			if (dir.isDirectory()) {
				File[] files = dir.listFiles();
				for (File f : files) {
					f.delete();
				}
			}
			dir.delete();
			System.out.println("delete dir [" + tempDir + "] success.");
		}
	}

	public static void deleteFile(String filePath) {
		File f = new File(filePath);
		if (f.isFile() && f.exists()) {
			try {
				f.delete();
				System.out.println("delete file [" + filePath + "] success.");
			} catch (Exception e) {
				// ignore
				e.printStackTrace();
			}
		}
	}

	public static void createTempDir(String tempDir) {
		File dir = new File(tempDir);
		if (!dir.exists()) {
			dir.mkdirs();
		}

	}

	public static void splitExtJsonFile(String fromFile, String toPath) {
		String file = null;
		try {
			file = FileUtils.readFileToString(new File(fromFile));
			if (!file.startsWith("{")) {
				file = "{" + file + "}";
			}
		} catch (IOException e1) {
			e1.printStackTrace();
			return;
		}
		JSONObject js = JSONObject.fromObject(file);
		splitExtJson(js, toPath);
	}

	public static void splitExtJson(JSONObject js, String toPath) {

		Iterator<String> it = js.keys();

		if (!toPath.endsWith("/") && !toPath.endsWith("\\")) {
			toPath = toPath + "/";
		}

		while (it.hasNext()) {
			String key = it.next();
			String s = js.getString(key);
			String fileName = key + ".txt";
			File file = new File(toPath + fileName);
			// 设置如果文件存在的话则不覆盖
			if (file.exists()) {
				continue;
			}
			String data = "\t\t" + key + ":\n\t\t\t" + s + "\n\t\t";
			try {
				FileUtils.writeStringToFile(file, data, "GBK");
				System.out.println(" saved in " + toPath + fileName);
			} catch (IOException e) {
				System.out.println("syso file failed!");
				e.printStackTrace();
			}
		}

	}

	public static void main(String[] args) {
		splitExtJsonFile("G:\\Documents\\Tencent Files\\505306581\\FileRecv\\add.json", "E://");
	}
}
