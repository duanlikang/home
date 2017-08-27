package com.outstudio.plan.filter;

import com.jfinal.aop.Interceptor;
import com.jfinal.aop.Invocation;

/**
 * 拦截需要用户权限的请求，进行验证
 * 
 * @author Grandfather3
 *
 */
public class AdminInterceptor implements Interceptor {

	public void intercept(Invocation inv) {
		if (inv.getController().getSessionAttr("admin") != null) {
			inv.invoke();
		} else {
			inv.getController().renderJsp("../jsp/login.jsp");
		}
	}
}
