package com.outstudio.plan.controller;

import java.util.List;
import java.util.Map;

import com.jfinal.core.Controller;
import com.mongodb.DBObject;
import com.outstudio.plan.service.AdminService;

public class AdminController extends Controller {

	/**
	 * @api {GET} /regist /regist
	 * @apiName regist
	 * @apiGroup admin.regist
	 * @apiVersion 1.0.0
	 * @apiDescription 注册
	 * @apiPermission 管理员
	 * 
	 * @apiParam {string} phone  电话
	 * @apiParam {string} password  密码
	 * @apiParam {string} name  姓名
	 * @apiParam {string} address  地址
	 * @apiParam {string} father_phone  推广人电话
	 * 
	 * @apiSuccess (成功) {jsp} render 自动跳转
	 */
	public void regist() {
		String phone = getPara("phone");
		String password = getPara("password");
		String name = getPara("name");
		String address = getPara("address");
		String fatherPhone = getPara("father_phone");
		Map<String, Object> infos = AdminService.me.regist(password, name, phone, address, fatherPhone);
		if ("success".equals(infos.get("info"))) {
			renderJsp("/sale/salemanLogin.jsp");
		} else {
			setAttr("errorInfo", infos.get("errorInfo"));
			renderJsp("/sale/salemanRegist.jsp");
		}
	}

	/**
	 * @api {GET} /login /login
	 * @apiName login
	 * @apiGroup admin.login
	 * @apiVersion 1.0.0
	 * @apiDescription 登陆
	 * @apiPermission 管理员
	 * 
	 * @apiParam {string} phone  电话
	 * @apiParam {string} password  密码
	 * 
	 * @apiSuccess (成功) {jsp} render 自动跳转
	 */
	public void login() {
		String phone = getPara("phone");
		String password = getPara("password");
		Map<String, Object> infos = AdminService.me.login(phone, password);

		if ("success".equals(infos.get("info"))) {
			setSessionAttr("admin", infos.get("admin"));
			forwardAction("/admin/salemanAdmin/0-" + phone);
		} else {
			renderJsp("../admin/salemanLogin.jsp");
		}
	}

	/**
	 * @api {GET} /salemanAdmin /salemanAdmin
	 * @apiName salemanAdmin
	 * @apiGroup admin.mgr
	 * @apiVersion 1.0.0
	 * @apiDescription 推广人主页
	 * @apiPermission 管理员
	 * 
	 * @apiParam {string} page-phone  页数-电话格式,urlpara
	 * 
	 * @apiSuccess (成功) {jsp} render 自动跳转
	 */
	public void salemanAdmin() {
		int index = getParaToInt(0);
		String phone = getPara(1);
		DBObject admin = getSessionAttr("admin");
		List<Map<String, Object>> salemen = AdminService.me.getAdmin(index, phone, admin);
		long count = AdminService.me.getAdminCount(phone);
		setAttr("salemen", salemen);
		setAttr("count", count);
		setAttr("phone", phone);
		renderJsp("../sale/salemanAdmin.jsp");
	}

	/**
	 * @api {GET} /userAdmin /userAdmin
	 * @apiName userAdmin
	 * @apiGroup admin.mgr
	 * @apiVersion 1.0.0
	 * @apiDescription 用户管理
	 * @apiPermission 管理员
	 * 
	 * @apiParam {string} page-phone  页数-电话格式,urlpara
	 * 
	 * @apiSuccess (成功) {jsp} render 自动跳转
	 */
	public void userAdmin() {
		int index = getParaToInt(0);
		String phone = getPara(1);
		DBObject admin = getSessionAttr("admin");
		List<Map<String, Object>> users = AdminService.me.getUser(index, phone, admin);
		setAttr("users", users);
		long count = AdminService.me.getUserCount(phone);
		setAttr("count", count);
		setAttr("phone", phone);
		renderJsp("../sale/userAdmin.jsp");
	}
}
