package com.outstudio.plan.filter;

import java.util.Arrays;

import com.jfinal.aop.Interceptor;
import com.jfinal.aop.Invocation;
import com.jfinal.core.Controller;
import com.jfinal.plugin.ehcache.CacheKit;
import com.outstudio.plan.util.MD5Util;

/**
 * 拦截需要用户权限的请求，进行验证
 * 
 * @author Grandfather3
 *
 */
public class TokenInterceptor implements Interceptor {

	public void intercept(Invocation inv) {
		Controller con = inv.getController();
		String _id = con.getPara("user_id");
		String signature = con.getPara("signature");
		long timestamp = con.getParaToLong("timestamp");
		if (Math.abs(timestamp - System.currentTimeMillis()) > 15 * 60 * 1000) {
			con.renderText("{\"info\":\"overdue\"}");
		} else {
			if (validate(_id, signature, timestamp)) {
				inv.invoke();// 验证成功
			} else {
				if (CacheKit.get("user_token", _id) != null) {
					CacheKit.remove("user_token", _id);
				}
				con.renderText("{\"info\":\"wrongToken\"}");
			}
		}
	}

	/**
	 * 验证token。userId、timestamp和服务器的token字典序取md5，与传来的signature比较
	 * 
	 * @param _id
	 *            userId
	 * @param signature
	 * @param timestamp
	 *            传来的客户端时间
	 * @return
	 */
	public boolean validate(String _id, String signature, long timestamp) {
		String token = CacheKit.get("user_token", _id);
		if (token == null) {
			return false;
		}
		String[] strs = { _id, token, timestamp + "" };
		Arrays.sort(strs);
		String rawSignature = "";
		for (String string : strs) {
			rawSignature += string;
		}
		if (signature.equals(MD5Util.MD5(rawSignature))) {
			return true;
		} else {
			return false;
		}
	}
}
