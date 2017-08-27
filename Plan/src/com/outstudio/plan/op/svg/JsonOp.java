package com.outstudio.plan.op.svg;

import java.io.IOException;

import javax.xml.transform.TransformerException;

import org.apache.batik.anim.dom.SVGDOMImplementation;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class JsonOp {

	public static final String svgNS = SVGDOMImplementation.SVG_NAMESPACE_URI;

	/**
	 * @param jsonPath
	 *            svg的json文件
	 * @param externalFilePath
	 *            或许需要引用的其他外部文件所在的文件夹路径
	 * @return json解析出的svg的document元素
	 */
	public static Document trans(String jsonPath, String externalFilePath, String extDirName) {
		return trans(jsonPath, externalFilePath, extDirName, null, null);
	}

	public static Document trans(String jsonPath, String externalFilePath, String extDirName, String height,
			String width) {

		JSONObject js = SvgParseUtil.readJson(jsonPath);

		return transJsonObj(js, externalFilePath, extDirName, height, width);

	}

	public static Document transtxt(String jsonTxt, String externalFilePath, String extDirName, String height,
			String width) {
		JSONObject js = JSONObject.fromObject(jsonTxt);
		return transJsonObj(js, externalFilePath, extDirName, height, width);
	}

	public static Document transJsonObj(JSONObject js, String externalFilePath, String extDirName, String height,
			String width) {

		PrimaryJsonPaser pp = new PrimaryJsonPaser(externalFilePath);

		Document doc = pp.initSvgDocument();

		JSONArray jaRoom = js.getJSONArray("room");

		Element root = doc.getDocumentElement();
		// 设置默认的大小
		root.setAttribute("height", "1200");
		root.setAttribute("width", "2000");

		if (height != null) {
			root.setAttribute("height", height);
		}
		if (width != null) {
			root.setAttribute("width", width);
		}

		if (js.containsKey("name")) {
			root.setAttribute("name", js.getString("name"));
		}
		if (js.containsKey("author")) {
			root.setAttribute("author", js.getString("author"));
		}
		if (js.containsKey("contact")) {
			root.setAttribute("contact", js.getString("contact"));
		}
		if (js.containsKey("email")) {
			root.setAttribute("email", js.getString("email"));
		}
		if (js.containsKey("phone")) {
			root.setAttribute("phone", js.getString("phone"));
		}
		if (js.containsKey("address")) {
			root.setAttribute("address", js.getString("address"));
		}
		if (js.containsKey("date")) {
			root.setAttribute("date", js.getString("date"));
		}
		if (js.containsKey("text")) {
			root.setAttribute("text", js.getString("text"));
		}

		// // 处理其他属性
		// Iterator<String> it = js.keys();
		// while (it.hasNext()) {
		// String key = it.next();
		// String value = js.getString(key);
		// if (!key.equals("room") && !key.equals("height") &&
		// !key.equals("width") && !key.equals("svgData")
		// && !key.equals("itemInfo")) {
		// root.setAttribute(key, value);
		// }
		// }

		// 处理itemInfo属性，如果没有就传null
		JSONObject itemInfo = null;
		if (js.containsKey("itemInfo")) {
			itemInfo = js.getJSONObject("itemInfo");
		}

		// 读取room数组
		pp.readJsonArrayToEle(root, jaRoom, itemInfo);
		// 处理最外围的svgData
		if (js.containsKey("svgData")) {
			JSONObject svgData = js.getJSONObject("svgData");
			Element e = doc.createElementNS(svgNS, svgData.getString("name"));
			JSONObject attrs = svgData.getJSONObject("attrs");
			// 加属性
			SvgParseUtil.addAttrs(attrs, e, externalFilePath);
			root.appendChild(e);
		}

		return doc;

	}

	public static void trans2png(String jsonPath, String externalFilePath, String extDirName, String pngPath,
			String height, String width) {
		trans(jsonPath, externalFilePath, extDirName, height, width);
	}

	public static String trans2String(String jsonPath, String externalFilePath, String extDirName)
			throws TransformerException, IOException {
		Document doc = JsonOp.trans(jsonPath, externalFilePath, extDirName);
		return SvgUtil.svgToString(doc);
	}

	public static void main(String[] args) throws TransformerException, IOException {
		Document doc = JsonOp.trans("E:/svg/svg20160124.txt", "E:/svg/", "/extJson/");
		SvgUtil.printSvg(doc);
		SvgUtil.outputSvgDocToPng(doc, "E:/svg/png0203.png");
	}

}
