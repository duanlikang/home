package com.outstudio.plan.op.svg;

import java.util.Iterator;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.batik.anim.dom.SVGDOMImplementation;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

//解析主json的类。
public class PrimaryJsonPaser {

	public static final String svgNS = SVGDOMImplementation.SVG_NAMESPACE_URI;

	/**
	 * 默认"/extJson/"
	 */
	private static String extDirName = "/extJson/";

	/**
	 * 外部引入img的路径
	 */
	private static String imgPath = null;

	private String filePath = null;

	public static Document doc = null;

	public PrimaryJsonPaser() {
	}

	/**
	 * 引入额外文件的文件夹位置
	 * 
	 * @param extPath
	 */
	public PrimaryJsonPaser(String extPath) {
		this.setFilePath(extPath);
	}

	/**
	 * 递归解析jsonArray,（默认是从room开始）
	 * 
	 * 修改itemInfo的处理方式。
	 * 
	 * @param ja
	 * @return
	 */
	public void readJsonArrayToEle(Element father, JSONArray ja, JSONObject itemInfo) {

		// 解析room数组
		for (int i = 0; i < ja.size(); i++) {
			// 每个room不为空的时候
			JSONObject jsRoom = ja.getJSONObject(i);
			// 放弃这种做法。前端修改
			// 每个room后面都有一个itemInfo储存item的信息
			// if (jsRoom.containsKey("itemInfo")) {
			// itemInfo = jsRoom.getJSONObject("itemInfo");
			// }

			if (null != jsRoom && !"null".equals(jsRoom.toString())) {
				// 每个svgData是一个标签
				JSONObject svgData = jsRoom.getJSONObject("svgData");
				// 为标签取名
				Element ele = doc.createElementNS(svgNS, svgData.getString("name"));
				// 如果是text，是否需要setContent
				if (svgData.getString("name").equals("text")) {
					if (svgData.containsKey("textContent")) {
						ele.setTextContent(svgData.getString("textContent"));
					}
				}
				// 加属性
				if (svgData.containsKey("attrs")) {
					JSONObject attrJs = svgData.getJSONObject("attrs");
					SvgParseUtil.addAttrs(attrJs, ele, filePath);
				}
				// 如果需要加外部元素
				if (svgData.containsKey("unique")) {
					addExternalEle(ele, svgData.getString("unique"), svgData);
					// 存在unique，则查看是否存在itemInfo
					// 处理item
					if (null != itemInfo) {
						String item_real = ele.getAttribute("item-real");
						if (itemInfo.containsKey(item_real)) {
							JSONObject item = itemInfo.getJSONObject(item_real);
							if (item.containsKey("itemName")) {
								ele.setAttribute("itemName", item.getString("itemName"));
							}
							if (item.containsKey("price")) {
								ele.setAttribute("price", item.getString("price"));
							}
							if (item.containsKey("text")) {
								ele.setAttribute("text", item.getString("text"));
							}
							if (item.containsKey("img")) {
								if (!item.getString("img").equals("")) {
									ele.setAttribute("img", imgPath + item.getString("img"));
								}
							}
							if (item.containsKey("imgWidth")) {
								ele.setAttribute("imgWidth", item.getString("imgWidth"));
							}
							if (item.containsKey("imgHeight")) {
								ele.setAttribute("imgHeight", item.getString("imgHeight"));
							}
						}
					}
				}

				// 如果有child子元素
				if (svgData.containsKey("child")) {
					readJsonArrayToEle(ele, svgData.getJSONArray("child"), itemInfo);
				}

				/**** svgData处理结束 ********************/
				// 如果有child子元素
				if (jsRoom.containsKey("child")) {
					readJsonArrayToEle(ele, jsRoom.getJSONArray("child"), itemInfo);
				}

				// ele.setAttribute("preserveAspectRatio", "none");

				father.appendChild(ele);

			}// end if
		}// end for

	}

	/**
	 * 处理svgData，返回处理完成后的svgData
	 * 
	 * @param svgData
	 * @return
	 */
	public Element parseSvgData(JSONObject svgData) {
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

	/**
	 * 得到svg标签
	 * 
	 * @return
	 */
	public Document initSvgDocument() {
		SVGDOMImplementation dom = new SVGDOMImplementation();
		doc = dom.createDocument(svgNS, "svg", null);
		return doc;
	}

	/**
	 * 根据名字获取外部独立的元素, 只得到其中有用的child元素
	 * 
	 * @param name
	 * @return
	 */
	public Element getExternalEle(String name) {

		SecondaryJsonParser s = new SecondaryJsonParser();

		// 检查导入的name是否以t结尾，椅子630x620t.txt，若是则说明图片需要翻转
		boolean imageIsRollover = false;
		if (name.endsWith("t")) {
			imageIsRollover = true;
			name = name.substring(name.length() - 1);
		}

		JSONObject js = SvgParseUtil.readJson(filePath + name + ".txt");

		Element ele = s.parseSecJsonToElement(doc, js.getJSONObject("svgData"), null, filePath, imageIsRollover);

		return ele;
	}

	/**
	 * 以name为文件名寻找所需的外部svg文件，并将json内的内容赋值进来， 将其作为子标签赋给ele
	 * 
	 * @param ele
	 * @param name
	 */
	public void addExternalEle(Element ele, String name) {
		addExternalEle(ele, name, null);
	}

	/**
	 * 用extJs动态替换外部文件中的数据
	 * 
	 * @param ele
	 * @param name
	 * @param extJs
	 *            动态修改的json,json外部为svgData
	 */
	public void addExternalEle(Element ele, String name, JSONObject svgData) {
		SecondaryJsonParser s = new SecondaryJsonParser();

		String jsonPath = null;
		try {
			if (!filePath.endsWith("/") && !filePath.endsWith("\\")) {
				jsonPath = filePath + extDirName;
			} else {
				jsonPath = filePath + extDirName.substring(1);
			}

			// 检查导入的name是否以t结尾，椅子630x620t.txt，若是则说明图片需要翻转
			boolean imageIsRollover = false;
			if (name.endsWith("t")) {
				imageIsRollover = true;
				name = name.substring(0, name.length() - 1);
			}
			System.out.println("Extrenal　File　Name=[" + name + "],imageIsRollover=" + imageIsRollover);
			JSONObject js = SvgParseUtil.readJson(jsonPath + name + ".txt");

			// 添加child
			JSONObject js1 = js.getJSONObject(name);
			if (js1 == null) {
				js1 = js.getJSONObject((String) js.keys().next());
			}
			JSONArray ja = js1.getJSONArray("child");

			// 添加属性
			JSONObject attrs = js1.getJSONObject("attrs");
			if (attrs != null && !attrs.isNullObject()) {
				SvgParseUtil.addAttrs(attrs, ele, filePath, svgData, imageIsRollover);
			}

			s.addElementFromSecJSONArray(doc, ele, ja, filePath, svgData, imageIsRollover);
			System.out.println("Find " + jsonPath + name + ".txt" + " succees.");
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("Find " + jsonPath + name + ".txt" + " failed.");
		}
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		if (!filePath.endsWith("\\") && !filePath.endsWith("/")) {
			filePath += "/";
		}
		this.filePath = filePath;
	}

	public static String getExtDirName() {
		return extDirName;
	}

	public static void setExtDirName(String extDirName) {
		PrimaryJsonPaser.extDirName = extDirName;
	}

	public static String getImgPath() {
		return imgPath;
	}

	public static void setImgPath(String imgPath) {
		PrimaryJsonPaser.imgPath = imgPath;
	}

}
