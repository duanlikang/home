package com.outstudio.plan.util;

public class StaticUtil {
	public static String root;

	static {
		root = StaticUtil.class.getResource("/").getPath();
		root = root.substring(0, root.length() - 17);
	}
}
