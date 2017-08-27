package com.outstudio.plan.util;

import java.security.MessageDigest;

public class MD5Util {

	public final static String MD5(String s) {
		return MD5(s, true);
	}

	public final static String MD5(String s, boolean upperCase) {
		char hexDigits[] = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F' };
		try {
			byte[] btInput = s.getBytes("utf-8");
			MessageDigest mdInst = MessageDigest.getInstance("MD5");
			mdInst.update(btInput);
			byte[] md = mdInst.digest();
			int j = md.length;
			char str[] = new char[j * 2];
			int k = 0;
			for (int i = 0; i < j; i++) {
				byte byte0 = md[i];
				str[k++] = hexDigits[byte0 >>> 4 & 0xf];
				str[k++] = hexDigits[byte0 & 0xf];
			}
			String result = new String(str);
			return upperCase ? result : result.toLowerCase();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

}