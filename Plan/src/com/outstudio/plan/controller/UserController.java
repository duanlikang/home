package com.outstudio.plan.controller;

import java.util.Map;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.plugin.ehcache.CacheKit;
import com.miaodiyun.httpApiDemo.IndustrySMS;
import com.outstudio.plan.filter.CallBackInterceptor;
import com.outstudio.plan.filter.TokenInterceptor;
import com.outstudio.plan.service.UserService;
import com.outstudio.plan.util.DisableSslCertValidationUtil;
import com.outstudio.plan.util.StringUtil;

/**
 * 接受与user有关的请求并作出响应
 * 
 * @author Grandfather3
 */
@Before(CallBackInterceptor.class)
public class UserController extends Controller {

	private static final String nullParaResp = "{\"info\" : \"nullPara\"}";
	private static final String tooFastResp = "{\"info\" : \"tooFast\"}";
	private static final String wrongFormatResp = "{\"info\" : \"wrongFormat\"}";

	/**
	 * @api {GET} /login /login
	 * @apiName login
	 * @apiGroup user.mgr
	 * @apiVersion 1.0.0
	 * @apiDescription 登陆
	 * @apiPermission 用户
	 * 
	 * @apiParam {string} phone  电话
	 * @apiParam {string} password  密码
	 * 
	 * @apiSuccess (成功) {string} info 状态
	 * @apiSuccess (成功) {string} _id 状态
	 * @apiSuccess (成功) {string} deadTimestamp 到期时间
	 * @apiSuccess (成功) {string} token 验证token
	 * @apiSuccess (成功) {string} uuid uuid
	 */
	public String login() {
		String phone = getPara("phone");
		String password = getPara("password");
		if (StringUtil.isBlank(phone) || StringUtil.isBlank(password)) {
			return nullParaResp;
		}
		Map<String, Object> infos = UserService.me.login(phone, password);
		JSONObject respJo = new JSONObject(infos);
		return respJo.toJSONString();
	}

	/**
	 * @api {GET} /sendCheckCode /sendCheckCode
	 * @apiName sendCheckCode
	 * @apiGroup user.mgr
	 * @apiVersion 1.0.0
	 * @apiDescription 请求发送验证码
	 * @apiPermission 用户
	 * 
	 * @apiParam {string} phone  电话
	 * 
	 * @apiSuccess (成功) {string} checkCode 验证码
	 */
	public String sendCheckCode() {
		DisableSslCertValidationUtil.disableCertificateValidation();
		String phone = getPara("phone");
		if (StringUtil.isBlank(phone)) {
			return nullParaResp;
		}
		if (!phone.matches("^1\\d{10}$")) {// 判断是否11位数字
			return wrongFormatResp;
		}
		long now = System.currentTimeMillis();
		if (CacheKit.get("user_checkCode_timestamp", phone) == null) {// 缓存中存入该手机号上次请求验证码的时间戳
			CacheKit.put("user_checkCode_timestamp", phone, now);
		} else {
			long lastTime = CacheKit.get("user_checkCode_timestamp", phone);
			CacheKit.put("user_checkCode_timestamp", phone, now);// 更新手机号请求验证码的时间
			if (now - lastTime < 60 * 1000) {// 判断是否过快
				return tooFastResp;
			}
		}
		JSONObject respJo = IndustrySMS.execute(phone);
		String checkCode = respJo.getString("checkCode");
		CacheKit.put("user_checkCode", phone, checkCode);
		return respJo.toJSONString();
	}

	/**
	 * @api {GET} /regist /regist
	 * @apiName regist
	 * @apiGroup user.mgr
	 * @apiVersion 1.0.0
	 * @apiDescription 注册
	 * @apiPermission 用户
	 * 
	 * @apiParam {string} phone  电话
	 * @apiParam {string} password  密码
	 * @apiParam {string} checkCode  验证码
	 * @apiParam {string} uuid  uuid
	 * @apiParam {string} key  key
	 * @apiParam {string} introNo  推荐人
	 * 
	 * @apiSuccess (成功) {string} info 状态
	 * @apiSuccess (成功) {string} userId 用户Id
	 */
	public String regist() {
		String phone = getPara("phone");
		String password = getPara("password");
		String checkCode = getPara("checkCode");
		String uuid = getPara("uuid");
		String key = getPara("key");
		if (StringUtil.isBlank(uuid) || StringUtil.isBlank(phone) || StringUtil.isBlank(password)
				|| StringUtil.isBlank(checkCode) || StringUtil.isBlank(key)) {
			return nullParaResp;
		}
		if (!phone.matches("^1\\d{10}$")) {
			return wrongFormatResp;
		}
		Map<String, Object> infos = UserService.me.regist(phone, password, checkCode, uuid, key);
		if (isParaExists("introNo") && infos.containsKey("userId")) {// 注册时判断是否有邀请码
			String introNo = getPara("introNo");
			String userId = infos.get("userId").toString();
			UserService.me.intro(userId, introNo);
		}
		JSONObject respJo = new JSONObject(infos);
		return respJo.toJSONString();
	}
	/**
	 * @api {GET} /findPwd /findPwd
	 * @apiName findPwd
	 * @apiGroup user.mgr
	 * @apiVersion 1.0.0
	 * @apiDescription 找回密码
	 * @apiPermission 用户
	 * 
	 * @apiParam {string} phone  电话
	 * @apiParam {string} password  密码
	 * @apiParam {string} checkCode  验证码
	 * 
	 * @apiSuccess (成功) {string} info 状态
	 */
	public String findPwd() {
		String phone = getPara("phone");
		String password = getPara("password");
		String checkCode = getPara("checkCode");
		if (StringUtil.isBlank(phone) || StringUtil.isBlank(password) || StringUtil.isBlank(checkCode)) {
			return nullParaResp;
		}
		if (!phone.matches("^1\\d{10}$")) {
			return wrongFormatResp;
		}
		Map<String, Object> infos = UserService.me.changePwd(phone, password, checkCode);
		JSONObject respJo = new JSONObject(infos);
		return respJo.toJSONString();
	}

	/**
	 * @api {GET} /completeInfo /completeInfo
	 * @apiName completeInfo
	 * @apiGroup user.mgr
	 * @apiVersion 1.0.0
	 * @apiDescription 完善信息
	 * @apiPermission 用户
	 * 
	 * @apiParam {string} json  完善信息json
	 * @apiParam {string} userId  用户id
	 * 
	 * @apiSuccess (成功) {string} info 状态
	 */
	@Before(TokenInterceptor.class)
	public String completeInfo() {
		String json = getPara("json");
		JSONObject jo = JSON.parseObject(json);
		String userId = getPara("userId");
		Map<String, Object> infos = UserService.me.completeInfo(userId, jo);
		JSONObject respJo = new JSONObject(infos);
		return respJo.toJSONString();
	}

}
