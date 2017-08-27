package com.outstudio.plan.op.svg;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.batik.anim.dom.SVGDOMImplementation;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

public class SecondaryJsonParser {

	public static final String svgNS = SVGDOMImplementation.SVG_NAMESPACE_URI;

	/**
	 * 获取固定格式的次要元素
	 * 
	 * @param doc
	 * @param js
	 * @return
	 */
	public Element parseSecJsonToElement(Document doc, JSONObject js, JSONObject itemInfo, String externalFilePath,
			boolean imageIsRollover) {

		Element svgEle = SvgParseUtil.parseSvgData(doc, js.getJSONObject("svgData"));

		JSONArray ja = js.getJSONArray("child");

		parseJsonToEleFromChilds(doc, svgEle, ja, externalFilePath, null, imageIsRollover);

		return svgEle;
	}

	/**
	 * 将ja作为子标签添加到ele
	 * 
	 * @param doc
	 * @param ele
	 * @param ja
	 */
	public void addElementFromSecJSONArray(Document doc, Element ele, JSONArray ja, String extPath,
			boolean imageIsRollover) {
		parseJsonToEleFromChilds(doc, ele, ja, extPath, null, imageIsRollover);
	}

	/**
	 * 
	 * @param doc
	 * @param ele
	 * @param ja
	 * @param extPath
	 * @param extJs
	 *            处理"data-style": "sub"
	 */
	public void addElementFromSecJSONArray(Document doc, Element ele, JSONArray ja, String extPath, JSONObject extJs,
			boolean imageIsRollover) {
		parseJsonToEleFromChilds(doc, ele, ja, extPath, extJs, imageIsRollover);
	}

	/**
	 * 递归形式遍历child标签内的元素
	 * 
	 * @param doc
	 * @param svgEle
	 * @param ja
	 */
	private void parseJsonToEleFromChilds(Document doc, Element svgEle, JSONArray ja, String extPath, JSONObject extJs,
			boolean imageIsRollover) {

		for (int i = 0; i < ja.size(); i++) {
			// 处理单个的child
			JSONObject child = ja.getJSONObject(i);
			Element e = doc.createElementNS(svgNS, child.getString("name"));
			// 加属性
			JSONObject attrs = child.getJSONObject("attrs");
			SvgParseUtil.addAttrs(attrs, e, extPath, extJs, imageIsRollover);
			// 如果还有子元素
			if (child.containsKey("child")) {
				JSONArray childJa = child.getJSONArray("child");
				parseJsonToEleFromChilds(doc, e, childJa, extPath, extJs, imageIsRollover);
			}

			svgEle.appendChild(e);
		}
	}

}
