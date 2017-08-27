package com.outstudio.plan.util;

import java.text.DecimalFormat;
import java.util.Arrays;
import java.util.Comparator;

public class MathUtil {

	/**
	 * data为polygon 中的points，（ points 中指定每一个座标点会依序连成线），即points中点的顺序就连起来就是所有边
	 * 
	 * @param data
	 * @return
	 */
	public static float getSurroundingLength(float[][] data) {
		float surrounding = 0;
		surrounding += distance(data[0][0], data[0][1], data[data.length - 1][0], data[data.length - 1][1]);
		for (int i = 0; i < data.length - 1; i++) {
			surrounding += distance(data[i][0], data[i][1], data[i + 1][0], data[i + 1][1]);
		}
		return surrounding;
	}

	public static float getSurroundingLength2(float[][] data) {
		float surrounding = 0;
		// 二维数组的排序，以行首优先
		Arrays.sort(data, new Comparator<float[]>() {
			@Override
			public int compare(float[] x, float[] y) {
				if (x[0] < y[0]) {
					return 1;
				} else if (x[0] > y[0]) {
					return -1;
				} else {
					return 0;
				}
			}
		});
		// 看x，最靠近的两个计算距离
		surrounding += distance(data[0][0], data[0][1], data[1][0], data[1][1]);
		surrounding += distance(data[2][0], data[2][1], data[3][0], data[3][1]);

		// 二维数组排序，以列为优先
		Arrays.sort(data, new Comparator<float[]>() {
			@Override
			public int compare(float[] x, float[] y) {
				if (x[1] < y[1]) {
					return 1;
				} else if (x[1] > y[1]) {
					return -1;
				} else {
					return 0;
				}
			}
		});
		// 看y，最靠近的两个计算距离
		surrounding += distance(data[0][0], data[0][1], data[1][0], data[1][1]);
		surrounding += distance(data[2][0], data[2][1], data[3][0], data[3][1]);

		for (int i = 0; i < data.length; i++) {
			System.out.println("data[i][0]:" + data[i][0] + ",data[i][1]" + data[i][1]);
		}

		return surrounding;
	}

	public static float getArea(float[][] data) {

		int len = data.length;
		float area = 0;
		if (len >= 3) { // 点的数量大于等于三才有面积
			area = data[0][1] * (data[len - 1][0] - data[1][0]);
			for (int i = 1; i < len; i++) {
				area += data[i][1] * (data[i - 1][0] - data[(i + 1) % len][0]);
			}
			area = Math.abs(area / 2);
			String areaStr = String.format("%.2f", area);

			System.out.println(areaStr);
		}

		return area;
	}

	/**
	 * 计算两点间距离
	 * 
	 * @param x1
	 * @param y1
	 * @param x2
	 * @param y2
	 * @return
	 */
	public static float distance(float x1, float y1, float x2, float y2) {
		float x = Math.abs(x1 - x2);
		float y = Math.abs(y1 - y2);

		return (float) Math.sqrt(x * x + y * y);
	}

	/**
	 * 将数据格式化为保留小数点后两位
	 * 
	 * @param n
	 * @return
	 */
	public static String format(float n) {
		DecimalFormat df = new DecimalFormat("#.00");
		String s = df.format(n);
		// 如果数是0.0的话格式化之后是”.00“
		if (s.startsWith(".")) {
			s = "0" + s;
		}
		return s;
	}

}
