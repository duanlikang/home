define({ "api": [
  {
    "type": "GET",
    "url": "/login",
    "title": "/login",
    "name": "login",
    "group": "admin_login",
    "version": "1.0.0",
    "description": "<p>登陆</p>",
    "permission": [
      {
        "name": "管理员"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "phone",
            "description": "<p>电话</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>密码</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "成功": [
          {
            "group": "成功",
            "type": "jsp",
            "optional": false,
            "field": "render",
            "description": "<p>自动跳转</p>"
          }
        ]
      }
    },
    "filename": "src/com/outstudio/plan/controller/AdminController.java",
    "groupTitle": "admin_login"
  },
  {
    "type": "GET",
    "url": "/salemanAdmin",
    "title": "/salemanAdmin",
    "name": "salemanAdmin",
    "group": "admin_mgr",
    "version": "1.0.0",
    "description": "<p>推广人主页</p>",
    "permission": [
      {
        "name": "管理员"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "page-phone",
            "description": "<p>页数-电话格式,urlpara</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "成功": [
          {
            "group": "成功",
            "type": "jsp",
            "optional": false,
            "field": "render",
            "description": "<p>自动跳转</p>"
          }
        ]
      }
    },
    "filename": "src/com/outstudio/plan/controller/AdminController.java",
    "groupTitle": "admin_mgr"
  },
  {
    "type": "GET",
    "url": "/userAdmin",
    "title": "/userAdmin",
    "name": "userAdmin",
    "group": "admin_mgr",
    "version": "1.0.0",
    "description": "<p>用户管理</p>",
    "permission": [
      {
        "name": "管理员"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "page-phone",
            "description": "<p>页数-电话格式,urlpara</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "成功": [
          {
            "group": "成功",
            "type": "jsp",
            "optional": false,
            "field": "render",
            "description": "<p>自动跳转</p>"
          }
        ]
      }
    },
    "filename": "src/com/outstudio/plan/controller/AdminController.java",
    "groupTitle": "admin_mgr"
  },
  {
    "type": "GET",
    "url": "/regist",
    "title": "/regist",
    "name": "regist",
    "group": "admin_regist",
    "version": "1.0.0",
    "description": "<p>注册</p>",
    "permission": [
      {
        "name": "管理员"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "phone",
            "description": "<p>电话</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>密码</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>姓名</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "address",
            "description": "<p>地址</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "father_phone",
            "description": "<p>推广人电话</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "成功": [
          {
            "group": "成功",
            "type": "jsp",
            "optional": false,
            "field": "render",
            "description": "<p>自动跳转</p>"
          }
        ]
      }
    },
    "filename": "src/com/outstudio/plan/controller/AdminController.java",
    "groupTitle": "admin_regist"
  },
  {
    "type": "GET",
    "url": "/create",
    "title": "/create",
    "name": "create",
    "group": "project_mgr",
    "version": "1.0.0",
    "description": "<p>创建项目</p>",
    "permission": [
      {
        "name": "用户"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "user_id",
            "description": "<p>用户id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "project_id",
            "description": "<p>项目id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>项目描述</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "成功": [
          {
            "group": "成功",
            "type": "string",
            "optional": false,
            "field": "info",
            "description": "<p>状态</p>"
          }
        ]
      }
    },
    "filename": "src/com/outstudio/plan/controller/ProjectController.java",
    "groupTitle": "project_mgr"
  },
  {
    "type": "GET",
    "url": "/getAllProject",
    "title": "/getAllProject",
    "name": "getAllProject",
    "group": "project_mgr",
    "version": "1.0.0",
    "description": "<p>获取项目</p>",
    "permission": [
      {
        "name": "用户"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "user_id",
            "description": "<p>用户id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "count",
            "description": "<p>每页的数量</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "index",
            "description": "<p>页码</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "成功": [
          {
            "group": "成功",
            "type": "string",
            "optional": false,
            "field": "json",
            "description": "<p>数组 项目数组</p>"
          }
        ]
      }
    },
    "filename": "src/com/outstudio/plan/controller/ProjectController.java",
    "groupTitle": "project_mgr"
  },
  {
    "type": "GET",
    "url": "/remove",
    "title": "/remove",
    "name": "remove",
    "group": "project_mgr",
    "version": "1.0.0",
    "description": "<p>删除项目</p>",
    "permission": [
      {
        "name": "用户"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "user_id",
            "description": "<p>用户id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "project_id",
            "description": "<p>项目id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "成功": [
          {
            "group": "成功",
            "type": "string",
            "optional": false,
            "field": "info",
            "description": "<p>状态</p>"
          }
        ]
      }
    },
    "filename": "src/com/outstudio/plan/controller/ProjectController.java",
    "groupTitle": "project_mgr"
  },
  {
    "type": "GET",
    "url": "/visit",
    "title": "/visit",
    "name": "visit",
    "group": "project_mgr",
    "version": "1.0.0",
    "description": "<p>查看项目</p>",
    "permission": [
      {
        "name": "用户"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "user_id",
            "description": "<p>用户id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "project_id",
            "description": "<p>项目id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "成功": [
          {
            "group": "成功",
            "type": "string",
            "optional": false,
            "field": "info",
            "description": "<p>状态</p>"
          }
        ]
      }
    },
    "filename": "src/com/outstudio/plan/controller/ProjectController.java",
    "groupTitle": "project_mgr"
  },
  {
    "type": "GET",
    "url": "/sendBriefProject",
    "title": "/sendBriefProject",
    "name": "sendBriefProject",
    "group": "project_send",
    "version": "1.0.0",
    "description": "<p>发送简要项目</p>",
    "permission": [
      {
        "name": "用户"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "project_id",
            "description": "<p>项目id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>邮箱</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "成功": [
          {
            "group": "成功",
            "type": "string",
            "optional": false,
            "field": "info",
            "description": "<p>状态</p>"
          }
        ]
      }
    },
    "filename": "src/com/outstudio/plan/controller/ProjectController.java",
    "groupTitle": "project_send"
  },
  {
    "type": "GET",
    "url": "/sendProject",
    "title": "/sendProject",
    "name": "sendProject",
    "group": "project_send",
    "version": "1.0.0",
    "description": "<p>发送项目</p>",
    "permission": [
      {
        "name": "用户"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "project_id",
            "description": "<p>项目id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>邮箱</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "成功": [
          {
            "group": "成功",
            "type": "string",
            "optional": false,
            "field": "info",
            "description": "<p>状态</p>"
          }
        ]
      }
    },
    "filename": "src/com/outstudio/plan/controller/ProjectController.java",
    "groupTitle": "project_send"
  },
  {
    "type": "GET",
    "url": "/completeInfo",
    "title": "/completeInfo",
    "name": "completeInfo",
    "group": "user_mgr",
    "version": "1.0.0",
    "description": "<p>完善信息</p>",
    "permission": [
      {
        "name": "用户"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "json",
            "description": "<p>完善信息json</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "userId",
            "description": "<p>用户id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "成功": [
          {
            "group": "成功",
            "type": "string",
            "optional": false,
            "field": "info",
            "description": "<p>状态</p>"
          }
        ]
      }
    },
    "filename": "src/com/outstudio/plan/controller/UserController.java",
    "groupTitle": "user_mgr"
  },
  {
    "type": "GET",
    "url": "/findPwd",
    "title": "/findPwd",
    "name": "findPwd",
    "group": "user_mgr",
    "version": "1.0.0",
    "description": "<p>找回密码</p>",
    "permission": [
      {
        "name": "用户"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "phone",
            "description": "<p>电话</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>密码</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "checkCode",
            "description": "<p>验证码</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "成功": [
          {
            "group": "成功",
            "type": "string",
            "optional": false,
            "field": "info",
            "description": "<p>状态</p>"
          }
        ]
      }
    },
    "filename": "src/com/outstudio/plan/controller/UserController.java",
    "groupTitle": "user_mgr"
  },
  {
    "type": "GET",
    "url": "/login",
    "title": "/login",
    "name": "login",
    "group": "user_mgr",
    "version": "1.0.0",
    "description": "<p>登陆</p>",
    "permission": [
      {
        "name": "用户"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "phone",
            "description": "<p>电话</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>密码</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "成功": [
          {
            "group": "成功",
            "type": "string",
            "optional": false,
            "field": "info",
            "description": "<p>状态</p>"
          },
          {
            "group": "成功",
            "type": "string",
            "optional": false,
            "field": "_id",
            "description": "<p>状态</p>"
          },
          {
            "group": "成功",
            "type": "string",
            "optional": false,
            "field": "deadTimestamp",
            "description": "<p>到期时间</p>"
          },
          {
            "group": "成功",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>验证token</p>"
          },
          {
            "group": "成功",
            "type": "string",
            "optional": false,
            "field": "uuid",
            "description": "<p>uuid</p>"
          }
        ]
      }
    },
    "filename": "src/com/outstudio/plan/controller/UserController.java",
    "groupTitle": "user_mgr"
  },
  {
    "type": "GET",
    "url": "/regist",
    "title": "/regist",
    "name": "regist",
    "group": "user_mgr",
    "version": "1.0.0",
    "description": "<p>注册</p>",
    "permission": [
      {
        "name": "用户"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "phone",
            "description": "<p>电话</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>密码</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "checkCode",
            "description": "<p>验证码</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "uuid",
            "description": "<p>uuid</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "key",
            "description": "<p>key</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "introNo",
            "description": "<p>推荐人</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "成功": [
          {
            "group": "成功",
            "type": "string",
            "optional": false,
            "field": "info",
            "description": "<p>状态</p>"
          },
          {
            "group": "成功",
            "type": "string",
            "optional": false,
            "field": "userId",
            "description": "<p>用户Id</p>"
          }
        ]
      }
    },
    "filename": "src/com/outstudio/plan/controller/UserController.java",
    "groupTitle": "user_mgr"
  },
  {
    "type": "GET",
    "url": "/sendCheckCode",
    "title": "/sendCheckCode",
    "name": "sendCheckCode",
    "group": "user_mgr",
    "version": "1.0.0",
    "description": "<p>请求发送验证码</p>",
    "permission": [
      {
        "name": "用户"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "phone",
            "description": "<p>电话</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "成功": [
          {
            "group": "成功",
            "type": "string",
            "optional": false,
            "field": "checkCode",
            "description": "<p>验证码</p>"
          }
        ]
      }
    },
    "filename": "src/com/outstudio/plan/controller/UserController.java",
    "groupTitle": "user_mgr"
  }
] });
