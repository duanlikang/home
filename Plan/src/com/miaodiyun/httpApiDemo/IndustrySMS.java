package com.miaodiyun.httpApiDemo;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.miaodiyun.httpApiDemo.common.Config;
import com.miaodiyun.httpApiDemo.common.HttpUtil;
import com.outstudio.plan.util.CommonUtil;

/**
 * 验证码通知短信接口
 * 
 * @ClassName: IndustrySMS
 * @Description: 验证码通知短信接口
 *
 */
public class IndustrySMS {
	private static String operation = "/industrySMS/sendSMS";

	private static String accountSid = Config.ACCOUNT_SID;

	/**
	 * 验证码通知短信
	 */
	public static JSONObject execute(String phone) {
		String checkCode = CommonUtil.getRandomCheckCode();
		String smsContent = "【优速Max】您的验证码是" + checkCode + "，请于30分钟内输入";
		String url = Config.BASE_URL + operation;
		String body = "accountSid=" + accountSid + "&to=" + phone + "&smsContent=" + smsContent
				+ HttpUtil.createCommonParam();
		// 提交请求
		String result = HttpUtil.post(url, body);
		JSONObject jo = JSON.parseObject(result);
		jo.put("checkCode", checkCode);
		return jo;
	}
}