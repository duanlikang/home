package com.outstudio.plan.filter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.jfinal.handler.Handler;

public class CorsHandler extends Handler {

	@Override
	public void handle(String target, HttpServletRequest request, HttpServletResponse response, boolean[] isHandled) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		nextHandler.handle(target, request, response, isHandled);
	}
}