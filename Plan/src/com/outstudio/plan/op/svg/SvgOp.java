package com.outstudio.plan.op.svg;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.xml.transform.TransformerException;

import org.apache.batik.anim.dom.SVGDOMImplementation;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.outstudio.plan.op.pdf.model.Furniture;
import com.outstudio.plan.op.pdf.model.HomePage;
import com.outstudio.plan.op.pdf.model.Room;
import com.outstudio.plan.util.MathUtil;

/**
 * 将doc中内容提取为pdf的页对象
 * 
 * @author 沧
 * 
 */
public class SvgOp {

	public static final String svgNS = SVGDOMImplementation.SVG_NAMESPACE_URI;

	private String tempPath;

	public SvgOp(String tempPath) {
		if (!tempPath.endsWith("\\") && !tempPath.endsWith("/")) {
			tempPath += "/";
		}
		this.tempPath = tempPath;
		File fp = new File(tempPath);
		if (!fp.exists()) {
			fp.mkdirs();
			System.out.println(fp.getAbsolutePath());
		}
	}

	public HomePage getHomePage(Document doc) {
		HomePage hp = new HomePage();

		hp.setBiaoti("总览");
		// hp.setDescription("俯瞰缩略图");

		String hpPath = tempPath + "homePage.png";

		float[] size = getHomePageSize(doc);
		float[] location = getTranslate(doc);

		Element root = doc.getDocumentElement();
		root.setAttribute("width", size[0] + location[0] + 20 + "");
		root.setAttribute("height", size[1] + location[1] + 20 + "");

		// System.out.println("size:" + size[0] + "*" + size[1]);
		// System.out.println("location:" + location[0] + "*" + location[1]);
		System.out.println("svg size:" + (size[0] + location[0]) + "*" + (size[1] + location[1]));

		// 生成主页总览图
		boolean flag = SvgUtil.outputSvgDocToPng(doc, hpPath);

		if (flag) {
			hp.setImage(hpPath);
		}

		if (root.hasAttribute("name")) {
			hp.setName(root.getAttribute("name"));
		}
		if (root.hasAttribute("author")) {
			hp.setAuthor(root.getAttribute("author"));
		}
		if (root.hasAttribute("contact")) {
			hp.setContact(root.getAttribute("contact"));
		}
		if (root.hasAttribute("email")) {
			hp.setEmail(root.getAttribute("email"));
		}
		if (root.hasAttribute("phone")) {
			hp.setPhone(root.getAttribute("phone"));
		}
		if (root.hasAttribute("address")) {
			hp.setAddress(root.getAttribute("address"));
		}
		if (root.hasAttribute("text")) {
			hp.setText(root.getAttribute("text"));
		}

		return hp;
	}

	/**
	 * 解析room
	 * 
	 * @param doc
	 * @return
	 */
	public List<Room> getRoom(Document doc) {
		Element root = doc.getDocumentElement();
		List<Room> rooms = new ArrayList<>();

		NodeList childList = root.getChildNodes();

		if (childList.getLength() == 0) {
			return null;
		}

		for (int i = 0; i < childList.getLength(); i++) {
			Node roomNode = childList.item(i);
			if (!roomNode.hasAttributes()) {
				continue;
			}
			NamedNodeMap nnm = roomNode.getAttributes();

			// 用uniqueId确定是否是room
			Node uniqueId = nnm.getNamedItem("uniqueId");
			if (uniqueId == null) {
				continue;
			}

			// 获取id
			Room room = new Room();
			Node id = nnm.getNamedItem("id");
			room.setId(id.getNodeValue());
			// 获取name
			Node roomName = nnm.getNamedItem("name");
			if (null != roomName) {
				room.setName(roomName.getNodeValue());
			} else {
				room.setName("房间" + (i + 1));
			}
			// 获取data
			Map<String, String> data = getRoomDetail(roomNode);
			room.setData(data);
			// 获取furns
			List<Furniture> furns = getFurniture(roomNode);
			room.setFurns(furns);
			// 计算totalPrice
			float totalPrice = 0;
			for (Furniture f : furns) {
				if (0 != f.getPrice()) {
					totalPrice += f.getPrice() * f.getNumber();
				}
			}
			room.setFurnsTotalPrice(totalPrice);
			// 添加单个房间png
			String roomImagePath = tempPath + "rooms-" + id.getNodeValue()
					+ (System.currentTimeMillis() + "").substring(6) + ".png";
			try {
				createRoomNodePng(roomNode, roomImagePath);
			} catch (Exception e) {
				roomImagePath = null;
				e.printStackTrace();
			}
			room.setImage(roomImagePath);
			// 添加房间总体缩略图
			String thumbnailPath = tempPath + "roomThumbnail-" + id.getNodeValue()
					+ (System.currentTimeMillis() + "").substring(6) + ".png";
			try {
				createRoomThumbnail(doc, id.getNodeValue(), thumbnailPath);
			} catch (Exception e) {
				thumbnailPath = null;
				e.printStackTrace();
			}
			room.setThumbnail(thumbnailPath);

			rooms.add(room);
		}

		return rooms;
	}

	/**
	 * 在getRoom中使用，获取每个房间内的家具信息
	 * 
	 * @param roomNode
	 * @return
	 */
	private List<Furniture> getFurniture(Node roomNode) {
		List<Furniture> furns = new ArrayList<>();
		NodeList childList = roomNode.getChildNodes();
		for (int i = 0; i < childList.getLength(); i++) {
			Node childNode = childList.item(i);

			// 如果不是家具标签，跳过
			NamedNodeMap cnnm = childNode.getAttributes();
			Node uniqueItem = cnnm.getNamedItem("item-unique");
			if (uniqueItem == null) {
				continue;
			}
			// 判断是否是摆设deskitem，其他other，隔断wall，墙柱wallcolumn，是的话则不进行操作
			if (uniqueItem.getNodeValue().contains("deskitem_")) {
				continue;
			} else if (uniqueItem.getNodeValue().contains("other_")) {
				continue;
			} else if (uniqueItem.getNodeValue().contains("wallcolumn_")) {
				continue;
			} else if (uniqueItem.getNodeValue().contains("wall_")) {
				continue;
			}

			// isVertical,用该属性判断是否为门窗，是的话则不进行操作。
			Node isVertical = cnnm.getNamedItem("isVertical");
			if (isVertical != null) {
				continue;
			}

			// 确认list中无重复元素
			boolean flag = false;
			for (Furniture f : furns) {
				if (uniqueItem.getNodeValue().equals(f.getItem_unique())) {
					flag = true;
					f.addNumber();// 让number的数量加1
					break;
				}
			}
			if (flag) {
				continue;
			}

			Furniture furn = new Furniture();
			// 找出id
			Node uniqueId = cnnm.getNamedItem("id");
			if (uniqueId != null) {
				furn.setId(uniqueId.getNodeValue());
			}

			furn.setId(uniqueId.getNodeValue());
			// name
			Node realName = cnnm.getNamedItem("item-real");
			if (realName != null) {
				furn.setName(realName.getNodeValue());
			} else {
				Node name = cnnm.getNamedItem("itemName");
				if (name != null) {
					furn.setName(name.getNodeValue());
				}
			}
			// text
			Node text = cnnm.getNamedItem("text");
			if (text != null) {
				furn.setText(text.getNodeValue());
			}
			// price
			Node price = cnnm.getNamedItem("price");
			if (price != null) {
				furn.setPrice(Float.parseFloat(price.getNodeValue().isEmpty() ? "0" : price.getNodeValue()));
			}
			// imgWidth
			Node imgWidth = cnnm.getNamedItem("imgWidth");
			if (imgWidth != null) {
				furn.setImgWidth(imgWidth.getNodeValue());
			}
			// imgHeight
			Node imgHeight = cnnm.getNamedItem("imgHeight");
			if (imgHeight != null) {
				furn.setImgHeight(imgHeight.getNodeValue());
			}
			// img
			Node img = cnnm.getNamedItem("img");
			if (img != null) {
				File f = new File(img.getNodeValue());
				if (f.exists()) {
					furn.setImage(img.getNodeValue());
				} else {
					System.out.println(img.getNodeValue() + " doesn't exist.");
					furn.setImage(null);
				}
			}
			// 添加uniqueItem
			furn.setItem_unique(uniqueItem.getNodeValue());
			// 生成的家具的png
			String uniqueFurnPath = tempPath + "furns-" + uniqueItem.getNodeValue()
					+ (System.currentTimeMillis() + "").substring(6) + ".png";
			try {
				createFurnNodePng(childNode, uniqueFurnPath);
			} catch (Exception e) {
				uniqueFurnPath = null;
				e.printStackTrace();
			}
			furn.setIcon(uniqueFurnPath);

			furns.add(furn);
		}

		return furns;
	}

	/**
	 * 返回主页png应该设置的png宽高，size[0]为宽，size[1]为高 从各个polygen中获取
	 * 
	 * @param doc
	 * @return
	 */
	private float[] getHomePageSize(Document doc) {
		float maxx = 0;
		float maxy = 0;

		Element root = doc.getDocumentElement();

		NodeList childs = root.getChildNodes();
		for (int i = 0; i < childs.getLength(); i++) {
			Element child = (Element) childs.item(i).cloneNode(true);
			if (!"g".equals(child.getNodeName())) {
				continue;
			}
			// 处理transform，得到xy坐标...用translate中的数值和scale相乘
			String transform = child.getAttribute("transform");
			float iscale = 1;
			if (transform.indexOf("scale(") != -1) {
				String scale = transform.substring(transform.indexOf("scale(") + 6);
				scale = scale.substring(0, scale.indexOf(")"));
				iscale = Float.parseFloat(scale);
			}
			// 得到translate中的坐标
			transform = transform.substring(transform.indexOf("translate(") + 10);
			transform = transform.substring(0, transform.indexOf(")"));
			String[] location = transform.trim().split(",");
			float locationx = Float.parseFloat(location[0]) * iscale;
			float locationy = Float.parseFloat(location[1]) * iscale;
			// 得到polygon
			NodeList nodes = child.getChildNodes();
			for (int k = 0; k < nodes.getLength(); k++) {
				Node node = nodes.item(k);
				if (node.getNodeName().equals("polygon")) {
					float hmax = 0;
					float wmax = 0;
					NamedNodeMap nnm = node.getAttributes();
					Node pointsNode = nnm.getNamedItem("points");
					String pointsValue = pointsNode.getNodeValue();
					pointsValue = pointsValue.replaceAll("\\s*,\\s*", ",");
					String[] points = pointsValue.trim().split("\\s");
					for (int j = 0; j < points.length; j++) {
						String[] point = points[j].split(",");
						float px = Float.parseFloat(point[0]);
						float py = Float.parseFloat(point[1]);
						hmax = Math.max(hmax, py + locationy);
						wmax = Math.max(wmax, px + locationx);
					}
					// 将最大宽高赋值
					maxx = Math.max(maxx, wmax);
					maxy = Math.max(maxy, hmax);

					break;
				}// end if
			}// end for k
		}// end for i

		return new float[] { maxx, maxy };
	}

	/**
	 * 生成每个room的缩略图png
	 * 
	 * @param roomNode
	 */
	public void createRoomThumbnail(Document doc, String roomId, String fpath) {
		SVGDOMImplementation dom = new SVGDOMImplementation();
		Document document = dom.createDocument(dom.SVG_NAMESPACE_URI, "svg", null);
		Element root = document.getDocumentElement();

		Element r = doc.getDocumentElement();
		// 若有width和height，添加属性
		if (r.hasAttribute("width") && r.hasAttribute("height")) {
			root.setAttribute("width", r.getAttribute("width"));
			root.setAttribute("height", r.getAttribute("height"));
		}

		NodeList childs = r.getChildNodes();
		for (int i = 0; i < childs.getLength(); i++) {
			Element child = (Element) childs.item(i);
			Node imp = document.importNode(child, true);
			// 若是同一房间，不做修改
			if (roomId.equals(child.getAttribute("id"))) {
				root.appendChild(imp);
			} else {
				NodeList nodes = imp.getChildNodes();
				for (int j = 0; j < nodes.getLength(); j++) {
					Element n = (Element) nodes.item(j);
					if (n.hasAttribute("fill")) {
						n.removeAttribute("fill");
						n.setAttribute("fill", "#ffffff");
					}
					if (n.hasAttribute("stroke")) {
						n.removeAttribute("stroke");
						n.setAttribute("stroke", "grey");
					}
					if (n.hasAttribute("stroke-opacity")) {
						n.removeAttribute("stroke-opacity");
						n.setAttribute("stroke-opacity", "0.2");
					}
					// 若还有子节点,删除掉
					if (n.hasChildNodes()) {
						NodeList cns = n.getChildNodes();
						for (int k = 0; k < cns.getLength(); k++) {
							Node cn = cns.item(k);
							n.removeChild(cn);
						}
					}
				}
				root.appendChild(imp);
			}// end else
		}// end for

		SvgUtil.outputSvgDocToPng(document, fpath);

	}

	/**
	 * 得到房间的具体信息
	 * 
	 * @param roomNode
	 * @return
	 */
	private Map<String, String> getRoomDetail(Node roomNode) {
		/** 使用LinkedHashMap来确保放入map中的内容取出时会顺序取出。 */
		Map<String, String> map = new LinkedHashMap<String, String>();

		// 得到points,不一定几个顶点
		// 此处polygen中的points的顺序是依次连起来的，所以顺序必须不能变
		float[][] points = null;
		NodeList childs = roomNode.getChildNodes();
		for (int i = 0; i < childs.getLength(); i++) {
			Element child = (Element) childs.item(i);
			if ("polygon".equals(child.getNodeName())) {
				String pointsAttr = child.getAttribute("points");
				pointsAttr = pointsAttr.replaceAll("\\s*,\\s*", ",");
				String[] points4 = pointsAttr.trim().split("\\s");
				// 根据points4初始化数组
				points = new float[points4.length][2];
				for (int j = 0; j < points4.length; j++) {
					String[] point1 = points4[j].split(",");
					/** 除以100是因为point是以厘米为单位，要转化成米 */
					points[j][0] = Float.parseFloat(point1[0]) / 100;
					points[j][1] = Float.parseFloat(point1[1]) / 100;
				}
			}
		}
		// 根据4个顶点计算
		float max = 0;
		float min = 0;
		// 长度
		float length = 0;
		for (int i = 0; i < points.length; i++) {
			max = Math.max(max, points[i][0]);
			min = Math.min(min, points[i][0]);
		}
		length = Math.abs(max - min);
		map.put("长度", MathUtil.format(length) + "米");
		// 宽度
		float width = 0;
		max = 0;
		min = 0;
		for (int i = 0; i < points.length; i++) {
			max = Math.max(max, points[i][1]);
			min = Math.min(min, points[i][1]);
		}
		width = Math.abs(max - min);
		map.put("宽度", MathUtil.format(width) + "米");
		// 周长
		float surrounding = MathUtil.getSurroundingLength(points);
		map.put("周边", MathUtil.format(surrounding) + "米");
		// 面积
		float area = MathUtil.getArea(points);
		map.put("面积", MathUtil.format(area) + "平方米");

		return map;
	}

	/**
	 * 生成每个家具的png。
	 * 
	 * 再次更改，根据情况动态改变transform。之前如果已有transform，只改变translate，而不改变其他属性。 TODO
	 * 测试完善中。。。
	 * 
	 * @param childNode
	 * @param fpath
	 */
	public void createFurnNodePng(Node childNode, String fpath) {
		SVGDOMImplementation dom = new SVGDOMImplementation();
		Document doc = dom.createDocument(dom.SVG_NAMESPACE_URI, "svg", null);
		Element root = doc.getDocumentElement();
		Element impNode = (Element) doc.importNode(childNode, true);

		// 处理使用path的svg的情况，获取path中的最大值
		// 例：<path fill="#f0f0f0"
		// d="M80,14A 90 90, 0, 0, 1, 160 -80L 160 14"
		// stroke-width="1" stroke="rgb(128,128,128)" />
		// double max = getMaxInPathAttr(childNode);
		double max = 0;
		System.out.println("max is " + max);
		// 为避免意外，默认不让其大于1000
		if (max < 0 || max > 1000) {
			max = 0;
		}

		if (impNode.hasAttribute("transform")) {
			String tra = impNode.getAttribute("transform");
			tra = tra.replaceAll("translate(\\S+,\\S+)", "translate(" + (25 + max / 2) + "," + (25 + max / 2) + ")");
			// 去掉rotate属性
			if (tra.contains("rotate")) {
				tra = removeRotate(tra);
			}
			impNode.setAttribute("transform", tra);
		} else {
			impNode.setAttribute("transform", "translate(" + (25 + max / 2) + "," + (25 + max / 2) + ")");
		}
		if (impNode.hasAttribute("width") && impNode.hasAttribute("height")) {
			root.setAttribute("height", Double.parseDouble(impNode.getAttribute("height")) + (40 + max) + "");
			root.setAttribute("width", Double.parseDouble(impNode.getAttribute("width")) + (40 + max) + "");
		}

		root.appendChild(impNode);
		SvgUtil.outputSvgDocToPng(doc, fpath);
	}

	/**
	 * 去掉rotate的标签
	 */
	private String removeRotate(String tra) {
		String[] temp = tra.split("rotate");
		String t = temp[1];
		int end = t.indexOf(")");
		t = t.substring(end + 1);
		tra = temp[0] + t;
		// System.out.println("tra=" + tra);
		return tra;
	}

	/**
	 * 得到node中的path路径中的最大值,采用暴力的方式，使用String猜测
	 * 
	 * @param childNode
	 * @return
	 */
	private double getMaxInPathAttr(Node childNode) {

		double max = 0.0;

		SVGDOMImplementation dom = new SVGDOMImplementation();
		Document doc = dom.createDocument(dom.SVG_NAMESPACE_URI, "svg", null);
		Element root = doc.getDocumentElement();
		Element impNode = (Element) doc.importNode(childNode, true);
		root.appendChild(impNode);

		String svg = null;
		try {
			svg = SvgUtil.svgToString(doc);
			// System.out.println("[furn-svg]:" + svg);
		} catch (TransformerException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

		if (svg == null) {
			return 0;
		}

		int start = -1;
		int end = -1;
		List<String> ds = new ArrayList<>();
		while (svg.contains(" d=\"")) {
			start = svg.indexOf(" d=\"");
			svg = svg.substring(start + 4);
			end = svg.indexOf("\"");
			ds.add(svg.substring(1, end));
			svg = svg.substring(end);
		}

		for (String d : ds) {
			d = d.replaceAll("[a-zA-z]", "");
			String[] numbers = d.split(",| ");
			for (String i : numbers) {
				try {
					double n = Double.parseDouble(i);
					max = n > max ? n : max;
				} catch (NumberFormatException e) {
					continue;
				}
			}
		}

		return max;
	}

	/**
	 * 生成每个room的png
	 */
	private void createRoomNodePng(Node childNode, String fpath) {
		SVGDOMImplementation dom = new SVGDOMImplementation();
		Document doc = dom.createDocument(dom.SVG_NAMESPACE_URI, "svg", null);
		Element root = doc.getDocumentElement();
		Element impNode = (Element) doc.importNode(childNode, true);

		if (impNode.hasAttribute("width") && impNode.hasAttribute("height")) {
			root.setAttribute("height", impNode.getAttribute("height"));
			root.setAttribute("width", impNode.getAttribute("width"));
		}

		NodeList childs = impNode.getChildNodes();
		for (int i = 0; i < childs.getLength(); i++) {
			Node node = childs.item(i);
			if (node.getNodeName().equals("polygon")) {
				float hmax = 0;
				float wmax = 0;
				float hmin = 0;
				float wmin = 0;
				NamedNodeMap nnm = node.getAttributes();
				Node pointsNode = nnm.getNamedItem("points");
				String pointsValue = pointsNode.getNodeValue();
				pointsValue = pointsValue.replaceAll("\\s*,\\s*", ",");
				String[] points = pointsValue.trim().split("\\s");
				for (int j = 0; j < points.length; j++) {
					String[] point = points[j].split(",");
					float px = Float.parseFloat(point[0]);
					float py = Float.parseFloat(point[1]);
					hmax = Math.max(hmax, py);
					hmin = Math.min(hmin, py);
					wmax = Math.max(wmax, px);
					wmin = Math.min(wmin, px);
				}

				System.out.println("wmin:" + wmin + ",hmin:" + hmin);
				// 处理transform，得到xy坐标...用translate中的数值和scale相乘
				String transform = impNode.getAttribute("transform");
				float iscale = 1;
				if (transform.indexOf("scale(") != -1 && !transform.equals("null") && transform != null) {
					String scale = transform.substring(transform.indexOf("scale(") + 6);
					scale = scale.substring(0, scale.indexOf(")"));
					iscale = Float.parseFloat(scale);
				}

				impNode.removeAttribute("transform");
				impNode.setAttribute("transform", "translate(" + (-wmin * iscale + 100) + "," + (-hmin * iscale + 100)
						+ ")");

				root.setAttribute("height", Math.abs(hmax - hmin) + 200 + "");
				root.setAttribute("width", Math.abs(wmax - wmin) + 200 + "");
				break;
			}
		}

		root.appendChild(impNode);
		SvgUtil.outputSvgDocToPng(doc, fpath);
	}

	// /**
	// * 得到room的polygen中的点的坐标最小值，得出最终的初始坐标系位置.(即最小值组成的坐标)
	// *
	// * @param room
	// * @return
	// */
	// private float[] getInitLocation(Node room) {
	//
	// }

	/**
	 * 得到svg第一个room的transform的translate的xy坐标
	 * 
	 * @param doc
	 * @return
	 */
	private static float[] getTranslate(Document doc) {
		Element root = doc.getDocumentElement();
		Element child = (Element) root.getFirstChild();
		// 处理transform，得到xy坐标
		String transform = child.getAttribute("transform");
		transform = transform.substring(transform.indexOf("translate(") + 10);
		transform = transform.substring(0, transform.indexOf(")"));
		String[] location = transform.trim().split(",");
		float locationx = Float.parseFloat(location[0]);
		float locationy = Float.parseFloat(location[1]);

		return new float[] { locationx, locationy };
	}
}
