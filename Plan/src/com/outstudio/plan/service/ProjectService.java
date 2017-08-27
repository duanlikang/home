package com.outstudio.plan.service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.bson.types.ObjectId;

import com.jfinal.aop.Duang;
import com.jfinal.ext.plugin.monogodb.MongoKit;
import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.WriteConcern;
import com.mongodb.WriteResult;
import com.outstudio.plan.main.Svg2Pdf;
import com.outstudio.plan.util.EmailUtil;
import com.outstudio.plan.util.FileOp;
import com.outstudio.plan.util.StaticUtil;
import com.outstudio.plan.util.TimeUtil;

/**
 * 
 * @author Grandfather3
 * 
 */
public class ProjectService {
	public static final ProjectService me = Duang.duang(new ProjectService());

	/**
	 * 创建项目
	 * 
	 * @param userId
	 *            用于关联
	 * @param projectId
	 * @param description
	 *            值为项目对应的svg对应的json
	 * @return
	 */
	public Map<String, Object> create(String userId, String projectId, String description) {
		Map<String, Object> infos = new HashMap<>();
		DBCollection projects = MongoKit.getCollection("project");
		DBObject projectToInsert = new BasicDBObject("user_id", new ObjectId(userId));
		projectToInsert.put("_id", projectId);
		DBObject project = projects.findOne(projectToInsert);// 先查找该项目是否存在
		WriteResult wr = null;
		if (project == null) {// 项目不存在，则插入项目
			projectToInsert.put("create_time", TimeUtil.getFormattedTime());
			projectToInsert.put("description", description);
			wr = projects.insert(projectToInsert, WriteConcern.ACKNOWLEDGED);
		} else {// 项目存在，则修改项目的description
			project.put("description", description);
			wr = projects.update(projectToInsert, project, false, false, WriteConcern.ACKNOWLEDGED);
		}
		if (wr.wasAcknowledged()) {
			infos.put("info", "success");
		} else {
			infos.put("info", "fail");
		}
		return infos;
	}

	/**
	 * 删除项目
	 * 
	 * @param userId
	 *            用于判断权限
	 * @param projectId
	 *            待删除的项目标识
	 * @return
	 */
	public Map<String, Object> remove(String userId, String projectId) {
		Map<String, Object> infos = new HashMap<>();
		DBCollection projects = MongoKit.getCollection("project");
		DBObject projectToDelete = new BasicDBObject("_id", projectId);
		DBObject project = projects.findOne(projectToDelete);
		if (project == null) {// 该projectId对应的project不存在
			infos.put("info", "notExist");
			return infos;
		}
		if (!userId.equals(project.get("user_id").toString())) {// 该projectId对应的user不是当前user
			infos.put("info", "notBelong");
			return infos;
		}
		WriteResult wr = projects.remove(projectToDelete, WriteConcern.ACKNOWLEDGED);
		if (wr.wasAcknowledged()) {
			infos.put("info", "success");
		} else {
			infos.put("info", "fail");
		}
		return infos;
	}

	/**
	 * 访问一个项目
	 * 
	 * @param userId
	 *            用于验证权限
	 * @param projectId
	 * @return
	 */
	public Map<String, Object> visit(String projectId) {
		Map<String, Object> infos = new HashMap<>();
		DBCollection projects = MongoKit.getCollection("project");
		DBObject projectToVisit = new BasicDBObject("_id", projectId);
		DBObject project = projects.findOne(projectToVisit);
		if (project == null) {// 该projectId对应的project不存在
			infos.put("info", "notExist");
			return infos;
		}
		infos = project.toMap();// 该project的详细信息
		infos.put("info", "success");
		return infos;
	}

	public List<DBObject> getAllProject(String user_id, int count, int index, boolean all) {
		DBCollection projects = MongoKit.getCollection("project");
		DBObject projectToFind = new BasicDBObject("user_id", new ObjectId(user_id));
		DBCursor projectCursor = null;
		if (all) {
			projectCursor = projects.find(projectToFind);
		} else {
			projectCursor = projects.find(projectToFind).skip(index * count).limit(count);
		}
		List<DBObject> projectOfTheUser = projectCursor.toArray();
		return projectOfTheUser;
	}

	public Map<String, Object> send(final String email, final String project_id) {
		Map<String, Object> infos = new HashMap<>();
		DBCollection projects = MongoKit.getCollection("project");
		DBObject projectToFind = new BasicDBObject("_id", project_id);
		DBObject project = projects.findOne(projectToFind);
		if (project == null) {
			infos.put("info", "notExist");
			return infos;
		} else {
			final String description = project.get("description").toString();
			final String projectId = (String) project.get("_id");
			new Thread(new Runnable() {
				public void run() {
					Svg2Pdf.generate(description, "D://", projectId, "D://svg", "/extJson/", StaticUtil.root,
							"D:/temp/" + projectId);
					EmailUtil.sendFile("D://" + projectId + ".pdf", email);
					FileOp.deleteFile("D://" + projectId + "_temp.pdf");
					FileOp.deleteFile("D://" + projectId + ".pdf");
				}
			}).start();
			infos.put("info", "success");
			return infos;
		}
	}

	public Map<String, Object> sendBrief(final String email, final String project_id) {
		Map<String, Object> infos = new HashMap<>();
		DBCollection projects = MongoKit.getCollection("project");
		DBObject projectToFind = new BasicDBObject("_id", project_id);
		DBObject project = projects.findOne(projectToFind);
		if (project == null) {
			infos.put("info", "notExist");
			return infos;
		} else {
			final String description = project.get("description").toString();
			final String projectId = (String) project.get("_id");
			new Thread(new Runnable() {
				public void run() {
					try {
						Svg2Pdf.generateForRoom(description, "D://", projectId + "_brief", "D://svg", "/extJson/",
								StaticUtil.root, "D:/temp/" + projectId + "_brief");
						EmailUtil.sendFile("D://" + projectId + "_brief.pdf", email);
						FileOp.deleteFile("D://" + projectId + "_brief_temp.pdf");
						FileOp.deleteFile("D://" + projectId + "_brief.pdf");
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			}).start();
			infos.put("info", "success");
			return infos;
		}
	}
}
