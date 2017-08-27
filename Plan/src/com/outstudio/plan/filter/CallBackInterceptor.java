package com.outstudio.plan.filter;

import com.jfinal.aop.Interceptor;
import com.jfinal.aop.Invocation;

public class CallBackInterceptor implements Interceptor {

	public void intercept(Invocation inv) {
		String callback = inv.getController().getPara("callback");
		inv.invoke();
		Object obj = inv.getReturnValue();
		if (callback == null) {
			inv.getController().renderText(obj.toString());
		} else {
			inv.getController().renderText(callback + "(" + obj + ")");
		}
	}

}
