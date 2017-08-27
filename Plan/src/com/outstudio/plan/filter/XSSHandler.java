package com.outstudio.plan.filter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.jfinal.handler.Handler;

/**
 * 统一XSS处理，进行过滤
 * 
 * @author Grandfather3
 */
public class XSSHandler extends Handler {

	@Override
	public void handle(String target, HttpServletRequest request, HttpServletResponse response, boolean[] isHandled) {
		request = new XSSHttpServletRequestWrapper(request);
		nextHandler.handle(target, request, response, isHandled);
	}
}