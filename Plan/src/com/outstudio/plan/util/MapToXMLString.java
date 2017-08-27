package com.outstudio.plan.util;

import java.io.StringReader;
import java.lang.reflect.Field;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;
import org.xml.sax.InputSource;

public class MapToXMLString {

	public static String converter(Map<String, String> dataMap) {
		synchronized (MapToXMLString.class) {
			StringBuilder strBuilder = new StringBuilder();
			strBuilder.append("<xml>\n");
			Set<String> objSet = dataMap.keySet();
			for (String key : objSet) {
				if (key == null) {
					continue;
				}
				strBuilder.append("\t<").append(key).append(">");
				String value = dataMap.get(key);
				strBuilder.append(value);
				strBuilder.append("</").append(key.toString()).append(">\n");
			}
			strBuilder.append("</xml>");
			return strBuilder.toString();
		}
	}

	public static String coverter(Object[] objects) {
		StringBuilder strBuilder = new StringBuilder();
		for (Object obj : objects) {
			strBuilder.append("<item className=").append(obj.getClass().getName()).append(">\n");
			strBuilder.append(coverter(obj));
			strBuilder.append("</item>\n");
		}
		return strBuilder.toString();
	}

	public static String coverter(Collection<?> objects) {
		StringBuilder strBuilder = new StringBuilder();
		for (Object obj : objects) {
			strBuilder.append("<item className=").append(obj.getClass().getName()).append(">\n");
			strBuilder.append(coverter(obj));
			strBuilder.append("</item>\n");
		}
		return strBuilder.toString();
	}

	public static String coverter(Object object) {
		if (object instanceof Object[]) {
			return coverter((Object[]) object);
		}
		if (object instanceof Collection) {
			return coverter((Collection<?>) object);
		}
		StringBuilder strBuilder = new StringBuilder();
		if (isObject(object)) {
			Class<? extends Object> clz = object.getClass();
			Field[] fields = clz.getDeclaredFields();

			for (Field field : fields) {
				field.setAccessible(true);
				if (field == null) {
					continue;
				}
				String fieldName = field.getName();
				Object value = null;
				try {
					value = field.get(object);
				} catch (IllegalArgumentException e) {
					continue;
				} catch (IllegalAccessException e) {
					continue;
				}
				strBuilder.append("<").append(fieldName).append(" className=\"").append(value.getClass().getName())
						.append("\">\n");
				if (isObject(value)) {
					strBuilder.append(coverter(value));
				} else if (value == null) {
					strBuilder.append("null\n");
				} else {
					strBuilder.append(value.toString() + "\n");
				}
				strBuilder.append("</").append(fieldName).append(">\n");
			}
		} else if (object == null) {
			strBuilder.append("null\n");
		} else {
			strBuilder.append(object.toString() + "\n");
		}
		return strBuilder.toString();
	}

	private static boolean isObject(Object obj) {
		if (obj == null) {
			return false;
		}
		if (obj instanceof String) {
			return false;
		}
		if (obj instanceof Integer) {
			return false;
		}
		if (obj instanceof Double) {
			return false;
		}
		if (obj instanceof Float) {
			return false;
		}
		if (obj instanceof Byte) {
			return false;
		}
		if (obj instanceof Long) {
			return false;
		}
		if (obj instanceof Character) {
			return false;
		}
		if (obj instanceof Short) {
			return false;
		}
		if (obj instanceof Boolean) {
			return false;
		}
		return true;
	}

	public static Map<String, String> toMap(String xml) {
		StringReader read = new StringReader(xml);
		InputSource source = new InputSource(read);
		SAXBuilder sb = new SAXBuilder();
		Map<String, String> result = new HashMap<>();
		try {
			Document doc = (Document) sb.build(source);
			Element root = doc.getRootElement();
			result.put(root.getName(), root.getText());
			parse(root, result);
		} catch (JDOMException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

	public static void parse(Element root, Map<String, String> result) {
		List<Element> nodes = root.getChildren();
		int len = nodes.size();
		if (len == 0) {
			result.put(root.getName(), root.getText());
		} else {
			for (int i = 0; i < len; i++) {
				Element element = (Element) nodes.get(i);
				result.put(element.getName(), element.getText());
				parse(element, result);
			}
		}
	}
}