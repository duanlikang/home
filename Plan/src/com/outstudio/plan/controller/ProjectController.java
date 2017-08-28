package com.outstudio.plan.controller;

import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jfinal.aop.Before;
import com.jfinal.aop.Clear;
import com.jfinal.core.Controller;
import com.mongodb.DBObject;
import com.outstudio.plan.filter.CallBackInterceptor;
import com.outstudio.plan.filter.TokenInterceptor;
import com.outstudio.plan.service.ProjectService;

/**
 * 接受关于project的请求，返回结果
 * 
 * @author Grandfather3
 *
 */
@Before({ TokenInterceptor.class, CallBackInterceptor.class }) // 拦截请求，验证token
public class ProjectController extends Controller {

	
	/**
	 * @api {GET} /create /create
	 * @apiName create
	 * @apiGroup project.mgr
	 * @apiVersion 1.0.0
	 * @apiDescription 创建项目
	 * @apiPermission 用户
	 * 
	 * @apiParam {string} user_id  用户id
	 * @apiParam {string} project_id  项目id
	 * @apiParam {string} description  项目描述
	 * 
	 * @apiSuccess (成功) {string} info 状态
	 */
	public String create() {
		String userId = getPara("user_id");// 登录成功返回的user_id
		String projectId = getPara("project_id");
		String description = getPara("description");// 项目描述，即svg对应的json
		Map<String, Object> infos = ProjectService.me.create(userId, projectId, description);
		JSONObject respJo = new JSONObject(infos);
		return respJo.toJSONString();
	}

	/**
	 * @api {GET} /remove /remove
	 * @apiName remove
	 * @apiGroup project.mgr
	 * @apiVersion 1.0.0
	 * @apiDescription 删除项目
	 * @apiPermission 用户
	 * 
	 * @apiParam {string} user_id  用户id
	 * @apiParam {string} project_id  项目id
	 * 
	 * @apiSuccess (成功) {string} info 状态
	 */
	public String remove() {
		String userId = getPara("user_id");// 登录成功返回的user_id
		String projectId = getPara("project_id");
		Map<String, Object> infos = ProjectService.me.remove(userId, projectId);
		JSONObject respJo = new JSONObject(infos);
		return respJo.toJSONString();
	}

	/**
	 * @api {GET} /visit /visit
	 * @apiName visit
	 * @apiGroup project.mgr
	 * @apiVersion 1.0.0
	 * @apiDescription 查看项目
	 * @apiPermission 用户
	 * 
	 * @apiParam {string} user_id  用户id
	 * @apiParam {string} project_id  项目id
	 * 
	 * @apiSuccess (成功) {string} info 状态
	 */
	@Clear(TokenInterceptor.class)
	public String visit() {
		String projectId = getPara("project_id");
		Map<String, Object> infos = ProjectService.me.visit(projectId);
		JSONObject respJo = new JSONObject(infos);
		return respJo.toJSONString();
	}

	
	/**
	 * @api {GET} /getAllProject /getAllProject
	 * @apiName getAllProject
	 * @apiGroup project.mgr
	 * @apiVersion 1.0.0
	 * @apiDescription 获取项目
	 * @apiPermission 用户
	 * 
	 * @apiParam {string} user_id  用户id
	 * @apiParam {string} count  每页的数量
	 * @apiParam {string} index  页码
	 * 
	 * @apiSuccess (成功) {string} json数组 项目数组
	 */
	/**
	 * 需要参数user_id，timestamp，signature，count，index。count是要取几个，index是从第几页开始取
	 */
	public String getAllProject() {
		String user_id = getPara("user_id");
		String countStr = getPara("count");// 请求项目的个数
		String indexStr = getPara("index");// 请求项目的页码，从零开始，index=0，count=10就是取前十个，index=1就是取第11-20个，依此类推
		boolean all = countStr == null || indexStr == null;// 有一个为空的话就是取全部的项目
		int count = 0;
		int index = 0;
		if (!all) {
			if (countStr.matches("^[1-9]\\d*$")) {
				count = Integer.parseInt(countStr);
			} else {
				count = 0;
			}
			if (countStr.matches("^[1-9]\\d*$")) {
				index = Integer.parseInt(indexStr);
			} else {
				index = 0;
			}
		}
		List<DBObject> projects = ProjectService.me.getAllProject(user_id, count, index, all);
		JSONArray respJa = new JSONArray();
		for (DBObject project : projects) {
			respJa.add(project);
		}
		return respJa.toJSONString();
	}

	/**
	 * @api {GET} /sendProject /sendProject
	 * @apiName sendProject
	 * @apiGroup project.send
	 * @apiVersion 1.0.0
	 * @apiDescription 发送项目
	 * @apiPermission 用户
	 * 
	 * @apiParam {string} project_id  项目id
	 * @apiParam {string} email  邮箱
	 * 
	 * @apiSuccess (成功) {string} info 状态
	 */
	public String sendProject() {
		String projectId = getPara("project_id");
		String email = getPara("email");
		Map<String, Object> infos = ProjectService.me.send(email, projectId);
		JSONObject respJo = new JSONObject(infos);
		return respJo.toJSONString();
	}

	/**
	 * @api {GET} /sendBriefProject /sendBriefProject
	 * @apiName sendBriefProject
	 * @apiGroup project.send
	 * @apiVersion 1.0.0
	 * @apiDescription 发送简要项目
	 * @apiPermission 用户
	 * 
	 * @apiParam {string} project_id  项目id
	 * @apiParam {string} email  邮箱
	 * 
	 * @apiSuccess (成功) {string} info 状态
	 */
	public String sendBriefProject() {
		String projectId = getPara("project_id");
		String email = getPara("email");
		Map<String, Object> infos = ProjectService.me.sendBrief(email, projectId);
		JSONObject respJo = new JSONObject(infos);
		return respJo.toJSONString();
	}
}
