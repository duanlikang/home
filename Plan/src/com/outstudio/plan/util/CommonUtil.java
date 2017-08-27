package com.outstudio.plan.util;

import java.util.Random;

public class CommonUtil {
	private static Random random = new Random();

	public static String getRandomCheckCode() {
		String checkCode = "";
		for (int i = 0; i < 6; i++) {
			checkCode += random.nextInt(10);
		}
		return checkCode;
	}
}
