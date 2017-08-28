(function($, window) {
	var Pay = function() {
		var self = this;
		this.payUrl = "http://usuapp.com/order/";
		this.sendUserInfoUrl = "http://usuapp.com/order/address/";
		this.isVIPUrl = "http://usuapp.com/order/dazhe";
		this.user = User.prototype;
		this.index = Index.prototype;
		this.payWay = "";
		this.payType = "";
		this.data = []; //储存用户订单信息
		this.pays = {};
		this.order = "";
		this.ip = "";
		this.init();
	};

	Pay.prototype = {
		init: function() {
			this.getAllElements();
			this.addEvent();
			//获取用户当前ip,returnCitySN是搜狐接口返回
			this.ip = returnCitySN.cip;
			this.initData();
			//判断是否是会员,如果购买过套餐，type1的价钱修改
			this.isVIP();
		},
		initData: function() {
			this.data["type1"] = 570;
			this.data["type2"] = 398;
			this.data["type3"] = 1200;
		},
		getAllElements: function() {
			this.mask = $("#index-mask");
			this.roughAddressInput = $("#pay-user-info-address-rough");
			this.payBoxSection = $("#pay-box-section");
			this.payUserSection = $("#pay-user-section");
			this.payWaySection = $("#pay-way-section");
			this.payUserSaveBtn = $("#pay-user-save-btn");
			this.payType1Price = $("#pay-type1-price");
			this.payType1PriceDiscount = $("#pay-type1-price-discount");
		},
		addEvent: function() {
			var self = this;

			window.onerror = function(msg, url, lineNo, columnNo, error) {
				var string = msg.toLowerCase();
				var substring = "script error";
				var errorMessage = "";
				if(string.indexOf(substring) > -1) {
					errorMessage = substring;
				} else {
					errorMessage = string;
				}
				var userInfo = self.user.hasLogin();
				if(userInfo) {
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
					mui.alert("请先登录", "IHome");
				}
				return false;
			};
			document.addEventListener('plusready', function() {
				self.plusReady();
			}, false);

			var old_back = mui.back;
			mui.back = function() {
				var btn = ["确定", "取消"];
				mui.confirm('确认关闭当前窗口？', 'IHome', btn, function(e) {
					if(e.index == 0) {
						//执行mui封装好的窗口关闭逻辑；
						old_back();
					}
				});
			}

			//绑定省市区选择模块事件
			this.roughAddressInput.on("click", function(event) {
				SelCity(this, event);
			});

			this.payBoxSection.on("click", '.pay-option', function(event) {
				var box = event.target;

				var type = box.getAttribute("data-type");
				var amount = box.getAttribute("data-amount");
				self.data["type"] = type;
				self.data["amount"] = amount;
				self.payWaySection.toggleClass("hidden");
			});

			this.payUserSaveBtn.on("click", function() {
				if(self.getPayUserInfo()) {
					self.payUserSection.toggleClass("hidden");
					self.sendUserInfo();
				}

			});
			this.payWaySection.on("click", ".pay-way-btn", function(event) {
				self.payWaySection.toggleClass("hidden");
				var id = event.target.id;
				// if(typeof plus != "undefined"){
				if(id == "pay-way-alipay") {
					// self.pay("alipay");
					self.sendPayInfo("alipay");
				} else if(id == "pay-way-wxpay") {
					self.sendPayInfo("wxpay");
				}

				// 	 }else{
				//  				mui.alert("不支持网页支付，请在ipad上完成支付");
				// }	
			});

		},
		isVIP: function() {
			var userInfo = this.user.hasLogin();
			if(userInfo) {
				var timeStamp = new Date().getTime();
				var signature = this.index.getSignature(userInfo, timeStamp);
				var info = {
					url: this.isVIPUrl,
					type: "post",
					data: {
						user_id: userInfo.uid,
						signature: signature,
						timestamp: timeStamp,
					}
				};
				this.user.sendAjaxInfo.call(this, info, this.isVIPResult, 'json');
			} else {
				mui.alert("请先登录", "IHome");
			}
		},
		/**
		 *	是否购买套餐的处理事件
		 */
		isVIPResult: function(data, self) {
			if(data) {
				switch(data.info) {
					case "true":
						console.log("okey");
						self.payType1Price.css({
							"color": "#666666",
							"text-decoration": "line-through"
						});
						self.payType1PriceDiscount.css("display", "inline");
						self.data["type1"] = 399;
						break;
					case "false":
						break;
				}
			} else {
				mui.alert("网络错误", "IHome");
			}
		},
		getPayUserInfo: function() {
			var payUserInfoName = $("#pay-user-info-name");
			var payUserInfoPhone = $("#pay-user-info-phone");
			var payUserInfoRoughAddress = $("#pay-user-info-address-rough");
			var payUserInfoDetailAddress = $("#pay-user-info-address-detail");

			var name = payUserInfoName.val();
			var phone = payUserInfoPhone.val();
			var roughtAddress = payUserInfoRoughAddress.val();
			var detailAddress = payUserInfoDetailAddress.val();
			var address = roughtAddress + detailAddress;

			if(this.checkInfo(name, phone, roughtAddress, detailAddress)) {
				this.data["name"] = name;
				this.data["phone"] = phone;
				this.data["address"] = address;

				return true;
			}

			return false;

		},
		checkInfo: function(name, phone, roughtAddress, detailAddress) {
			if(name == "") {
				mui.alert("收件人不能为空！");
				return false;
			}
			if(phone == "") {
				mui.alert("手机号不能为空！");
				return false;
			}
			if(roughtAddress == "") {
				mui.alert("请选择省市区！");
				return false;
			}
			if(detailAddress == "") {
				mui.alert("详细地址不能为空！");
				return false;
			}

			//判断是否是正确的手机号
			var reg = /^1[0-9]{10}/;
			if(!reg.test(phone)) {
				mui.alert("请填写正确格式的手机号！");
				return false;
			}
			return true;
		},
		/*
			发送收件信息
		*/
		sendUserInfo: function() {

			var userInfo = this.user.hasLogin();
			if(userInfo) {
				var timeStamp = new Date().getTime();
				var signature = this.index.getSignature(userInfo, timeStamp);
				var info = {
					url: this.sendUserInfoUrl,
					type: "post",
					data: {
						user_id: userInfo.uid,
						out_trade_no: this.order,
						name: this.data["name"],
						phone: this.data["phone"],
						address: this.data["address"],
						signature: signature,
						timestamp: timeStamp,
					}
				};
				this.user.sendAjaxInfo.call(this, info, this.sendUserInfoResult, 'json');
			}
		},

		sendUserInfoResult: function(data, self) {
			if(data) {
				switch(data.info) {
					case "success":
						mui.alert("收货信息提交成功,感谢您购买我们的服务,请重新登录。", 'IHome', function() {
							localStorage.removeItem("user");
							self.payUserSection.addClass("hidden");
							mui.openWindow({
								url: "index.html"
							});
						});
						break;
					case "fail":
						mui.alert(data.errorInfo, 'IHome', function() {
							self.payUserSection.addClass("hidden");
						});
						break;
				}
			}
		},
		/*
		 *	获取支付通道
		 */
		plusReady: function() {

			var self = this;
			plus.payment.getChannels(function(channels) {
				for(var i in channels) {
					var channel = channels[i];
					self.pays[channel.id] = channel;
					self.checkServices(channel);
				}
			}, function(e) {
				console.log("获取通道信息失败");
			});
		},

		//检查是否安装这项服务
		checkServices: function(pc) {
			if(!pc.serviceReady) {
				var txt = null;
				switch(pc.id) {
					case "wxpay":
						txt = "检测到系统未安装“微信快捷支付服务”，无法完成支付操作。"
						break;
					case "alipay":
						txt = "检测到系统未安装“支付宝快捷支付服务”，无法完成支付操作。";
						break;
				}
				plus.nativeUI.confirm(txt, function(e) {
					if(e.index == 0) {
						pc.installService();
					}
				}, pc.description);
			}
		},
		sendPayInfo: function(id) {
			var payUrl = "http://usuapp.com/order/";
			var total = this.data["type" + this.data["type"]];
			switch(id) {
				case "wxpay":
					payUrl += "payByWeixin";
					total = total * 100;
					break;
				case "alipay":
					payUrl += "payByAli";
					break;
			}
			var userInfo = this.user.hasLogin();
			if(userInfo) {
				var timeStamp = new Date().getTime();
				var signature = this.index.getSignature(userInfo, timeStamp);
				var project = localStorage.getItem(self.id);
				var info = {
					url: payUrl,
					type: "post",
					data: {
						user_id: userInfo.uid,
						type: this.data["type"],
						total: total,
						spbill_create_ip: this.ip,
						signature: signature,
						timestamp: timeStamp,
					}
				};
				this.user.sendAjaxInfo.call(this, info, this.sendPayInfoResult, "json");

			}
		},
		//处理返回的订单信息
		sendPayInfoResult: function(data, self) {
			if(data) {
				switch(data.info) {
					case "success":
						var order = data.order;
						self.order = data.out_trade_no;
						plus.payment.request(self.pays[data.way], order, function(result) {

							plus.nativeUI.alert("支付成功：感谢你的支持，我们会继续努力完善产品。", function() {

								//如果仅仅是购买服务
								if(self.data["type"] == 1) {

									mui.alert("感谢您购买我们的服务，请重新登录.", 'IHome', function() {
										//重新登录,删除user
										localStorage.removeItem("user");
										mui.openWindow({
											url: "index.html"
										});
									});

								} else {
									mui.alert("感谢您使用我们的服务！为了方便给您邮寄发票或者设备，请填写您的收件信息。", 'IHome', function() {
										self.payUserSection.removeClass("hidden");
									});
								}

							}, "IHome");
						}, function(e) {
							plus.nativeUI.alert("支付失败", null, "优速");
						});

						break;
					default:
						plus.nativeUI.alert("获取订单信息失败！", null, "优速");
						break;
				}
			} else {
				plus.nativeUI.alert("获取订单信息失败！", null, "优速");
			}
		}

	};

	window["Pay"] = Pay;

})(jQuery, window);