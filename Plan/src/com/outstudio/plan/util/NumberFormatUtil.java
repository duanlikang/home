package com.outstudio.plan.util;

import java.math.BigDecimal;

public class NumberFormatUtil {

	/**
	 * 将number格式化，保留后面wei位。
	 * 
	 * @param number
	 * @param wei
	 * @return
	 */
	public static double format(double number, int wei) {
		BigDecimal b = new BigDecimal(number);
		double f1 = b.setScale(wei, BigDecimal.ROUND_HALF_UP).doubleValue();
		return f1;
	}

}
