package com.outstudio.plan.util;

import java.util.Collection;
import java.util.Iterator;

public class StringUtil {

	/**
	 * 将字符串raw左侧填充字符paddingChar，补全到长度len
	 */
	public static String paddingLeft(String raw, int len, char paddingChar) {
		if (raw.length() >= len) {
			return raw;
		}
		StringBuilder sb = new StringBuilder(len);
		int paddingLength = len - raw.length();
		for (int i = 0; i < paddingLength; i++) {
			sb.append(paddingChar);
		}
		sb.append(raw);
		return sb.toString();
	}

	public static String findBetween(String src, String left, String right) {
		if (src == null || left == null || right == null) {
			return null;
		}
		int leftIndex = src.indexOf(left);
		if (leftIndex == -1) {
			return null;
		}

		int rightIndex = src.indexOf(right, leftIndex + left.length());
		if (rightIndex == -1) {
			return null;
		}

		String tmp = src.substring(leftIndex + left.length(), rightIndex);
		while (true) {
			leftIndex = tmp.indexOf(left);
			if (leftIndex == -1) {
				break;
			}
			tmp = tmp.substring(leftIndex + left.length());
		}
		return tmp;
	}

	/**
	 * Join a collection of strings by a seperator
	 * 
	 * @param strings
	 *            collection of string objects
	 * @param sep
	 *            string to place between strings
	 * @return joined string
	 */
	public static String join(Collection strings, String sep) {
		return join(strings.iterator(), sep);
	}

	/**
	 * Join a collection of strings by a seperator
	 * 
	 * @param strings
	 *            iterator of string objects
	 * @param sep
	 *            string to place between strings
	 * @return joined string
	 */
	public static String join(Iterator strings, String sep) {
		if (!strings.hasNext())
			return "";

		String start = strings.next().toString();
		if (!strings.hasNext()) // only one, avoid builder
			return start;

		StringBuilder sb = new StringBuilder(64).append(start);
		while (strings.hasNext()) {
			sb.append(sep);
			sb.append(strings.next());
		}
		return sb.toString();
	}

	public static boolean isBlank(String str) {
		return str == null || str.trim().isEmpty();
	}

	public static void main(String[] args) {
		System.out.println(findBetween("aaabbb", "aa", "bbb"));
	}
}
