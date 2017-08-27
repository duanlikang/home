package com.outstudio.plan.op.svg;

import java.io.File;
import java.io.IOException;
import java.util.Iterator;

import net.sf.json.JSONObject;

import org.apache.batik.anim.dom.SVGDOMImplementation;
import org.apache.commons.io.FileUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

public class SvgParseUtil {

	public static final String svgNS = SVGDOMImplementation.SVG_NAMESPACE_URI;

	/**
	 * 处理data-style=="sub"属性，将extJs替换掉attrJs里的内容
	 * 
	 * @param attrJs
	 * @param ele
	 * @param externalFilePath
	 * @param extJs
	 * @param imageIsRollover
	 *            设置图片是否翻转
	 * 
	 */
	public static void addAttrs(JSONObject attrJs, Element ele, String externalFilePath, JSONObject svgData,
			boolean imageIsRollover) {

		// 加属性
		Iterator<String> it = attrJs.keys();
		while (it.hasNext()) {
			String key = it.next();
			String value = attrJs.getString(key);
			if (key.equals("xlink:href")) {
				value = externalFilePath + value;
				// 如果翻转，则将value.的前方加t
				if (imageIsRollover) {
					value = value.substring(0, value.lastIndexOf(".")) + "t" + value.substring(value.lastIndexOf("."));
				}
				System.out.println("Finding [" + value + "],imageIsRollover=" + imageIsRollover);
				File file = new File(value);
				value = file.toURI().toString();
				String xlink = "http://www.w3.org/1999/xlink";
				if (attrJs.containsKey("xmlns:xlink")) {
					xlink = attrJs.getString("xmlns:xlink");
				}
				if (!ele.hasAttribute(key)) {// 如果已经写入此属性，那么便不会再次写入
					ele.setAttributeNS(xlink, key, value);
				}
			} else if (key.equals("data-style") && svgData != null) {// 处理data-style=“sub”的情况
				if (value.equals("sub") && !svgData.isEmpty()) {
					JSONObject extJs = null;
					try {
						extJs = svgData.getJSONArray("child").getJSONObject(0).getJSONObject("svgData");
						if (extJs.getString("name").equals("g")) {
							// System.out.println("extJs:" + extJs.toString());
							// 把extAttrs加上

							String addTransform = extJs.getJSONObject("attrs").getString("transform");
							System.out.println("addTransform=" + addTransform);
							if (ele.hasAttribute("transform")) {
								String transform = ele.getAttribute("transform");
								// System.out.println("transform=" + transform);
								if (addTransform.matches("rotate(.+)")) {
									int start = transform.indexOf("rotate(");
									int end = transform.indexOf(")", start);
									// System.out.println("start=" + start +
									// ",end=" + end);
									transform = transform.substring(0, start).trim() + " " + addTransform.trim() + " "
											+ transform.substring(end + 1);
								}
								// System.out.println("transform=" + transform);
								ele.setAttributeNS(null, "transform", transform);
							}
							// addAttrs(extJs, ele, externalFilePath, true);
						}
					} catch (Exception e) {
						// 如果找不到这个值，那么便不处理，使用默认情况。
						e.printStackTrace();
					}
				}
			} else {
				if (!ele.hasAttribute(key)) {// 如果已经写入此属性，那么便不会再次写入
					ele.setAttributeNS(null, key, value);
				}
			}

		}
	}

	/**
	 * parse attrs from attrJs and add them on ele
	 * 
	 * @param attrJs
	 * @param ele
	 * @param externalFilePath
	 */

	public static void addAttrs(JSONObject attrJs, Element ele, String externalFilePath) {
		addAttrs(attrJs, ele, externalFilePath, false);
	}

	public static void addAttrs(JSONObject attrJs, Element ele, String externalFilePath, boolean isCover) {

		// 加属性
		Iterator<String> it = attrJs.keys();
		while (it.hasNext()) {
			String key = it.next();
			String value = attrJs.getString(key);
			if (key.equals("xlink:href")) {
				value = externalFilePath + value;
				System.out.println("Finding [" + value + "]. ");
				File file = new File(value);
				value = file.toURI().toString();
				String xlink = "http://www.w3.org/1999/xlink";
				if (attrJs.containsKey("xmlns:xlink")) {
					xlink = attrJs.getString("xmlns:xlink");
				}
				if (!ele.hasAttribute(key) || isCover)// 如果已经写入此属性，那么便不会再次写入
					ele.setAttributeNS(xlink, key, value);
			} else {
				if (!ele.hasAttribute(key) || isCover)// 如果已经写入此属性，那么便不会再次写入
					ele.setAttributeNS(null, key, value);
			}
		}
	}

	/**
	 * 读取指定文件位置的json，失败则返回null
	 * 
	 * @param fpath
	 * @return
	 */
	public static JSONObject readJson(String fpath) {
		JSONObject js = JSONObject.fromObject(readJsonFileToString(fpath));
		return js;
	}

	/**
	 * 读取指定位置的json数据，失败则返回null
	 * 
	 * @param fpath
	 * @return
	 */
	public static String readJsonFileToString(String fpath) {
		String data = null;

		try {
			data = FileUtils.readFileToString(new File(fpath), "GBK");
			// 确定其为json
			if (!data.trim().startsWith("{")) {
				data = "{" + data + "}";
			}
			data = data.replaceAll("\\s", " ");
			data = data.replaceAll("\\s+", " ");
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
		return data;
	}

	/**
	 * 处理svgData，返回处理完成后的svgData
	 * 
	 * @param svgData
	 * @return
	 */
	public static Element parseSvgData(Document doc, JSONObject svgData) {
		// 为标签取名
		Element ele = doc.createElementNS(svgNS, svgData.getString("name"));
		JSONObject attrJs = svgData.getJSONObject("attrs");
		// 加属性
		Iterator<String> it = attrJs.keys();
		while (it.hasNext()) {
			String key = it.next();
			String value = attrJs.getString(key);
			ele.setAttributeNS(null, key, value);
		}

		return ele;
	}

}
