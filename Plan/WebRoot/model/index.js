(function($,window){
  var Index = function(options){
    var self = this;
    this.storageName = (options&&options.storageName) || "projects";
    this.storage = window.localStorage;
    this.viewScale = (options&&options.viewScale) || 0.3; //每个项目缩略图的缩放比例
    this.lastOpenopts = null; //记录最后一个被点击之后显示打开选项的Dom，在下次点击另一个时隐藏
    this.timer = null; //记录定时器，便于快速点击时取消没有执行的定时器
    this.curCloudDeleteProejctDom = null; //记录删除云端项目的dom节点，便于删除dom
    this.user = null;  //记录用户信息

    this.uploadProjectUrl = "http://localhost:8080/Plan/project/create";
    this.downloadProjectUrl = "http://localhost:8080/Plan/project/getAllProject";
    this.removeProjectUrl = "http://localhost:8080/Plan/project/remove";

    this.projectsDom = $("#project-list");
    this.mask = $("#index-mask");

    this.init();

    /* 主页面可视区域改变大小时，重置布局 */
    $(window).resize(function() {
      self.resetProjectCss();
    });
  };
  Index.prototype = {
    init: function(){
      this.initStorage();
      this.showAllProjects();
      this.getAllElement();
      this.resetProjectCss();
      this.user = new User();
      this.addEvent();
    },
    initStorage: function(){
      var projects = this.storage.getItem(this.storageName);
      if(!projects) this.storage.setItem(this.storageName,"[]");
    },
    getAllElement: function(){
      this.newProSVG = document.getElementById("new-pro-svg");
      this.newProBackground = document.getElementById("new-pro-grid");
      this.projectsDom = $("#project-list");
      this.projectsList = this.projectsDom.find(".project-li");
      this.projectsOpenOpts = this.projectsList.find(".project-choose");
      this.headDom = $("#header");
      this.contentDom = $("#content");
      this.loginSection = $("#tabbar-with-login");
      this.mainSection = $("#tabbar-with-info");
      this.cloudList = $("#cloud-list");
    },
    addEvent: function(){
      var self = this;

      /* 返回此页面后触发refresh刷新index页面，移动端有效 */
      window.addEventListener('refresh',function(event){
        self.getAllElement();
				self.showAllProjects();
			});

      /* 为项目列表绑定事件 */
      this.projectsDom.on("click",".project-li-img",function(event){
        if(event.currentTarget.id=="create-new"){
          self.createNewProject();
        }else{
          var openOpts = this.querySelector(".project-li-open");
          if(self.lastOpenopts) self.lastOpenopts.style.display="none"; //隐藏上一个项目的选项
          openOpts.style.display="block";
          self.lastOpenopts = openOpts;
          /* 快速点击时及时清理定时器 */
          window.clearTimeout(self.timer);
          self.timer = setTimeout(function(){
            self.lastOpenopts.style.display="none";
            self.lastOpenopts = null;
          },1500);
        }
      });
      /* 项目选项操作 打开、删除、上传 */
      this.projectsDom.on("click",".project-opt",function(event){
        event.stopPropagation();
        var proId = this.getAttribute("data-proId");
        var type = this.getAttribute("data-type");
        switch(type){
          case "open":
            self.openNewPage(proId);
            break;
          case "delete":
            if(confirm("如果您没有上传将无法恢复此项目！您确定要删除吗？")){
              self.deleteOneProject(proId);
            }
            break;
          case "upload":
            self.uploadProject(proId);
            break;
        }
      });
      /* 菜单选项 云端数据浏览、下载 */
      this.contentDom.on("click",'[data-target|="content-event"]',function(event){
        if(this.id=="project-cloud"){
          self.showCloudProject();
        }else if(this.id=="project-download"){
          self.downloadCloudProject();
        }
      });
      /* 菜单选项 打开用户界面 */
      this.headDom.on("click",'[data-target|="head-event"]',function(event){
        if(this.id=="userBtn"){
          if(self.user.hasLogin()){
            self.mainSection.addClass("mui-active");
          }else{
            self.loginSection.addClass("mui-active");
          }
        }
      });
      /* 云端数据选项 关闭、删除 */
      this.cloudList.on("click",".cloud-delete",function(event){
        var type = this.getAttribute("data-type");
        console.log(type)
        if(type=="close"){
          self.closeCloudList();
        }else if(type=="delete"){
          var proId = this.getAttribute("data-target");
          self.curCloudDeleteProejctDom = this.parentNode;
          self.deleteCloudProject(proId);
        }
      })
    },
    createNewProject: function(){
      var proId = this.createNewStorage("new");
      this.openNewPage(proId);
    },

    /**
     * 加载已保存项目
     * @param  {[type]} svgView [显示区域DOM]
     * @param  {[type]} id        [项目id]
     */
    showSvgView: function(svgView,id){
      showCreatedProject(svgView,id); //util文件里的函数，建议减少全局函数
    },

    /**
     * 打开新的页面
     * @param  {[type]} id [项目id]
     */
    openNewPage: function(id){
      /* 利用mui.js创建新的页面并打开 */
      mui.openWindow({
          url: "project.html?id=" + id,
          id: "project.html",
      });
    },

    /**
     * 根据用户信息生成校验信息
     * @param  {[type]} userInfo  [用户信息]
     * @param  {[type]} timeStamp [时间戳]
     * @return {[type]}           [校验码]
     */
    getSignature: function(userInfo,timeStamp){
      var arr = [userInfo.uid,userInfo.token,timeStamp].sort();
      var signature = "";
      for(var i=0,len=arr.length;i<len;i++){
        signature+=arr[i];
      }
      signature = hex_md5(signature).toUpperCase(); //md5.js生成
      return signature;
    },

    /**
     * 上传项目
     * @param  {[type]} id [项目id]
     */
    uploadProject: function(id){
      var self = this;
      var userInfo = this.user.hasLogin();
      var project = this.getStorage(id);
      if(userInfo){
        var timeStamp = new Date().getTime();
        var signature = this.getSignature(userInfo,timeStamp);
        var info = {
          url: this.uploadProjectUrl,
          type: "post",
          data:{
            user_id: userInfo.uid,
            project_id: id,
            signature: signature,
            timestamp: timeStamp,
            description: JSON.stringify(project),
          }
        };
        /* 调用User的sendAjaxInfo发送数据 */
        this.user.sendAjaxInfo.call(this,info,this.uploadProjectResult,"json");
      }else{
        /* mul.js 仿IOS原生组件 */
        mui.alert("请先登录",'优速Max',function(){
          self.loginSection.addClass("mui-active"); 
        });
      }
    },

    /**
     * 下载云端数据
     * @return {[type]} [description]
     */
    downloadCloudProject: function(){
      if(confirm("下载云端数据会覆盖当前未上传同名项目，请确保已上传最新内容，"+
        "如果想要回滚以前的数据，请忽略此信息。您确定下载云端数据吗？")){
        var userInfo = this.user.hasLogin();
        if(userInfo){
          var timeStamp = new Date().getTime();
          var signature = this.getSignature(userInfo,timeStamp);
          var info = {
            url: this.downloadProjectUrl,
            type: "post",
            data:{
              user_id: userInfo.uid,
              signature: signature,
              timestamp: timeStamp
            }
          };
          this.user.sendAjaxInfo.call(this,info,this.downloadProjectResult);
        }
      }
    },

    /**
     * 下载回调函数
     * @param  {[type]} data [返回结果]
     * @param  {[type]} self [当前对象]
     */
    downloadProjectResult: function(data,self){
      self.mask.hide();
      if(data){
        /* 覆盖已有项目，若没有则重新创建并保存 */
         mui.alert("下载成功",'优速Max', function() {
          var projects = self.getStorage(self.storageName);
          for(var i=0,len=data.length;i<len;i++){
            if(data[i].description&&data[i].description!='{}'){
              var projectId = data[i]["_id"];
              var flag = false;
              for(var j=0,len2=projects.length;j<len2;j++){
                if(projectId==projects[j]){
                  flag = true;
                }
              }
              if(!flag){
                projects.push(projectId);
              }
              var pro = data[i].description;
              self.saveStorage(projectId, pro);
            }
          }
          self.saveStorage(self.storageName, projects);
          self.showAllProjects();
          self.resetProjectCss();
        });
      }else{
        mui.alert("登录已过期，请重新登录",'优速Max');
      }
    },

    /**
     * 上传项目回调函数
     * @param  {[type]} data [返回结果]
     * @param  {[type]} self [当前对象]
     */
    uploadProjectResult: function(data,self){
      self.mask.hide();
      if(data){
        switch(data.info){
          case "wrongToken":
            mui.alert("登录已过期，请重新登录",'优速Max');
            self.storage.removeItem("user");
            self.storage.addClass("mui-active");
            break;
          case "success":
             mui.alert("上传成功",'优速Max');
            break;
        }
      }else{
        mui.alert("网络出错，请重新尝试",'优速Max');
      }
    },

    /**
     * 删除项目
     * @param  {[type]} id [项目id]
     */
    deleteOneProject: function(id){
      var projects = this.getStorage(this.storageName);
      for (var i = 0; i < projects.length; i++) {
        if (projects[i] == id){
          projects.splice(i, 1);
          break;
        }
      }
      this.deleteStorage(id);
      this.saveStorage(this.storageName,projects);
      $("#"+id).remove();
    },

    /**
     * 创建并初始化保存新的项目
     * @param  {[type]} data [非空字符串]
     * @return {[type]} [项目id]
     */
    createNewStorage: function(data){
      var proId = getUid(data);
      var projects = this.getStorage(this.storageName);
      projects.unshift(proId); //插入头部，按时间顺序显示
      this.saveStorage(this.storageName,projects);
      var projectInfo = {
        "id": proId,
        "name": "未命名",
        "author": "未知",
        "contact": "",
        "email": "",
        "phone": "",
        "address": "",
        "date": nowTime().toString(),
        "text": "",
        "room": [],
        "svgData": {
          "name": "g",
          "attrs": {
            "id": "svg-g",
            "width": "100%",
            "height": "100%",
            "transform": "translate(0,0) scale(1) rotate(0 0,0)"
          }
        },
        "itemInfo":{}
      };
      var userInfo = this.user.hasLogin();
      if(userInfo){
        projectInfo["author"] = userInfo.username;
      }
      this.saveStorage(proId,projectInfo);
      return proId;
    },

    /**
     * 显示云端项目
     */
    showCloudProject: function(){
      var self = this;
      var userInfo = this.user.hasLogin();
      if(userInfo){
        var timeStamp = new Date().getTime();
        var signature = this.getSignature(userInfo,timeStamp);
        var info = {
          url: this.downloadProjectUrl,
          type: "post",
          data:{
            user_id: userInfo.uid,
            signature: signature,
            timestamp: timeStamp
          }
        };
        
        this.user.sendAjaxInfo.call(this,info,this.showCloudProjectResult);
      }else{
        mui.alert("请先登录",'优速Max',function(){
          self.loginSection.addClass("mui-active"); 
        });
      }
    },

    closeCloudList: function(){
      this.mask.hide();
      this.cloudList.hide();
    },

    /**
     * 删除云端项目
     * @param  {[type]} proId [项目id]
     */
    deleteCloudProject: function(proId){
      var self = this;
      var userInfo = this.user.hasLogin();
      if(userInfo){
        var timeStamp = new Date().getTime();
        var signature = this.getSignature(userInfo,timeStamp);
        var info = {
          url: this.removeProjectUrl,
          type: "post",
          data:{
            user_id: userInfo.uid,
            signature: signature,
            timestamp: timeStamp,
            project_id: proId
          }
        };
        this.user.sendAjaxInfo.call(this,info,this.deleteCloudProjectResult);
      }else{
        mui.alert("请先登录",'优速Max',function(){
          self.cloudList.hide();
          self.mask.hide();
          self.loginSection.addClass("mui-active"); 
        });
      }
    },

    /**
     * 删除云端项目回调函数
     * @param  {[type]} data [返回结果]
     * @param  {[type]} self [当前对象]
     */
    deleteCloudProjectResult: function(data,self){
      if(data){
        switch(data.info){
          case "wrongToken":
            mui.alert("登录已过期，请重新登录",'优速Max');
            self.storage.removeItem("user");
            self.storage.addClass("mui-active");
            break;
          case "overdue":
            mui.alert("登录已过期，请重新登录",'优速Max');
            self.storage.removeItem("user");
            self.storage.addClass("mui-active");
            break;
          case "notExist":
            mui.alert("项目不存在",'优速Max');
            break;
          case "success":
            self.curCloudDeleteProejctDom.remove();
            self.curCloudDeleteProejctDom = null;
            break;
        }
      }else{
        mui.alert("网络出错，请重新尝试",'优速Max');
      }
    },

    /**
     * 显示云端项目回调函数
     * @param  {[type]} data [返回结果]
     * @param  {[type]} self [当前对象]
     */
    showCloudProjectResult: function(data,self){
      self.mask.hide();
      if(data){
        var dom = '<li class="cloud-li">'+
          '<div class="cloud-title">云端项目</div>'+
          '<div class="cloud-close cloud-delete" data-type="close"><img src="img/usu/close.png" alt="" /></div>'+
        '</li>';
        for(var i=0,len=data.length;i<len;i++){
          if(data[i].description&&data[i].description!='{}'){
            var desc = JSON.parse(data[i].description);
            dom+='<li class="cloud-li">'+
            '<div class="cloud-name">'+(i+1)+'. '+desc.name+'</div>'+
            '<div class="cloud-author">'+desc.author+'</div>'+
            '<div class="cloud-date">'+desc.date+'</div>'+
            '<div class="cloud-opt cloud-delete" data-target="'+desc.id+
            '" data-type="delete">删除</div>'+
            '</li>';
          }
        }
        self.cloudList.html(dom);
        self.mask.show();
        self.cloudList.show();
      }else{
        mui.alert("登录已过期，请重新登录",'优速Max');
      }
    },

    /**
     * 动态计算每个项目显示区域大小
     * @return {[type]} [description]
     */
    resetProjectCss: function(){
      var width = $(window).width();
      var height = $(window).height();
      if (height > width) {
        $(".project-li").css({
          width: "45%",
          height: width * 0.45,
          "margin-left": "3.3%"
        });
      } else {
        $(".project-li").css({
          width: "30%",
          height: width * 0.3,
          "margin-left": "2.5%"
        });
      }
      $(".project-list").css({
        height: (height-90)+"px"
      });
    },

    getStorage: function(name){
      var result = this.storage.getItem(name);
      return JSON.parse(result);
    },
    saveStorage: function(key,value){
      this.storage.setItem(key,JSON.stringify(value));
    },
    deleteStorage: function(name){
      this.storage.removeItem(name);
    },
    showAllProjects: function(){
      var self = this;
      var projects = this.getStorage(this.storageName);
      var dom = '<li class="project-li">'+
        '<div class="project-li-img background-grid" id="create-new">'+
          '<div class="project-li-add">'+
            '<div class="project-li-icon">'+
              '<span>新建平面图</span>'+
            '</div>'+
          '</div>'+
        '</div>'+
        '<div class="project-li-info project-new-name">'+
          '<div class="project-li-name project-li-new">新平面图</div>'+
          '<div class="project-li-date"></div>'+
        '</div>'+
      '</li>';
      projects.forEach(function(proId){
        var project = self.getStorage(proId);
        if(typeof project == "string"){
          project = JSON.parse(project);
        }
        dom += '<li class="project-li" id="'+proId+'">' +
          '<div class="project-li-img">'+
            '<svg  width="100%" height="100%">' +
              '<g></g>' +
              '<g width="90%" height="90%" transform="translate(0,20) scale('+self.viewScale+')">' +
                '<g id="snap-' + project.id + '"></g>' +
              '</g>' +
            '</svg>' +
            '<div class="project-li-open">' +
              '<div class="project-choose">' +
                '<button class="project-open-btn project-opt" data-type="open" data-proId="'+proId+'">打开</button>'+
              '</div>' +
              '<div class="project-choose">' +
                '<button class="project-open-btn project-opt" data-type="delete" data-proId="'+proId+'">删除</button>'+
              '</div>' +
            '</div>' +
            '<div class="project-upload project-opt" data-type="upload" data-proId="'+proId+'">'+
            '<img src="img/usu/upload.png" alt=""></div>'+
          '</div>' +
          '<div class="project-li-info">' +
            '<div class="project-li-name">' + project.name + '</div>' +
            '<div class="project-li-date">' + project.date + '</div>' +
          '</div>' +
        '</li>';
      });
      this.projectsDom.html(dom);
      projects.forEach(function(proId){
        var snap = document.getElementById("snap-"+proId);
        self.showSvgView(snap,proId);
      });
    },
  };
  window['Index'] = Index;
})(jQuery,window);

(function($,window){
  var User = function(){
    var self = this;
    this.token = "";
    this.loginUrl = "http://localhost:8080/Plan/user/login";
    this.verifyUrl = "http://localhost:8080/Plan/user/sendCheckCode";
    this.regUrl = "http://localhost:8080/Plan/user/regist";
    this.forgetPasswordUrl = "http://localhost:8080/Plan/user/findPwd";
    this.mask = $("#index-mask");
    this.username = null;
    this.password = null;
    this.checkCode = null;
    this.phone = null;

    this.userSection = document.getElementById("user-info");

    this.init();
  };
  
  User.prototype = {
    init: function(){
      this.getAllElement();
      this.userInfo = this.hasLogin();
      if(this.userInfo){
        this.userNameLabel.html(this.userInfo.username);
      }
      this.addEvent();
    },
    getAllElement: function(){
      this.loginSection = $("#tabbar-with-login");
      this.loginBtn = this.loginSection.find("#login-btn");
      this.regSection = $("#tabbar-with-reg");
      this.regBtn = this.regSection.find("#reg-btn");
      this.regVerifyBtn = this.regSection.find("#reg-verify-get");
      this.mainSection = $("#tabbar-with-info");
      this.userNameLabel = this.mainSection.find("#user-name");
      this.forgetSection = $("#tabbar-with-forget");
      this.forgetBtn = this.forgetSection.find("#forget-btn");
      this.forgetVerifyBtn = this.forgetSection.find("#forget-verify-get");
    },
    addEvent: function(){
      var self = this;
      this.userSection.addEventListener("click",function(event){
        self.eventHandler(event);
      });
    },

    /**
     * 事件委托处理用户信息界面的所有点击事件
     * @param  {[type]} event [事件对象]
     */
    eventHandler: function(event){
      var type = event.target.id;
      console.log(type);
      switch(type){
        case "hide-user-login":
          this.loginSection.removeClass("mui-active");
          break;
        case "hide-user-reg":
          this.regSection.removeClass("mui-active");
          break;
        case "hide-user-info":
          this.mainSection.removeClass("mui-active");
          break;
        case "hide-user-forget":
          this.forgetSection.removeClass("mui-active");
          break;
        case "login-btn":
          this.login();
          break;
        case "reg-btn":
          this.register();
          break;
        case "forget-btn":
          this.forgetPassword();
          break;
        case "user-logout-btn":
          this.logout();
          break;
        case "reg-verify-get":
          this.getCheckCode("reg");
          break;
        case "forget-verify-get":
          this.getCheckCode("forget");
          break;
      }
    },
    hasLogin: function(){
      var token = localStorage.getItem("user");
      return token ? JSON.parse(token) : false;
    },
    logout: function(){
      localStorage.removeItem("user");
      this.mainSection.removeClass("mui-active");
    },

    /**
     * 获取验证码
     * @param  {[type]} type [验证码类型 注册、找回密码]
     */
    getCheckCode: function(type){
      this.regVerifyBtn.attr("disabled",true);
      this.forgetVerifyBtn.attr("disabled",true);
      if(type=="reg"){
        this.phone = this.regSection.find("#reg-phone-value").val();
      }else if(type=="forget"){
        this.phone = this.forgetSection.find("#forget-phone-value").val();
      }else{
        return;
      }
      var info = {
        url: this.verifyUrl,
        type: "post",
        data:{
          phone: this.phone
        }
      };
      this.sendAjaxInfo(info,this.getCheckCodeResult);
    },

    /**
     * 获取验证码回调函数
     * @param  {[type]} data [返回结果]
     * @param  {[type]} self [当前对象]
     */
    getCheckCodeResult: function(data,self){
      var count = 60;
      var timer = null;
      self.mask.hide();
      console.log(data,"ssss")
      if(data){
        switch(data.info){
          case "nullPara":
            self.regVerifyBtn.attr("disabled",false);
            self.forgetVerifyBtn.attr("disabled",false);
            mui.alert("请输入手机号",'优速Max');
            break;
          case "wrongFormat":
            self.regVerifyBtn.attr("disabled",false);
            self.forgetVerifyBtn.attr("disabled",false);
            mui.alert("请输入正确的手机号",'优速Max');
            break;
          case "tooFast":
            self.regVerifyBtn.attr("disabled",false);
            self.forgetVerifyBtn.attr("disabled",false);
            mui.alert("请等待一定时间再获取",'优速Max');
            break;
          default:
            timer = setInterval(counter,1000); //定时器限制验证码获取时间间隔
            break;
        }
      }else{
        mui.alert("出错，请重新尝试",'优速Max');
      }

      function counter(){
        if(count<=1){
          clearInterval(timer);
          self.regVerifyBtn.attr("disabled",false);
          self.forgetVerifyBtn.attr("disabled",false);
          self.regVerifyBtn.html("获取验证码");
          self.forgetVerifyBtn.html("获取验证码");
        }else{
          count--;
          self.regVerifyBtn.html("重新获取 (" + count + "S)");
          self.forgetVerifyBtn.html("重新获取 (" + count + "S)");
        }
      }
    },


    login: function(){
      this.username = this.loginSection.find("#login-user-value").val();
      this.password = this.loginSection.find("#login-password-value").val();
      var info = {
        url: this.loginUrl,
        type: "post",
        data:{
          username: this.username,
          password: this.password
        }
      };
      this.loginBtn.attr("disabled",true);
      this.sendAjaxInfo(info,this.loginResult);
    },
    loginResult: function(data,self){
      self.loginBtn.attr("disabled",false);
      self.mask.hide();
      if(data){
        switch(data.info){
          case "noUser":
            mui.alert("您输入的用户不存在",'优速Max');
            break;
          case "wrongPwd":
            mui.alert("密码不正确",'优速Max');
            break;
          case "nullPara":
            mui.alert("信息不完整",'优速Max');
            break;
          case "success":
            self.userNameLabel.html(self.username);
            var str = {username:self.username,uid:data._id,token:data.token};
            localStorage.setItem("user",JSON.stringify(str));
            self.loginSection.removeClass("mui-active");
            self.mainSection.addClass("mui-active");
            break;
        }
      }else{
        mui.alert("网络出错，请重新尝试",'优速Max');
      }
    },
    register: function(){
      this.username = this.regSection.find("#reg-user-value").val();
      this.password = this.regSection.find("#reg-password-value").val();
      var regPhone = this.regSection.find("#reg-phone-value").val();
      var regVerify = this.regSection.find("#reg-verify-value").val();
      var info = {
        url: this.regUrl,
        type: "post",
        data:{
          username: this.username,
          password: this.password,
          phone: regPhone,
          checkCode: regVerify
        }
      };
      this.regBtn.attr("disabled",true);
      this.sendAjaxInfo(info,this.registerResult);
    },
    registerResult: function(data,self){
      self.regBtn.attr("disabled",false);
      self.mask.hide();
      if(data){
        switch(data.info){
          case "wrongFormat":
            mui.alert("数据格式不正确",'优速Max');
            break;
          case "usernameHasExisted":
            mui.alert("用户名已经存在",'优速Max');
            break;
          case "phoneHasExisted":
            mui.alert("手机号已经被注册",'优速Max');
            break;
          case "notMatch":
            mui.alert("验证码错误",'优速Max');
            break;
          case "nullPara":
            mui.alert("信息不完整",'优速Max');
            break;
          case "success":
            self.userNameLabel.html(self.username);
            self.regBtn.attr("disabled",true);
            mui.alert("注册成功,欢迎您的加入",'优速Max', function() {
              setTimeout(function(){
                var info = {
                  url: self.loginUrl,
                  type: "post",
                  data:{
                    username: self.username,
                    password: self.password
                  }
                };
                self.sendAjaxInfo(info,self.loginResult);
                self.regSection.removeClass("mui-active");
                self.regBtn.attr("disabled",false);
              },1000);
            });
            
            break;
        }
      }else{
        mui.alert("网络出错，请重新尝试",'优速Max');
      }
    },
    forgetPassword: function(){
      this.phone = this.forgetSection.find("#forget-phone-value").val();
      this.password = this.forgetSection.find("#forget-password-value").val();
      var forgetVerify= this.forgetSection.find("#forget-verify-value").val();
      var info = {
        url: this.forgetPasswordUrl,
        type: "post",
        data:{
          password: this.password,
          phone: this.phone,
          checkCode: forgetVerify
        }
      };
      this.forgetBtn.attr("disabled",true);
      this.sendAjaxInfo(info,this.forgetPasswordResult);
    },
    forgetPasswordResult: function(data,self){
      console.log(data);
      if(data){

      }else{
        mui.alert("网络出错，请重新尝试",'优速Max');
      }
    },

    /**
     * AJAX请求封装
     * @param  {[type]}   info     [待发送数据]
     * @param  {Function} callback [回调函数]
     * @param  {[type]}   type     [发送类型，是否jsonp]
     * @return {[type]}            [description]
     */
    sendAjaxInfo: function(info,callback,type){
      var self = this;
      /* jsonp 只能发送GET请求，无法上传项目，数据太大，其他请求可以满足。
       * 移动端已解决跨域问题，无需考虑跨域问题，此处使用jsonp仅限于PC端测试方便，正式上线时可以删除。
      */
      if(!type){
      	var type = "jsonp"
      }
      $.ajax({
        type:info.type,
        url:info.url,
        dataType:type,
        data:info.data,
        timeout : 10000,
        beforeSend:function(){
          self.mask.show();
        },
        success:function(data){
          self.mask.hide();
          callback(data,self);
        },
        error: function(e){
          self.mask.hide();
          callback(false,self);
        }
      });
    }
  };

  window['User'] = User;
})(jQuery,window);