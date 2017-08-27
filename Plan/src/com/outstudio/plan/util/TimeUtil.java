package com.outstudio.plan.util;

import java.sql.Timestamp;

public class TimeUtil {

	public static String getFormattedTime() {
		return getFormattedTime(System.currentTimeMillis());
	}

	public static String getFormattedTime(long timestamp) {
		return new Timestamp(timestamp).toString().substring(0, 19);
	}

}
