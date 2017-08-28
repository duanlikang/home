package com.outstudio.plan.config;

import com.jfinal.config.Constants;
import com.jfinal.config.Handlers;
import com.jfinal.config.Interceptors;
import com.jfinal.config.JFinalConfig;
import com.jfinal.config.Plugins;
import com.jfinal.config.Routes;
import com.jfinal.ext.plugin.monogodb.MongodbPlugin;
import com.jfinal.plugin.ehcache.EhCachePlugin;
import com.outstudio.plan.controller.AdminController;
import com.outstudio.plan.controller.IndexController;
import com.outstudio.plan.controller.PictureController;
import com.outstudio.plan.controller.ProjectController;
import com.outstudio.plan.controller.UserController;
import com.outstudio.plan.filter.CorsHandler;

public class CoreConfig extends JFinalConfig {

	public void configConstant(Constants me) {
		me.setDevMode(true);
		me.setUploadedFileSaveDirectory("D:/origin_file");
	}

	public void configRoute(Routes me) {
		me.add("/picture", PictureController.class);
		me.add("/admin", AdminController.class);
		me.add("/user", UserController.class);
		me.add("/project", ProjectController.class);
		me.add("/", IndexController.class);
	}

	public void configPlugin(Plugins me) {
		MongodbPlugin mongodbPlugin = new MongodbPlugin("115.28.53.9",27017,"plan");
		me.add(mongodbPlugin);
		EhCachePlugin ehCachePlugin = new EhCachePlugin();
		me.add(ehCachePlugin);
	}

	public void configInterceptor(Interceptors me) {

	}

	public void configHandler(Handlers me) {
		me.add(new CorsHandler());
	}

}
