(function($, window) {
  var MainFrame = function(options) {
    var self = this;
    this.user = User.prototype;
    this.index = Index.prototype;
    this.id = getUrlParam("id");
    this.oldBack = null;
    this.roomCount = 0;
    this.virtualData = {}; //虚拟数据 设想将dom数据虚拟化处理，减少对dom的直接操作，提升性能，后续需要去做的主要工作。
    this.panelTransform = null; //整体transform
    this.lastTransform = {}; //记录双击房间之前的transform，便于双击面板时还原
    this.currentRoom = null; //当前操作的房间
    this.currentRoomId = ''; //当前操作的房间id，可以利用currentRoom获取
    this.roomDomList = {}; //房间的dom列表，因为Js其动态关联特性，可以直接操作词列表
    this.roomObjList = {}; //房间的room对象列表
    this.roomHammerList = {}; //房间的hammer事件处理列表
    this.isDoubleTap = false; //记录是否处于房间编辑状态
    this.isWheel = true; //记录是否允许鼠标滑轮操作，只针对于PC端优化处理
    self.isPinch = false; //防止在双指放缩时触发房间其他事件，只针对于移动端优化处理
    this.svgHammer = null; //整体面板的Hammer事件
    this.maskHammer = null; //遮罩的Hammer事件
    this.history = []; //记录历史操作，目前只支持最基本的添加回退功能，后续需要增强
    this.isShowSize = false; //房间的item进行尺寸标记时，禁用掉所有的事件
    this.init();

    /**
     * 错误检测程序，很重要的功能，尤其是测试阶段
     * @param  {[type]} err [description]
     * @return {[type]}     [description]
     */
    //错误处理程序
    window.onerror = function(msg, url, lineNo, columnNo, error) {
      var string = msg.toLowerCase();
      var substring = "script error";
      var errorMessage = "";
      if (string.indexOf(substring) > -1) {
        errorMessage = substring;
      } else {
        errorMessage = string;
      }
      var userInfo = self.user.hasLogin();
      if (userInfo) {
        var timeStamp = new Date().getTime();
        var signature = self.index.getSignature(userInfo, timeStamp);
        var info = {
          url: errorUrl,
          type: "post",
          data: {
            user_id: userInfo.uid,
            signature: signature,
            timestamp: timeStamp,
            error: errorMessage,
            date: nowTime(),
          }
        };
        self.user.sendAjaxInfo.call(self, info, errorResult, 'json');
      } else {
        mui.alert("请先登录", "优速Max");
      }
      return false;
    };
  };
  MainFrame.prototype = {
    init: function() {
      this.dataList = new SubSvgList();
      this.bluetooth = new Bluetooth();

      this.initMui();
      this.getAllElement();
      this.showCreatedProject();
      this.addEvent();
      this.drawRotateBlock();
      this.getItemDataList();
    },
    initMui: function() {
      var self = this;
      this.oldBack = mui.back;
      mui.back = function() {
        var btn = ["确定", "取消"];
        mui.confirm('确认关闭当前窗口？', '优速Max', btn, function(e) {
          if (e.index == 0) {
            self.resetAllRoom();
            /* 防止再次编辑时保存后没有长度信息 */
            self.drawInfoLineForSave();
            self.saveProject(false);
            localStorage.removeItem("itemDataList");
            self.oldBack();
          }
        });
      }
      mui.init({
        beforeback: function() {
          if (typeof plus != "undefined") {
            mui.plusReady(function() {
              var index = plus.webview.getWebviewById("project.html");
              mui.fire(index, 'refresh');
            });
          }
          return true;
        }
      });
    },
    getAllElement: function() {
      this.wallMask = document.getElementById("wall-mask");
      this.maskDom = '';
      this.content = $("#edit-content");
      this.headDom = this.content.find("header");
      this.header = $("#header");
      this.headerBack = this.header.find("#header-back");
      this.headerFinish = this.header.find("#header-finish");
      this.addRoomDom = this.content.find("#tabbar-with-addRoom");
      this.objRoomList = this.addRoomDom.find("#obj-room-list");
      this.hideAddRoomDom = this.addRoomDom.find("#hide-add-room");
      this.addRoomTypeDom = this.addRoomDom.find("#add-room-type");
      this.svg = document.getElementById("SVG");
      this.svgPanel = document.getElementById("svg-g");
      this.roomListDom = this.svgPanel.children;
      this.footerDom = $("#footer-ul");
      this.resetBtn = $("#reset-btn");
      this.title = $("#svg-title");
    },
    addEvent: function() {
      var self = this;
      var tmpRoom, tmpRoomId;
      self.svgHammer = propagating(new Hammer(this.svg));
      var tmpX, tmpY, lastX, lastY, lastScale, lastRotate,
        pinchCenterX, pinchCenterY, tScale, tmpScale, scale;
      this.hideAddRoomDom.on("click", function(event) {
        self.addRoomDom.removeClass("mui-active");
      });
      this.headerFinish.on("click", function(event) {
        self.resetPanelForDoubleTap();
      });

      this.reBindFooterEvent();

      this.objRoomList.on("click", "li", function(event) {
        var type = this.getAttribute("data-value");
        self.addDefaultRoom(type);
        self.maskDom.hide();
        self.maskDom.off("click");
        self.addRoomDom.hide();
        self.isWheel = true;
      });
      self.svgHammer.on("tap", function(ev) {
        if (self.isDoubleTap) {} else {
          self.resetAllRoom();
          self.resetBottomForPanel();
        }

      });
      self.svgHammer.on("doubletap", function(ev) {
        self.resetPanelForDoubleTap();
      });
      self.svgHammer.on("panstart panmove panend", function(ev) {
        switch (ev.type) {
          case "panstart":
            self.panelTransform = self.getTransform(self.svgPanel.getAttribute("transform"));
            lastX = self.panelTransform.translateX;
            lastY = self.panelTransform.translateY;
            lastScale = self.panelTransform.scale;
            lastRotate = self.panelTransform.angle + " " +
              self.panelTransform.rotateX + "," + self.panelTransform.rotateY;
            break;
          case "panmove":
            tmpX = parseInt(ev.deltaX) + lastX;
            tmpY = parseInt(ev.deltaY) + lastY;
            self.svgPanel.setAttribute("transform", "translate(" + tmpX +
              "," + tmpY + ") scale(" + lastScale + ") rotate(" + lastRotate + ")");
            break;
          case "panend":
            self.panelTransform.translateX = tmpX;
            self.panelTransform.translateY = tmpY;
            break;
        }
      });
      self.svgHammer.get('pinch').set({
        enable: true
      });
      self.svgHammer.on("pinchstart pinchmove pinchend pinchcancel", function(ev) {
        ev.stopPropagation();
        //必须实时设置为true，无法预测pinch行为和房间的pan行为的先后顺序，若pan先执行而仅
        //在pinchstart中设置为true，房间依旧会移动
        self.isPinch = true;
        switch (ev.type) {
          case "pinchstart":
            tmpRoom = self.currentRoom;
            tmpRoomId = self.currentRoomId;
            self.currentRoom = null;
            self.currentRoomId = null;
            for (var id in self.roomHammerList) {
              self.roomHammerList[id].destroy("tap doubletap panstart panmove panend");
            }
            self.panelTransform = self.getTransform(self.svgPanel.getAttribute("transform"));
            lastX = self.panelTransform.translateX;
            lastY = self.panelTransform.translateY;
            scale = self.panelTransform.scale;
            pinchCenterX = ev.center.x;
            pinchCenterY = ev.center.y;
            lastRotate = self.panelTransform.angle + " " +
              self.panelTransform.rotateX + "," + self.panelTransform.rotateY;
            break;
          case "pinchmove":
            tScale = (ev.scale - 1) / 2;
            tmpScale = tScale + parseFloat(scale);
            tmpX = parseInt(lastX - (pinchCenterX - lastX) * tScale);
            tmpY = parseInt(lastY - (pinchCenterY - lastY) * tScale);
            if (tmpScale < 0.1) tmpScale = 0.1;
            self.svgPanel.setAttribute("transform", "translate(" + tmpX + "," +
              tmpY + ") scale(" + tmpScale + ") rotate(" + lastRotate + ")");
            break;
          case "pinchend":
          case "pinchcancel":
            self.panelTransform.scale = tmpScale;
            self.panelTransform.translateX = tmpX;
            self.panelTransform.translateY = tmpY;
            //延时处理，重新绑定房间事件，防止误触
            setTimeout(function() {
              self.isPinch = false;
              for (var id in self.roomDomList) {
                self.addRoomEvent(self.roomDomList[id]);
              }
              self.currentRoom = tmpRoom;
              self.currentRoomId = tmpRoomId;
            }, 100);
            break;
        }
      });
      document.body.onmousewheel = function(event) {
        if (!self.isWheel) return false;
        var mouseX = event.clientX;
        var mouseY = event.clientY;
        self.panelTransform = self.getTransform(self.svgPanel.getAttribute("transform"));
        var lastX = self.panelTransform.translateX;
        var lastY = self.panelTransform.translateY;
        var scale = self.panelTransform.scale;
        var rotate = self.panelTransform.angle + " " +
          self.panelTransform.rotateX + "," + self.panelTransform.rotateY;
        if (event.wheelDelta > 0 || event.detail > 0) {
          self.panelTransform.scale *= 1.1;
          lastX = parseInt(lastX - (mouseX - lastX) * 0.1);
          lastY = parseInt(lastY - (mouseY - lastY) * 0.1);
        } else {
          self.panelTransform.scale *= 0.9;
          lastX = parseInt(lastX + (mouseX - lastX) * 0.1);
          lastY = parseInt(lastY + (mouseY - lastY) * 0.1);
        }
        if (self.panelTransform.scale < 0.1) {
          self.panelTransform.scale = 0.1;
        }
        self.svgPanel.setAttribute("transform", "translate(" + lastX +
          "," + lastY + ") scale(" + self.panelTransform.scale +
          ") rotate(" + rotate + ")");
        self.panelTransform.translateX = lastX;
        self.panelTransform.translateY = lastY;
      };
      this.resetBtn.on("click", function(event) {
        if (self.history.length <= 0) return false;
        var history = self.history.pop();
        var room, item, roomId;
        if (history.element == "room") {
          room = document.getElementById(history.id);
          self.svgPanel.removeChild(room);
          if (self.isDoubleTap) {
            self.resetPanelForDoubleTap();
          }
          self.roomCount--;
        } else if (history.element == "item") {
          item = document.getElementById(history.id);
          //item.parentNode.removeChild(item);
          roomId = history.roomId;
          room = document.getElementById(roomId);
          self.roomObjList[roomId].removeItem(room, item);

        }
        if (self.history.length <= 0) {
          self.resetBtn.hide();
        }
      })
    },
    addRoomEvent: function(roomDom) {
      var self = this;
      var roomId = roomDom.id;
      var svgScale = self.panelTransform.scale;
      var curTransform, curChild, lastX, lastY, moveX, moveY, roomScale, child, transform;
      var roomRotate = ''; //预留数据，后续扩展房间旋转等
      this.roomHammerList[roomId] = propagating(new Hammer(roomDom));
      this.roomHammerList[roomId].on("tap", function(ev) {
        if (self.isDoubleTap) return false;
        ev.stopPropagation();
        self.highLightRoomWall(roomId);
        self.currentRoomId = roomId;
        self.currentRoom = roomDom;
        self.resetBottomForRoom();
        self.title.html(self.currentRoom.getAttribute("name"));
      });
      this.roomHammerList[roomId].on("doubletap", function(ev) {
        ev.stopPropagation();
        self.doubleHighLightRoom();
      });
      this.roomHammerList[roomId].on("panstart panmove panend", function(ev) {
        if (self.isDoubleTap || self.isPinch) return false;
        ev.stopPropagation();
        switch (ev.type) {
          case "panstart":
            // for(var id in self.roomHammerList){
            //   if(id!=self.currentRoomId){
            //     self.roomHammerList[id].off("tap doubletap panstart panmove panend");
            //   }
            // }
            self.highLightRoomWall(roomId);
            self.currentRoomId = roomId;
            self.currentRoom = roomDom;

            curTransform = self.getTransform(self.currentRoom.getAttribute("transform"));
            svgScale = self.panelTransform.scale;
            roomRotate = curTransform.angle + " " +
              curTransform.rotateX + "," + curTransform.rotateY;
            roomScale = curTransform.scale;
            curChild = self.virtualData[roomId].child;
            lastX = curTransform.translateX;
            lastY = curTransform.translateY;
            break;
          case "panmove":
            moveX = parseInt(ev.deltaX / svgScale) + lastX;
            moveY = parseInt(ev.deltaY / svgScale) + lastY;
            for (var id in self.virtualData) {
              if (id != self.currentRoomId) {
                child = self.virtualData[id].child;
                transform = self.virtualData[id].transform;
                for (var item in child) {
                  if (child[item].name == "circle") {
                    for (var i in curChild) {
                      if (curChild[i].name == "circle") {
                        if (Math.abs((curChild[i].cx + moveX) - (child[item].cx + transform.translateX)) < 40 &&
                          Math.abs((curChild[i].cy + moveY) - (child[item].cy + transform.translateY)) < 40) {
                          self.showDashInfoLine(id, child[item].cx, child[item].cy, item + i);
                        } else {
                          self.deleteDashInfoLine(id, item + i);
                        }
                      }
                    }
                  }
                }
              }
            }
            self.currentRoom.setAttribute("transform", "translate(" + moveX + "," +
              moveY + ") scale(" + roomScale + ") rotate(" + roomRotate + ")");
            break;
          case "panend":
            for (var id in self.virtualData) {
              if (id != self.currentRoomId) {
                var child = self.virtualData[id].child;
                var transform = self.virtualData[id].transform;
                for (var item in child) {
                  if (child[item].name == "circle") {
                    for (var i in curChild) {
                      if (curChild[i].name == "circle") {
                        self.deleteDashInfoLine(id, item + i);
                        if (Math.abs((curChild[i].cx + moveX) - (child[item].cx + transform.translateX)) < 40 &&
                          Math.abs((curChild[i].cy + moveY) - (child[item].cy + transform.translateY)) < 40) {
                          moveX = child[item].cx + transform.translateX - curChild[i].cx;
                          moveY = child[item].cy + transform.translateY - curChild[i].cy;
                        }
                      }
                    }
                  }
                }
              }
            }
            self.currentRoom.setAttribute("transform", "translate(" + moveX + "," +
              moveY + ") scale(" + roomScale + ") rotate(" + roomRotate + ")");
            self.virtualData[self.currentRoomId].transform.translateX = moveX;
            self.virtualData[self.currentRoomId].transform.translateY = moveY;
            setTimeout(function() {
              for (var id in self.roomDomList) {
                if (id != roomId) {
                  self.addRoomEvent(self.roomDomList[id]);
                }
              }
            }, 100);
            break;
        }
      });
    },
    reBindFooterEvent: function() {
      var self = this;
      self.footerDom.on("click", "li", function(event) {
        if (!this.id) return false;
        var type = this.id;
        if (type == "addRoom") {
          self.showAddRoom();
        } else if (type == "delete-room") {
          self.deleteRoom();
        } else if (type == "save-project") {
          self.saveProject(true);
        } else if (type = "highLight-room") {
          self.doubleHighLightRoom();
        }
      });
    },
    doubleHighLightRoom: function() {
      var self = this;
      if (self.isDoubleTap) return false;
      self.resetHeaderForRoom();
      self.isDoubleTap = true;
      //深copy
      for (var i in self.panelTransform) {
        self.lastTransform[i] = self.panelTransform[i];
      }
      self.roomObjList[self.currentRoomId].init();
      self.offRoomEvent(self.currentRoomId);
    },
    offRoomEvent: function(roomId) {
      this.roomHammerList[roomId].destroy("tap doubletap panstart panmove panend");
      delete this.roomHammerList[roomId];
    },
    drawRotateBlock: function() {
      var rotateSvg = document.getElementById("svg-angle");
      var svgData = {
        name: "g",
        attrs: "translate(0,-90)",
        child: [{
          name: "rect",
          attrs: {
            x: "100",
            y: "100",
            width: "20",
            height: "380",
            fill: "#2f91d7",
            "fill-opacity": 0.6,
          },
        }, {
          name: "line",
          attrs: {
            x1: "50",
            y1: "110",
            x2: "70",
            y2: "110",
            stroke: "black"
          }
        }, {
          name: "text",
          attrs: {
            x: "30",
            y: "115",
            "font-size": "12px"
          },
          textContent: "0°"
        }, {
          name: "line",
          attrs: {
            x1: "60",
            y1: "200",
            x2: "70",
            y2: "200",
            stroke: "black"
          }
        }, {
          name: "text",
          attrs: {
            x: "25",
            y: "205",
            "font-size": "12px"
          },
          textContent: "90°"
        }, {
          name: "line",
          attrs: {
            x1: "55",
            y1: "290",
            x2: "70",
            y2: "290",
            stroke: "black"
          }
        }, {
          name: "text",
          attrs: {
            x: "20",
            y: "295",
            "font-size": "12px"
          },
          textContent: "180°"
        }, {
          name: "line",
          attrs: {
            x1: "60",
            y1: "380",
            x2: "70",
            y2: "380",
            stroke: "black"
          }
        }, {
          name: "text",
          attrs: {
            x: "20",
            y: "385",
            "font-size": "12px"
          },
          textContent: "270°"
        }, {
          name: "line",
          attrs: {
            x1: "55",
            y1: "470",
            x2: "70",
            y2: "470",
            stroke: "black"
          }
        }, {
          name: "text",
          attrs: {
            x: "20",
            y: "475",
            "font-size": "12px"
          },
          textContent: "360°"
        }, {
          name: "rect",
          attrs: {
            id: "angle-rect",
            x: "90",
            y: "100",
            width: "40",
            height: "20",
            fill: "#2f91d7",
            stroke: "#2f91d7",
            "stroke-width": "2"
          }
        }]
      }
      var element = document.createElementNS('http://www.w3.org/2000/svg', "g");
      element.setAttribute("transform", svgData.attrs);
      for (var i = 0, len = svgData.child.length; i < len; i++) {
        var subElement = resetSVG(svgData.child[i].name, svgData.child[i].attrs);
        if (svgData.child[i].textContent) {
          subElement.textContent = svgData.child[i].textContent;
        }
        element.appendChild(subElement);
      }
      rotateSvg.appendChild(element);
    },
    showCreatedProject: function() {
      var roomDom, roomAttrs, items, unique, isTurn, itemInfo, subElement;
      var project = JSON.parse(localStorage.getItem(this.id));
      if (typeof project == "string") {
        project = JSON.parse(project);
      }
      this.svgPanel.setAttribute("transform", project.svgData.attrs.transform);
      this.panelTransform = this.getTransform(project.svgData.attrs.transform);
      this.setVirtualData("firstLoad", project);

      roomList = project.room;
      for (var i = 0, len = roomList.length; i < len; i++) {
        roomDom = document.createElementNS('http://www.w3.org/2000/svg', "g");
        roomAttrs = roomList[i].svgData.attrs;
        for (var k in roomAttrs) {
          roomDom.setAttribute(k, roomAttrs[k])
        }
        items = roomList[i].child;
        for (var j = 0, len2 = items.length; j < len2; j++) {
          if (items[j].svgData.name == "g" && items[j].svgData.unique) {
            unique = items[j].svgData.unique;
            isTurn = false;
            if (unique.charAt(unique.length - 1) == "t") {
              unique = unique.substr(0, unique.length - 1);
              isTurn = true;
            }
            itemInfo = this.dataList.getData(unique);
            subElement = this.showRoomItem(items[j].svgData.attrs, itemInfo, isTurn);
            if (subElement.getAttribute("wallId")) {
              tmpChild = subElement.children;
              for (var k = 0, len3 = tmpChild.length; k < len3; k++) {
                if (tmpChild[k].tagName == "g" && tmpChild[k].getAttribute("data-style")) {
                  tmpChild[k].setAttribute("transform", items[j].svgData.child[0].svgData.attrs.transform)
                }
              }
            }
          } else if (items[j].svgData.name == "g" &&
            items[j].svgData.attrs["data-type"] == "size-text") {
            subElement = this.showMarkLine(items[j].svgData);
            //var subElement = this.showRoomLineInfo(items[j].svgData);
          } else {
            subElement = resetSVG(items[j].svgData.name, items[j].svgData.attrs);
          }
          roomDom.appendChild(subElement);
        }
        this.svgPanel.appendChild(roomDom);
        this.roomCount++;
        this.roomDomList[roomAttrs.id] = roomDom;
        this.addRoomEvent(roomDom);
        this.roomObjList[roomAttrs.id] = new Room(this, roomDom);
      }
    },
    addDefaultRoom: function(type) {
      var self = this;
      this.addRoomDom.hide();
      var roomData = this.dataList.getData("room", ++this.roomCount);
      var transform, roomSvg, history;
      this.panelTransform = this.getTransform(this.svgPanel.getAttribute("transform"));
      if (this.roomCount > 1) {
        transform = this.getNewRoomTranform();
        roomData.attrs.transform = "translate(" + transform.translateX + "," +
          transform.translateY + ") " + "scale(" + transform.scale + ") " +
          "rotate(" + transform.angle + " " + transform.rotateX + "," + transform.rotateY + ")";
      }
      roomSvg = this.createRoomSvg(roomData);
      roomSvg.setAttribute("name", type);
      this.svgPanel.appendChild(roomSvg);
      this.title.html(type);
      this.currentRoomId = roomSvg.id;
      this.currentRoom = roomSvg;
      this.roomDomList[this.currentRoomId] = this.currentRoom;
      if (this.roomCount == 1) {
        transform = this.getTransform(this.currentRoom.getAttribute("transform"));
      }
      this.setVirtualData("create", roomData, transform);

      this.svgPanel.style.transform = "translate(" + (this.panelTransform.translateX) + "px," +
        (this.panelTransform.translateY) + "px) " + "scale(" + this.panelTransform.scale + ") " +
        "rotate(0)";
      this.addRoomEvent(this.currentRoom);
      this.roomObjList[this.currentRoomId] = new Room(this, this.currentRoom);
      this.doubleHighLightRoom();

      history = {
        element: "room",
        type: "add",
        id: roomSvg.id,
      }
      this.history.push(history);
      if (this.history.length > 0) {
        this.resetBtn.show();
      }
    },
    addArbitraryRoom: function() {
      return mui.alert("暂不支持，敬请期待", "优速Max");
    },
    deleteRoom: function() {
      for (var i = this.history.length - 1; i >= 0; i--) {
        if (this.history[i].id == this.currentRoomId) {
          this.history.splice(i, 1);
        }
      }
      if (this.history.length <= 0) {
        this.resetBtn.hide();
      }
      this.roomObjList[this.currentRoomId].removeAllEvent();
      this.svgPanel.removeChild(this.currentRoom);
      delete this.roomDomList[this.currentRoomId];
      delete this.roomObjList[this.currentRoomId];
      delete this.virtualData[this.currentRoomId];
      this.currentRoom = null;
      this.currentRoomId = null;
      this.roomCount--;
      this.resetBottomForPanel();
      this.reBindFooterEvent();
    },
    setVirtualData: function(type, data, transform) {
      var roomId, subArray, roomData, roomList, childData, child;
      if (type == "create") {
        roomId = data.attrs.id;
        subArray = data.subArray;
        roomData = {};
        this.virtualData[roomId] = {
          transform: transform,
          child: {}
        }
        for (var i = 0, len = subArray.length; i < len; i++) {
          if (subArray[i].name == "polygon") {
            roomData[subArray[i].attrs.id] = {
              name: "polygon",
              points: subArray[i].attrs.points
            }
          } else if (subArray[i].name == "line") {
            roomData[subArray[i].attrs.id] = {
              name: "line",
              stroke: subArray[i].attrs.stroke,
              "stroke-width": subArray[i].attrs["stroke-width"],
              x1: parseInt(subArray[i].attrs.x1),
              y1: parseInt(subArray[i].attrs.y1),
              x2: parseInt(subArray[i].attrs.x2),
              y2: parseInt(subArray[i].attrs.y2),
            }
          } else if (subArray[i].name == "circle") {
            roomData[subArray[i].attrs.id] = {
              name: "circle",
              cx: parseInt(subArray[i].attrs.cx),
              cy: parseInt(subArray[i].attrs.cy),
              fill: subArray[i].attrs.fill,
              stroke: subArray[i].attrs.stroke,
            }
          }
        }
        this.virtualData[roomId].child = roomData;
      } else if (type == "firstLoad") {
        roomList = data.room;
        roomData = {};
        childData = {};
        for (var i = 0, len = roomList.length; i < len; i++) {
          roomData.transform = this.getTransform(roomList[i].svgData.attrs.transform);
          child = roomList[i].child;
          for (var j = 0, len2 = child.length; j < len2; j++) {
            if (child[j].svgData.name == "polygon") {
              childData[child[j].svgData.attrs.id] = {
                name: "polygon",
                points: child[j].svgData.attrs.points
              }
            } else if (child[j].svgData.name == "line") {
              childData[child[j].svgData.attrs.id] = {
                name: "line",
                stroke: child[j].svgData.attrs.stroke,
                "stroke-width": child[j].svgData.attrs["stroke-width"],
                x1: parseInt(child[j].svgData.attrs.x1),
                y1: parseInt(child[j].svgData.attrs.y1),
                x2: parseInt(child[j].svgData.attrs.x2),
                y2: parseInt(child[j].svgData.attrs.y2),
              }
            } else if (child[j].svgData.name == "circle") {
              childData[child[j].svgData.attrs.id] = {
                name: "circle",
                cx: parseInt(child[j].svgData.attrs.cx),
                cy: parseInt(child[j].svgData.attrs.cy),
                fill: child[j].svgData.attrs.fill,
                stroke: child[j].svgData.attrs.stroke,
              }
            }
          }
          roomData.child = childData;
          childData = {};
          this.virtualData[roomList[i].svgData.attrs.id] = roomData;
          roomData = {};
        }
      }
    },
    updateVirtualData: function() {
      var roomList = this.roomListDom;
      var roomData = {};
      var childData = {};
      for (var i = 0, len = roomList.length; i < len; i++) {
        roomData.transform = this.getTransform(roomList[i].getAttribute("transform"));
        var child = roomList[i].children;
        for (var j = 0, len2 = child.length; j < len2; j++) {
          if (child[j].tagName == "polygon") {
            childData[child[j].id] = {
              name: "polygon",
              points: child[j].getAttribute("points")
            }
          } else if (child[j].tagName == "line") {
            childData[child[j].id] = {
              name: "line",
              stroke: child[j].getAttribute("stroke"),
              "stroke-width": child[j].getAttribute("stroke-width"),
              x1: parseInt(child[j].getAttribute("x1")),
              y1: parseInt(child[j].getAttribute("y1")),
              x2: parseInt(child[j].getAttribute("x2")),
              y2: parseInt(child[j].getAttribute("y2")),
            }
          } else if (child[j].tagName == "circle") {
            childData[child[j].id] = {
              name: "circle",
              cx: parseInt(child[j].getAttribute("cx")),
              cy: parseInt(child[j].getAttribute("cy")),
              fill: child[j].getAttribute("fill"),
              stroke: child[j].getAttribute("stroke"),
            }
          }
        }
        roomData.child = childData;
        childData = {};
        this.virtualData[roomList[i].id] = roomData;
        roomData = {};
      }
    },
    createRoomSvg: function(data) {
      var element = document.createElementNS('http://www.w3.org/2000/svg', "g");
      var roomAttrs = data.attrs;
      for (var k in roomAttrs) {
        element.setAttribute(k, roomAttrs[k]);
      }
      var subArray = data.subArray;
      var index = 0;
      var child, textElement;
      for (var i = 0, len = subArray.length; i < len; i++) {
        var subElement = resetSVG(subArray[i].name, subArray[i].attrs);
        if (subArray[i].name == "g") {
          child = subArray[i].child;
          for (var j = 0, len2 = child.length; j < len2; j++) {
            textElement = resetSVG(child[j].name, child[j].attrs);
            if (child[j].name == "text") {
              textElement.textContent = attrs.text[index];
              index++;
            }
            subElement.appendChild(textElement);
          }
        }
        element.appendChild(subElement);
      }
      return element;
    },
    getTransform: function(transform) {
      var translate = transform.match(/translate\((-?\+?[\d]+),(-?\+?[\d]+)\)/);
      var scale = transform.match(/scale\((-?\+?[\d]+\.[\d]+|-?\+?[\d]+)/);
      var rotate = transform.match(/rotate\((-?\+?[\d]+\.[\d]+|-?\+?[\d]+)\s([\d]+),([\d]+)\)/);
      var translateX = parseInt(translate[1]);
      var translateY = parseInt(translate[2]);
      scale = scale[1] ? parseFloat(scale[1]) : 1;
      var angle = parseFloat(rotate[1]);
      var rotateX = parseFloat(rotate[2]);
      var rotateY = parseFloat(rotate[3]);
      transformDetail = {
        translateX: translateX,
        translateY: translateY,
        scale: scale,
        angle: angle,
        rotateX: rotateX,
        rotateY: rotateY
      };
      return transformDetail;
    },
    getNewRoomTranform: function() {
      var maxX = 0;
      var minY = Infinity;
      var maxY = 0;
      var room, translateX, translateY, childs, child;
      for (var key in this.virtualData) {
        room = this.virtualData[key];
        translateX = room.transform.translateX;
        translateY = room.transform.translateY;
        childs = room.child;
        for (var index in childs) {
          child = childs[index];
          if (child.name == "circle") {
            if (maxX < translateX + child.cx) maxX = translateX + child.cx;
            if (maxY < translateY + child.cy) maxY = translateY + child.cy;
            if (translateY + child.cy < minY) minY = translateY + child.cy;
          }
        }
      }
      var transform = {
        translateX: maxX + 60,
        translateY: parseInt((maxY + minY) / 2),
        scale: 1,
        angle: 0,
        rotateX: 300,
        rotateY: 250
      };
      return transform;
    },
    resetPanelForDoubleTap: function() {
      var self = this;
      if (!self.isDoubleTap) return false;
      self.resetAllRoom();
      //在room中更新panelTransform放缩，而lastTransform深copy不会变
      self.svgPanel.style.transform = "translate(" + (self.panelTransform.translateX) + "px," +
        (self.panelTransform.translateY) + "px) " + "scale(" + self.panelTransform.scale + ") " +
        "rotate(0)";
      setTimeout(function() {
        self.svgPanel.style.transition = "all 0.5s ease-in";
        self.svgPanel.style.transform = "translate(" + (self.lastTransform.translateX) + "px," +
          (self.lastTransform.translateY) + "px) " + "scale(" + self.lastTransform.scale + ") rotate(0)";
        setTimeout(function() {
          self.svgPanel.setAttribute("transform", "translate(" + (self.lastTransform.translateX) + "," +
            (self.lastTransform.translateY) + ") " + "scale(" + self.lastTransform.scale + ") " +
            "rotate(" + self.lastTransform.angle + " " + self.lastTransform.rotateX + "," + self.lastTransform.rotateY + ")");
          self.svgPanel.style.transition = "";
          self.svgPanel.style.transform = "";
          self.panelTransform = self.getTransform(self.svgPanel.getAttribute("transform"));
        }, 500);
      }, 100);
      self.resetBottomForPanel();
      self.resetHeaderForPanel();
      self.addRoomEvent(self.currentRoom);
      // self.resetAllRoom();
      self.isDoubleTap = false;
      self.roomObjList[self.currentRoomId].removeAllEvent();
      self.updateVirtualData();
      self.reBindFooterEvent();
    },
    resetBottomForRoom: function() {
      var dom = '<li class="footer-list" id="highLight-room">' +
        '<div class="footer-img">' +
        '<img class="footer-add" src="img/usu/edit.svg" alt="" />' +
        '</div>' +
        '<div class="footer-text">' +
        '<span>房间编辑</span>' +
        '</div>' +
        '</li>' +
        '<li class="footer-list">' +
        '</li>' +
        '<li class="footer-list">' +
        '</li>' +
        '<li class="footer-list">' +
        '</li>' +
        '<li class="footer-list">' +
        '</li>' +
        '<li class="footer-list" id="delete-room">' +
        '<div class="footer-img">' +
        '<img class="footer-normal" src="img/usu/delete.svg" alt="" />' +
        '</div>' +
        '<div class="footer-text">' +
        '<span>删除</span>' +
        '</div>' +
        '</li>';
      this.footerDom.html(dom);
    },
    resetBottomForPanel: function() {
      var dom =
        '<li class="footer-list" id="addRoom">' +
        '<div class="footer-img">' +
        '<img class="footer-normal" src="img/usu/addRoom-@3x.png" alt="" />' +
        '</div>' +
        '<div class="footer-text">' +
        '<span>添加房间</span>' +
        '</div>' +
        '</li>' +
        '<li class="footer-list">' +
        '</li>' +
        '<li class="footer-list">' +
        '</li>' +
        '<li class="footer-list">' +
        '</li>' +
        '<li class="footer-list">' +
        '</li>' +
        '<li class="footer-list" id="save-project">' +
        '<div class="footer-img">' +
        '<img class="footer-normal" src="img/usu/save.png" alt="" />' +
        '</div>' +
        '<div class="footer-text">' +
        '<span>保存</span>' +
        '</div>' +
        '</li>';
      this.footerDom.html(dom);
    },
    resetHeaderForRoom: function() {
      this.headerBack.hide();
      this.headerFinish.show();
    },
    resetHeaderForPanel: function() {
      this.headerFinish.hide();
      this.headerBack.show();
    },
    resetAllRoom: function() {
      var self = this;
      var child, subChild, borderChild;
      self.title.html("优速Max");
      for (var index in self.roomDomList) {
        child = self.roomDomList[index].children;
        for (var i = 0, len = child.length; i < len; i++) {
          if (child[i].tagName == "polygon") {
            child[i].setAttribute("fill-opacity", 1);
          } else if (child[i].tagName == "line") {
            child[i].setAttribute("stroke", "black");
            child[i].setAttribute("stroke-width", "14");
          } else if (child[i].tagName == "circle") {
            child[i].setAttribute("stroke", "black");
            child[i].setAttribute("fill", "black");
            child[i].setAttribute("r", "6");
          } else if (child[i].tagName == "g") {
            child[i].style.display = "block";
            if (child[i].getAttribute("data-type") == "text") {
              child[i].style.display = "none";
            }

            if (child[i].tagName == "g" &&
              child[i].getAttribute("item-unique") &&
              !child[i].getAttribute("wallId")) {
              subChild = child[i].childNodes;
              subChild[subChild.length - 2].style.display = "none";
              borderChild = subChild[subChild.length - 2].childNodes;
              for (var j = 0, len2 = borderChild.length; j < len2; j++) {
                borderChild[j].setAttribute("stroke", "blue");
              }
              subChild[subChild.length - 3].style.display = "none";
            }
            self.isShowSize = false;
          }
        }
      }
    },
    highLightRoomWall: function(roomDomId) {
      var self = this;
      var roomList = this.roomDomList;
      var room, child;
      for (var roomId in roomList) {
        room = roomList[roomId];
        child = room.children;
        if (room.id != roomDomId) {
          for (var j = 0, len = child.length; j < len; j++) {
            if (child[j].tagName == "line") {
              child[j].setAttribute("stroke", "black");
              child[j].setAttribute("stroke-width", "14");
            } else if (child[j].tagName == "circle") {
              child[j].setAttribute("stroke", "black");
              child[j].setAttribute("fill", "black");
              child[j].setAttribute("r", "6");
            } else if (child[j].tagName == "g" &&
              child[j].getAttribute("data-type") == "text") {
              child[j].style.display = "none";
            }
          }
        } else {
          for (var j = 0, len = child.length; j < len; j++) {
            if (child[j].tagName == "line") {
              child[j].setAttribute("stroke", "red");
              child[j].setAttribute("stroke-width", "14");
            } else if (child[j].tagName == "circle") {
              child[j].setAttribute("stroke", "red");
              child[j].setAttribute("fill", "red");
              child[j].setAttribute("fill-opacity", "1");
              child[j].setAttribute("r", "6");
            } else if (child[j].tagName == "g") {
              child[j].style.display = "block";
              if (child[j].tagName == "g" &&
                child[j].getAttribute("data-type") == "text") {
                child[j].style.display = "none";
              }
            }
          }
        }
      }
    },
    showAddRoom: function() {
      var self = this;
      this.isWheel = false;
      this.wallMask.innerHTML = '<div id="addRoomSection"' +
        ' class="rotate-mask" style="background: rgba(0,0,0,0.1)"></div>';
      this.maskDom = $("#addRoomSection");
      this.maskDom.show();
      this.addRoomDom.show();
      this.maskDom.on("click", function() {
        self.maskDom.hide();
        self.maskDom.off("click");
        self.addRoomDom.hide();
        self.isWheel = true;
      })
    },
    showRoomItem: function(attrs, itemInfo, isTurn) {
      var element = document.createElementNS('http://www.w3.org/2000/svg', "g");
      for (var key in attrs) {
        element.setAttribute(key, attrs[key]);
      }
      attrs.width = parseInt(attrs.width);
      attrs.height = parseInt(attrs.height);
      var itemUnique = attrs['item-unique'];
      var subArray = itemInfo.child;
      var subElement, subChild, childEle, tmpData, tmp, sizeData, border, subElement, domData, opacity;
      if (subArray) {

        console.log(subArray[0].attrs['xlink:href'], isTurn);
        for (var i = 0, len = subArray.length; i < len; i++) {
          if (subArray[i].attrs['xlink:href'] !== undefined) {
            if (isTurn) {
              subArray[i].attrs['xlink:href'] = subArray[0].attrs['xlink:href'].replace(/t?.png/, "t.png");
            } else {
              subArray[i].attrs['xlink:href'] = subArray[0].attrs['xlink:href'].replace(/t?.png/, ".png");
            }
          }
          subElement = resetSVG(subArray[i].name, subArray[i].attrs);
          subChild = subArray[i].child;
          if (subChild) {
            for (var j = 0, childLen = subChild.length; j < childLen; j++) {
              childEle = resetSVG(subChild[j].name, subChild[j].attrs);
              subElement.appendChild(childEle);
            }
          }

          element.appendChild(subElement);

        }
      }
      if (!element.getAttribute("wallId")) {
        tmpData = {
          name: "circle",
          attrs: {
            cx: 0,
            cy: 0,
            r: 10,
            fill: "white",
            stroke: "red",
            "stroke-width": 2,
            style: 'display:none',
          }
        }
        tmp = resetSVG(tmpData.name, tmpData.attrs);
        element.appendChild(tmp);
        sizeData = {
          name: "g",
          child: [{
            name: "path",
            attrs: {
              d: "M0 0 L" + attrs.width + " 0 " + attrs.width + " " + attrs.height +
                " 0 " + attrs.height + "z",
              stroke: "blue",
              fill: "none",
              "fill-opacity": 0,
              "stroke-width": 2,
            }
          }, {
            name: "circle",
            attrs: {
              cx: 0,
              cy: 0,
              r: 10,
              fill: "white",
              stroke: "blue",
              "stroke-width": 2,
            }
          }, {
            name: "circle",
            attrs: {
              cx: attrs.width,
              cy: 0,
              r: 10,
              fill: "white",
              stroke: "blue",
              "stroke-width": 2,
            }
          }, {
            name: "circle",
            attrs: {
              cx: attrs.width,
              cy: attrs.height,
              r: 10,
              fill: "white",
              stroke: "blue",
              "stroke-width": 2,
            }
          }, {
            name: "circle",
            attrs: {
              cx: 0,
              cy: attrs.height,
              r: 10,
              fill: "white",
              stroke: "blue",
              "stroke-width": 2,
            }
          }],
          attrs: {
            "data-type": "item-border",
            style: 'display:none',
            "id": attrs.id + "-size",
          }
        };
        border = resetSVG(sizeData.name, sizeData.attrs);
        for (var i = 0, len = sizeData.child.length; i < len; i++) {
          subElement = resetSVG(sizeData.child[i].name, sizeData.child[i].attrs);
          border.appendChild(subElement);
        }
        element.appendChild(border);
        domData = {
          name: "g",
          child: [{
            name: "path",
            attrs: {
              "data-type": "item-opacity",
              d: "M250 0 L150 50 200 50 200 200 50 200 50 150 0 250 50 350 50 300 " +
                "200 300 200 450 150 450 250 500 350 450 300 450 300 300 450 300 450 " +
                "350 500 250 450 150 450 200 300 200 300 50 350 50 z",
              fill: "blue",
              stroke: "black",
              "stroke-width": 2,
              "fill-opacity": "0.5",
              transform: "translate(" + (attrs.width - 75) / 2 + "," + (attrs.height - 75) / 2 + ") scale(0.15)",
            }
          }, {
            name: "path",
            attrs: {
              d: "M-2 -2 L10 -2 M-2 -2 L -2 10",
              stroke: "red",
              "stroke-width": 2,
            }
          }, {
            name: "path",
            attrs: {
              d: "M" + (attrs.width + 2) + " -2 L" + (attrs.width - 10) + "-2 M" + (attrs.width + 2) + " -2 L" + (attrs.width + 2) + " 10",
              stroke: "red",
              "stroke-width": 2,
            }
          }, {
            name: "path",
            attrs: {
              d: "M" + (attrs.width + 2) + " " + (attrs.height + 2) + " L" + (attrs.width - 10) + " " +
                (attrs.height + 2) + " M" + (attrs.width + 2) + " " + (attrs.height + 2) + " L" + (attrs.width + 2) + " " + (attrs.height - 10),
              stroke: "red",
              "stroke-width": 2,
            }
          }, {
            name: "path",
            attrs: {
              d: "M-2 " + (attrs.height + 2) + " L10 " +
                (attrs.height + 2) + " M-2 " + (attrs.height + 2) + " L-2 " + (attrs.height - 10),
              stroke: "red",
              "stroke-width": 2,
            }
          }, ],
          attrs: {
            "data-type": "item-opacity",
            style: 'display:none'
          }
        };
      } else {
        domData = {
          name: "g",
          child: [{
            name: "path",
            attrs: {
              d: "M-2 -2 L10 -2 M-2 -2 L -2 10",
              stroke: "red",
              "stroke-width": 2,
            }
          }, {
            name: "path",
            attrs: {
              d: "M" + (attrs.width + 2) + " -2 L" + (attrs.width - 10) + "-2 M" + (attrs.width + 2) + " -2 L" + (attrs.width + 2) + " 10",
              stroke: "red",
              "stroke-width": 2,
            }
          }, {
            name: "path",
            attrs: {
              d: "M" + (attrs.width + 2) + " " + (attrs.height + 2) + " L" + (attrs.width - 10) + " " +
                (attrs.height + 2) + " M" + (attrs.width + 2) + " " + (attrs.height + 2) + " L" + (attrs.width + 2) + " " + (attrs.height - 10),
              stroke: "red",
              "stroke-width": 2,
            }
          }, {
            name: "path",
            attrs: {
              d: "M-2 " + (attrs.height + 2) + " L10 " +
                (attrs.height + 2) + " M-2 " + (attrs.height + 2) + " L-2 " + (attrs.height - 10),
              stroke: "red",
              "stroke-width": 2,
            }
          }, ],
          attrs: {
            "data-type": "item-opacity",
            style: 'display:none'
          }
        };
      }
      opacity = resetSVG(domData.name, domData.attrs);
      for (var i = 0, len = domData.child.length; i < len; i++) {
        subElement = resetSVG(domData.child[i].name, domData.child[i].attrs);
        opacity.appendChild(subElement);
      }

      element.appendChild(opacity);
      return element;
    },
    showMarkLine: function(data) {
      var element = document.createElementNS('http://www.w3.org/2000/svg', "g");
      for (var key in data.attrs) {
        element.setAttribute(key, data.attrs[key]);
      }
      var subArray = data.child;
      var subElement;
      for (var i = 0, len = subArray.length; i < len; i++) {
        subElement = resetSVG(subArray[i].svgData.name, subArray[i].svgData.attrs);
        element.appendChild(subElement);
        if (subArray[i].svgData.name == "text") {
          subElement.textContent = subArray[i].svgData.textContent;
        }
      }
      return element;
    },
    showDashInfoLine: function(childId, x, y, dashId) {
      var self = this;
      var curRoom = self.roomDomList[childId];
      var dash = curRoom.children;
      var flag = false;
      for (var i = dash.length - 1; i >= 0; i--) {
        if (dash[i] && (dash[i].id == dashId + "-" + 1 ||
            dash[i].id == dashId + "-" + 2 || dash[i].id == dashId + "-" + 3)) {
          return;
        }
      }
      var attrs = {
        x1: x - 100,
        y1: y,
        x2: x + 100,
        y2: y,
        "stroke-dasharray": "50,20,10,20",
        stroke: "#00e500",
        "stroke-width": "4",
        id: dashId + "-" + 1,
        type: "dash"
      };
      var subElement = resetSVG("line", attrs);
      var attrs2 = {
        x1: x,
        y1: y - 100,
        x2: x,
        y2: y + 100,
        "stroke-dasharray": "50,20,10,20",
        stroke: "#00e500",
        "stroke-width": "4",
        id: dashId + "-" + 2,
        type: "dash"
      };
      var subElement2 = resetSVG("line", attrs2);
      var attrs3 = {
        cx: x,
        cy: y,
        r: 10,
        stroke: "#00e500",
        "stroke-width": "3",
        "fill-opacity": "0.8",
        fill: "#00e500",
        id: dashId + "-" + 3,
        type: "dash"
      };
      var subElement3 = resetSVG("circle", attrs3);
      curRoom.appendChild(subElement);
      curRoom.appendChild(subElement2);
      curRoom.appendChild(subElement3);
    },
    deleteDashInfoLine: function(childId, dashId) {
      var self = this;
      var curRoom = self.roomDomList[childId];
      var dash = curRoom.children;
      for (var i = dash.length - 1; i >= 0; i--) {
        if (dash[i] && (dash[i].id == dashId + "-" + 1 ||
            dash[i].id == dashId + "-" + 2 || dash[i].id == dashId + "-" + 3)) {
          curRoom.removeChild(dash[i]);
        }
      }
    },
    getItemDataList: function() {
      var project = JSON.parse(localStorage.getItem(this.id));
      if (typeof project == "string") {
        project = JSON.parse(project)
      }
      var itemDataList = project.itemInfo;
      localStorage.setItem("itemDataList", JSON.stringify(itemDataList));
    },
    drawInfoLineForSave: function() {
      var lineNum, i, j, child;
      var roomList = this.svgPanel.children;
      for (i = 0, len = roomList.length; i < len; i++) {
        child = roomList[i].children;
        lineNum = 0;
        for (j = 0, len2 = child.length; j < len2; j++) {
          if (child[i].tagName == "line") {
            lineNum++;
          }
        }
        this.drawInfoLine(roomList[i], child, lineNum);
      }
    },
    saveProject: function(isAlert) {
      var project = JSON.parse(localStorage.getItem(this.id));
      if (typeof project == "string") {
        project = JSON.parse(project)
      }
      project = getProjectInfo(project);
      var itemDataList = JSON.parse(localStorage.getItem("itemDataList"));
      if (itemDataList == null) {
        itemDataList = {};
      }
      project.itemInfo = itemDataList;
      localStorage.setItem(this.id, JSON.stringify(project));
      if (isAlert) {
        mui.alert("保存成功", '优速Max');
      }
    },
    /**
     * 此函数和Room中相同，没有重用，待改进
     * @param  {[type]} room      [description]
     * @param  {[type]} child     [description]
     * @param  {[type]} lineCount [description]
     * @return {[type]}           [description]
     */
    drawInfoLine: function(room, child, lineCount) {
      var sizeTextList = [];
      for (var i = child.length - 1; i >= 0; i--) {
        if (child[i].tagName == "g" && child[i].getAttribute("data-type") == "text") {
          room.removeChild(child[i]);
        } else if (child[i].tagName == "g" &&
          child[i].getAttribute("data-type") == "size-text") {
          sizeTextList.push(child[i]);
          room.removeChild(child[i]);
        }
      }

      var points = covertPolygon(child[0].getAttribute("points"));
      var x1, y1, x2, y2, childLineId, line1X2, line1Y2, line2X1, line2Y1, line2X2, line2Y2,
        line3X1, line3Y1, line3X2, line3Y2, line4X, line4Y, textX, textY, edgeLength, textId,
        position, textStyle, arrowPath1, arrowPath2, pointsInfo, element, subElement;
      //var child = virtualData.child;
      for (var i = 0, len = child.length; i < len; i++) {
        if (child[i].tagName == "line") {
          x1 = parseInt(child[i].getAttribute("x1"));
          y1 = parseInt(child[i].getAttribute("y1"));
          x2 = parseInt(child[i].getAttribute("x2"));
          y2 = parseInt(child[i].getAttribute("y2"));
          childLineId = child[i].id;

          textX = (x1 + x2) / 2;
          textY = (y1 + y2) / 2;
          edgeLength = (Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) / 100).toFixed(2);
          /*调整手动输入时0.01的误差*/
          if (Math.abs(Math.ceil(edgeLength) - edgeLength <= 0.01)) {
            edgeLength = Math.ceil(edgeLength).toFixed(2);
          }
          textId = getUid("lineInfo");
          position = "";
          textStyle = "";
          arrowPath1 = "";
          arrowPath2 = "";
          if (Math.abs(y2 - y1) / Math.abs(x2 - x1) <= 1) {
            textY += 50;
            textStyle = "lr";
            line1X1 = x1;
            line1X2 = x1;
            line3X1 = x2;
            line3X2 = x2;
            line2X1 = x1;
            line2X2 = x2;
            if (isInPolygon(textX, textY, points)) {
              position = "horizon-up";
              textY -= 90;
              line1Y2 = y1 - 40;
              line3Y2 = y2 - 40;
              line2Y1 = y1 - 30;
              line2Y2 = y2 - 30;

              line1Y1 = y1 - 18;
              line3Y1 = y2 - 18;
            } else {
              position = "horizon-down";
              line1Y2 = y1 + 40;
              line3Y2 = y2 + 40;
              line2Y1 = y1 + 30;
              line2Y2 = y2 + 30;

              line1Y1 = y1 + 18;
              line3Y1 = y2 + 18;
            }
            if (x1 >= x2) {
              arrowPath1 = "M" + (line2X1 - 5) + "," + (line2Y1 - 5) + " L" + line2X1 + "," + line2Y1 + " L" +
                (line2X1 - 5) + "," + (line2Y1 + 5);
              arrowPath2 = "M" + (line2X2 + 5) + "," + (line2Y2 - 5) + " L" + line2X2 + "," + line2Y2 + " L" +
                (line2X2 + 5) + "," + (line2Y2 + 5);
            } else {
              arrowPath1 = "M" + (line2X1 + 5) + "," + (line2Y1 - 5) + " L" + line2X1 + "," + line2Y1 + " L" +
                (line2X1 + 5) + "," + (line2Y1 + 5);
              arrowPath2 = "M" + (line2X2 - 5) + "," + (line2Y2 - 5) + " L" + line2X2 + "," + line2Y2 + " L" +
                (line2X2 - 5) + "," + (line2Y2 + 5);
            }
          } else {
            textX += 50;
            textStyle = "tb";
            line1Y1 = y1;
            line1Y2 = y1;
            line3Y1 = y2;
            line3Y2 = y2;
            line2Y1 = y1;
            line2Y2 = y2;
            if (isInPolygon(textX, textY, points)) {
              position = "vertical-left";
              textX -= 100;
              line1X2 = x1 - 40;
              line3X2 = x2 - 40;
              line2X1 = x1 - 30;
              line2X2 = x2 - 30;
              line1X1 = x1 - 18;
              line3X1 = x2 - 18;
            } else {
              position = "vertical-right";
              line1X2 = x1 + 40;
              line3X2 = x2 + 40;
              line2X1 = x1 + 30;
              line2X2 = x2 + 30;
              line1X1 = x1 + 18;
              line3X1 = x2 + 18;
            }
            if (y1 >= y2) {
              arrowPath1 = "M" + (line2X1 - 5) + "," + (line2Y1 - 5) + " L" + line2X1 + "," + line2Y1 + " L" +
                (line2X1 + 5) + "," + (line2Y1 - 5);
              arrowPath2 = "M" + (line2X2 - 5) + "," + (line2Y2 + 5) + " L" + line2X2 + "," + line2Y2 + " L" +
                (line2X2 + 5) + "," + (line2Y2 + 5);
            } else {
              arrowPath1 = "M" + (line2X1 - 5) + "," + (line2Y1 + 5) + " L" + line2X1 + "," + line2Y1 + " L" +
                (line2X1 + 5) + "," + (line2Y1 + 5);
              arrowPath2 = "M" + (line2X2 - 5) + "," + (line2Y2 - 5) + " L" + line2X2 + "," + line2Y2 + " L" +
                (line2X2 + 5) + "," + (line2Y2 - 5);
            }
          }
          pointsInfo = {
            name: "g",
            attrs: {
              "data-type": "text",
              position: position,
              lineId: childLineId
            },
            child: [{
              name: "line",
              attrs: {
                x1: line1X1,
                y1: line1Y1,
                x2: line1X2,
                y2: line1Y2,
                stroke: "black",
                "stroke-width": "1"
              }
            }, {
              name: "line",
              attrs: {
                x1: line2X1,
                y1: line2Y1,
                x2: line2X2,
                y2: line2Y2,
                stroke: "black",
                "stroke-width": "1"
              }
            }, {
              name: "line",
              attrs: {
                x1: line3X1,
                y1: line3Y1,
                x2: line3X2,
                y2: line3Y2,
                stroke: "black",
                "stroke-width": "1"
              }
            }, {
              name: "text",
              attrs: {
                id: textId,
                x: textX,
                y: textY,
                fill: "blue",
                "font-size": "12px",
                "writing-mode": textStyle,
                class: "text-border"
              }
            }, {
              name: "path",
              attrs: {
                d: arrowPath1
              }
            }, {
              name: "path",
              attrs: {
                d: arrowPath2
              }
            }, {
              name: "rect",
              attrs: {
                x: textX - 20,
                y: textY - 20,
                width: 40,
                height: 40,
                fill: "#fff",
                "fill-opacity": 0
              }
            }],
          };

          element = document.createElementNS('http://www.w3.org/2000/svg', "g");
          for (var k in pointsInfo.attrs) {
            element.setAttribute(k, pointsInfo.attrs[k]);
          }
          for (var j = 0, len2 = pointsInfo.child.length; j < len2; j++) {
            subElment = resetSVG(pointsInfo.child[j].name, pointsInfo.child[j].attrs);
            if (pointsInfo.child[j].name == "text") {
              subElment.textContent = edgeLength;
            }
            element.appendChild(subElment);
          }
          room.appendChild(element);
        }
      }
      for (var i = 0, len = sizeTextList.length; i < len; i++) {
        room.appendChild(sizeTextList[i]);
      }
    },
  };
  window['MainFrame'] = MainFrame;
})(jQuery, window);