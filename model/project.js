(function($, window) {
	var Project = function(options) {
		var self = this;
		this.id = getUrlParam("id");
		this.User = User.prototype;
		this.Index = Index.prototype;
		this.email = '';
		this.project = null;
		this.uploadProjectUrl = "http://usuapp.com/project/create";
		this.outPutToEmailType1Url = "http://usuapp.com/project/sendProject"; //获取获取整体方案的url
		this.outPutToEmailType2Url = "http://usuapp.com/project/sendBriefProject"; //获取房间布局图的url
		this.imageHostUrl = "http://usuapp.com/";
		this.dataList = new SubSvgList(); //家具数据列表
		this.init();
	};

	Project.prototype = {
		init: function() {
			this.initMui();
			this.getProject();
			this.getAllElement();
			this.showProjectDetail(this.id);
			this.drawSvgView();
			this.addEvent();
			this.showDataView();
		},

		initMui: function() {
			var self = this;
			/*
			 * 重写mui.js返回函数，添加自定义事件
			 * @type {[type]}
			 */
			this.oldBack = mui.back;
			mui.back = function() {
				var btn = ["确定", "取消"];
				mui.confirm('确认关闭当前窗口？', '优速Max', btn, function(e) {
					if(e.index == 0) {
						//执行mui封装好的窗口关闭逻辑；
						if(typeof plus == "undefined") {
							location.href = "./appindex.html?type=pro";
						} else {
							self.oldBack();
						}
					}
				});
			};
			mui.init({
				id: "project.html",
				beforeback: function() {
					/* 获得列表界面的webview */
					if(typeof plus != "undefined") {
						mui.plusReady(function() {
							var index = plus.webview.getLaunchWebview();

							/* 触发列表界面的自定义事件（refresh）,从而进行数据刷新 */
							mui.fire(index, 'refresh');
						});
					}
					return true;
				},
			});
		},
		getAllElement: function() {
			this.mask = $("#index-mask");
			this.content = document.querySelector("#mui-content");
			this.editSection = this.content.querySelector("#tabbar-with-edit");
			this.svgView = this.editSection.querySelector("#snap");
			this.projectDetailShow = this.editSection.querySelector("#project-detail-show");
			this.projectDetailEdit = this.editSection.querySelector("#project-detail-edit");
			this.detailTitle = this.editSection.querySelector("#detail-title-finish");
			this.detailPhone = this.editSection.querySelector("#detail-phone-finish");
			this.detailUser = this.editSection.querySelector("#detail-user-finish");
			this.detailEmail = this.editSection.querySelector("#detail-email-finish");
			this.detailAddress = this.editSection.querySelector("#detail-address-finish");
			this.detailText = this.editSection.querySelector("#detail-text-finish");
			this.detailTitleSpan = this.editSection.querySelector("#detail-title-span");
			this.detailPhoneSpan = this.editSection.querySelector("#detail-phone-span");
			this.detailUserSpan = this.editSection.querySelector("#detail-user-span");
			this.detailEmailSpan = this.editSection.querySelector("#detail-email-span");
			this.detailAddressSpan = this.editSection.querySelector("#detail-address-span");
			this.detailTextSpan = this.editSection.querySelector("#detail-text-span");
			this.detailAuthorSpan = this.editSection.querySelector("#detail-author-span");
			this.detailTimeSpan = this.editSection.querySelector("#detail-time-span");
			this.outputSection = this.content.querySelector("#tabbar-with-output");
			this.outputEmailType1Btn = this.content.querySelector("#output-email-type1");
			this.outputEmailType2Btn = this.content.querySelector("#output-email-type2");
			this.dataSection = this.content.querySelector("#tabbar-with-statistics");
		},

		drawSvgView: function() {
			showCreatedProject(this.svgView, this.id);
		},

		addEvent: function() {
			var self = this;
			    window.onerror = function (msg, url, lineNo, columnNo, error) {
        var string = msg.toLowerCase();
        var substring = "script error";
        var errorMessage = "";
        if (string.indexOf(substring) > -1){
            errorMessage = substring;
        } else {
          errorMessage = string;
        }
        var userInfo = self.User.hasLogin();
        if(userInfo) {
           var timeStamp = new Date().getTime();
           var signature = self.Index.getSignature(userInfo, timeStamp);
           var info = {
              url: errorUrl,
              type: "post",
              data: {
                user_id: userInfo.uid,
                signature: signature,
                timestamp: timeStamp,
                error:errorMessage,
                date:nowTime(),
              }
            };
        self.User.sendAjaxInfo.call(self, info,errorResult, 'json');
        }else{
          mui.alert("请先登录","优速Max");
        }
        return false;
    };
			this.editSection.addEventListener("click", function(event) {
				self.eventHandler(event);
			});
			this.outputEmailType1Btn.addEventListener("click", function(event) {
				self.outputEmail(event, 1);
			});
			this.outputEmailType2Btn.addEventListener("click", function(event) {
				self.outputEmail(event, 2);
			});

			/* 从编辑页返回后重新加载数据实现更新 */
			window.addEventListener('refresh', function(event) {
				self.svgView.innerHTML = '';
				self.getProject();
				self.drawSvgView();
				self.showDataView();
			});
		},
		eventHandler: function(event) {
			var type = event.target.id;
			switch(type) {
				case "open-edit":
					this.openEditPage(this.id);
				case "svg-view":
					this.openEditPage(this.id);
					break;
				case "detail-btn-edit":
					this.editProjectInfoShow(this.id);
					break;
				case "detail-btn-finish":
					this.saveProjectDetail(this.id);
					break;
			}
		},

		getProject: function() {
			this.project = JSON.parse(localStorage.getItem(this.id));
			/* 对于从服务器下载获取的数据，含有转义后的\ ，需要解析两次才可以去除掉 */
			if(typeof this.project == "string") {
				this.project = JSON.parse(this.project);
			}
			if(!this.project) this.oldBack();
		},

		openEditPage: function(id) {
			mui.openWindow({
				id: 'edit.html',
				url: "edit.html?id=" + id,
			});
		},

		/**
		 * 显示项目信息编辑栏
		 * @param  {[type]} id [项目id]
		 */
		editProjectInfoShow: function(id) {
			this.projectDetailShow.style.display = "none";
			this.projectDetailEdit.style.display = "block";
			var project = JSON.parse(localStorage.getItem(id));
			if(typeof project == "string") {
				project = JSON.parse(project);
			}
			this.detailTitle.value = project.name;
			this.detailPhone.value = project.phone;
			this.detailUser.value = project.contact;
			this.detailEmail.value = project.email;
			this.detailAddress.value = project.address;
			this.detailText.value = project.text;
		},

		/**
		 * 加载显示项目简介
		 * @param  {[type]} id [description]
		 * @return {[type]}    [description]
		 */
		showProjectDetail: function(id) {
			var project = JSON.parse(localStorage.getItem(id));
			if(typeof project == "string") {
				project = JSON.parse(project);
			}
			this.detailTitleSpan.innerHTML = project.name;
			this.detailPhoneSpan.innerHTML = project.phone;
			this.detailUserSpan.innerHTML = project.contact;
			this.detailEmailSpan.innerHTML = project.email;
			this.detailAddressSpan.innerHTML = project.address;
			this.detailTextSpan.innerHTML = project.text;
			this.detailAuthorSpan.innerHTML = project.author;
			this.detailTimeSpan.innerHTML = project.date;
		},

		/**
		 * 保存项目数据，可以简化此函数
		 * @param  {[type]} id [description]
		 * @return {[type]}    [description]
		 */
		saveProjectDetail: function(id) {
			var project = JSON.parse(localStorage.getItem(id));
			project.name = this.detailTitle.value ? this.detailTitle.value : "未命名";
			project.phone = this.detailPhone.value;
			project.contact = this.detailUser.value;
			project.email = this.detailEmail.value;
			project.address = this.detailAddress.value;
			project.text = this.detailText.value;
			localStorage.setItem(id, JSON.stringify(project));
			this.projectDetailEdit.style.display = "none";
			this.projectDetailShow.style.display = "block";
			this.detailTitleSpan.innerHTML = project.name;
			this.detailTextSpan.innerHTML = project.text;
			this.detailPhoneSpan.innerHTML = project.phone;
			this.detailUserSpan.innerHTML = project.contact;
			this.detailEmailSpan.innerHTML = project.email;
			this.detailAddressSpan.innerHTML = project.address;
		},

		/**
		 * 输出项目发送到邮箱
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		outputEmail: function(e, type) {
			var self = this;
			/* 修复iOS 8.x平台存在的bug，使用plus.nativeUI.prompt会造成输入法闪一下又没了 */
			//    if(typeof plus !="undefined"){
			//    	mui.plusReady(function(){
			//      	e.detail.gesture.preventDefault();
			//      }
			//    }
			var btnArray = ['确定', '取消'];
			/* mui.js仿IOS输入弹出框 */
			mui.prompt('请输入您要接收的邮箱：', '', '优速Max', btnArray, function(e) {
				if(e.index == 0) {
					/* 先上传再发送邮箱 */
					self.email = e.value;
					var userInfo = self.User.hasLogin();
					if(userInfo) {
						var timeStamp = new Date().getTime();
						var signature = self.Index.getSignature(userInfo, timeStamp);
						var project = localStorage.getItem(self.id);
						var info = {
							url: self.uploadProjectUrl,
							type: "post",
							data: {
								user_id: userInfo.uid,
								project_id: self.id,
								signature: signature,
								timestamp: timeStamp,
								description: project
							}
						};
						if(type == 1) {
							self.User.sendAjaxInfo.call(self, info, self.uploadForEmailResult1, "json");
						} else if(type == 2) {
							self.User.sendAjaxInfo.call(self, info, self.uploadForEmailResult2, "json");
						}

					} else {
						mui.alert("请先登录", '优速Max', function() {
							self.oldBack();
						});
					}
				}
			});
		},

		/**
		 * 上传项目回调函数(获取整体方案和报价表)
		 * @param  {[type]} data [返回结果]
		 * @param  {[type]} self [当前对象]
		 */
		uploadForEmailResult1: function(data, self) {

			if(data) {
				switch(data.info) {
					case "wrongToken":
						mui.alert("登录已过期，请重新登录", '优速Max');
						self.storage.removeItem("user");
						break;
					case "success":
						var timeStamp = new Date().getTime();
						var userInfo = self.User.hasLogin();
						if(userInfo) {
							var signature = self.Index.getSignature(userInfo, timeStamp);
							var info = {
								url: self.outPutToEmailType1Url,
								type: "post",
								data: {
									user_id: userInfo.uid,
									project_id: self.id,
									signature: signature,
									timestamp: timeStamp,
									email: self.email,
								}
							};
							self.User.sendAjaxInfo.call(self, info, self.outputEmailResult, "json");
						} else {
							mui.alert("请先登录", '优速Max', function() {
								self.oldBack();
							});
						}
						break;
				}
			} else {
				mui.alert("网络出错，请重新尝试", '优速Max');
			}
		},

		/**
		 * 上传项目回调函数(获取整体方案)
		 * @param {Object} data
		 * @param {Object} self
		 */
		uploadForEmailResult2: function(data, self) {
			if(data) {
				switch(data.info) {
					case "wrongToken":
						mui.alert("登录已过期，请重新登录", '优速Max');
						self.storage.removeItem("user");
						break;
					case "success":
						var timeStamp = new Date().getTime();
						var userInfo = self.User.hasLogin();
						if(userInfo) {
							var signature = self.Index.getSignature(userInfo, timeStamp);
							var info = {
								url: self.outPutToEmailType2Url,
								type: "post",
								data: {
									user_id: userInfo.uid,
									project_id: self.id,
									signature: signature,
									timestamp: timeStamp,
									email: self.email,
								}
							};
							self.User.sendAjaxInfo.call(self, info, self.outputEmailResult, "json");
						} else {
							mui.alert("请先登录", '优速Max', function() {
								self.oldBack();
							});
						}
						break;
				}
			} else {
				mui.alert("网络出错，请重新尝试", '优速Max');
			}
		},

		/**
		 * 输出到邮箱回调函数
		 * @param  {[type]} data [返回结果]
		 * @param  {[type]} self [当前对象]
		 */
		outputEmailResult: function(data, self) {
			if(data) {
				switch(data.info) {
					case "wrongToken":
						mui.alert("登录已过期，请重新登录", '优速Max');
						self.storage.removeItem("user");
						break;
					case "fail":
						mui.alert("获取文件失败", '优速Max');
						break;
					case "success":
						mui.alert("发送成功，请使用邮箱查收", '优速Max');
						break;
				}
			} else {
				mui.alert("网络出错，请重新尝试", '优速Max');
			}
		},

		/**
		 * 数据统计页数据展示，函数内代码过长，建议将功能分割
		 */
		showDataView: function() {
			var self = this;
			var room = this.project.room;
			var itemInfo, itemName, itemShowName, itemUnique, category, itemImg, itemPrice, itemAttrs, tmpTotal,
				itemScale, itemWidth, itemHeight, res, child, itemList, tmpData, svgDom, roomInfo, minX, minY, maxX, maxY,
				roomDom, roomAttrs, roomId;
			var totalPrice = 0;
			var dom = '';
			for(var i = 0, len = room.length; i < len; i++) {
				dom += '<div class="project-sta-block"></div><div class="project-sta-title">' +
					room[i].svgData.attrs.name + '</div>' +
					'<div class="project-data-view project-sta-view">' +
					'<div class="project-data-svg">' +
					'<svg width="500" height="360">' +
					'<g id="svg-statistics-' + i + '" width="100%" height="100%" transform="translate(0,0) scale(1)"></g>' +
					'</svg>' +
					'</div>' +
					'</div>';
				child = room[i].child;
				itemList = [];
				/* 遍历房间的item,判断是否有相同尺寸的item(括号内尺寸一致，共享详细数据),若没有则添加到item列表，
				   若已有相同数据，则此item加1 */
				for(var j = 0, len2 = child.length; j < len2; j++) {
					if(child[j].svgData.name == "g") {
						if(child[j].svgData.unique && (!child[j].svgData.attrs["isVertical"])) {
							itemAttrs = child[j].svgData.attrs;
							itemName = itemAttrs['item-real']; //带有实际尺寸的名字
							category = itemAttrs['item-unique'].split("_")[0];
							/* 屏蔽掉墙柱、其他、摆设、隔断分类下的item的显示 */
							if(category == "wallcolumn" || category == "other" || category == "deskitem" || category == "wall") continue;
							res = this.hasExist(itemList, "itemName", itemName);
							if(res) {
								itemList[res.index].count++;
							} else {
								tmpData = child[j].svgData;
								tmpData.itemName = itemName;
								tmpData.count = 1;
								itemList.push(tmpData);
							}
						}
					}
				}
				tmpTotal = 0; //统计每个房间里的所有item的价格

				/* 遍历item列表，添加到dom中去 */
				for(var j = 0, len2 = itemList.length; j < len2; j++) {
					itemAttrs = itemList[j].attrs;
					itemName = itemAttrs.itemName;

					/*判断item的名字是否包含t，若包含，表示图片被翻转*/
					if(itemName.charAt(itemName.length - 1) == "t") {
						itemName = itemName.substr(0, itemName.length - 1);
					}
					itemShowName = itemList[j].itemName; //带有实际尺寸的名字
					itemUnique = itemAttrs["item-unique"];
					category = itemUnique.split("_")[0]; //分隔item-unique属性查找其所属类别

					/* 判断item是否包含编辑过的信息， 价格、图片、备注等 */
					if(this.project.itemInfo[itemShowName]) {
						itemInfo = this.project.itemInfo[itemShowName];
						itemImg = (itemInfo.img ? (this.imageHostUrl + itemInfo.img) : "img/nopic.png");
						itemPrice = (itemInfo.price ? parseFloat(itemInfo.price).toFixed(2) : "0.00");
						itemInfo.price ? tmpTotal += itemInfo.price * itemList[j].count : 0;

						dom += '<div class="project-sta-list">' +
							'<div class="project-sta-left">' +
							'<div class="project-sta-grid">' +
							'<img src="data/icon/' + category + "/" + itemName + 'a.png" title="' + itemName + '" alt="' + itemName + '" />' +
							'</div>' +
							'<div class="project-sta-grid">' +
							'<div class="project-sta-name">' + itemShowName + '</div>' +
							'</div>' +
							'</div>' +
							'<div class="project-sta-center">' +
							'<img class="light" data-role="light" data-source="' + itemImg + '"' +
							'src="' + itemImg + '" id="img" data-group="img-' + i + '-' + j + '" data-id="img' + i + '-' + j + '">' +
							'</div>' +
							'<div class="project-sta-right">' +
							'<div class="project-sta-grid-r">' +
							'<div class="project-sta-number">' + itemList[j].count + ' 个</div>' +
							'</div>' +
							'<div class="project-sta-grid-r">' +
							'<div class="project-sta-price">￥' + itemPrice + '</div>' +
							'</div>' +

							'</div>' +
							'</div>';
						if(itemInfo.text) {
							dom += '<div class="project-sta-text-list"><div class="project-sta-text">备注：' + itemInfo.text + '</div></div>';
						}
						dom += "</div>";
					} else {
						dom += '<div class="project-sta-list">' +
							'<div class="project-sta-left">' +
							'<div class="project-sta-grid">' +
							'<img src="data/icon/' + category + "/" + itemName + 'a.png" title="' + itemName + '" alt="' + itemName + '" />' +
							'</div>' +
							'<div class="project-sta-grid">' +
							'<div class="project-sta-name">' + itemShowName + '</div>' +
							'</div>' +
							'</div>' +
							'<div class="project-sta-center">' +
							'<img class="light" data-role="light" data-source="img/nopic.png"' +
							'src="img/nopic.png" id="img" data-group="img-' + i + '-' + j + '" data-id="img' + i + '-' + j + '">' +
							'</div>' +
							'<div class="project-sta-right">' +
							'<div class="project-sta-grid-r">' +
							'<div class="project-sta-number">' + itemList[j].count + ' 个</div>' +
							'</div>' +
							'<div class="project-sta-grid-r">' +
							'<div class="project-sta-price">￥0.00</div>' +
							'</div>' +
							'</div>' +
							'</div>';
					}
				}

				if(tmpTotal !== 0) {
					dom += '<div class="project-sta-list project-room-price">' +
						'<div class="project-room-total">' +
						'<label>小计：</label><span>￥' + parseFloat(tmpTotal).toFixed(2) + '</span></div>' +
						'</div>' +
						'<div class="project-sta-list"></div>';
				} else {
					dom += '<div class="project-sta-list project-room-price"></div>';
				}

				dom += '<div class="project-sta-bottom"></div>';

				totalPrice += tmpTotal; //累加项目的所有房间的所有item的总价格
			};

			if(!dom) {
				dom = "<div >没有数据</div>";
			}
			dom += '<div class="project-sta-bottom"></div>';
			dom += '<div class="project-sta-total">总价格：<span id="total-price-span">￥' +
				parseFloat(totalPrice).toFixed(2) + '</span></div>';

			$("#tabbar-with-statistics").html(dom); //拼接字符串，一次操作dom，提升性能

			/* 根据数据绘制房间布局 */
			for(var i = 0, len = room.length; i < len; i++) {
				svgDom = document.getElementById("svg-statistics-" + i);
				roomInfo = room[i];

				/* 找出房间的各边界点，确定房间的缩放比例以便于无裁剪绘制*/
				minX = 100000;
				minY = 100000;
				maxX = 0;
				maxY = 0;
				roomDom = document.createElementNS('http://www.w3.org/2000/svg', "g");
				roomAttrs = roomInfo.svgData.attrs;
				roomId = "";
				for(var k in roomAttrs) {
					if(k == "id") {
						roomId = roomAttrs[k];
					}
					roomDom.setAttribute(k, roomAttrs[k]);
				}
				var items = roomInfo.child;
				for(var j = 0, len2 = items.length; j < len2; j++) {
					if(items[j].svgData.name == "g" && items[j].svgData.unique) {
						var unique = items[j].svgData.unique;

						/* svg不支持3d变化，无法实现图片的翻转功能，替代方案为准备原始和翻转后的两份图片，
						利用图片替换实现翻转功能 */
						var isTurn = false; //记录图片是否翻转
						if(unique.charAt(unique.length - 1) == "t") {
							unique = unique.substr(0, unique.length - 1);
							isTurn = true;
						}

						var itemInfo = this.dataList.getData(unique);

						var subElement = this.showRoomItem(items[j].svgData.attrs, itemInfo, isTurn);

						/* wallId为门窗特有属性，可利用此属性判断item是否为门窗 */
						if(subElement.getAttribute("wallId")) {
							var tmpChild = subElement.children;
							/* 查找门窗的子元素中的g元素，替换其transform属性显示正确的旋转值，即向内还是向外开放*/
							for(var k = 0, len3 = tmpChild.length; k < len3; k++) {
								if(tmpChild[k].tagName == "g" && tmpChild[k].getAttribute("data-style")) {
									tmpChild[k].setAttribute("transform", items[j].svgData.child[0].svgData.attrs.transform)
								}
							}
						}

						/* data-type属性可以唯一判断是墙壁的长度标记信息 */
					} else if(items[j].svgData.name == "g" && items[j].svgData.attrs["data-type"]) {
						var subElement = this.showRoomLineInfo(items[j].svgData);
					} else {
						/* 利用circle的位置寻找房间的边界点 */
						if(items[j].svgData.name == "circle") {
							var circleX = items[j].svgData.attrs["cx"];
							var circleY = items[j].svgData.attrs["cy"];
							var transform = roomAttrs["transform"].split(" ");
							var translate = transform[0].match(/(-|\+)?[\d]+,(-|\+)?[\d]+/)[0].split(",");
							var tmpX = parseInt(circleX) + parseInt(translate[0]);
							var tmpY = parseInt(circleY) + parseInt(translate[1]);
							if(tmpX > maxX) {
								maxX = tmpX;
							}
							if(tmpX < minX) {
								minX = tmpX;
							}
							if(tmpY > maxY) {
								maxY = tmpY;
							}
							if(tmpY < minY) {
								minY = tmpY;
							}
						}
						var subElement = resetSVG(items[j].svgData.name, items[j].svgData.attrs);
					}
					roomDom.appendChild(subElement);
				}
				svgDom.appendChild(roomDom);
				var scale = Math.min(1, 360 / (maxX - minX), 240 / (maxY - minY)); //利用边界点求出缩放比例

				/* 根据svg坐标特性，(-minX*scale+80，-minY*scale+60) 可以比较完美的作为绘图的起始点 */
				svgDom.setAttribute("transform", "translate(" + (-minX * scale + 80) + "," + (-minY * scale + 60) + ") scale(" + scale.toFixed(2) + ")");
			}
		},

		/**
		 * 判断数组中是否存在某一键值对
		 * @param  {[type]}  itemList [数组]
		 * @param  {[type]}  key      [键]
		 * @param  {[type]}  value    [值]
		 * @return {Boolean}          
		 */
		hasExist: function(itemList, key, value) {
			for(var i = 0, len = itemList.length; i < len; i++) {
				if(itemList[i][key] == value) return {
					index: i
				};
			}
			return false;
		},

		/**
		 * 添加房间墙壁DOM
		 * @param  {[type]} item [待绘制数据]
		 */
		showRoomLineInfo: function(item) {
			var element = document.createElementNS('http://www.w3.org/2000/svg', item.name);
			element.setAttribute("data-type", item.attrs["data-type"]);
			var child = item.child;
			for(var i = 0, len = child.length; i < len; i++) {
				var subElement = resetSVG(child[i].svgData.name, child[i].svgData.attrs);
				if(child[i].svgData.name == "text") {
					subElement.textContent = child[i].svgData.textContent;
				}
				element.appendChild(subElement);
			}
			return element;
		},

		/**
		 * 绘制房间的item
		 * @param  {[type]}  attrs    [属性]
		 * @param  {[type]}  itemInfo [数据]
		 * @param  {Boolean} isTurn   [是否翻转，可选]
		 */
		showRoomItem: function(attrs, itemInfo, isTurn) {
			var element = document.createElementNS('http://www.w3.org/2000/svg', "g");

			for(var key in attrs) {
				element.setAttribute(key, attrs[key]);
			}
			console.log(attrs['item-unique']);
			var subArray = itemInfo.child;
			if(subArray) {
				for(var i = 0, len = subArray.length; i < len; i++) {
					if(subArray[i].attrs['xlink:href']!==undefined)
					{
						if(isTurn) {
							subArray[i].attrs['xlink:href'] = subArray[0].attrs['xlink:href'].replace(/t?.png/, "t.png");
						}else{
							subArray[i].attrs['xlink:href'] = subArray[0].attrs['xlink:href'].replace(/t?.png/, ".png");
						}
					}
					var subElement = resetSVG(subArray[i].name, subArray[i].attrs);
					var subChild = subArray[i].child;
					if(subChild) {
						for(var j = 0, childLen = subChild.length; j < childLen; j++) {
							var childEle = resetSVG(subChild[j].name, subChild[j].attrs);
							subElement.appendChild(childEle);
						}
					}
					element.appendChild(subElement);
				}
			}
			var opacity = document.createElementNS('http://www.w3.org/2000/svg', "polygon");
			opacity.setAttribute("points", "0,0 " + attrs.width + ",0 " + attrs.width + "," + attrs.height + " 0," + attrs.height);
			opacity.setAttribute("fill", "white");
			opacity.setAttribute("fill-opacity", "0");
			opacity.setAttribute("stroke-width", "10");
			opacity.setAttribute("stroke", "#cccccc");
			opacity.setAttribute("stroke-opacity", "0");
			element.appendChild(opacity);
			return element;
		}
	}
	window['Project'] = Project;
})(jQuery, window);