(function($, window) {
	var Room = function(mainFrame, dom, isClose) {
		this.mainFrame = mainFrame; //依赖注入mainframe对象，从而可以使用mainFrame
		this.hammerList = {}; //记录房间里的所有元素的Hammer对象
		this.isClose = true; //记录房间是否是闭合房间，目前已删除自定义房间，所以值都为true
		this.maskDom = null; //操作房间元素事件的蒙版dom
		this.maskHammer = null; //操作房间元素事件的Hammer对象
		this.rotateBlock = null; //旋转事件滑块dom
		this.sizeObjList = {}; //记录元素之间尺寸标记的对象
		this.itemDataList = {}; //记录房间元素的详细信息页数据
		this.currentItemId = null; //当前操作的元素id,类似currentRoomId
		this.currentItem = null; //当前操作的元素dom
		this.currentItemData = {}; //记录当前操作的元素的详细信息

		/* 目前图片上传的机制为，首先选取图片(移动端可以选取相册图片或拍照，PC端打开本地文件)，然后点击上传，在编辑区加载
		 * 上传后的图片，然后利用JCrop组件进行编辑图片大小，之后点击保存发送数据到服务器，显示编辑后的图片。
		 * 此过程需要优化，后期可以减去先上传的步骤，利用js或者filereader实现图片的预览进行编辑，只需要发送一次数据就可以
		 * 完成编辑的过程。
		 */
		this.editUrl = ''; //记录上传的图片的url
		this.editX = 0; //记录编辑图片的起始X值
		this.editY = 0; //Y值
		this.editWidth = 0; //图片的宽度
		this.editHeight = 0; //图片的高度
		this.xhr = null;
		this.markType = null; //尺寸标记的类型，目前有相对距离，水平距离，竖直距离
		this.isLocked = false; //墙壁是否锁定，锁定只在智能测距时生效
		this.files = []; //记录选取的待上传图片，目前限制单图片上传
		this.markCircleData = {}; //记录与墙壁标记长度的数据

		this.getAllElement();
	}
	Room.prototype = {
		init: function() {
			this.id = this.mainFrame.currentRoomId;
			this.svgPanelTransform = this.mainFrame.panelTransform;
			this.allRoom = this.mainFrame.roomDomList;
			this.svgPanel = this.mainFrame.svgPanel;
			this.roomDom = this.mainFrame.currentRoom;
			this.children = this.roomDom.children;
			this.virtualData = this.mainFrame.virtualData[this.id];
			this.lineCount = this.getLineCount(this.children);
			this.itemCount = this.getItemCount(this.children);
			this.drawInfoLine(this.children, this.lineCount, this.virtualData);
			this.highLightRoom();
			this.resetBottom();
			this.addEvent();
		},
		/* 这里获取dom的对象很混乱，既有原生方式，也有juery方式获取，需要灵活处理 */
		getAllElement: function() {
			this.wallMask = document.getElementById("wall-mask");
			this.header = $("header");
			this.footer = $("#footer-ul");
			this.addItemDom = $("#tabbar-with-addItem");
			this.addItemCateDom = $("#tabbar-with-addItemCate");
			this.itemListDom = $("#obj-list");
			this.itemDetailListDom = $("#itemDetail-list");
			this.muiPopover = $(".mui-popover");
			this.rotateMask = $("#rotate-btn-mask");
			this.rotateMaskBtn = $("#rotate-mask-close");
			this.svgCirclePoint = document.getElementById("svg-point");
			this.svgCircleRoom = document.getElementById("svg-roomtransform");
			this.side = $("#tabbar-with-editRoom");

			/* 白点dom，其用处是点击墙壁是标注所点位置，在添加拐角，门窗时，以白点所在位置为基准 */
			this.svgCircle = document.getElementById("svg-circle");

			this.editMask = $("#edit-mask");
			this.backBtn = this.side.find("#hide-edit-room");
			this.editContent = this.side.find("#edit-item-content");
			this.sideImgIcon = this.side.find("#side-img-icon");
			this.sideImgName = this.side.find("#side-img-name");
			this.lengthSpan = this.side.find("#item-length-value");
			this.widthSpan = this.side.find("#item-width-value");
			this.heightSpan = this.side.find("#item-height-value");
			this.priceInput = this.side.find("#item-price-value");
			this.textInput = this.side.find("#item-text-value");
			this.addImgBtn = this.side.find("#img-opt-add");
			this.delImgBtn = this.side.find("#img-opt-del");
			this.editImgBtn = this.side.find("#img-opt-edit");
			this.itemImgView = this.side.find("#item-img-view");
			this.editImgPanel = this.side.find("#img-edit-panel");
			this.jcropImg = this.side.find("#jcrop-img");
			this.imgView = this.side.find("#img-view");
			this.cameraBtn = this.side.find("#camera-btn");
			this.galleryBtn = this.side.find("#gallery-btn");
			this.uploadImgBtn = this.side.find("#img-upload-btn");
			this.saveImgBtn = this.side.find("#img-save-btn");
			this.saveItemInfoBtn = this.side.find("#item-save-all");
			this.sideItemIcon = this.side.find("#side-img-icon");
			this.imgViewEdit = this.side.find("#img-view-edit");
			this.fileList = this.side.find("#files");
			this.popoverWallInput = $("#popover-input");
			this.popoverDoorInput = $("#popover-input-door");
			this.bluetoothSection = $("#tabbar-with-bluetooth");
			this.bluetoothBtn = $("#bluetooth-submit");
			this.bluetoothValue = $("#bluetooth-value");
		},

		addEvent: function() {
			this.removeAllEvent();
			var self = this;
			/* 为房间各元素绑定事件 */
			for(var i = 0, len = this.children.length; i < len; i++) {
				if(this.children[i].tagName == "line") {
					/* 根据墙壁的斜率判断需要绑定水平事件还是竖直事件，利用isVertical属性进行唯一判断，
					 * 水平和竖直的不同事件处理的代码有一定的重复，可以考虑合并 
					 */
					if(this.children[i].getAttribute("isVertical") == "horizon") {
						this.childLineHorHandler(this.children, i, this.lineCount);
					} else {
						this.childLineVerHandler(this.children, i, this.lineCount);
					}
				} else if(this.children[i].tagName == "circle") {
					this.childCircleHandler(this.children, i);
				} else if(this.children[i].tagName == "g" &&
					this.children[i].getAttribute("item-unique")) {
					/* 利用wallId唯一属性判断是门窗还是房间的家具等元素，分别绑定不同的事件 */
					if(this.children[i].getAttribute("wallId")) {
						this.addDoorEvent(this.children[i], this.children[i].id);
					} else {
						this.addItemEvent(this.children, this.children[i].id);
					}
				}
			}
			this.header.on("click", "div", function(event) {
				switch(this.id) {
					case "hide-add-item":
						self.addItemDom.hide();
						self.maskDom.hide();
						self.maskDom.off("click");
						if(self.currentItem.tagName == "line") {
							self.currentItem.setAttribute("stroke", "black");
							self.svgCircle.setAttribute("fill-opacity", 0);
						}
						break;
					case "hide-add-itemCate":
						self.addItemCateDom.hide();
						break;
					case "hide-add-bluetooth":
						self.bluetoothSection.hide();
						break;
				}
			});
			this.footer.on("click", "li", function(event) {
				event.stopPropagation();
				switch(this.id) {
					case "addItem":
						self.showAddItem("item");
						break;
					case "toTopRoom":
						self.toTopRoom();
						break;
					case "markLength":
						self.markLength(self.currentItem, self.currentItemId);
						break;
					case "copyItem":
						self.copyItem(self.currentItem, self.currentItemId);
						self.resetBottom();
						break;
					case "copySomeItem":
						mui('#popover-copy').popover('toggle'); //mui组件里的弹出输入框，会动态判断是隐藏还是显示
						break;
					case "deleteItem":
						self.removeItem(self.roomDom, self.currentItem);
						break;
					case "rotateItem":
						self.rotateItem(self.currentItem, self.currentItemId);
						break;
					case "editItem":
						self.showSide(self.currentItem, self.currentItemId);
						break;
					case "deleteMark":
						self.deleteMark(this.getAttribute("data-target"), true);
						break;
					case "finishMark":
						self.deleteMark(this.getAttribute("data-target"), false);
						break;
					case "addNewWall":
						self.addNewWall(self.currentItem, self.currentItemId);
						break;
					case "show-edit-wall":
						mui('#popover-wall').popover('toggle');
						break;
					case "addWindow":
					case "addDoor":
						var type = this.getAttribute("data-target");
						self.addItemCateDom.show();
						var dom = '';
						var data = self.mainFrame.dataList.getData(type);
						for(var index in data) {
							dom += '<li class="obj-item" data-type="door" data-target="' + data[index].svg + '">' +
								'<div class="obj-item-img">' +
								'<img src="data/icon/door/' + data[index].name + '.png"></div>' +
								'<div class="obj-item-name"><span>' + data[index].name + '</span></div>' +
								'</li>';
						}
						self.itemDetailListDom.html(dom);
						self.showAddItem("door");
						break;
					case "copyDoor":
						self.copyDoor(self.currentItem);
						break;
					case "rotateDoor":
						self.rotateDoor(self.currentItem);
						break;
					case "modifyDoor":
						mui('#popover-door').popover('toggle');
						break;
					case "deleteDoor":
						self.deleteDoor(self.currentItem);
						break;
					case "reset-bluetooth":
						self.showBluetoothSection();
						break;
					case "lockWall":
						if(self.isLocked) {
							self.unLockWall(self.currentItem, self.currentItemId);
							this.querySelector(".footer-text").
							querySelector("span").textContent = "锁定墙壁";
							self.isLocked = false;
						} else {
							self.lockWall(self.currentItem, self.currentItemId);
							this.querySelector(".footer-text").
							querySelector("span").textContent = "解锁墙壁";
							self.isLocked = true;
						}
						break;
						/* 三种不同的尺寸标记方式 */
					case "origin-distance":
						self.markType = "origin";
						$("#origin-distance").addClass("footer-active");
						$("#horizon-distance").removeClass("footer-active");
						$("#vertical-distance").removeClass("footer-active");
						break;
					case "horizon-distance":
						self.markType = "horizon";
						$("#horizon-distance").addClass("footer-active");
						$("#origin-distance").removeClass("footer-active");
						$("#vertical-distance").removeClass("footer-active");
						break;
					case "vertical-distance":
						self.markType = "vertical";
						$("#vertical-distance").addClass("footer-active");
						$("#origin-distance").removeClass("footer-active");
						$("#horizon-distance").removeClass("footer-active");
						break;
				}
			});
			this.itemListDom.on("click", "li", function(event) {
				self.addItemCateDom.show();
				var type = this.getAttribute("data-target");

				var data = self.mainFrame.dataList.getData(type);
				var dom = '';
				for(var index in data) {
					dom += '<li class="obj-item" data-target="' + data[index].svg + '">' +
						'<div class="obj-item-img">' +
						'<img src="data/icon/' + type + '/' + data[index].name + 'a.png" alt="' +
						data[index].name + '" /></div>' +
						'<div class="obj-item-name"><span>' + data[index].name + '</span></div>' +
						'</li>';
				}
				self.itemDetailListDom.html(dom);
			});
			this.itemDetailListDom.on("click", "li", function(event) {
				event.stopPropagation();
				var target = this.getAttribute("data-target");
				var isDoor = this.getAttribute("data-type");
				var data = self.mainFrame.dataList.getData(target);
				if(isDoor) {
					var uid = self.addDoor(self.currentItem, self.currentItemId, target);
				} else {
					var uid = getUid(self.itemCount + "item");
					self.itemCount++;
					for(var i = 0, len = self.children.length; i < len; i++) {
						if(self.children[i].tagName == "g" &&
							self.children[i].getAttribute("position")) {
							self.roomDom.insertBefore(
								self.createSVG(data, uid), self.children[i]);
							break;
						}
					}
					self.addItemEvent(self.children, uid);
				}
				self.maskDom.hide();
				self.maskDom.off("click");
				self.addItemDom.hide();
				self.addItemCateDom.hide();
				self.mainFrame.isWheel = true;
				var history = {
					element: "item",
					type: "add",
					roomId: self.id,
					id: uid,
				}
				self.mainFrame.history.push(history);
				if(self.mainFrame.history.length > 0) {
					self.mainFrame.resetBtn.show();
				}
			});
			this.muiPopover.on("click", "button", function(ev) {
				switch(this.id) {
					case "popover-item-copy-btn":
						self.copySomeItem(self.currentItem, self.currentItemId);
						break;
					case "popover-btn":
						var input = self.popoverWallInput.val();
						var res = self.changeWallLength(self.currentItem, self.currentItemId, input);
						if(res) {
							mui('#popover-wall').popover('toggle');
						}
						break;
					case "popover-btn-door":
						var input = self.popoverDoorInput.val();
						self.changeDoorLength(self.currentItem, self.currentItemId, input);
						mui("#popover-door").popover("toggle");
						self.popoverDoorInput.val("");
						break;
				}
			});
			this.side.on("click", function(event) {
				var type = event.target.id;
				switch(type) {
					case "item-save-all":
						self.saveItemData(true);

						break;
					case "img-opt-add":
						self.showUploadPanel();
						break;
					case "img-opt-del":
						self.deleteImg();
						break;
					case "img-opt-edit":
						self.showImgEditPanel();
						break;
					case "camera-btn":
						self.appendByCamera();
						break;
					case "gallery-btn":
						self.appendByGallery();
						break;
					case "img-upload-btn":
						self.uploadOriginImg();
						break;
					case "img-save-btn":
						self.saveImg();
						break;
				}
			});
			this.editMask.on("click", function(event) {
				self.editMask.hide();
				self.side.hide();
				self.saveItemData(false);
				self.mainFrame.isWheel = true;
			});
			this.bluetoothBtn.on("click", function(event) {
				event.stopPropagation();
				var input = self.bluetoothValue.val();
				console.log(input);
				var res = self.changeWallLength(self.currentItem, self.currentItemId, input);
				if(res) {
					self.bluetoothSection.hide();
					self.maskDom.hide();
					self.currentItem.setAttribute("stroke", "black");
					self.svgCircle.setAttribute("fill-opacity", 0);
					self.resetBottom();
				}
			});
		},
		/**
		 * 为房间item添加事件
		 * @param {[type]} child  [房间所有子元素dom]
		 * @param {[type]} itemId [item的id]
		 */
		addItemEvent: function(child, itemId) {
			var self = this;
			var item = document.getElementById(itemId);

			self.hammerList[itemId] = new propagating(new Hammer(item));
			self.hammerList[itemId].on("tap", function(ev) {
				ev.stopPropagation();
				if(self.mainFrame.isShowSize) return;

				/* 利用isArbitrary属性判断该元素是否支持单方向的放缩，默认的元素只支持等比例的放缩，需要单方向放缩的元素只是房间的隔断，
				 * 但是因为transform的rotate是在x，y方向放缩，当元素不在标准的角度时，依旧按照x, y方向放缩，会导致和预期情况不一致，
				 * 这里需要分别动态去计算x,y的比例，才能达到完美的效果，后续需要完善。
				 */
				var isWall = item.getAttribute("isArbitrary");
				var childPoints = [];
				var parentItem = [];
				var markList = [];
				var tmpMarkData = {};
				var markDom = null;
				var markChild = null;
				var markDirect = '';
				var curPoints = [];
				var midPointX, midPointY, svgScale, transform, translate, itemScale, itemScaleY,
					realWidth, realHeight, rotate, angle, lastPosX, lastPosY, realMidX, realMidY, cx1, cy1, cx2, cy2,
					cx3, cy3, cx4, cy4, nX1, nY1, nX2, nY2, nX3, nY3, nX4, nY4, tmpScale;

				/* 显示元素的十字标志 */
				item.childNodes[item.childNodes.length - 1].style.display = "block";

				self.currentItemId = itemId;
				self.currentItem = item;
				self.resetBottomForItem(item);

				/* 重置mask的dom，并重新绑定事件 */
				self.wallMask.innerHTML = '<div id=' + item.id + '-mask' +
					' class="rotate-mask"></div>';
				self.maskDom = document.getElementById(item.id + "-mask");
				self.maskDom.style.display = "block";
				self.maskHammer = propagating(new Hammer(self.maskDom));
				self.maskHammer.get('pan').set({
					direction: Hammer.DIRECTION_ALL
				});

				/* 在点击masks时，移除绑定的事件，释放内存 */
				self.maskHammer.on("tap", function(ev) {
					ev.stopPropagation();
					item.childNodes[item.childNodes.length - 1].style.display = "none";
					self.removeMaskEvent();
					self.currentItemId = null;
					self.currentItem = null;
					self.resetBottom();
				});

				self.maskHammer.on("press", function(ev) {
					ev.stopPropagation();
					self.showSide(self.currentItem, self.currentItemId);
				});

				self.maskHammer.on("panstart panmove panend", function(ev) {
					ev.stopPropagation();
					switch(ev.type) {
						case "panstart":
							markList = [];
							var width = parseInt(item.getAttribute("width"));
							var height = parseInt(item.getAttribute("height"));
							midPointX = parseInt(width / 2);
							midPointY = parseInt(height / 2);
							/* 获取整体svg的放缩比例，在拖动元素时，保证速率不受比例影响导致或快或慢 */
							svgScale = self.svgPanelTransform.scale;
							transform = item.getAttribute("transform");
							translate = transform.match(/translate\((-?\+?[\d]+),(-?\+?[\d]+)\)/);
							itemScale = transform.match(/scale\((-?\+?[\d]+\.[\d]+|-?\+?[\d]+)/);
							itemScale = parseFloat(itemScale[1]).toFixed(5);

							/* 如果是单项放缩元素，则获取Y轴的缩放比例 */
							if(isWall) {
								itemScaleY = transform.split(" ")[1].match(/([\d]+\.[\d]+|[\d]+)\)/);
								itemScaleY = parseFloat(itemScaleY[1]).toFixed(5);
							}
							realWidth = parseInt(width * itemScale);
							realHeight = parseInt(height * itemScale);
							translate[0] = parseInt(translate[1]);
							translate[1] = parseInt(translate[2]);
							rotate = transform.match(/rotate\((-?\+?[\d]+\.[\d]+|-?\+?[\d]+)\s([\d]+),([\d]+)\)/);
							angle = parseInt(rotate[1]); //初始旋转角度
							lastPosX = translate[0];
							lastPosY = translate[1];
							realMidX = parseInt(midPointX * itemScale);
							realMidY = parseInt(midPointY * itemScale);
							cx1 = 0;
							cy1 = 0;
							cx2 = realWidth;
							cy2 = 0;
							cx3 = realWidth;
							cy3 = realHeight;
							cx4 = 0;
							cy4 = realHeight;
							var piAngle = angle / 180 * Math.PI;

							//利用公式计算item的四个顶点在旋转一定角度后实际的坐标
							curPoints = [];
							curPoints[0] = {
								x: parseInt(realMidX + (cx1 - realMidX) * Math.cos(piAngle) - (cy1 - realMidY) * Math.sin(piAngle)),
								y: parseInt(realMidY + (cx1 - realMidX) * Math.sin(piAngle) + (cy1 - realMidY) * Math.cos(piAngle))
							};
							curPoints[1] = {
								x: parseInt(realMidX + (cx2 - realMidX) * Math.cos(piAngle) - (cy2 - realMidY) * Math.sin(piAngle)),
								y: parseInt(realMidY + (cx2 - realMidX) * Math.sin(piAngle) + (cy2 - realMidY) * Math.cos(piAngle))
							};
							curPoints[2] = {
								x: parseInt(realMidX + (cx3 - realMidX) * Math.cos(piAngle) - (cy3 - realMidY) * Math.sin(piAngle)),
								y: parseInt(realMidY + (cx3 - realMidX) * Math.sin(piAngle) + (cy3 - realMidY) * Math.cos(piAngle))
							};
							curPoints[3] = {
								x: parseInt(realMidX + (cx4 - realMidX) * Math.cos(piAngle) - (cy4 - realMidY) * Math.sin(piAngle)),
								y: parseInt(realMidY + (cx4 - realMidX) * Math.sin(piAngle) + (cy4 - realMidY) * Math.cos(piAngle))
							};

							/* 记录其他每个元素的四个顶点的位置，壁的位置，以及已标记的尺寸， 利用各元素的定点坐标判断两个元素在靠近时是否自动靠拢，
							 * 目前只保留了标准角度可以自动靠拢，非标准角度存在意义不大
							 **/
							for(var i = 0, index = 0, itemIndex = 0, len = child.length; i < len; i++) {

								/* 判断房间的墙壁是否是水平或者竖直，对于非标准角度不显示距离数据 */
								if(angle % 90 == 0) {
									if(child[i].tagName == "line") {
										childPoints[index] = {};
										x1 = parseInt(child[i].getAttribute("x1"));
										y1 = parseInt(child[i].getAttribute("y1"));
										x2 = parseInt(child[i].getAttribute("x2"));
										y2 = parseInt(child[i].getAttribute("y2"));
										if(x1 == x2) {
											childPoints[index].isShow = "vertical";
											childPoints[index].pos = x1;
											childPoints[index].pos1 = y1 < y2 ? y1 : y2;
											childPoints[index].pos2 = y1 >= y2 ? y1 : y2;
										} else if(y1 == y2) {
											childPoints[index].isShow = "horizon";
											childPoints[index].pos = y1;
											childPoints[index].pos1 = x1 < x2 ? x1 : x2;
											childPoints[index].pos2 = x1 >= x2 ? x1 : x2;
										} else {
											childPoints[index].isShow = "none";
										}
										index++;
									}
								}

								/* 记录房间内的item的各顶点的位置，限制为标准角度的item */
								if(child[i].tagName == "g" && child[i].getAttribute("item-unique") &&
									!child[i].getAttribute("wallId") && child[i].id != itemId) {
									var itemTransform = self.mainFrame.getTransform(child[i].getAttribute("transform"));
									if(itemTransform.angle % 90 == 0) {
										parentItem[itemIndex] = {};
										var itemTranslateX = itemTransform.translateX;
										var itemTranslateY = itemTransform.translateY;
										var parentItemScale = itemTransform.scale;
										var itemWidth = child[i].getAttribute("width");
										var itemHeight = child[i].getAttribute("height");
										var parentItemMidX = (itemTransform.rotateX * parentItemScale);
										var parentItemMidY = (itemTransform.rotateY * parentItemScale);
										cx1 = 0;
										cy1 = 0;
										cx2 = parseInt(itemWidth * parentItemScale);
										cy2 = 0;
										cx3 = parseInt(itemWidth * parentItemScale);
										cy3 = parseInt(itemHeight * parentItemScale);
										cx4 = 0;
										cy4 = parseInt(itemHeight * parentItemScale);
										//计算旋转后真实的位置
										var parentItemAngle = itemTransform.angle / 180 * Math.PI;
										nX1 = parseInt(parentItemMidX + (cx1 - parentItemMidX) * Math.cos(parentItemAngle) -
											(cy1 - parentItemMidY) * Math.sin(parentItemAngle));
										nY1 = parseInt(parentItemMidY + (cx1 - parentItemMidX) * Math.sin(parentItemAngle) +
											(cy1 - parentItemMidY) * Math.cos(parentItemAngle));
										nX2 = parseInt(parentItemMidX + (cx2 - parentItemMidX) * Math.cos(parentItemAngle) -
											(cy2 - parentItemMidY) * Math.sin(parentItemAngle));
										nY2 = parseInt(parentItemMidY + (cx2 - parentItemMidX) * Math.sin(parentItemAngle) +
											(cy2 - parentItemMidY) * Math.cos(parentItemAngle));
										nX3 = parseInt(parentItemMidX + (cx3 - parentItemMidX) * Math.cos(parentItemAngle) -
											(cy3 - parentItemMidY) * Math.sin(parentItemAngle));
										nY3 = parseInt(parentItemMidY + (cx3 - parentItemMidX) * Math.sin(parentItemAngle) +
											(cy3 - parentItemMidY) * Math.cos(parentItemAngle));
										nX4 = parseInt(parentItemMidX + (cx4 - parentItemMidX) * Math.cos(parentItemAngle) -
											(cy4 - parentItemMidY) * Math.sin(parentItemAngle));
										nY4 = parseInt(parentItemMidY + (cx4 - parentItemMidX) * Math.sin(parentItemAngle) +
											(cy4 - parentItemMidY) * Math.cos(parentItemAngle));
										parentItem[itemIndex].x1 = nX1 + itemTranslateX;
										parentItem[itemIndex].y1 = nY1 + itemTranslateY;
										parentItem[itemIndex].x2 = nX2 + itemTranslateX;
										parentItem[itemIndex].y2 = nY2 + itemTranslateY;
										parentItem[itemIndex].x3 = nX3 + itemTranslateX;
										parentItem[itemIndex].y3 = nY3 + itemTranslateY;
										parentItem[itemIndex].x4 = nX4 + itemTranslateX;
										parentItem[itemIndex].y4 = nY4 + itemTranslateY;
										itemIndex++;
									}

								}
								/* 记录与item相关的所有的尺寸标记数据 */
								if(child[i].tagName == "g" && child[i].getAttribute("data-type") == "size-text" &&
									(child[i].getAttribute("data-from") == itemId ||
										child[i].getAttribute("data-target") == itemId)) {
									if(child[i].getAttribute("data-from") == itemId) {
										markDirect = "from";
									} else if(child[i].getAttribute("data-target") == itemId) {
										markDirect = "target";
									}
									markChild = child[i].children;
									markDom = {
										dom: child[i],
										child: markChild,
										direct: markDirect,
										x1: parseInt(markChild[0].getAttribute("x1")),
										y1: parseInt(markChild[0].getAttribute("y1")),
										x2: parseInt(markChild[0].getAttribute("x2")),
										y2: parseInt(markChild[0].getAttribute("y2")),
									}
									markList.push(markDom);
								}
							}

							self.deleteItemInfoLine(self.roomDom);
							self.createItemInfoLine(self.roomDom);

							break;
						case "panmove":
							translate[0] = parseInt(ev.deltaX / svgScale) + parseInt(lastPosX);
							translate[1] = parseInt(ev.deltaY / svgScale) + parseInt(lastPosY);
							var hasTop = false;
							var hasLeft = false;
							var hasRight = false;
							var hasBottom = false;
							/* 遍历所有的标准墙壁，是否显示距离数据 */
							for(var i = 0, len = childPoints.length; i < len; i++) {
								if(childPoints[i].isShow == "vertical") {
									if(childPoints[i].pos1 < translate[1] + realHeight / 2 &&
										childPoints[i].pos2 > translate[1] + realHeight / 2) {
										if(childPoints[i].pos <= translate[0] && !hasLeft) {
											self.showInfoLine("left", childPoints[i].pos, translate, realWidth, realHeight);
											hasLeft = true;

											/* 如果距离墙壁小于15，则自动靠拢 */
											if(Math.abs(childPoints[i].pos - translate[0]) < 15) {
												translate[0] = parseInt(childPoints[i].pos) + 7;
											}
										} else if(childPoints[i].pos > translate[0] && !hasRight) {
											self.showInfoLine("right", childPoints[i].pos, translate, realWidth, realHeight);
											hasRight = true;
											if(Math.abs(childPoints[i].pos - translate[0] - realWidth) < 15) {
												translate[0] = parseInt(childPoints[i].pos - realWidth) - 7;
											}
										}
									}
									if(Math.abs(childPoints[i].x - translate[0]) < 15) {
										translate[0] = parseInt(childPoints[i].x) + 7;
									}
								} else if(childPoints[i].isShow == "horizon") {
									if(childPoints[i].pos1 < translate[0] + realWidth / 2 &&
										childPoints[i].pos2 > translate[0] + realWidth / 2) {
										if(childPoints[i].pos <= translate[1] && !hasTop) {
											self.showInfoLine("top", childPoints[i].pos, translate, realWidth, realHeight);
											hasTop = true;
											if(Math.abs(childPoints[i].pos - translate[1]) < 15) {
												translate[1] = parseInt(childPoints[i].pos) + 7;
											}
										} else if(childPoints[i].pos > translate[1] && !hasTop) {
											self.showInfoLine("bottom", childPoints[i].pos, translate, realWidth, realHeight);
											hasBottom = true;
											if(Math.abs(childPoints[i].pos - translate[1] - realHeight) < 15) {
												translate[1] = parseInt(childPoints[i].pos - realHeight) - 7;
											}
										}
									}
								}
							}

							/* 遍历同一房间内的标准角度的item，判断是否自动靠拢 */
							for(var i = 0, len = parentItem.length; i < len; i++) {
								for(var j = 0, len2 = curPoints.length; j < len2; j++) {
									if(Math.abs(curPoints[j].x + translate[0] - parentItem[i].x1) < 8 &&
										Math.abs(curPoints[j].y + translate[1] - parentItem[i].y1) < 8) {
										translate[0] = parentItem[i].x1 - curPoints[j].x;
										translate[1] = parentItem[i].y1 - curPoints[j].y;
									} else if(Math.abs(curPoints[j].x + translate[0] - parentItem[i].x2) < 8 &&
										Math.abs(curPoints[j].y + translate[1] - parentItem[i].y2) < 8) {
										translate[0] = parentItem[i].x2 - curPoints[j].x;
										translate[1] = parentItem[i].y2 - curPoints[j].y;
									} else if(Math.abs(curPoints[j].x + translate[0] - parentItem[i].x3) < 8 &&
										Math.abs(curPoints[j].y + translate[1] - parentItem[i].y3) < 8) {
										translate[0] = parentItem[i].x3 - curPoints[j].x;
										translate[1] = parentItem[i].y3 - curPoints[j].y;
									} else if(Math.abs(curPoints[j].x + translate[0] - parentItem[i].x4) < 8 &&
										Math.abs(curPoints[j].y + translate[1] - parentItem[i].y4) < 8) {
										translate[0] = parentItem[i].x4 - curPoints[j].x;
										translate[1] = parentItem[i].y4 - curPoints[j].y;
									}
								}
							}
							/* 重设尺寸标记数据 */
							self.resetMarkLine(markList, translate[0] - lastPosX, translate[1] - lastPosY);

							/* 如果是单方向放缩item，则放缩单方向 */
							if(isWall) {
								item.setAttribute("transform", "translate(" + translate[0] + "," + translate[1] + ")" +
									" scale(" + itemScale + "," + itemScaleY + ") rotate(" + angle + " " + midPointX + "," + midPointY + ")");
							} else {
								item.setAttribute("transform", "translate(" + translate[0] + "," + translate[1] + ")" +
									" scale(" + itemScale + ") rotate(" + angle + " " + midPointX + "," + midPointY + ")");
							}
							break;
						case "panend":
							self.deleteItemInfoLine(self.roomDom);
							break;
					}
				});
				self.maskHammer.get('pinch').set({
					enable: true
				});
				self.maskHammer.on("pinchstart pinchmove pinchend", function(ev) {
					ev.stopPropagation();
					switch(ev.type) {
						case "pinchstart":
							/* 取消所有房间事件，防止有被选中的房间跟随手指移动 */
							transform = self.mainFrame.getTransform(item.getAttribute("transform"));
							translateX = transform.translateX;
							translateY = transform.translateY;
							var width = parseInt(item.getAttribute("width"));
							var height = parseInt(item.getAttribute("height"));
							itemScale = transform.scale;

							if(isWall) {
								itemScaleY = item.getAttribute("transform").split(" ")[1].match(/([\d]+\.[\d]+|[\d]+)\)/);
								itemScaleY = parseFloat(itemScaleY[1]).toFixed(5);
							}

							rotate = transform.angle + " " + transform.rotateX + "," + transform.rotateY;

							markList = [];
							for(var i = self.children.length - 1; i >= 0; i--) {
								tmpMarkData = {};
								if(self.children[i].tagName == "g" &&
									self.children[i].getAttribute("data-type") == "size-text" &&
									(self.children[i].getAttribute("data-from") == itemId ||
										self.children[i].getAttribute("data-target") == itemId)) {
									if(self.children[i].getAttribute("data-wall")) {
										self.roomDom.removeChild(self.children[i]);
									} else {
										if(self.children[i].getAttribute("data-from") == itemId) {
											tmpMarkData.itemId = itemId;
											tmpMarkData.targetId = self.children[i].getAttribute("data-target");
										} else if(self.children[i].getAttribute("data-target") == itemId) {
											tmpMarkData.itemId = self.children[i].getAttribute("data-from");
											tmpMarkData.targetId = itemId;
										}
										tmpMarkData.item = document.getElementById(tmpMarkData.itemId);
										tmpMarkData.target = document.getElementById(tmpMarkData.targetId);
										tmpMarkData.targetTransform = self.mainFrame.getTransform(
											tmpMarkData.target.getAttribute("transform"));
										tmpMarkData.itemTransform = self.mainFrame.getTransform(
											tmpMarkData.item.getAttribute("transform"));
										tmpMarkData.cx1 = parseInt(self.children[i].children[0].getAttribute("x1") -
											tmpMarkData.itemTransform.translateX);
										tmpMarkData.cy1 = parseInt(self.children[i].children[0].getAttribute("y1") -
											tmpMarkData.itemTransform.translateY);
										tmpMarkData.tCx1 = parseInt(self.children[i].children[0].getAttribute("x2") -
											tmpMarkData.targetTransform.translateX);
										tmpMarkData.tCy1 = parseInt(self.children[i].children[0].getAttribute("y2") -
											tmpMarkData.targetTransform.translateY);
										markList.push(tmpMarkData);
									}
								}
							}
							break;
						case "pinchmove":
							tmpScale = ((ev.scale - 1) / 2 + parseFloat(itemScale));
							if(tmpScale < 0.1) {
								tmpScale = 0.12;
							} else if(tmpScale > 2.1) {
								tmpScale = 2;
							}
							tmpScale = Math.abs(tmpScale);

							if(isWall) {
								if(item.getAttribute("isVertical")) {
									if((transform.angle % 90 == 0 && transform.angle % 180 != 0)) {
										item.setAttribute("transform", "translate(" + translateX + "," + translateY +
											") scale(" + tmpScale.toFixed(5) + "," + itemScaleY + ") rotate(" + rotate + ")");
									} else {
										item.setAttribute("transform", "translate(" + translateX + "," + translateY +
											") scale(1," + tmpScale + ") rotate(" + rotate + ")");
									}
								} else {
									if((transform.angle % 90 == 0 && transform.angle % 180 != 0)) {
										item.setAttribute("transform", "translate(" + translateX + "," + translateY +
											") scale(1," + tmpScale + ") rotate(" + rotate + ")");
									} else {
										item.setAttribute("transform", "translate(" + translateX + "," + translateY +
											") scale(" + tmpScale.toFixed(5) + "," + itemScaleY + ") rotate(" + rotate + ")");
									}
								}
							} else {
								item.setAttribute("transform", "translate(" + translateX + "," + translateY +
									") scale(" + tmpScale.toFixed(5) + ") rotate(" + rotate + ")");
							}

							for(var i = 0, len = markList.length; i < len; i++) {
								self.deleteMarkLineById(markList[i].itemId, markList[i].targetId);
							}

							for(var i = 0, len = markList.length; i < len; i++) {
								self.drawMarkLine(markList[i]);
							}
							break;
						case "pinchend":
							itemScale = tmpScale;
							break;
					}
				});
			});
		},
		addDoorEvent: function(door, doorId) {
			var self = this;

			self.hammerList[doorId] = new propagating(new Hammer(door));

			self.hammerList[doorId].on("tap", function(ev) {
				ev.stopPropagation();

				door.childNodes[door.childNodes.length - 1].style.display = "block";

				var isVertical = door.getAttribute("isVertical");

				var svgScale = self.svgPanelTransform.scale;
				var transform = door.getAttribute("transform");
				var translate = transform.match(/(-|\+)?[\d]+,(-|\+)?[\d]+/)[0].split(",");
				translate[0] = parseInt(translate[0]);
				translate[1] = parseInt(translate[1]);

				var doorScale;
				if(isVertical == "vertical") {
					doorScale = transform.split(" ")[1].split(",");
					doorScale = doorScale[1].match(/[\d]{1,16}\.[\d]{1,16}|\d+/)[0];
				} else {
					doorScale = transform.split(" ")[1].match(/[\d]{1,16}\.[\d]{1,16}|\d+/)[0];
				}

				var angle = transform.split(" ")[2].match(/(-|\+)?[\d]{1,16}\.[\d]{1,16}|(-|\+)?\d+/)[0];
				var line = document.getElementById(door.getAttribute("wallId"));

				/* 由于无法直接获知墙壁的位置，利用外围标注的数据信息 position属性获取墙壁的位置 */
				for(var i = self.children.length - 1; i >= 0; i--) {
					if(self.children[i].getAttribute("data-type") == "text" &&
						self.children[i].getAttribute("lineId") == line.id) {
						var position = self.children[i].getAttribute("position");
					}
				}

				var x1 = parseInt(line.getAttribute("x1"));
				var y1 = parseInt(line.getAttribute("y1"));
				var x2 = parseInt(line.getAttribute("x2"));
				var y2 = parseInt(line.getAttribute("y2"));
				var width = door.getAttribute("width");
				var height = door.getAttribute("height");
				var realWidth = parseInt(width * doorScale);
				var realHeight = parseInt(height);

				var windowLineId = doorId + "-line";
				var doorData = {
					translate: translate,
					realWidth: realWidth,
					realHeight: realHeight,
					x1: x1,
					y1: y1,
					x2: x2,
					y2: y2,
					position: position,
					windowLineId: windowLineId
				}
				self.drawDoorInfoLine(doorData);

				var windowLine = document.getElementById(windowLineId);
				if(windowLine) {
					var winLinechild = windowLine.childNodes;
				}

				self.currentItemId = doorId;
				self.currentItem = door;
				self.resetBottomForDoor(door);
				self.wallMask.innerHTML = '<div id=' + door.id + '-mask' +
					' class="rotate-mask"></div>';
				self.maskDom = document.getElementById(door.id + "-mask");
				self.maskDom.style.display = "block";
				self.maskHammer = propagating(new Hammer(self.maskDom));
				self.maskHammer.get('pan').set({
					direction: Hammer.DIRECTION_ALL
				});
				self.maskHammer.on("tap", function(ev) {
					ev.stopPropagation();
					door.childNodes[door.childNodes.length - 1].style.display = "none";
					self.removeMaskEvent();
					self.deleteDoorInfoLine(windowLineId);
					self.currentItemId = null;
					self.currentItem = null;
					self.resetBottom();
				});

				var k, lastPosX, lastPosY, tmpScale;
				self.maskHammer.on("panstart panmove panend", function(ev) {
					ev.stopPropagation();
					switch(ev.type) {
						case "panstart":
							realWidth = parseInt(width * doorScale);
							lastPosX = parseInt(translate[0]);
							lastPosY = parseInt(translate[1]);
							if(isVertical == "vertical") {
								k = Math.tan((angle - 90) * Math.PI / 180);
							} else {
								k = Math.tan(angle * Math.PI / 180);
							}
							if(x1 - x2 == 0) {
								k = 0;
							}
							windowLine = document.getElementById(windowLineId);
							if(windowLine) {
								winLinechild = windowLine.childNodes;
							}
							break;
						case "panmove":
							if(isVertical == "vertical") {
								translate[0] = parseInt(ev.deltaY * (-k) / svgScale) + parseInt(lastPosX);
								translate[1] = parseInt(ev.deltaY / svgScale) + parseInt(lastPosY);

								door.setAttribute("transform", "translate(" + translate[0] + "," +
									translate[1] + ") scale(1," + doorScale + ") rotate(" + angle + ")");
							} else {
								translate[0] = parseInt(ev.deltaX / svgScale) + parseInt(lastPosX);
								translate[1] = parseInt(ev.deltaX * k / svgScale) + parseInt(lastPosY);
								door.setAttribute("transform", "translate(" + translate[0] + "," +
									translate[1] + ") scale(" + doorScale + ",1) rotate(" + angle + ")");
							}
							translate[0] = parseInt(translate[0]);
							translate[1] = parseInt(translate[1]);

							if(windowLine) {
								doorData = {
									childNodes: winLinechild,
									translate: translate,
									realWidth: realWidth,
									realHeight: realHeight,
									x1: x1,
									y1: y1,
									x2: x2,
									y2: y2,
									position: position
								};
								self.resetDoorInfoLine(doorData);
							}
							break;
						case "panend":
							lastPosX = parseInt(translate[0]);
							lastPosY = parseInt(translate[1]);
							break;
					}
				});
				self.maskHammer.get('pinch').set({
					enable: true
				});
				self.maskHammer.on("pinchstart pinchmove pinchend", function(ev) {
					ev.stopPropagation();
					switch(ev.type) {
						case "pinchstart":
							break;
						case "pinchmove":
							tmpScale = ((ev.scale - 1) / 2 + parseInt(doorScale));
							if(tmpScale < 0.4) {
								tmpScale = 0.4;
							} else if(tmpScale > 4.1) {
								tmpScale = 4;
							}
							if(isVertical == "vertical") {
								door.setAttribute("transform", "translate(" + translate[0] + "," +
									translate[1] + ") scale(1," + tmpScale + ") rotate(" + angle + ")");
							} else {
								door.setAttribute("transform", "translate(" + translate[0] + "," +
									translate[1] + ") scale(" + tmpScale + ",1) rotate(" + angle + ")");
							}
							if(windowLine) {
								doorData = {
									childNodes: winLinechild,
									translate: translate,
									realWidth: parseInt(width * tmpScale),
									realHeight: realHeight,
									x1: x1,
									y1: y1,
									x2: x2,
									y2: y2,
									position: position
								};
								self.resetDoorInfoLine(doorData);
							}
							break;
						case "pinchend":
							doorScale = tmpScale;
							break;
					}
				});
			});
		},
		/**
		 * 移除房间的所有事件
		 */
		removeAllEvent: function() {
			/* hammer.js的off方法只是关闭了事件，没有释放内存，释放需要使用destroy*/
			for(var i in this.hammerList) {
				this.hammerList[i].destroy("tap");
				delete this.hammerList[i];
			}
			this.header.off("click");
			this.footer.off("click");
			this.itemListDom.off("click");
			this.itemDetailListDom.off("click");
			this.muiPopover.off("click");
			this.side.off("click");
			this.editMask.off("click");
			this.bluetoothBtn.off("click");
		},
		removeMaskEvent: function() {
			var self = this;
			self.maskDom.style ? self.maskDom.style.display = "none" : self.maskDom.hide();
			self.svgCircle.setAttribute("fill-opacity", 0);
			self.maskHammer.destroy("tap press panstart panmove panend pinchstart pinchmove pinchend");
		},
		/**
		 * 高亮当前的房间，使其处于可编辑状态
		 */
		highLightRoom: function() {
			var self = this;
			var Xarr = [],
				Yarr = [];
			for(var i = 0, len = this.children.length; i < len; i++) {
				if(this.children[i].tagName == "polygon") {
					this.children[i].setAttribute("fill-opacity", 0);
				}
				if(this.children[i].tagName == "line") {
					this.children[i].setAttribute("stroke", "black");
					this.children[i].setAttribute("stroke-width", "14");
				}
				if(this.children[i].tagName == "circle") {
					Xarr.push(this.children[i].getAttribute("cx"));
					Yarr.push(this.children[i].getAttribute("cy"));
					this.children[i].setAttribute("stroke", "blue");
					this.children[i].setAttribute("fill", "black");
					this.children[i].setAttribute("fill-opacity", "1");
					this.children[i].setAttribute("r", "7");
				}
				if(this.children[i].tagName == "g" &&
					this.children[i].getAttribute("data-type") == "text") {
					this.children[i].style.display = "block";
				}
			}

			/* 寻找边界点求出房间的最大宽度和长度，然后与屏幕的长宽计算，求出使其垂直居中的合适比例 */
			var minX = Math.min.apply(null, Xarr);
			var minY = Math.min.apply(null, Yarr);
			var maxX = Math.max.apply(null, Xarr);
			var maxY = Math.max.apply(null, Yarr);
			var roomMaxHeight = maxY - minY;
			var roomMaxWidth = maxX - minX;

			var viewWidth = $(window).width() - 400;
			var viewHeight = $(window).height() - 300;
			var transform = this.mainFrame.getTransform(this.roomDom.getAttribute("transform"));
			var svgTranform = this.svgPanelTransform;
			var widthScale = viewWidth / roomMaxWidth;
			var heightScale = viewHeight / roomMaxHeight;

			var scale, distanceX, distanceY;
			if(widthScale < heightScale) {
				scale = widthScale;
				distanceX = 0;
				distanceY = (viewHeight - roomMaxHeight * scale) / 2;
			} else {
				scale = heightScale;
				distanceX = (viewWidth - roomMaxWidth * scale) / 2;
				distanceY = 0;
			}

			this.svgPanel.style.transform = "translate(" + (svgTranform.translateX) + "px," +
				(svgTranform.translateY) + "px) scale(" + svgTranform.scale + ") rotate(0)";

			/* 根据边界点计算房间高亮时应该设置的位置，使其垂直居中显示 */
			transform.translateX = parseInt(((-transform.translateX - minX) * scale) + distanceX + 200);
			transform.translateY = parseInt(((-transform.translateY - minY) * scale) + distanceY + 150);

			/* 利用定时器触发过渡效果 */
			setTimeout(function() {
				/* 利用transition实现过渡 */
				self.svgPanel.style.transition = "all 0.5s ease-in";
				self.svgPanel.style.transform = "translate(" + transform.translateX + "px," +
					transform.translateY + "px)" + "scale(" + scale + ") rotate(0)";
				/* 在500毫秒后替换掉css样式，修改成svg的属性，利用css过渡减少对dom的直接操作 */
				setTimeout(function() {
					self.svgPanel.setAttribute("transform", "translate(" +
						transform.translateX + "," + transform.translateY + ")" +
						"scale(" + scale + ") rotate(0 0,0)");
					self.svgPanel.style.transition = "";
					self.svgPanel.style.transform = "";
					self.mainFrame.panelTransform = self.mainFrame.
					getTransform(self.roomDom.parentNode.getAttribute("transform"));
					self.svgPanelTransform = self.mainFrame.panelTransform;

					/* 将其他所有的房间设置为不可操作的灰色模式 */
					for(var i in self.allRoom) {
						if(self.allRoom[i].id != self.id) {
							var roomItem = self.allRoom[i].children;
							for(var j = 0, itemLen = roomItem.length; j < itemLen; j++) {
								if(roomItem[j].tagName == "line") {
									roomItem[j].setAttribute("stroke", "#dddddd");
									roomItem[j].setAttribute("stroke-width", "14");
								} else if(roomItem[j].tagName == "circle") {
									roomItem[j].setAttribute("stroke", "#dddddd");
									roomItem[j].setAttribute("fill", "#dddddd");
									roomItem[j].setAttribute("r", "7");
								} else if(roomItem[j].tagName == "g") {
									roomItem[j].style.display = "none";
								}
							}
						}
					}
				}, 500);
			}, 100);
		},
		resetBottom: function() {
			var dom = '<li class="footer-list" id="addItem">' +
				'<div class="footer-img">' +
				'<img class="footer-add" src="img/usu/addItem-@3x.png" alt="" />' +
				'</div>' +
				'<div class="footer-text">' +
				'<span>插入对象</span>' +
				'</div>' +
				'</li>' +
				'<li class="footer-list"></li>' +
				'<li class="footer-list"></li>' +
				'<li class="footer-list"></li>' +
				'<li class="footer-list"></li>' +
				'<li class="footer-list" id="toTopRoom">' +
				'<div class="footer-img">' +
				'<img class="footer-add" src="img/usu/copy.svg" alt="" />' +
				'</div>' +
				'<div class="footer-text">' +
				'<span>置于顶层</span>' +
				'</div>' +
				'</li>';
			this.footer.html(dom);
		},
		resetBottomForWall: function() {
			if(!this.currentItem.getAttribute("lock") || this.currentItem.getAttribute("lock") == "false") {
				this.isLocked = false;
			} else {
				this.isLocked = true;
			}
			var dom = '<li class="footer-list" id="addDoor" data-target="door">' +
				'<div class="footer-img">' +
				'<img class="footer-add" src="img/usu/addItem-@3x.png" alt="" />' +
				'</div>' +
				'<div class="footer-text">' +
				'<span>添加门</span>' +
				'</div>' +
				'</li>' +
				'<li class="footer-list" id="addWindow" data-target="windows">' +
				'<div class="footer-img">' +
				'<img class="footer-add" src="img/usu/addItem-@3x.png" alt="" />' +
				'</div>' +
				'<div class="footer-text">' +
				'<span>添加窗户</span>' +
				'</div>' +
				'</li>' +
				'<li class="footer-list" id="lockWall">' +
				'<div class="footer-img">' +
				'<img class="footer-normal" src="img/usu/lock.png" alt="" />' +
				'</div>' +
				'<div class="footer-text">' +
				'<span>' + (this.isLocked ? "解锁墙壁" : "锁定墙壁") + '</span>' +
				'</div>' +
				'</li>' +
				'<li class="footer-list" " id="addNewWall">' +
				'<div class="footer-img">' +
				'<img class="footer-normal" src="img/usu/addWall.png" alt="" />' +
				'</div>' +
				'<div class="footer-text">' +
				'<span>添加拐角</span>' +
				'</div>' +
				'</li>' +
				'<li class="footer-list" id="show-edit-wall">' +
				'<div class="footer-img">' +
				'<img class="footer-edit" src="img/usu/edit-@3x.png" alt="" />' +
				'</div>' +
				'<div class="footer-text">' +
				'<span>长度编辑</span>' +
				'</div>' +
				'</li>' +
				'<li class="footer-list" id="reset-bluetooth">' +
				'<div class="footer-img">' +
				'<img class="footer-normal" src="img/usu/bluetooth.png" alt="" />' +
				'</div>' +
				'<div class="footer-text">' +
				'<span>智能测距</span>' +
				'</div>' +
				'</li>';
			this.footer.html(dom);
		},
		resetBottomForItem: function(item) {
			var dom = '<li class="footer-list" id="markLength">' +
				'<div class="footer-img">' +
				'<img class="footer-add" src="img/usu/edit.svg" alt="" />' +
				'</div>' +
				'<div class="footer-text">' +
				'<span>尺寸测量</span>' +
				'</div>' +
				'</li>' +
				'<li class="footer-list" id="copyItem">' +
				'<div class="footer-img">' +
				'<img class="footer-normal" src="img/usu/copy-@3x.png" alt="" />' +
				'</div>' +
				'<div class="footer-text">' +
				'<span>复制</span>' +
				'</div>' +
				'</li>' +
				'<li class="footer-list" id="copySomeItem">' +
				'<div class="footer-img">' +
				'<img class="footer-normal" src="img/usu/copy-@3x.png" alt="" />' +
				'</div>' +
				'<div class="footer-text">' +
				'<span>批量复制</span>' +
				'</div>' +
				'</li>' +
				'<li class="footer-list" id="deleteItem">' +
				'<div class="footer-img">' +
				'<img class="footer-normal" src="img/usu/delete.svg" alt="" />' +
				'</div>' +
				'<div class="footer-text">' +
				'<span>删除</span>' +
				'</div>' +
				'</li>' +
				'<li class="footer-list" id="rotateItem">' +
				'<div class="footer-img">' +
				'<img class="footer-normal" src="img/usu/rotate.png" alt="" />' +
				'</div>' +
				'<div class="footer-text">' +
				'<span>旋转</span>' +
				'</div>' +
				'</li>' +
				'<li class="footer-list" id="editItem">' +
				'<div class="footer-img">' +
				'<img class="footer-normal" src="img/usu/statistics@2x.png" alt="" />' +
				'</div>' +
				'<div class="footer-text">' +
				'<span>数据预览</span>' +
				'</div>' +
				'</li>';
			this.footer.html(dom);
		},
		resetBottomForDoor: function(door) {
			var dom = '<li class="footer-list" id="copyDoor">' +
				'<div class="footer-img">' +
				'<img class="footer-normal" src="img/usu/copy-@3x.png" alt="" />' +
				'</div>' +
				'<div class="footer-text">' +
				'<span>复制</span>' +
				'</div>' +
				'</li>' +
				'<li class="footer-list" id="rotateDoor">' +
				'<div class="footer-img">' +
				'<img class="footer-normal" src="img/usu/rotate.png" alt="旋转门使其向内或向外" />' +
				'</div>' +
				'<div class="footer-text">' +
				'<span>旋转</span>' +
				'</div>' +
				'</li>' +
				'<li class="footer-list" id="modifyDoor">'+
				'<div class="footer-img">' +
				'<img class="footer-normal" src="img/usu/编辑--.png" alt="修改门窗的长度" />' +
				'</div>' +
				'<div class="footer-text">' +
				'<span>长度编辑</span>' +
				'</div>' +
				'</li>' +
				'<li class="footer-list"></li>' +
				'<li class="footer-list"></li>' +
				'<li class="footer-list" id="deleteDoor">' +
				'<div class="footer-img">' +
				'<img class="footer-normal" src="img/usu/delete.svg" alt="删除门" />' +
				'</div>' +
				'<div class="footer-text">' +
				'<span>删除</span>' +
				'</div>' +
				'</li>';
			this.footer.html(dom);
		},
		resetBottomForMark: function(itemId) {
			this.markType = null;
			var dom = '<li class="footer-list" id="finishMark">' +
				'<div class="footer-img">' +
				'<img class="footer-add" src="img/usu/edit.svg" alt="" />' +
				'</div>' +
				'<div class="footer-text">' +
				'<span>完成</span>' +
				'</div>' +
				'</li>' +
				'<li class="footer-list footer-active" id="origin-distance">' +
				'<div class="footer-img">' +
				'<img class="footer-normal" ' +
				'src="img/usu/line-icon.svg" alt="" />' +
				'</div>' +
				'<div class="footer-text">' +
				'<span>直接距离</span>' +
				'</div>' +
				'</li>' +
				'<li class="footer-list" id="horizon-distance">' +
				'<div class="footer-img">' +
				'<img class="footer-normal" style="transform:rotate(45deg)" ' +
				'src="img/usu/line-icon.svg" alt="" />' +
				'</div>' +
				'<div class="footer-text">' +
				'<span>水平距离</span>' +
				'</div>' +
				'</li>' +
				'<li class="footer-list" id="vertical-distance">' +
				'<div class="footer-img">' +
				'<img class="footer-normal" style="transform:rotate(-45deg) scale(0.8)" ' +
				'src="img/usu/line-icon.svg" alt="" />' +
				'</div>' +
				'<div class="footer-text">' +
				'<span>竖直距离</span>' +
				'</div>' +
				'</li>' +
				'<li class="footer-list"></li>' +
				'<li class="footer-list" id="deleteMark" data-target="' + itemId + '">' +
				'<div class="footer-img">' +
				'<img class="footer-normal" src="img/usu/delete.svg" alt="" />' +
				'</div>' +
				'<div class="footer-text">' +
				'<span>清除标注</span>' +
				'</div>' +
				'</li>';
			this.footer.html(dom);
		},
		/**
		 * 修改房间的层级
		 */
		toTopRoom: function() {
			var parent = this.roomDom.parentNode;
			/* 依赖于svg新添加的元素总是会出现在最上层的特性，首先移除掉元素，然后再添加，
			 * 即可实现层级的修改，而不需要重新绑定事件
			 */
			parent.removeChild(this.roomDom);
			parent.appendChild(this.roomDom);
		},
		/**
		 * 添加门窗
		 * @param {[type]} item   [墙壁的dom]
		 * @param {[type]} itemId [墙壁的id]
		 * @param {[type]} type   [门窗的类型]
		 */
		addDoor: function(item, itemId, type) {
			var self = this;
			var isVertical = item.getAttribute("isVertical");
			var points = [];
			item.setAttribute("stroke", "black");
			self.removeMaskEvent();
			self.resetBottom();
			self.itemCount++;

			var x1 = parseInt(item.getAttribute("x1"));
			var y1 = parseInt(item.getAttribute("y1"));
			var x2 = parseInt(item.getAttribute("x2"));
			var y2 = parseInt(item.getAttribute("y2"));
			var transform = self.getRotateAngle(x1, y1, x2, y2, isVertical);

			var doorId = getUid("windowId" + self.itemCount);

			var svgData = self.mainFrame.dataList.getData(type);
			var width = svgData.attrs.width;
			var height = svgData.attrs.height;

			var element = document.createElementNS('http://www.w3.org/2000/svg', "g");
			element.setAttribute("id", doorId);
			element.setAttribute("transform", transform);
			element.setAttribute("width", width);
			element.setAttribute("height", height);
			element.setAttribute("item-unique", svgData.attrs['item-unique']);
			element.setAttribute("isVertical", isVertical);
			element.setAttribute("wallId", itemId);

			var child = svgData.child;
			for(var i = 0, len = child.length; i < len; i++) {
				var sub = resetSVG(child[i].name, child[i].attrs);
				if(child[i].child) {
					for(var j = 0, len2 = child[i].child.length; j < len2; j++) {
						var subEle = resetSVG(child[i].child[j].name, child[i].child[j].attrs);
						sub.appendChild(subEle);
					}
				}
				element.appendChild(sub);
			}

			var domData = {
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
						d: "M" + (width + 2) + " -2 L" + (width - 10) + "-2 M" +
							(width + 2) + " -2 L" + (width + 2) + " 10",
						stroke: "red",
						"stroke-width": 2,
					}
				}, {
					name: "path",
					attrs: {
						d: "M" + (width + 2) + " " + (height + 2) + " L" +
							(width - 10) + " " + (height + 2) + " M" + (width + 2) + " " +
							(height + 2) + " L" + (width + 2) + " " + (height - 10),
						stroke: "red",
						"stroke-width": 2,
					}
				}, {
					name: "path",
					attrs: {
						d: "M-2 " + (height + 2) + " L10 " +
							(height + 2) + " M-2 " + (height + 2) + " L-2 " + (height - 10),
						stroke: "red",
						"stroke-width": 2,
					}
				}, ],
				attrs: {
					"data-type": "item-opacity",
					style: 'display:none'
				}
			};
			var opacity = resetSVG(domData.name, domData.attrs);
			for(var i = 0, len = domData.child.length; i < len; i++) {
				var subElement = resetSVG(domData.child[i].name, domData.child[i].attrs);
				opacity.appendChild(subElement);
			}

			element.appendChild(opacity);

			var child = self.roomDom.childNodes;
			for(var i = 0, len = child.length; i < len; i++) {
				if(child[i].tagName == "g" && child[i].getAttribute("position")) {
					self.roomDom.insertBefore(element, child[i]);
					break;
				}
			}
			self.addDoorEvent(element, doorId);
			return doorId;
		},
		/**
		 * 显示添加门窗的选择页
		 * @param  {[type]} type [门窗的类型]
		 */
		showAddItem: function(type) {
			var self = this;
			this.mainFrame.isWheel = false;
			this.wallMask.innerHTML = '<div id="addItemSection"' +
				' class="rotate-mask" style="background: rgba(0,0,0,0.1)"></div>';
			this.maskDom = $("#addItemSection");
			this.maskDom.show();
			this.addItemDom.show();
			this.maskDom.on("click", function() {
				self.maskDom.hide();
				self.maskDom.off("click");
				self.addItemDom.hide();
				self.addItemCateDom.hide();
				self.mainFrame.isWheel = true;
				if(type == "door") {
					self.currentItem.setAttribute("stroke", "black");
					self.svgCircle.setAttribute("fill-opacity", 0);
				}
			});
		},
		/**
		 * 添加新的墙壁和拐角
		 * @param {[type]} item   [墙壁的dom]
		 * @param {[type]} itemId [墙壁的id]
		 */
		addNewWall: function(item, itemId) {
			/* 添加新的墙壁需要添加两个circle和两个line*/
			var self = this;
			var thisWall = document.getElementById(itemId);
			var isClose = this.isClose;
			var room = thisWall.parentNode;
			var child = room.childNodes;
			var midX = parseInt(this.svgCircle.getAttribute("cx"));
			var midY = parseInt(this.svgCircle.getAttribute("cy"));
			var polygon = child[0].getAttribute("points").split(" ");

			thisWall.setAttribute("stroke", "black");

			var index = 0;
			for(var i = 0, len = child.length; i < len; i++) {
				if(child[i].tagName == "line") {
					index++;
					if(child[i].id == itemId) {
						break;
					}
				}
			}

			polygon.splice(index, 0, midX + "," + midY);
			polygon.splice(index, 0, midX + "," + midY);
			var tPolygon = polygon.join(" ");
			child[0].setAttribute("points", tPolygon);

			var attrs = thisWall.attributes;

			var element = document.createElementNS('http://www.w3.org/2000/svg', "line");
			for(var i = 0, len = attrs.length; i < len; i++) {
				if(attrs[i].name == "id") {
					element.setAttribute(attrs[i].name, getUid(attrs[attrs[i].name].value));
				} else if(attrs[i].name == "x2") {
					element.setAttribute(attrs[i].name, midX);
				} else if(attrs[i].name == "y2") {
					element.setAttribute(attrs[i].name, midY);
				} else {
					element.setAttribute(attrs[i].name, attrs[attrs[i].name].value);
				}
			}
			thisWall.setAttribute("x1", midX);
			thisWall.setAttribute("y1", midY);

			room.insertBefore(element, thisWall);

			/* 第二条边 */
			var element2 = document.createElementNS('http://www.w3.org/2000/svg', "line");
			for(var i = 0, len = attrs.length; i < len; i++) {
				if(attrs[i].name == "id") {
					element2.setAttribute(attrs[i].name, getUid(attrs[attrs[i].name].value + "2"));
				} else if(attrs[i].name == "x1") {
					element2.setAttribute(attrs[i].name, midX);
				} else if(attrs[i].name == "x2") {
					element2.setAttribute(attrs[i].name, midX);
				} else if(attrs[i].name == "y1") {
					element2.setAttribute(attrs[i].name, midY);
				} else if(attrs[i].name == "y2") {
					element2.setAttribute(attrs[i].name, midY);
				} else if(attrs[i].name == "isVertical") {
					if(attrs[attrs[i].name].value == "vertical") {
						element2.setAttribute(attrs[i].name, "horizon");
					} else {
						element2.setAttribute(attrs[i].name, "vertical");
					}

				} else {
					element2.setAttribute(attrs[i].name, attrs[attrs[i].name].value);
				}
			}

			room.insertBefore(element2, thisWall);

			var index2 = 0;
			for(var i = 1, len = child.length; i < len; i++) {
				if(child[i].tagName == "circle") {

					if(index == index2) {
						var element = document.createElementNS('http://www.w3.org/2000/svg', "circle");
						var attrs = child[i].attributes;
						for(var j = 0, len2 = attrs.length; j < len2; j++) {
							if(attrs[j].name == "id") {
								element.setAttribute(attrs[j].name, getUid(attrs[attrs[j].name].value));
							} else if(attrs[j].name == "cx") {
								element.setAttribute(attrs[j].name, midX);
							} else if(attrs[j].name == "cy") {
								element.setAttribute(attrs[j].name, midY);
							} else {
								element.setAttribute(attrs[j].name, attrs[attrs[j].name].value);
							}
						}

						room.insertBefore(element, child[i]);
						break;
					} else if(isClose) {
						if(index - index2 == 1) {
							var element = document.createElementNS('http://www.w3.org/2000/svg', "circle");
							var attrs = child[i].attributes;
							for(var j = 0, len2 = attrs.length; j < len2; j++) {
								if(attrs[j].name == "id") {
									element.setAttribute(attrs[j].name, getUid(attrs[attrs[j].name].value));
								} else if(attrs[j].name == "cx") {
									element.setAttribute(attrs[j].name, midX);
								} else if(attrs[j].name == "cy") {
									element.setAttribute(attrs[j].name, midY);
								} else {
									element.setAttribute(attrs[j].name, attrs[attrs[j].name].value);
								}
							}
							room.insertBefore(element, child[i + 1]);
							break;
						}
					}
					index2++;
				}
			}

			/* 第二个点 */
			var index2 = 0;
			for(var i = 1, len = child.length; i < len; i++) {
				if(child[i].tagName == "circle") {

					if(index == index2) {
						var element = document.createElementNS('http://www.w3.org/2000/svg', "circle");
						var attrs = child[i].attributes;
						for(var j = 0, len2 = attrs.length; j < len2; j++) {
							if(attrs[j].name == "id") {
								element.setAttribute(attrs[j].name, getUid(attrs[attrs[j].name].value + "2"));
							} else if(attrs[j].name == "cx") {
								element.setAttribute(attrs[j].name, midX);
							} else if(attrs[j].name == "cy") {
								element.setAttribute(attrs[j].name, midY);
							} else {
								element.setAttribute(attrs[j].name, attrs[attrs[j].name].value);
							}
						}
						room.insertBefore(element, child[i]);
						break;
					} else if(isClose) {
						if(index - index2 == 1) {
							var element = document.createElementNS('http://www.w3.org/2000/svg', "circle");
							var attrs = child[i].attributes;
							for(var j = 0, len2 = attrs.length; j < len2; j++) {
								if(attrs[j].name == "id") {
									element.setAttribute(attrs[j].name, getUid(attrs[attrs[j].name].value + "2"));
								} else if(attrs[j].name == "cx") {
									element.setAttribute(attrs[j].name, midX);
								} else if(attrs[j].name == "cy") {
									element.setAttribute(attrs[j].name, midY);
								} else {
									element.setAttribute(attrs[j].name, attrs[attrs[j].name].value);
								}
							}
							room.insertBefore(element, child[i + 1]);
							break;
						}
					}
					index2++;
				}
			}

			this.lineCount += 2;
			this.removeAllEvent();
			this.resetBottom();
			this.removeMaskEvent();
			this.addEvent();
			this.drawInfoLine(this.children, this.lineCount);
		},
		/**
		 * 锁定墙壁，仅对智能测距时生效
		 * @param {[type]} item   [墙壁的dom]
		 * @param {[type]} itemId [墙壁的id]
		 */
		lockWall: function(item, itemId) {
			item.setAttribute("lock", true);
			var child = this.children;
			for(var i = child.length - 1; i > 0; i--) {
				if(child[i].getAttribute("lineId") && child[i].getAttribute("lineId") == itemId) {
					child[i].querySelector("text").setAttribute("fill", "red");
					break;
				}
			}
		},
		/**
		 * 解锁墙壁
		 * @param {[type]} item   [墙壁的dom]
		 * @param {[type]} itemId [墙壁的id]
		 */
		unLockWall: function(item, itemId) {
			item.setAttribute("lock", false);
			var child = this.children;
			for(var i = child.length - 1; i > 0; i--) {
				if(child[i].getAttribute("lineId") && child[i].getAttribute("lineId") == itemId) {
					child[i].querySelector("text").setAttribute("fill", "blue");
					break;
				}
			}
		},
		/**
		 * 编辑墙壁的长度
		 * @param {[type]} item   [墙壁的dom]
		 * @param {[type]} itemId [墙壁的id]
		 * @param  {[type]} input  [输入的值]
		 */
		changeWallLength: function(item, itemId, input) {
			/*
			 * 删除非闭合房间的情况,改变未锁定的墙壁的长度，根据外围的标注长度信息里的position来判断墙壁的位置。
			 * 默认长度延伸方向为向下和向右
			 */
			if(isNaN(input) || !input || input <= 0 || input >= 40) {
				mui.alert("请输入有效值", "优速Max");
				return false;
			}

			var child = this.children;

			var lineNum = this.lineCount;
			var isClose = this.isClose;

			if(!isClose) return false;
			var positionList = {};
			var points = child[0].getAttribute("points").split(" ");
			var now = new Date().getTime();
			var wallPosition, index;
			for(var i = child.length - 1; i > 0; i--) {
				if(child[i].tagName == "g" && child[i].getAttribute("lineId")) {
					var tmpId = child[i].getAttribute("lineId");
					var tmpPos = child[i].getAttribute("position");
					if(tmpId == itemId) {
						wallPosition = tmpPos;
					}
					positionList[tmpId] = tmpPos;
				}
				if(child[i].id == itemId) {
					index = i;
					break;
				}
			};
			var x1 = parseInt(item.getAttribute("x1"));
			var y1 = parseInt(item.getAttribute("y1"));
			var x2 = parseInt(item.getAttribute("x2"));
			var y2 = parseInt(item.getAttribute("y2"));

			var moveLenX, moveLenY, wallAngle, tmpLength, isChangeable, distanceX, distanceY, tX1, tY1, tX2, tY2;
			if(x1 == x2) {
				moveLenX = 0;
				moveLenY = parseInt(input * 100);
			} else {
				wallAngle = Math.atan((y2 - y1) / (x2 - x1));
				tmpLength = parseInt(Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1)));
				// moveLenX = parseInt(input * Math.cos(wallAngle) * 100);
				// moveLenY = parseInt(input * Math.sin(wallAngle) * 100);

				//对于非标准角度，需要计算其在水平和竖直方向的变化长度
				moveLenX = Math.sqrt(input * input * 10000 - (tmpLength * Math.sin(wallAngle)) * (tmpLength * Math.sin(wallAngle)));
				moveLenY = Math.sqrt(input * input * 10000 - (tmpLength * Math.cos(wallAngle)) * (tmpLength * Math.cos(wallAngle)));
			}

			//分别对不同位置的墙壁做相应的处理
			if(wallPosition == "vertical-left") {
				if(y2 >= y1) {
					isChangeable = false;
					for(var i = index + 1; i <= lineNum; i++) {
						tmpPos = positionList[child[i].id];
						if(tmpPos == "vertical-right" &&
							(!child[i].getAttribute("lock") || child[i].getAttribute("lock") == "false")) {
							isChangeable = true;
						}
					}
					if(!isChangeable) {
						return mui.alert("请解锁右侧墙壁", "优速Max");
					}
					// distanceX = Math.abs(x2-x1);
					distanceY = moveLenY - (y2 - y1); //相对于原来的位置移动的距离;
					child[index].setAttribute("y2", distanceY + y2);

					for(var i = index + 1; i <= lineNum; i++) {
						tmpPos = positionList[child[i].id];
						tX1 = parseInt(child[i].getAttribute("x1"));
						tY1 = parseInt(child[i].getAttribute("y1"));
						tX2 = parseInt(child[i].getAttribute("x2"));
						tY2 = parseInt(child[i].getAttribute("y2"));
						child[i].setAttribute("y1", tY1 + distanceY);
						points[i - 1] = tX1 + "," + (tY1 + distanceY);
						child[i + lineNum].setAttribute("cy", tY1 + distanceY);

						if(tmpPos == "horizon-down" || tmpPos == "horizon-up") {
							child[i].setAttribute("y2", tY2 + distanceY);
						} else if(tmpPos == "vertical-right") {
							if(!child[i].getAttribute("lock") || child[i].getAttribute("lock") == "false") {
								child[0].setAttribute("points", points.join(" "));
								break;
							} else {
								child[i].setAttribute("y2", tY2 + distanceY);
							}
						} else if(tmpPos == "vertical-left") {
							child[i].setAttribute("y2", tY2 + distanceY);
						}
					}
				}
			} else if(wallPosition == "vertical-right") {
				if(y1 >= y2) {
					isChangeable = false;
					for(var i = index - 1; i > 0; i--) {
						tmpPos = positionList[child[i].id];
						if(tmpPos == "vertical-left" &&
							(!child[i].getAttribute("lock") || child[i].getAttribute("lock") == "false")) {
							isChangeable = true;
						}
					}
					if(!isChangeable) {
						return mui.alert("请解锁左侧墙壁", "优速Max");
					}
					// distanceX = Math.abs(x2-x1);
					distanceY = moveLenY - (y1 - y2); //相对于原来的位置移动的距离;
					child[index].setAttribute("y1", distanceY + y1);
					isChangeable = false;

					for(var i = index - 1; i > 0; i--) {
						tmpPos = positionList[child[i].id];
						tX1 = parseInt(child[i].getAttribute("x1"));
						tY1 = parseInt(child[i].getAttribute("y1"));
						tX2 = parseInt(child[i].getAttribute("x2"));
						tY2 = parseInt(child[i].getAttribute("y2"));
						child[i].setAttribute("y2", tY2 + distanceY);
						points[i] = tX2 + "," + (tY2 + distanceY);
						child[i + lineNum + 1].setAttribute("cy", tY2 + distanceY);

						if(tmpPos == "horizon-down" || tmpPos == "horizon-up") {
							child[i].setAttribute("y1", tY1 + distanceY);
						} else if(tmpPos == "vertical-right") {
							child[i].setAttribute("y1", tY1 + distanceY);
						} else if(tmpPos == "vertical-left") {
							if(!child[i].getAttribute("lock") || child[i].getAttribute("lock") == "false") {
								child[0].setAttribute("points", points.join(" "));
								break;
							} else {
								child[i].setAttribute("y1", tY1 + distanceY);
							}
						}
					}
				}
			} else if(wallPosition == "horizon-down") {
				if(x1 <= x2) {
					isChangeable = false;
					for(var i = index + 1; i <= lineNum; i++) {
						tmpPos = positionList[child[i].id];
						if(tmpPos == "horizon-up" &&
							(!child[i].getAttribute("lock") || child[i].getAttribute("lock") == "false")) {
							isChangeable = true;
						}
					}
					if(!isChangeable) {
						return mui.alert("请解锁上侧墙壁", "优速Max");
					}
					distanceX = moveLenX - (x2 - x1);
					// distanceY = moveLenY-(y1-y2); //相对于原来的位置移动的距离;
					child[index].setAttribute("x2", distanceX + x2);
					for(var i = index + 1; i <= lineNum; i++) {
						tmpPos = positionList[child[i].id];
						tX1 = parseInt(child[i].getAttribute("x1"));
						tY1 = parseInt(child[i].getAttribute("y1"));
						tX2 = parseInt(child[i].getAttribute("x2"));
						tY2 = parseInt(child[i].getAttribute("y2"));
						child[i].setAttribute("x1", tX1 + distanceX);
						child[i + lineNum].setAttribute("cx", tX1 + distanceX);
						points[i - 1] = (tX1 + distanceX) + "," + tY1;

						if(tmpPos == "horizon-up") {
							if(!child[i].getAttribute("lock") || child[i].getAttribute("lock") == "false") {
								child[0].setAttribute("points", points.join(" "));
								break;
							} else {
								child[i].setAttribute("x2", tX2 + distanceX);
							}
						} else if(tmpPos == "vertical-right" || tmpPos == "vertical-left" || tmpPos == "horizon-down") {
							child[i].setAttribute("x2", tX2 + distanceX);
						}
					}
				}
			} else {
				if(x1 >= x2) {
					isChangeable = false;
					for(var i = index - 1; i > 0; i--) {
						tmpPos = positionList[child[i].id];
						if(tmpPos == "horizon-down" &&
							(!child[i].getAttribute("lock") || child[i].getAttribute("lock") == "false")) {
							isChangeable = true;
						}
					}
					if(!isChangeable) {
						return mui.alert("请解锁下侧墙壁", "优速Max");
					}
					distanceX = moveLenX - (x1 - x2);
					// distanceY = moveLenY-(y1-y2); //相对于原来的位置移动的距离;
					child[index].setAttribute("x1", distanceX + x1);
					for(var i = index - 1; i > 0; i--) {
						tmpPos = positionList[child[i].id];
						tX1 = parseInt(child[i].getAttribute("x1"));
						tY1 = parseInt(child[i].getAttribute("y1"));
						tX2 = parseInt(child[i].getAttribute("x2"));
						tY2 = parseInt(child[i].getAttribute("y2"));
						child[i].setAttribute("x2", tX2 + distanceX);
						child[i + lineNum + 1].setAttribute("cx", tX2 + distanceX);
						points[i] = (tX2 + distanceX) + "," + tY2;

						if(tmpPos == "horizon-down") {
							if(!child[i].getAttribute("lock") || child[i].getAttribute("lock") == "false") {
								child[0].setAttribute("points", points.join(" "));
								break;
							} else {
								child[i].setAttribute("x1", tX1 + distanceX);
							}
						} else if(tmpPos == "vertical-right" || tmpPos == "vertical-left" || tmpPos == "horizon-up") {
							child[i].setAttribute("x1", tX1 + distanceX);
						}
					}
				}
			}

			item.setAttribute("lock", true);
			this.drawInfoLine(child, lineNum);
			this.resetWindow(child, child[index].id, moveLenX,
				moveLenY, moveLenX, moveLenY, "vertical", index);
			return true;
		},
		/**
		 * 尺寸标记item之间的距离
		 * @param  {[type]} item   [item的dom]
		 * @param  {[type]} itemId [item的id]
		 */
		markLength: function(item, itemId) {
			var self = this;
			/* 尺寸标注函数，点击底部菜单后显示item的四个顶点的圆，选中一个圆后会触发显示其他同房间里的所有item的
			 * 四个顶点的圆，然后再点击某个圆和墙壁完成标注，在此过程中应屏蔽掉所有的实践操作，利用isShowSize来控制
			 */
			self.resetBottomForMark(itemId); //重置底部菜单，有三个标注可选方式
			self.mainFrame.isShowSize = true;
			self.removeMaskEvent();

			/* 移除所有的圆的绑定的事件，防止重复绑定*/
			for(var k in self.sizeObjList) {
				self.sizeObjList[k].off("click");
				delete self.sizeObjList[k];
			}
			var itemChild = item.childNodes;
			var itemCircle = $("#" + itemId + "-size");
			itemChild[itemChild.length - 1].style.display = "none";
			itemChild[itemChild.length - 2].style.display = "block";
			/* 点击某一点后，将其高亮，实质上是绘制一个新的红色的圆 */
			itemCircle.on("click", "circle", function(ev) {
				ev.stopPropagation();
				var _this = this;
				this.setAttribute("stroke", "red");
				var cx = parseInt(this.getAttribute("cx"));
				var cy = parseInt(this.getAttribute("cy"));
				var transform = item.getAttribute("transform");
				self.markCircleData = {
					cx: cx,
					cy: cy,
					transform: transform,
					width: parseInt(item.getAttribute("width")),
					height: parseInt(item.getAttribute("height")),
					itemId: itemId,
					item: item
				};
				itemChild[itemChild.length - 3].setAttribute("cx", cx);
				itemChild[itemChild.length - 3].setAttribute("cy", cy);
				itemChild[itemChild.length - 3].style.display = "block";
				itemChild[itemChild.length - 2].style.display = "none";
				var child = self.children;
				for(var i = 0, len = child.length; i < len; i++) {
					if(child[i].tagName == "g" && child[i].id != itemId &&
						child[i].getAttribute("item-unique")) {
						var iChild = child[i].childNodes;
						iChild[iChild.length - 2].style.display = "block";
						self.sizeObjList[child[i].id] = $("#" + child[i].id + "-size");
						/* 遍历其他元素所有的顶点的圆绑定事件 */
						self.sizeObjList[child[i].id].on("click", "circle", function(ev) {
							ev.stopPropagation();
							_this.setAttribute("stroke", "blue");
							var tCx = parseInt(this.getAttribute("cx"));
							var tCy = parseInt(this.getAttribute("cy"));
							var tTransform = this.parentNode.parentNode.getAttribute("transform");
							var markData = {
								cx1: cx,
								cy1: cy,
								tCx1: tCx,
								tCy1: tCy,
								itemId: itemId,
								targetId: this.parentNode.parentNode.id
							}

							self.drawMarkLine(markData);

							iChild[iChild.length - 2].style.display = "none";
							itemChild[itemChild.length - 3].style.display = "none";
							itemCircle.off("click");
							self.mainFrame.isShowSize = false;
							self.deleteMark(itemId, false);
						});
					}
				}
			});
		},
		/**
		 * 根据finish值决定是删除尺寸标记还是退出标记状态
		 * @param  {[type]} itemId [item的id]
		 * @param  {[boolean]} finish [true删除， false退出标记]
		 */
		deleteMark: function(itemId, finish) {
			for(var i = this.children.length - 1; i >= 0; i--) {
				if(this.children[i].tagName == "g" &&
					this.children[i].getAttribute("data-type") == "size-text" &&
					(this.children[i].getAttribute("data-target") == itemId ||
						this.children[i].getAttribute("data-from") == itemId)) {
					if(finish) {
						this.roomDom.removeChild(this.children[i]);
					}
				} else if(this.children[i].tagName == "g" &&
					this.children[i].getAttribute("item-unique") &&
					!this.children[i].getAttribute("wallId")) {
					var child = this.children[i].childNodes;
					child[child.length - 2].style.display = "none";
					var borderChild = child[child.length - 2].childNodes;
					for(var j = 0, len = borderChild.length; j < len; j++) {
						borderChild[j].setAttribute("stroke", "blue");
					}
					child[child.length - 3].style.display = "none";
				}
			}
			this.resetBottom();
			this.mainFrame.isShowSize = false;
		},
		/**
		 * 复制item
		 * @param  {[type]} item         [item的dom]
		 * @param  {[type]} itemId       [item的id]
		 * @param  {[type]} newTransform [可选参数，决定使用哪个transform]
		 */
		copyItem: function(item, itemId, newTransform) {
			var self = this;
			var target = item.getAttribute("item-unique");
			var child = self.children;
			var newItemId = getUid(item.id + "new");

			/* 针对翻转情况的处理 */
			var isTurn = false;
			if(target.charAt(target.length - 1) == "t") {
				target = target.substr(0, target.length - 1);
				isTurn = true;
			}
			var itemInfo = self.mainFrame.dataList.getData(target);
			var transform = "";

			/* 批量复制时使用传来的transform,单个复制时有一个的错落感*/
			if(newTransform) {
				itemInfo.transform = newTransform;
			} else {
				transform = item.getAttribute("transform");
				transform = self.mainFrame.getTransform(transform);
				itemInfo.transform = "translate(" + (transform.translateX + 20) + "," +
					(transform.translateY + 20) + ") scale(" + transform.scale + ") rotate(" +
					transform.angle + " " + transform.rotateX + "," + transform.rotateY + ")";
			}
			for(var i = 0, len = child.length; i < len; i++) {
				if(child[i].tagName == "g" && child[i].getAttribute("position")) {
					var newEle = self.createSVG(itemInfo, newItemId);
					var itemUniqueAttr = newEle.getAttribute("item-unique");
					if(isTurn) {
						if(itemUniqueAttr.charAt(itemUniqueAttr.length - 1) !== "t") {
							newEle.setAttribute("item-unique", itemUniqueAttr + "t");
						}
						newEle.children[0].setAttribute("xlink:href",
							newEle.children[0].getAttribute("xlink:href").replace(/t?.png/, "t.png"))
						newEle.children[0].setAttribute("href",
							newEle.children[0].getAttribute("href").replace(/t?.png/, "t.png"))
					} else {
						newEle.children[0].setAttribute("xlink:href",
							newEle.children[0].getAttribute("xlink:href").replace(/t?.png/, ".png"))
						newEle.children[0].setAttribute("href",
							newEle.children[0].getAttribute("href").replace(/t?.png/, ".png"))
					}
					self.roomDom.insertBefore(newEle, child[i]);
					break;
				}
			}

			if(!newTransform) {
				self.removeMaskEvent();
			}

			item.childNodes[item.childNodes.length - 1].style.display = "none";
			self.addItemEvent(child, newItemId);
			self.itemCount++;

			var history = {
				element: "item",
				type: "copy",
				roomId: self.id,
				id: newItemId,
			}
			self.mainFrame.history.push(history);
			if(self.mainFrame.history.length > 0) {
				self.mainFrame.resetBtn.show();
			}
		},
		/**
		 * 批量复制item
		 * @param  {[type]} item         [item的dom]
		 * @param  {[type]} itemId       [item的id]
		 */
		copySomeItem: function(item, itemId) {
			var self = this;
			var dir = $('.popover-view-radio input[name="direction"]:checked').val(); //水平或竖直
			var line = $("#popover-item-line").val();
			var distance = $("#popover-item-dis").val();

			if(isNaN(line) || isNaN(distance) || !line || !distance) {
				return mui.alert("不是合法的数据", "优速Max");
			}

			var transform = self.mainFrame.getTransform(
				item.getAttribute("transform"));
			var width = item.getAttribute("width");
			var height = item.getAttribute("height");
			var realWidth = parseInt(transform.scale * width);
			var realHeight = parseInt(transform.scale * height);
			var rotate = transform.angle + " " + transform.rotateX + "," +
				transform.rotateY;
			var angle = transform.angle / 180 * Math.PI;
			line = parseInt(line);
			distance = parseInt(distance * 100);
			var newTransform = "";
			/* 针对旋转后的item需要根据角度划分多种情况处理，当角度接近标准角度时，会有一定的误差，需要优化 */
			for(var i = 1; i <= line; i++) {
				if(dir == "0") {
					if(transform.angle == 90 || transform.angle == 270) {
						newTransform = "translate(" + parseInt(transform.translateX +
								realHeight * i + distance * i) + "," + transform.translateY + ") scale(" +
							transform.scale + ") rotate(" + rotate + ")";
					} else if(transform.angle == 0 || transform.angle == 180 || transform.angle == 360) {
						newTransform = "translate(" + parseInt(transform.translateX +
								realWidth * i + distance * i) + "," + transform.translateY + ") scale(" +
							transform.scale + ") rotate(" + rotate + ")";
					} else {
						if(transform.angle % 90 > 10) {
							newTransform = "translate(" + parseInt(transform.translateX +
									realHeight / Math.abs(Math.sin(angle)) * i + distance * i) + "," +
								transform.translateY + ") scale(" + transform.scale + ") rotate(" + rotate + ")";
						} else {
							newTransform = "translate(" + parseInt(transform.translateX +
									realHeight * i + distance * i) + "," +
								transform.translateY + ") scale(" + transform.scale + ") rotate(" + rotate + ")";
						}
					}
				} else {
					if(transform.angle == 90 || transform.angle == 270) {
						newTransform = "translate(" + transform.translateX + "," +
							parseInt(transform.translateY + distance * i + realWidth * i) + ") scale(" +
							transform.scale + ") rotate(" + rotate + ")";
					} else if(transform.angle == 0 || transform.angle == 180 || transform.angle == 360) {
						newTransform = "translate(" + transform.translateX + "," +
							parseInt(transform.translateY + distance * i + realHeight * i) + ") scale(" +
							transform.scale + ") rotate(" + rotate + ")";
					} else {
						if(transform.angle % 90 > 10) {
							newTransform = "translate(" + transform.translateX + "," +
								parseInt(transform.translateY + realHeight / Math.abs(Math.cos(angle)) * i +
									distance * i) + ") scale(" + transform.scale + ") rotate(" + rotate + ")";
						} else {
							newTransform = "translate(" + transform.translateX + "," +
								parseInt(transform.translateY + realHeight * i + distance * i) + ") scale(" +
								transform.scale + ") rotate(" + rotate + ")";
						}
					}
				}
				self.copyItem(item, itemId, newTransform);
			}
			mui('#popover-copy').popover('toggle');
			self.removeMaskEvent();
		},
		copyDoor: function(door) {
			door.childNodes[door.childNodes.length - 1].style.display = "none";
			this.removeMaskEvent();
			this.deleteDoorInfoLine(door.id + "-line");
			this.currentItemId = null;
			this.currentItem = null;
			this.resetBottom();
			this.itemCount++;
			var wallId = door.getAttribute("wallId");
			var isVertical = door.getAttribute("isVertical");
			var itemUnique = door.getAttribute("item-unique");
			var windowData = {
				id: getUid("windowId" + this.itemCount),
				transform: door.getAttribute("transform"),
			}
			var attrs = {
				width: parseInt(door.getAttribute("width")),
				height: parseInt(door.getAttribute("height"))
			}
			var element = document.createElementNS('http://www.w3.org/2000/svg', "g");
			element.setAttribute("id", windowData.id);
			element.setAttribute("transform", windowData.transform);
			element.setAttribute("width", attrs.width);
			element.setAttribute("height", attrs.height);
			element.setAttribute("item-unique", itemUnique);
			element.setAttribute("isVertical", isVertical);
			element.setAttribute("wallId", wallId);
			var svgData = this.mainFrame.dataList.getData(itemUnique);
			var child = svgData.child;
			for(var i = 0, len = child.length; i < len; i++) {
				var sub = resetSVG(child[i].name, child[i].attrs);
				if(child[i].child) {
					for(var j = 0, len2 = child[i].child.length; j < len2; j++) {
						var subEle = resetSVG(child[i].child[j].name, child[i].child[j].attrs);
						sub.appendChild(subEle);
					}
				}
				element.appendChild(sub);
			}
			var domData = {
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
						d: "M" + (attrs.width + 2) + " -2 L" + (attrs.width - 10) + "-2 M" +
							(attrs.width + 2) + " -2 L" + (attrs.width + 2) + " 10",
						stroke: "red",
						"stroke-width": 2,
					}
				}, {
					name: "path",
					attrs: {
						d: "M" + (attrs.width + 2) + " " + (attrs.height + 2) + " L" +
							(attrs.width - 10) + " " + (attrs.height + 2) + " M" + (attrs.width + 2) + " " +
							(attrs.height + 2) + " L" + (attrs.width + 2) + " " + (attrs.height - 10),
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
			var opacity = resetSVG(domData.name, domData.attrs);
			for(var i = 0, len = domData.child.length; i < len; i++) {
				var subElement = resetSVG(domData.child[i].name, domData.child[i].attrs);
				opacity.appendChild(subElement);
			}
			element.appendChild(opacity);
			var child = this.roomDom.childNodes;
			for(var i = 0, len = child.length; i < len; i++) {
				if(child[i].tagName == "g" && child[i].getAttribute("position")) {
					this.roomDom.insertBefore(element, child[i]);
					break;
				}
			}
			this.addDoorEvent(element, windowData.id);
		},
		deleteDoor: function(door) {
			/* 在删除房间时，将历史数据中的记录删除掉，防止复原时出错，但是这样处理丧失了复原功能的意义，
			 * 所以之后需要增强复原功能，需要保存删除的dom，以便真正的复原
			 */
			for(var i = this.mainFrame.history.length - 1; i >= 0; i--) {
				if(this.mainFrame.history[i].id == this.currentItemId) {
					this.mainFrame.history.splice(i, 1);
				}
			}
			if(this.mainFrame.history.length <= 0) {
				this.mainFrame.resetBtn.hide();
			}
			this.roomDom.removeChild(door);
			this.itemCount--;
			this.removeMaskEvent();
			this.resetBottom();
			this.deleteDoorInfoLine(door.id + "-line");
			this.currentItem = null;
			this.currentItemId = null;
		},
		/**
		 * 旋转门使其向内或向外
		 * @param  {[type]} door [door的dom]
		 */
		rotateDoor: function(door) {
			var rotateDom = door.querySelector("[data-style=sub]");
			var transform = rotateDom.getAttribute("transform").split(" ");
			var rotate = transform[0].match(/[\d]+/);
			var newRotate = (+rotate[0] + 180) % 360;
			rotateDom.setAttribute("transform", "rotate(" + newRotate + " " + transform[1]);
		},
		/**
		 * 编辑门的长度
		 * @param {[type]} item   [door的dom]
		 * @param {[type]} itemId [door的id]
		 * @param  {[type]}   [输入的值]
		 */
		changeDoorLength: function(item, itemId, IWidth ) {


			var transform = item.getAttribute("transform").split(" ");
			var translate = transform[0];
			var rotate = transform[2];

			var scale = transform[1].match(/scale\(\s?([^,]+),\s?([^\)]+)\)/);
			var scaleX = scale[1];
			var scaleY = scale[2];
			var width = item.getAttribute("width");
			var height = item.getAttribute("height");
			var isVertical = item.getAttribute("isVertical");
			var newScale ="";

			//判断IWidth的数据合法性
			if(IWidth<=0){
				mui.alert("请输入有效值","优速Max");
				return;
			}
			var tempScale = IWidth*100/width;
			//判断门窗所在的墙壁
			if(isVertical!== undefined)
			{
				if(isVertical == "horizon")
				{
					newScale = scale[0].replace(/scale\(([^,]+),([^\)]+)\)/,"scale("+tempScale+","+scaleY+")");
				}else if(isVertical == "vertical"){
					newScale = scale[0].replace(/scale\(([^,]+),([^\)]+)\)/,"scale("+scaleX+","+tempScale+")");
				}
				
			}
			var newTransform = translate +" "+ newScale+" "+rotate;
			item.setAttribute("transform",newTransform); 
		},

		rotateItem: function(item, itemId) {
			var self = this;
			var isWall = item.getAttribute("isArbitrary");
			self.rotateMask.show();
			var turnBtn = $("#turn-btn");
			/* item的翻转功能，点击按钮动态判断进行翻转，实质是用翻转后的图片替代 */
			turnBtn.on("click", function(event) {
				if(isWall) return false; //禁用单方向放缩的item的翻转功能，特指隔断
				var itemName = self.currentItem.getAttribute("item-unique");
				var href = self.currentItem.children[0].getAttribute("href");
				if(itemName.charAt(itemName.length - 1) == "t") {
					self.currentItem.setAttribute("item-unique", itemName.substr(0, itemName.length - 1));
					href = href.replace("t.png", ".png");
					self.currentItem.children[0].setAttribute("href", href);
					self.currentItem.children[0].setAttribute("xlink:href", href);
				} else {
					self.currentItem.setAttribute("item-unique", itemName + "t");
					href = href.replace(".png", "t.png");
					self.currentItem.children[0].setAttribute("href", href);
					self.currentItem.children[0].setAttribute("xlink:href", href);
				}
			});
			self.rotateMaskBtn.on("click", function(event) {
				event.stopPropagation();
				self.rotateMask.hide();
				turnBtn.off("click"); //取消事件绑定
				self.rotateBlock.off("panstart panmove panend");
				self.rotateMaskBtn.off("click");
			});
			var rect = document.getElementById("angle-rect");
			var transform = self.mainFrame.getTransform(item.getAttribute("transform"));
			var rotateX = transform.rotateX;
			var rotateY = transform.rotateY;
			if(isWall) {
				transform = "translate(" + transform.translateX + "," + transform.translateY +
					") scale(" + transform.scale + ",1) rotate(";
			} else {
				transform = "translate(" + transform.translateX + "," + transform.translateY +
					") scale(" + transform.scale + ") rotate(";
			}
			var rectY = 0;
			var newPos = 0;
			var realAngle = 0;
			var markList = []; //记录item相关标记线，旋转时重绘
			var tmpMarkData = {};
			self.rotateBlock = propagating(new Hammer(rect));
			self.rotateBlock.get('pan').set({
				direction: Hammer.DIRECTION_ALL
			});
			self.rotateBlock.on("panstart panmove panend", function(ev) {
				ev.stopPropagation();
				switch(ev.type) {
					case "panstart":
						rectY = parseInt(rect.getAttribute("y"));
						markList = [];
						for(var i = self.children.length - 1; i >= 0; i--) {
							tmpMarkData = {};
							if(self.children[i].tagName == "g" &&
								self.children[i].getAttribute("data-type") == "size-text" &&
								(self.children[i].getAttribute("data-from") == itemId ||
									self.children[i].getAttribute("data-target") == itemId)) {
								if(self.children[i].getAttribute("data-wall")) {
									self.roomDom.removeChild(self.children[i]);
								} else {
									if(self.children[i].getAttribute("data-from") == itemId) {
										tmpMarkData.itemId = itemId;
										tmpMarkData.targetId = self.children[i].getAttribute("data-target");
									} else if(self.children[i].getAttribute("data-target") == itemId) {
										tmpMarkData.itemId = self.children[i].getAttribute("data-from");
										tmpMarkData.targetId = itemId;
									}
									tmpMarkData.item = document.getElementById(tmpMarkData.itemId);
									tmpMarkData.target = document.getElementById(tmpMarkData.targetId);
									tmpMarkData.targetTransform = self.mainFrame.getTransform(
										tmpMarkData.target.getAttribute("transform"));
									tmpMarkData.itemTransform = self.mainFrame.getTransform(
										tmpMarkData.item.getAttribute("transform"));
									tmpMarkData.cx1 = parseInt((self.children[i].children[0].getAttribute("x1") -
										tmpMarkData.itemTransform.translateX));
									tmpMarkData.cy1 = parseInt((self.children[i].children[0].getAttribute("y1") -
										tmpMarkData.itemTransform.translateY));
									tmpMarkData.tCx1 = parseInt((self.children[i].children[0].getAttribute("x2") -
										tmpMarkData.targetTransform.translateX));
									tmpMarkData.tCy1 = parseInt((self.children[i].children[0].getAttribute("y2") -
										tmpMarkData.targetTransform.translateY));
									markList.push(tmpMarkData);
								}
							}
						}
						break;
					case "panmove":
						newPos = rectY + ev.deltaY;
						if(newPos < 105) {
							newPos = 100;
						} else if(Math.abs(newPos - 190) < 5) {
							newPos = 190;
						} else if(Math.abs(newPos - 280) < 5) {
							newPos = 280;
						} else if(Math.abs(newPos - 370) < 5) {
							newPos = 370;
						} else if(newPos > 458) {
							newPos = 460;
						}
						rect.setAttribute("y", newPos);
						realAngle = newPos - 100;
						//删除和添加不可合并在一起，否则在两个元素之间有多条标记时，只会更新最后一条
						for(var i = 0, len = markList.length; i < len; i++) {
							self.deleteMarkLineById(markList[i].itemId, markList[i].targetId);
						}
						for(var i = 0, len = markList.length; i < len; i++) {
							self.drawMarkLine(markList[i]);
						}
						item.setAttribute("transform", transform + realAngle + " " + rotateX + "," + rotateY + ")");
						break;
					case "panend":
						break;
				}
			});
		},
		/**
		 * 详细页
		 * @param  {[type]} item   [item的dom]
		 * @param  {[type]} itemId [item的id]
		 */
		showSide: function(item, itemId) {
			this.mainFrame.isWheel = false;
			this.editMask.show();
			this.side.show();
			var transform = this.mainFrame.getTransform(item.getAttribute("transform"));
			var itemUnique = item.getAttribute("item-unique");
			var itemName = item.getAttribute("itemName");
			var category = itemUnique.split("_")[0];
			var width = parseFloat(item.getAttribute("width") * transform.scale / 100).toFixed(2);
			var height = parseFloat(item.getAttribute("height") * transform.scale / 100).toFixed(2);
			var data = {
				category: "item",
				"item-unique": itemUnique,
				price: "",
				text: "",
				img: "",
				imgWidth: 0,
				imgHeight: 0
			}
			var saveData = {};
			var itemNameVal = itemName + "(" + (width * 1000) + "x" + (height * 1000) + ")";
			item.setAttribute("item-real", itemNameVal);
			this.sideItemIcon.attr("src", "data/icon/" + category + "/" + itemName + "a.png");
			this.itemDataList = JSON.parse(localStorage.getItem("itemDataList"));
			if(this.itemDataList[itemNameVal]) {
				saveData = this.itemDataList[itemNameVal];
			}

			$.extend(data, saveData);

			/* 若不是同一item，重置图片上传区 */
			if(!this.currentItemData.itemName || this.currentItemData.itemName !== itemNameVal) {
				this.imgViewEdit.html('');
				this.fileList.html("<li>注：图片必须先上传才能编辑</li>");
				this.editImgPanel.hide();
				this.itemImgView.attr("src", "img/nopic.png");
				this.itemImgView.addClass("light");
				this.itemImgView.attr("data-role", "light");
				this.itemImgView.attr("data-source", "img/nopic.png");
				this.itemImgView.attr("data-group", "img-1");
				this.itemImgView.attr("data-id", "img1");
			}
			this.currentItemData = data;
			this.currentItemData.itemName = itemNameVal;
			this.sideImgName.html(itemNameVal);
			this.lengthSpan.val(width);
			this.widthSpan.val(height);
			this.priceInput.val(data.price);
			this.textInput.val(data.text);

			/* 若有保存的图片，则增加点击放缩查看功能 */
			if(data.img) {
				this.itemImgView.attr("src", imageHostUrl + data.img.substr(1));
				this.itemImgView.addClass("light");
				this.itemImgView.attr("data-role", "light");
				this.itemImgView.attr("data-source", imageHostUrl + data.img.substr(1));
				this.itemImgView.attr("data-group", "img-1");
				this.itemImgView.attr("data-id", "img1");
			}
		},
		/**
		 * 显示智能测距页面
		 */
		showBluetoothSection: function() {
			var self = this;
			this.mainFrame.isWheel = false;
			this.wallMask.innerHTML = '<div id="bluetoothSection"' +
				' class="rotate-mask" style="background: rgba(0,0,0,0.1)"></div>';
			this.maskDom = $("#bluetoothSection");
			this.maskDom.show();
			this.bluetoothSection.show();
			this.maskDom.on("click", function() {
				self.maskDom.hide();
				self.maskDom.off("click");
				self.bluetoothSection.hide();
				self.mainFrame.isWheel = true;
				self.currentItem.setAttribute("stroke", "black");
				self.svgCircle.setAttribute("fill-opacity", 0);
				self.resetBottom();
			})
		},
		/**
		 * 显示上传图片栏
		 */
		showUploadPanel: function() {
			this.editImgPanel.show();
			this.editContent.scrollTop(this.editContent.height());
			this.imgViewEdit.html('');
			this.fileList.html("<li>注：图片必须先上传才能编辑</li>");
		},
		/**
		 * 显示图片编辑框
		 * @return {[type]} [description]
		 */
		showImgEditPanel: function() {
			if(this.currentItemData.img == '') {
				return;
			} else {
				this.editImgPanel.show();
				this.editContent.scrollTop(this.editContent.height());
				var img = '<img id="jcrop-img" src="' + imageHostUrl + this.currentItemData.img.substr(1) + '"/>';
				this.imgViewEdit.html(img);
				this.resetImg(this.currentItemData.imgWidth, this.currentItemData.imgHeight);
			}
		},
		/**
		 * 打开相机
		 */
		appendByCamera: function() {
			var self = this;
			/* 利用plus判断是否是PC端，做不同处理 */
			if(typeof plus != "undefined") {
				plus.camera.getCamera().captureImage(function(p) {
					self.appendFile(p);
				});
			} else {
				var fileInput = document.getElementById("uploadkey1");
				fileInput.setAttribute("value", "");
				$("#uploadkey1").click();
				fileInput.onchange = function() {
					var p = fileInput.value;
					var li = document.createElement("li");
					var n = p.substr(p.lastIndexOf('/') + 1);
					li.innerText = n;
					self.fileList.html(li);
				}
			}
		},
		/**
		 * 上传原始图片
		 */
		uploadOriginImg: function() {
			var self = this;
			var viewWidth, viewHeight;
			/* 针对PC和IOS做不同的上传处理，利用jquery.form.js来实现跨域上传图片，其实不需要分终端处理*/
			if(typeof plus != "undefined") {
				if(this.files.length <= 0) {
					mui.alert("没有添加上传文件！", "优速Max");
					return false;
				}
				var wt = plus.nativeUI.showWaiting();
				var task = plus.uploader.createUpload(uploadPictureUrl, {
						method: "POST"
					},
					function(t, status) { //上传完成
						if(status == 200) {
							wt.close();
							ret = t.responseText;
							var j = JSON.parse(ret);

							var img = '<img id="jcrop-img"  src="' + imageHostUrl + j.url + '"/>';
							self.editUrl = j.url;
							self.currentItemData.img = j.url;
							self.currentItemData.imgWidth = j.width;
							self.currentItemData.imgHeight = j.height;
							self.imgViewEdit.html(img);

							/* 重设可视图片的大小 */
							self.resetImg(j.width, j.height);
						} else {
							wt.close();
							mui.alert("网络错误", "优速Max");
						}

					}
				);
				setTimeout(function() {
					wt.close();
				}, 10 * 1000);
				viewWidth = self.editImgPanel.width() * 0.8;
				viewHeight = self.imgView.height();
				task.addData("viewWidth", "" + viewWidth);
				task.addData("viewHeight", "" + viewHeight);
				task.addData("pictureId", self.currentItemId);
				var f = this.files[this.files.length - 1];
				task.addFile(f.path, {
					key: f.name
				});
				task.start();
			} else {
				var fileInput = document.getElementById("uploadkey1");
				if(fileInput.value) {
					viewWidth = self.editImgPanel.width() * 0.8;
					viewHeight = self.imgView.height();
					$("#up-width").val(viewWidth);
					$("#up-height").val(viewHeight);
					$("#up-projectId").val(self.currentItemId);
					$("#upFile").ajaxSubmit({
						url:uploadPictureUrl,
						dataType: "json",
						beforeSubmit: function() {
							console.log("正在上传");
						},
						success: function(result) {
							var j = result;
							var img = '<img id="jcrop-img"  src="' + imageHostUrl + j.url + '"/>';
							self.editUrl = j.url;
							self.currentItemData.img = j.url;
							self.currentItemData.imgWidth = j.width;
							self.currentItemData.imgHeight = j.height;
							self.imgViewEdit.html(img);

							/* 重设可视图片的大小 */
							self.resetImg(j.width, j.height);
						},
						error: function(result) {
							mui.alert("网络错误", "优速Max");
						}
					});
				} else {
					mui.alert("没有添加上传文件", "优速Max");
				}
			}
		},
		/**
		 * 打开相册
		 */
		appendByGallery: function() {
			var self = this;
			if(typeof plus != "undefined") {
				plus.gallery.pick(function(p) {
					self.appendFile(p);
				});
			} else {
				var fileInput = document.getElementById("uploadkey1");
				fileInput.setAttribute("value", "");
				$("#uploadkey1").click();
				fileInput.onchange = function() {
					var p = fileInput.value;
					var li = document.createElement("li");
					var n = p.substr(p.lastIndexOf('/') + 1);
					li.innerText = n;
					self.fileList.html(li);
				}
			}
		},
		/**
		 * 选择图片，目前限定单图片
		 * @param  {[type]} p [description]
		 * @return {[type]}   [description]
		 */
		appendFile: function(p) {
			this.fileList.html("");
			var li = document.createElement("li");
			var n = p.substr(p.lastIndexOf('/') + 1);
			li.innerText = n;
			this.fileList.html(li);
			this.files.push({
				name: "uploadkey1",
				path: p
			});
		},
		/**
		 * 根据图片长宽缩放显示
		 * @param  {[type]} imgWidth  [图片宽]
		 * @param  {[type]} imgHeight [图片长]
		 */
		resetImg: function(imgWidth, imgHeight) {
			var self = this;
			/* 利用jcrop插件来实现图片的编辑 */

			var viewWidth = this.editImgPanel.width() * 0.8; //图片预览区无法获取正确的高度？ 使用侧边宽度替代
			var viewHeight = this.imgView.height();

			this.imgView.css({
				//  "background": "url(img/loading.gif) no-repeat",
				"background-position": "center"
			})
			this.jcropImg.css({
				"width": imgWidth,
				"height": imgHeight
			});
			this.imgViewEdit.css({
				"width:": imgWidth,
				"height": imgHeight,
				"margin-left": (viewWidth - imgWidth) / 2,
				"margin-top": (viewHeight - imgHeight) / 2
			})
			$("#jcrop-img").Jcrop({
				onSelect: function(c) {
					self.editX = c.x;
					self.editY = c.y;
					self.editWidth = c.w;
					self.editHeight = c.h;
				},
				onChange: function(c) {
					self.editX = c.x;
					self.editY = c.y;
					self.editWidth = c.w;
					self.editHeight = c.h;
				},
				boxWidth: imgWidth,
				boxHeight: imgHeight,
				setSelect: [10, 10, imgWidth - 10, imgHeight - 10]
			});
		},
		/**
		 * 保存编辑后的图片大小，并发送数据，关闭编辑框
		 * @return {[type]} [description]
		 */
		saveImg: function() {
			var self = this;
			var data = {
				editX: self.editX,
				editY: self.editY,
				editWidth: self.editWidth,
				editHeight: self.editHeight,
				url: self.editUrl
			};
			$.ajax({
				type: "post",
				url: uploadEditUrl,
				dataType: "json",
				data: data,
				success: function(data) {
					var j = data;
					j.width = self.editWidth;
					j.height = self.editHeight;
					var img = '<img id="jcrop-img"  src="' + imageHostUrl + j.url + '"/>';
					self.itemImgView.attr("src", imageHostUrl + j.url + "?random" + Math.random());
					self.itemImgView.addClass("light");
					self.itemImgView.attr("data-role", "light");
					self.itemImgView.attr("data-source", imageHostUrl + j.url + "?random" + Math.random());
					self.itemImgView.attr("data-group", "img-1");
					self.itemImgView.attr("data-id", "img1");
					self.editUrl = j.url;
					self.currentItemData.img = j.url;
					self.currentItemData.imgWidth = j.width;
					self.currentItemData.imgHeight = j.height;
					self.imgViewEdit.html(img);
					self.editImgPanel.hide();
				},
				error: function(e) {
					mui.alert("网络错误", '优速Max');
				}
			});
		},
		/**
		 * 删除图片
		 */
		deleteImg: function() {
			this.currentItemData.img = '';
			this.currentItemData.imgWidth = 0;
			this.currentItemData.imgHeight = 0;
			this.itemImgView.attr("src", "img/nopic.png");
			this.itemImgView.addClass("light");
			this.itemImgView.attr("data-role", "light");
			this.itemImgView.attr("data-source", "img/nopic.png");
			this.itemImgView.attr("data-group", "img-1");
			this.itemImgView.attr("data-id", "img1");
			this.editImgPanel.hide();
			this.imgViewEdit.html('');
			this.fileList.html("<li>注：图片必须先上传才能编辑</li>");
		},
		/**
		 * 保存详细编辑页面的数据，并重置item
		 * @param  {[boolean]} flag [是否弹出对话框]
		 */
		saveItemData: function(flag) {
			/* 点击保存按钮时，根据flag决定是否显示弹出框。 item的实际数据根据输入的长宽值进行重置 */
			var lengthVal = this.lengthSpan.val();
			var length = parseInt(lengthVal * 100); //这里height和width有些混乱
			var sLength = this.currentItem.getAttribute("width");
			var sWidth = this.currentItem.getAttribute("height");
			var scale = length / sLength;
			var widthVal = (sWidth * scale / 100).toFixed(2);
			var itemNameVal = this.currentItemData.itemName.replace(/\([\d]+x[\d]+\)/, "");
			itemNameVal = itemNameVal + "(" + (lengthVal * 1000) + "x" + (widthVal * 1000) + ")";

			var transform = this.mainFrame.getTransform(this.currentItem.getAttribute("transform"));
			this.currentItem.setAttribute("transform", "translate(" + transform.translateX + "," +
				transform.translateY + ") scale(" + scale.toFixed(5) + ") rotate(" +
				transform.angle + " " + transform.rotateX + "," + transform.rotateY + ")");
			this.currentItem.setAttribute("item-real", itemNameVal);
			var data = {
				price: this.priceInput.val(),
				text: this.textInput.val(),
				itemName: itemNameVal,
			}

			$.extend(this.currentItemData, data);
			this.itemDataList[itemNameVal] = this.currentItemData;

			localStorage.setItem("itemDataList", JSON.stringify(this.itemDataList));

			this.widthSpan.val(widthVal);
			this.sideImgName.html(itemNameVal);

			/* 需要重新绘制item的尺寸标注 */
			var markList = [];
			var tmpMarkData = {};
			var itemId = this.currentItemId;
			for(var i = this.children.length - 1; i >= 0; i--) {
				tmpMarkData = {};
				if(this.children[i].tagName == "g" &&
					this.children[i].getAttribute("data-type") == "size-text" &&
					(this.children[i].getAttribute("data-from") == itemId ||
						this.children[i].getAttribute("data-target") == itemId)) {

					if(this.children[i].getAttribute("data-from") == itemId) {
						tmpMarkData.itemId = itemId;
						tmpMarkData.targetId = this.children[i].getAttribute("data-target");
					} else if(this.children[i].getAttribute("data-target") == itemId) {
						tmpMarkData.itemId = this.children[i].getAttribute("data-from");
						tmpMarkData.targetId = itemId;
					}
					tmpMarkData.item = document.getElementById(tmpMarkData.itemId);
					tmpMarkData.target = document.getElementById(tmpMarkData.targetId);
					tmpMarkData.targetTransform = this.mainFrame.getTransform(
						tmpMarkData.target.getAttribute("transform"));
					tmpMarkData.itemTransform = this.mainFrame.getTransform(
						tmpMarkData.item.getAttribute("transform"));
					tmpMarkData.cx1 = parseInt(this.children[i].children[0].getAttribute("x1") -
						tmpMarkData.itemTransform.translateX);
					tmpMarkData.cy1 = parseInt(this.children[i].children[0].getAttribute("y1") -
						tmpMarkData.itemTransform.translateY);
					tmpMarkData.tCx1 = parseInt(this.children[i].children[0].getAttribute("x2") -
						tmpMarkData.targetTransform.translateX);
					tmpMarkData.tCy1 = parseInt(this.children[i].children[0].getAttribute("y2") -
						tmpMarkData.targetTransform.translateY);
					markList.push(tmpMarkData);
				}
			}
			for(var i = 0, len = markList.length; i < len; i++) {
				this.deleteMarkLineById(markList[i].itemId, markList[i].targetId);
			}
			for(var i = 0, len = markList.length; i < len; i++) {
				this.drawMarkLine(markList[i]);
			}
			if(flag) {
				mui.alert("保存成功", "优速Max");
			}
		},
		/**
		 * 水平方向的墙壁的事件处理函数
		 * @param  {[type]} child [room的所有子元素]
		 * @param  {[type]} index [当前墙壁的索引]
		 */
		childLineHorHandler: function(child, index) {
			var self = this;
			var tmpNum = self.isClose ? 0 : 1; //对于非闭合和闭合房间两种情况进行的矫正
			var lineId = child[index].id;
			var roomAllPoints = [];
			var roomNumber = 0;
			var roomList = null;

			self.hammerList[lineId] = propagating(new Hammer(child[index]));
			self.hammerList[lineId].on("tap", function(ev) {
				if(self.mainFrame.isShowSize) {
					self.drawMarkLineByWall(child[index], self.markCircleData);
					return false;
				}
				child[index].setAttribute("stroke", "red");
				self.wallMask.innerHTML = '<div class="rotate-mask" id="' + lineId + '-mask"' + '></div>';
				self.maskDom = document.getElementById(lineId + "-mask");
				self.maskDom.style.display = "block";

				self.drawWhitePoint(ev, child, index);

				self.currentItemId = lineId;
				self.currentItem = child[index];

				self.resetBottomForWall();

				self.maskHammer = propagating(new Hammer(self.maskDom));
				self.maskHammer.get('pan').set({
					direction: Hammer.DIRECTION_ALL
				});

				var lineX1, lineY1, lineX2, lineY2, points, svgScale, transfrom,
					translate, translateX, translateY, isAbsHorizon, itemNum, lineNum,
					moveLengthX, moveLengthX2, moveLengthY, moveLengthY2;
				self.maskHammer.on("panstart panmove panend", function(ev) {
					ev.stopPropagation();
					switch(ev.type) {
						case "panstart":
							self.svgCircle.setAttribute("fill-opacity", 0);
							lineX1 = parseInt(child[index].getAttribute("x1"));
							lineY1 = parseInt(child[index].getAttribute("y1"));
							lineX2 = parseInt(child[index].getAttribute("x2"));
							lineY2 = parseInt(child[index].getAttribute("y2"));
							points = child[0].getAttribute("points").split(" ");
							self.svgPanelTransform = self.mainFrame.getTransform(self.svgPanel.getAttribute("transform"));
							svgScale = self.svgPanelTransform.scale;
							transform = child[index].parentNode.getAttribute("transform");
							translate = transform.match(/(-|\+)?[\d]+,(-|\+)?[\d]+/)[0].split(",");
							translateX = parseInt(translate[0]);
							translateY = parseInt(translate[1]);
							isAbsHorizon = (lineY1 - lineY2 != 0) ? false : true;
							itemNum = self.itemCount;
							lineNum = self.lineCount;

							roomAllPoints = []; //用来记录所有房间的顶点，在移动墙壁时支持自动合并的功能的实现

							roomList = child[index].parentNode.parentNode.children;

							for(var i = 0, len = roomList.length; i < len; i++) {
								var roomChild = roomList[i].children;
								var roomTransform = roomList[i].getAttribute("transform");
								var roomTranslate = roomTransform.match(/(-|\+)?[\d]+,(-|\+)?[\d]+/)[0].split(",");
								roomTranslate[1] = parseInt(roomTranslate[1]);
								roomTranslate[0] = parseInt(roomTranslate[0]);
								if(roomList[i].id != self.id) {
									for(var j = 0, len2 = roomChild.length; j < len2; j++) {
										if(roomChild[j].tagName == "circle") {
											var roomChildY = parseInt(roomChild[j].getAttribute("cy")) + roomTranslate[1];
											var hasThePoint = false;
											for(var k = 0, len3 = roomAllPoints.length; k < len3; k++) {
												if(roomAllPoints[k] == roomChildY) {
													hasThePoint = true;
												}
											}
											if(!hasThePoint) {
												roomAllPoints.push(roomChildY);
											}
										}
									}
								} else {

									/* 移除与此墙壁相关的尺寸标注 */
									for(var j = roomChild.length - 1; j > 0; j--) {
										if(roomChild[j].tagName == "g" && roomChild[j].getAttribute("data-type") == "size-text" &&
											roomChild[j].getAttribute("data-target") == lineId) {
											self.roomDom.removeChild(roomChild[j]);
										}
									}
								}
							}
							break;
						case "panmove":
							moveLengthY = parseInt(lineY1 + (ev.deltaY / svgScale));
							moveLengthY2 = parseInt(lineY2 + (ev.deltaY / svgScale));

							/* 如果是标准的水平方向 */
							if(isAbsHorizon) {
								moveLengthX = lineX1;
								moveLengthX2 = lineX2;
								for(var i = 0, len = roomAllPoints.length; i < len; i++) {
									/* 相近时自动合并 */
									if(Math.abs(translateY + moveLengthY - roomAllPoints[i]) < 15) {
										moveLengthY = roomAllPoints[i] - translateY;
										moveLengthY2 = roomAllPoints[i] - translateY;
									}
								}
							} else {
								moveLengthX = parseInt(lineX1 + (ev.deltaX / svgScale));
								moveLengthX2 = parseInt(lineX2 + (ev.deltaX / svgScale));
							}

							child[index].setAttribute("x1", moveLengthX);
							child[index].setAttribute("y1", moveLengthY);
							child[index].setAttribute("x2", moveLengthX2);
							child[index].setAttribute("y2", moveLengthY2);
							child[index + lineNum].setAttribute("cx", moveLengthX);
							child[index + lineNum].setAttribute("cy", moveLengthY);

							self.resetLineInfo(child, index + 2 * lineNum + tmpNum + itemNum, index);

							/* 改变其他所有与当前移动墙壁有关联的墙壁或者顶点的坐标 */
							if(child[index + lineNum + 1].tagName == "circle") {
								child[index + lineNum + 1].setAttribute("cx", moveLengthX2);
								child[index + lineNum + 1].setAttribute("cy", moveLengthY2);
							} else {
								child[lineNum + 1].setAttribute("cx", moveLengthX2);
								child[lineNum + 1].setAttribute("cy", moveLengthY2);
							}
							/* 移动的是第一条边时 */
							if(index == 1) {
								if(self.isClose) {
									child[lineNum].setAttribute("x2", moveLengthX);
									child[lineNum].setAttribute("y2", moveLengthY);
									child[lineNum].setAttribute("lock", false);
									self.resetLineInfo(child, 3 * lineNum + itemNum + itemNum, lineNum);
								}
								if(child[index + 1].tagName == "line") {
									child[index + 1].setAttribute("x1", moveLengthX2);
									child[index + 1].setAttribute("y1", moveLengthY2);
									child[index + 1].setAttribute("lock", false);
									self.resetLineInfo(child, index + 2 * lineNum + itemNum + tmpNum + 1, index + 1);
								}
								/* 移动的是最后一条边时 */
							} else if(index == lineNum) {
								if(self.isClose) {
									child[1].setAttribute("x1", moveLengthX2);
									child[1].setAttribute("y1", moveLengthY2);
									child[1].setAttribute("lock", false);
									self.resetLineInfo(child, 2 * lineNum + itemNum + 1, 1);
								}
								if(child[index - 1].tagName == "line") {
									child[index - 1].setAttribute("x2", moveLengthX);
									child[index - 1].setAttribute("y2", moveLengthY);
									child[index - 1].setAttribute("lock", false);
									self.resetLineInfo(child, index - 1 + 2 * lineNum + itemNum + tmpNum, index - 1);
								}
								/* 移动的是中间的边时 */
							} else {
								child[index - 1].setAttribute("x2", moveLengthX);
								child[index - 1].setAttribute("y2", moveLengthY);
								child[index + 1].setAttribute("x1", moveLengthX2);
								child[index + 1].setAttribute("y1", moveLengthY2);
								child[index - 1].setAttribute("lock", false);
								child[index + 1].setAttribute("lock", false);
								self.resetLineInfo(child, index + 2 * lineNum + itemNum + tmpNum - 1, index - 1);
								self.resetLineInfo(child, index + 2 * lineNum + itemNum + tmpNum + 1, index + 1);
							}

							/* 根据index分情况改变底部地板的位置 */
							if(points.length == index) {
								points[index - 1] = (moveLengthX + "," + moveLengthY);
								points[0] = (moveLengthX2 + "," + moveLengthY2);
							} else {
								points[index - 1] = (moveLengthX + "," + moveLengthY);
								points[index] = (moveLengthX2 + "," + moveLengthY2);
							}

							var tPoints = points.join(" ");
							child[0].setAttribute("points", tPoints);

							self.resetWindow(child, child[index].id, moveLengthX, moveLengthY,
								moveLengthX, moveLengthY, "vertical", index);
							break;
						case "panend":
							self.drawInfoLine(child, lineNum);
							self.drawWhitePoint(ev, child, index);
							break;
					}
				});
				self.maskHammer.on("tap", function(ev) {
					ev.stopPropagation();
					child[index].setAttribute("stroke", "black");
					self.removeMaskEvent();
					self.resetBottom();
				});
			});
		},
		/**
		 * 竖直方向的墙壁的事件处理函数
		 * @param  {[type]} child [room的所有子元素]
		 * @param  {[type]} index [当前墙壁的索引]
		 */
		childLineVerHandler: function(child, index) {
			var self = this;

			var tmpNum = self.isClose ? 0 : 1;
			var lineId = child[index].id;
			var roomAllPoints = [];
			var roomList = null;
			//var virtualData = self.virtualData.child[lineId];
			self.hammerList[lineId] = propagating(new Hammer(child[index]));
			self.hammerList[lineId].on("tap", function(ev) {
				if(self.mainFrame.isShowSize) {
					self.drawMarkLineByWall(child[index], self.markCircleData);
					return false;
				}
				child[index].setAttribute("stroke", "red");
				self.wallMask.innerHTML = '<div class="rotate-mask" id="' + lineId + '-mask"' +
					'></div>';
				self.maskDom = document.getElementById(lineId + "-mask");
				self.maskDom.style.display = "block";
				self.drawWhitePoint(ev, child, index);
				self.currentItemId = lineId;
				self.currentItem = child[index];
				self.resetBottomForWall();
				self.maskHammer = propagating(new Hammer(self.maskDom));
				self.maskHammer.get('pan').set({
					direction: Hammer.DIRECTION_ALL
				});

				var lineX1, lineY1, lineX2, lineY2, points, svgScale, transform,
					translate, translateX, translateY, isAbsVertical, itemNum, lineNum,
					moveLengthX, moveLengthX2, moveLengthY, moveLengthY2;
				self.maskHammer.on("panstart panmove panend", function(ev) {
					ev.stopPropagation();
					switch(ev.type) {
						case "panstart":
							self.svgCircle.setAttribute("fill-opacity", 0);
							lineX1 = parseInt(child[index].getAttribute("x1"));
							lineY1 = parseInt(child[index].getAttribute("y1"));
							lineX2 = parseInt(child[index].getAttribute("x2"));
							lineY2 = parseInt(child[index].getAttribute("y2"));
							points = child[0].getAttribute("points").split(" ");
							self.svgPanelTransform = self.mainFrame.getTransform(self.svgPanel.getAttribute("transform"));
							svgScale = self.svgPanelTransform.scale;
							transform = child[index].parentNode.getAttribute("transform");
							translate = transform.match(/(-|\+)?[\d]+,(-|\+)?[\d]+/)[0].split(",");
							translateX = parseInt(translate[0]);
							translateY = parseInt(translate[1]);
							isAbsVertical = (lineX1 - lineX2 != 0) ? false : true;
							itemNum = self.itemCount;
							lineNum = self.lineCount;
							roomAllPoints = [];
							roomList = child[index].parentNode.parentNode.children;
							for(var i = 0, len = roomList.length; i < len; i++) {
								var roomChild = roomList[i].children;
								var roomTransform = roomList[i].getAttribute("transform");
								var roomTranslate = roomTransform.match(/(-|\+)?[\d]+,(-|\+)?[\d]+/)[0].split(",");
								roomTranslate[0] = parseInt(roomTranslate[0]);
								roomTranslate[1] = parseInt(roomTranslate[1]);
								if(roomList[i].id != self.id) {
									for(var j = 0, len2 = roomChild.length; j < len2; j++) {
										if(roomChild[j].tagName == "circle") {
											var roomChildX = parseInt(roomChild[j].getAttribute("cx")) + roomTranslate[0];
											var hasThePoint = false;
											for(var k = 0, len3 = roomAllPoints.length; k < len3; k++) {
												if(roomAllPoints[k] == roomChildX) {
													hasThePoint = true;
												}
											}
											if(!hasThePoint) {
												roomAllPoints.push(roomChildX);
											}
										}
									}
								} else {
									for(var j = roomChild.length - 1; j > 0; j--) {
										if(roomChild[j].tagName == "g" && roomChild[j].getAttribute("data-type") == "size-text" &&
											roomChild[j].getAttribute("data-target") == lineId) {
											self.roomDom.removeChild(roomChild[j]);
										}
									}
								}
							}
							break;
						case "panmove":
							moveLengthX = parseInt(lineX1 + (ev.deltaX / svgScale));
							moveLengthX2 = parseInt(lineX2 + (ev.deltaX / svgScale));
							if(isAbsVertical) {
								moveLengthY = lineY1;
								moveLengthY2 = lineY2;
								for(var i = 0, len = roomAllPoints.length; i < len; i++) {
									if(Math.abs(translateX + moveLengthX - roomAllPoints[i]) < 15) {
										moveLengthX = roomAllPoints[i] - translateX;
										moveLengthX2 = roomAllPoints[i] - translateX;
									}
								}
							} else {
								moveLengthY = parseInt(lineY1 + (ev.deltaY / svgScale));
								moveLengthY2 = parseInt(lineY2 + (ev.deltaY / svgScale));
							}

							child[index].setAttribute("x1", moveLengthX);
							child[index].setAttribute("y1", moveLengthY);
							child[index].setAttribute("x2", moveLengthX2);
							child[index].setAttribute("y2", moveLengthY2);
							child[index + lineNum].setAttribute("cx", moveLengthX);
							child[index + lineNum].setAttribute("cy", moveLengthY);
							self.resetLineInfo(child, index + 2 * lineNum + itemNum + tmpNum, index);

							if(child[index + lineNum + 1].tagName == "circle") {
								child[index + lineNum + 1].setAttribute("cx", moveLengthX2);
								child[index + lineNum + 1].setAttribute("cy", moveLengthY2);
							} else {
								child[lineNum + 1].setAttribute("cx", moveLengthX2);
								child[lineNum + 1].setAttribute("cy", moveLengthY2);
							}

							if(index == 1) {
								if(self.isClose) {
									child[lineNum].setAttribute("x2", moveLengthX);
									child[lineNum].setAttribute("y2", moveLengthY);
									child[lineNum].setAttribute("lock", false);
									self.resetLineInfo(child, 3 * lineNum + itemNum, lineNum);
								}
								if(child[index + 1].tagName == "line") {
									child[index + 1].setAttribute("x1", moveLengthX2);
									child[index + 1].setAttribute("y1", moveLengthY2);
									child[index + 1].setAttribute("lock", false);
									self.resetLineInfo(child, index + 2 * lineNum + itemNum + tmpNum + 1, index + 1);
								}
							} else if(index == lineNum) {
								if(self.isClose) {
									child[1].setAttribute("x1", moveLengthX2);
									child[1].setAttribute("y1", moveLengthY2);
									child[1].setAttribute("lock", false);
									self.resetLineInfo(child, 2 * lineNum + 1, 1);
								}
								if(child[index - 1].tagName == "line") {
									child[index - 1].setAttribute("x2", moveLengthX);
									child[index - 1].setAttribute("y2", moveLengthY);
									child[index - 1].setAttribute("lock", false);
									self.resetLineInfo(child, index - 1 + 2 * lineNum + itemNum + tmpNum, index - 1);
								}
							} else {
								child[index - 1].setAttribute("x2", moveLengthX);
								child[index - 1].setAttribute("y2", moveLengthY);
								child[index + 1].setAttribute("x1", moveLengthX2);
								child[index + 1].setAttribute("y1", moveLengthY2);
								child[index - 1].setAttribute("lock", false);
								child[index + 1].setAttribute("lock", false);
								self.resetLineInfo(child, index + 2 * lineNum + itemNum + tmpNum - 1, index - 1);
								self.resetLineInfo(child, index + 2 * lineNum + itemNum + tmpNum + 1, index + 1);
							}

							if(points.length == index) {
								points[index - 1] = (moveLengthX + "," + moveLengthY);
								points[0] = (moveLengthX2 + "," + moveLengthY2);
							} else {
								points[index - 1] = (moveLengthX + "," + moveLengthY);
								points[index] = (moveLengthX2 + "," + moveLengthY2);
							}
							var tPoints = points.join(" ");
							child[0].setAttribute("points", tPoints);
							self.resetWindow(child, child[index].id, moveLengthX,
								moveLengthY, moveLengthX, moveLengthY, "vertical", index);
							break;
						case "panend":
							self.drawInfoLine(child, lineNum);
							self.drawWhitePoint(ev, child, index);
							break;
					}
				});
				self.maskHammer.on("tap", function(ev) {
					ev.stopPropagation();
					child[index].setAttribute("stroke", "black");
					self.removeMaskEvent();
					self.resetBottom();
				});
			});
		},
		/**
		 * 房间顶点的事件处理函数
		 * @param  {[type]} child [room的所有子元素]
		 * @param  {[type]} index [当前墙壁的索引]
		 */
		childCircleHandler: function(child, index) {
			var self = this;

			var point = child[index];
			self.hammerList[point.id] = propagating(new Hammer(child[index]));
			self.hammerList[point.id].on("tap", function(ev) {
				ev.stopPropagation();
				if(self.mainFrame.isShowSize) return;

				child[index].setAttribute("stroke", "red");
				child[index].setAttribute("fill", "red");
				child[index].setAttribute("fill-opacity", "0.5");
				child[index].setAttribute("r", "8");

				self.wallMask.innerHTML = '<div id=' + child[index].id + '-mask' +
					' class="rotate-mask"></div>';
				self.maskDom = document.getElementById(child[index].id + "-mask");
				self.maskDom.style.display = "block";

				self.maskHammer = propagating(new Hammer(self.maskDom));
				self.maskHammer.get('pan').set({
					direction: Hammer.DIRECTION_ALL
				});
				self.maskHammer.on("tap", function(ev) {
					self.removeMaskEvent();
					child[index].setAttribute("stroke", "blue");
					child[index].setAttribute("fill", "black");
					child[index].setAttribute("fill-opacity", "1");
					child[index].setAttribute("r", "7");
				});

				var moveLenthX, moveLenthY, moveLengthX2, moveLengthY2, parentScale, cx, cy, polygon,
					lineNum, itemNum, tmpX, tmpY, tPolygon, tNum;
				self.maskHammer.on("panstart panmove panend", function(ev) {
					ev.stopPropagation();
					switch(ev.type) {
						case "panstart":
							point.setAttribute("stroke", "red");
							cx = parseInt(point.getAttribute("cx")); //记录初始的位置
							cy = parseInt(point.getAttribute("cy"));
							self.svgPanelTransform = self.mainFrame.getTransform(self.svgPanel.getAttribute("transform"));
							parentScale = self.svgPanelTransform.scale;

							polygon = child[0].getAttribute("points").split(" ");
							itemNum = self.itemCount;
							lineNum = self.lineCount;
							for(var j = self.children.length - 1; j > 0; j--) {
								if(self.children[j].tagName == "g" && self.children[j].getAttribute("data-wall") &&
									self.children[j].getAttribute("data-type") == "size-text") {
									self.roomDom.removeChild(self.children[j]);
								}
							}
							break;

						case "panmove":
							moveLenthX = parseInt(ev.deltaX / parentScale) + cx;
							moveLenthY = parseInt(ev.deltaY / parentScale) + cy;

							if(child[index + 1] && child[index + 1].tagName == "circle") {
								tmpX = child[index + 1].getAttribute("cx");
								tmpY = child[index + 1].getAttribute("cy");
								if(Math.abs(moveLenthX - tmpX) < 20) {
									moveLenthX = tmpX;
								}
								if(Math.abs(moveLenthY - tmpY) < 20) {
									moveLenthY = tmpY;
								}
							}

							if(child[index - 1] && child[index - 1].tagName == "circle") {
								tmpX = child[index - 1].getAttribute("cx");
								tmpY = child[index - 1].getAttribute("cy");
								if(Math.abs(moveLenthX - tmpX) < 20) {
									moveLenthX = tmpX;
								}
								if(Math.abs(moveLenthY - tmpY) < 20) {
									moveLenthY = tmpY;
								}
							}

							/* 闭合房间的第一个节点 */
							if(self.isClose && index - lineNum == 1) {

								tmpX = child[index + lineNum - 1].getAttribute("cx");
								tmpY = child[index + lineNum - 1].getAttribute("cy");
								if(Math.abs(moveLenthX - tmpX) < 20) {
									moveLenthX = tmpX;
								}
								if(Math.abs(moveLenthY - tmpY) < 20) {
									moveLenthY = tmpY;
								}
							}
							if(self.isClose && index - lineNum * 2 == 0) {
								tmpX = child[index - lineNum + 1].getAttribute("cx");
								tmpY = child[index - lineNum + 1].getAttribute("cy");
								if(Math.abs(moveLenthX - tmpX) < 20) {
									moveLenthX = tmpX;
								}
								if(Math.abs(moveLenthY - tmpY) < 20) {
									moveLenthY = tmpY;
								}
							}

							point.setAttribute("cx", moveLenthX);
							point.setAttribute("cy", moveLenthY);

							polygon[index - lineNum - 1] = moveLenthX + "," + moveLenthY;
							tPolygon = polygon.join(" ");
							child[0].setAttribute("points", tPolygon);

							if(index - lineNum == 1) {
								if(self.isClose) {
									/* 闭合的第一个点 */
									child[index - 1].setAttribute("x2", moveLenthX);
									child[index - 1].setAttribute("y2", moveLenthY);
									child[index - 1].setAttribute("lock", false);
									self.resetLineInfo(child, index + lineNum * 2 + itemNum - 1, lineNum);
								}
								/* 未闭合的第一个点 */
								child[1].setAttribute("x1", moveLenthX);
								child[1].setAttribute("y1", moveLenthY);
								child[1].setAttribute("lock", false);
								tmpNum = self.isClose ? 0 : 1;
								self.resetLineInfo(child, index + lineNum + itemNum + tmpNum, 1);

							} else if(index - lineNum * 2 == 1) {
								/* 未闭合最后一个顶点 */
								child[index - lineNum - 1].setAttribute("x2", moveLenthX);
								child[index - lineNum - 1].setAttribute("y2", moveLenthY);
								child[index - lineNum - 1].setAttribute("lock", false);
								self.resetLineInfo(child, index + lineNum + itemNum, index - lineNum - 1);
							} else {
								/* 中间的点 */
								child[index - lineNum].setAttribute("x1", moveLenthX);
								child[index - lineNum].setAttribute("y1", moveLenthY);
								child[index - lineNum - 1].setAttribute("x2", moveLenthX);
								child[index - lineNum - 1].setAttribute("y2", moveLenthY);
								child[index - lineNum].setAttribute("lock", false);
								child[index - lineNum - 1].setAttribute("lock", false);
								tmpNum = self.isClose ? -1 : 0;
								self.resetLineInfo(child, index + lineNum + itemNum + tmpNum, index - lineNum - 1);
								self.resetLineInfo(child, index + lineNum + itemNum + tmpNum + 1, index - lineNum);
							}
							self.resetWindow(child, child[index].id, moveLenthX, moveLenthY,
								moveLenthX, moveLenthY, "vertical", index);
							break;
						case "panend":
							cx = moveLenthX;
							cy = moveLenthY;
							self.drawInfoLine(child, lineNum);
							break;
					}
				});
			});
		},
		removeItem: function(roomDom, item) {
			for(var i = this.mainFrame.history.length - 1; i >= 0; i--) {
				if(this.mainFrame.history[i].id == this.currentItemId) {
					this.mainFrame.history.splice(i, 1);
				}
			}
			if(this.mainFrame.history.length <= 0) {
				this.mainFrame.resetBtn.hide();
			}
			roomDom.removeChild(item);
			this.itemCount--;
			this.removeMaskEvent();
			this.resetBottom();
			this.deleteMark(this.currentItemId, true);
			this.currentItem = null;
			this.currentItemId = null;
		},
		/**
		 * 在移动墙壁，顶点时重置与之关联的门窗的位置
		 * @param  {[type]}  child      [room的所有子元素]
		 * @param  {[type]}  wallId     [墙壁的id]
		 * @param  {[type]}  x1         [墙壁的x1]
		 * @param  {[type]}  y1         [墙壁的y1]
		 * @param  {[type]}  x2         [墙壁的x2]
		 * @param  {[type]}  y2         [墙壁的y2]
		 * @param  {Boolean} isVertical [墙壁是否竖直]
		 * @param  {[type]}  index      [墙壁索引值]
		 */
		resetWindow: function(child, wallId, x1, y1, x2, y2, isVertical, index) {
			for(var i = index, len = child.length; i < len; i++) {
				var domWallId = child[i].getAttribute("wallId");
				if(child[i].tagName == "g" && domWallId) {
					var wall = document.getElementById(domWallId);
					var wallX1 = wall.getAttribute("x1");
					var wallY1 = wall.getAttribute("y1");
					var wallX2 = wall.getAttribute("x2");
					var wallY2 = wall.getAttribute("y2");

					var wallAngle = Math.atan((wallY1 - wallY2) / (wallX1 - wallX2)) * 180 / Math.PI;
					wallAngle = wallAngle.toFixed(5);

					var wallK = (wallY2 - wallY1) / (wallX2 - wallX1);

					var transform = child[i].getAttribute("transform");
					var translate = transform.match(/(-|\+)?[\d]+,(-|\+)?[\d]+/)[0].split(",");
					var tmpTransform = transform.split(" ");

					if(wallK == "-Infinity" || wallK == "Infinity") {
						wallAngle = 90;
						if(wallAngle < 0) {
							var tmpX = parseInt((translate[1] - wallY1) / wallK +
								parseInt(wallX1)) - 7;
						} else {
							var tmpX = parseInt((translate[1] - wallY1) / wallK +
								parseInt(wallX1)) + 7;
						}

						transform = "translate(" + tmpX + "," + translate[1] + ") " +
							tmpTransform[1] + " rotate(" + wallAngle + ")";;
					} else {
						if(child[i].getAttribute("isVertical") == "vertical") {
							if(wallAngle < 0) {
								wallAngle = parseInt(wallAngle) + 360;
								var tmpX = parseInt((translate[1] - wallY1) / wallK +
									parseInt(wallX1)) - 7;
							} else {
								var tmpX = parseInt((translate[1] - wallY1) / wallK +
									parseInt(wallX1)) + 7;
							}
							transform = "translate(" + tmpX + "," + translate[1] + ") " +
								tmpTransform[1] + " rotate(" + wallAngle + ")";
						} else {
							var tmpY = parseInt(wallK * (translate[0] - wallX1) +
								parseInt(wallY1)) - 7;
							transform = "translate(" + translate[0] + "," + tmpY + ") " +
								tmpTransform[1] + " rotate(" + wallAngle + ")";
						}

					}
					child[i].setAttribute("transform", transform);
				}
			}
		},
		/**
		 * 绘制墙壁上的白点
		 * @param  {[type]} ev    [event事件对象]
		 * @param  {[type]} child [room的所有子元素]
		 * @param  {[type]} index [当前墙壁的索引]
		 */
		drawWhitePoint: function(ev, child, index) {
			var transformDom = this.svgPanel.getAttribute("transform");
			var roomTransformDom = this.roomDom.getAttribute("transform");
			var transform = this.mainFrame.getTransform(transformDom);
			var roomTransform = this.mainFrame.getTransform(roomTransformDom);
			var x1 = parseInt(child[index].getAttribute("x1"));
			var y1 = parseInt(child[index].getAttribute("y1"));
			var x2 = parseInt(child[index].getAttribute("x2"));
			var y2 = parseInt(child[index].getAttribute("y2"));
			var cx = (ev.center.x - transform.translateX) / transform.scale - roomTransform.translateX;
			var cy = (ev.center.y - transform.translateY) / transform.scale - roomTransform.translateY;
			var k = 0;

			if(x1 == x2) {
				cx = x1;
				cy = parseInt(cy);
			} else if(y1 == y2) {
				cx = parseInt(cx);
				cy = y1;
			} else {
				cy = parseInt((cx - x1) * (y2 - y1) / (x2 - x1) + y1);
			}
			this.svgCirclePoint.setAttribute("transform", transformDom);
			this.svgCircleRoom.setAttribute("transform", roomTransformDom);
			this.svgCircle.setAttribute("cx", cx);
			this.svgCircle.setAttribute("cy", cy);
			this.svgCircle.setAttribute("fill-opacity", 1);
		},
		/**
		 * 绘制墙壁上的门窗的长度信息
		 * @param  {[type]} data [长度相关数据]
		 */
		drawDoorInfoLine: function(data) {
			var translate = data.translate;
			var realWidth = data.realWidth;
			var realHeight = data.realHeight;
			var x1 = data.x1;
			var x2 = data.x2;
			var y1 = data.y1;
			var y2 = data.y2;
			var position = data.position;
			var windowLineId = data.windowLineId;

			if(position == "vertical-right") {
				if(x1 == x2) {
					if(y1 < y2) {
						var tmp = y1;
						y1 = y2;
						y2 = tmp;
					}
					var pointsInfo = {
						name: "g",
						attrs: {
							"data-type": "text",
							id: windowLineId
						},
						child: [{
							name: "line",
							attrs: {
								x1: x1 - 10,
								y1: y1 - 10,
								x2: x1 - 40,
								y2: y1 - 10,
								stroke: "black",
								"stroke-width": "1"
							}
						}, {
							name: "line",
							attrs: {
								x1: x1 - 30,
								y1: y1 - 10,
								x2: x1 - 30,
								y2: translate[1] + realWidth,
								stroke: "black",
								"stroke-width": "1"
							}
						}, {
							name: "line",
							attrs: {
								x1: translate[0] - 20,
								y1: translate[1] + realWidth,
								x2: translate[0] - 50,
								y2: translate[1] + realWidth,
								stroke: "black",
								"stroke-width": "1"
							}
						}, {
							name: "text",
							attrs: {
								x: x1 - 40,
								y: (y1 + translate[1] + realWidth) / 2,
								fill: "blue",
								"font-size": "8px",
								"writing-mode": "tb",
								class: "text-border"
							}
						}, {
							name: "path",
							attrs: {
								d: "M" + (x1 - 35) + "," + (y1 - 15) + " L" + (x1 - 30) + "," + (y1 - 10) + " L" + (x1 - 25) + "," + (y1 - 15)
							}
						}, {
							name: "path",
							attrs: {
								d: "M" + (x1 - 35) + "," + (translate[1] + realWidth + 5) + " L" + (x1 - 30) + "," + (translate[1] + realWidth) + " L" +
									(x1 - 25) + "," + (translate[1] + realWidth + 5)
							}
						}, {
							name: "line",
							attrs: {
								x1: x1 - 30,
								y1: translate[1],
								x2: x1 - 30,
								y2: translate[1] + realWidth,
								stroke: "black",
								"stroke-width": "1"
							}
						}, {
							name: "line",
							attrs: {
								x1: translate[0] - 20,
								y1: translate[1],
								x2: translate[0] - 50,
								y2: translate[1],
								stroke: "black",
								"stroke-width": "1"
							}
						}, {
							name: "text",
							attrs: {
								x: x1 - 40,
								y: translate[1] + realWidth / 2,
								fill: "blue",
								"font-size": "8px",
								"writing-mode": "tb",
								class: "text-border"
							}
						}, {
							name: "path",
							attrs: {
								d: "M" + (x1 - 35) + "," + (translate[1] + realWidth - 5) + " L" + (x1 - 30) + "," + (translate[1] + realWidth) + " L" +
									(x1 - 25) + "," + (translate[1] + realWidth - 5)
							}
						}, {
							name: "path",
							attrs: {
								d: "M" + (x1 - 35) + "," + (translate[1] + 5) + " L" + (x1 - 30) + "," + (translate[1]) + " L" +
									(x1 - 25) + "," + (translate[1] + 5)
							}
						}, {
							name: "line",
							attrs: {
								x1: x1 - 30,
								y1: translate[1],
								x2: x1 - 30,
								y2: y2 + 10,
								stroke: "black",
								"stroke-width": "1"
							}
						}, {
							name: "line",
							attrs: {
								x1: x1 - 10,
								y1: y2 + 10,
								x2: x1 - 40,
								y2: y2 + 10,
								stroke: "black",
								"stroke-width": "1"
							}
						}, {
							name: "text",
							attrs: {
								x: x1 - 40,
								y: (translate[1] + y2) / 2,
								fill: "blue",
								"font-size": "8px",
								"writing-mode": "tb",
								class: "text-border"
							}
						}, {
							name: "path",
							attrs: {
								d: "M" + (x1 - 35) + "," + (translate[1] - 5) + " L" + (x1 - 30) + "," + (translate[1]) + " L" +
									(x1 - 25) + "," + (translate[1] - 5)
							}
						}, {
							name: "path",
							attrs: {
								d: "M" + (x1 - 35) + "," + (y2 + 15) + " L" + (x1 - 30) + "," + (y2 + 10) + " L" +
									(x1 - 25) + "," + (y2 + 15)
							}
						}],
					};
				} else {
					return;
				}
			} else if(position == "vertical-left") {
				if(x1 == x2) {
					if(y1 < y2) {
						var tmp = y1;
						y1 = y2;
						y2 = tmp;
					}
					var pointsInfo = {
						name: "g",
						attrs: {
							"data-type": "text",
							id: windowLineId
						},
						child: [{
							name: "line",
							attrs: {
								x1: x1 + 10,
								y1: y1 - 10,
								x2: x1 + 40,
								y2: y1 - 10,
								stroke: "black",
								"stroke-width": "1"
							}
						}, {
							name: "line",
							attrs: {
								x1: x1 + 30,
								y1: y1 - 10,
								x2: x1 + 30,
								y2: translate[1] + realWidth,
								stroke: "black",
								"stroke-width": "1"
							}
						}, {
							name: "line",
							attrs: {
								x1: translate[0],
								y1: translate[1] + realWidth,
								x2: translate[0] + 30,
								y2: translate[1] + realWidth,
								stroke: "black",
								"stroke-width": "1"
							}
						}, {
							name: "text",
							attrs: {
								x: x1 + 40,
								y: (y1 + translate[1] + realWidth) / 2,
								fill: "blue",
								"font-size": "8px",
								"writing-mode": "tb",
								class: "text-border"
							}
						}, {
							name: "path",
							attrs: {
								d: "M" + (x1 + 35) + "," + (y1 - 15) + " L" + (x1 + 30) + "," + (y1 - 10) + " L" + (x1 + 25) + "," + (y1 - 15)
							}
						}, {
							name: "path",
							attrs: {
								d: "M" + (x1 + 35) + "," + (translate[1] + realWidth + 5) + " L" + (x1 + 30) + "," + (translate[1] + realWidth) + " L" +
									(x1 + 25) + "," + (translate[1] + realWidth + 5)
							}
						}, {
							name: "line",
							attrs: {
								x1: x1 + 30,
								y1: translate[1],
								x2: x1 + 30,
								y2: translate[1] + realWidth,
								stroke: "black",
								"stroke-width": "1"
							}
						}, {
							name: "line",
							attrs: {
								x1: translate[0],
								y1: translate[1],
								x2: translate[0] + 30,
								y2: translate[1],
								stroke: "black",
								"stroke-width": "1"
							}
						}, {
							name: "text",
							attrs: {
								x: x1 + 40,
								y: translate[1] + realWidth / 2,
								fill: "blue",
								"font-size": "8px",
								"writing-mode": "tb",
								class: "text-border"
							}
						}, {
							name: "path",
							attrs: {
								d: "M" + (x1 + 35) + "," + (translate[1] + realWidth - 5) + " L" + (x1 + 30) + "," + (translate[1] + realWidth) + " L" +
									(x1 + 25) + "," + (translate[1] + realWidth - 5)
							}
						}, {
							name: "path",
							attrs: {
								d: "M" + (x1 + 35) + "," + (translate[1] + 5) + " L" + (x1 + 30) + "," + (translate[1]) + " L" +
									(x1 + 25) + "," + (translate[1] + 5)
							}
						}, {
							name: "line",
							attrs: {
								x1: x1 + 30,
								y1: translate[1],
								x2: x1 + 30,
								y2: y2 + 10,
								stroke: "black",
								"stroke-width": "1"
							}
						}, {
							name: "line",
							attrs: {
								x1: x1 + 10,
								y1: y2 + 10,
								x2: x1 + 40,
								y2: y2 + 10,
								stroke: "black",
								"stroke-width": "1"
							}
						}, {
							name: "text",
							attrs: {
								x: x1 + 40,
								y: (translate[1] + y2) / 2,
								fill: "blue",
								"font-size": "8px",
								"writing-mode": "tb",
								class: "text-border"
							}
						}, {
							name: "path",
							attrs: {
								d: "M" + (x1 + 35) + "," + (translate[1] - 5) + " L" + (x1 + 30) + "," + (translate[1]) + " L" +
									(x1 + 25) + "," + (translate[1] - 5)
							}
						}, {
							name: "path",
							attrs: {
								d: "M" + (x1 + 35) + "," + (y2 + 15) + " L" + (x1 + 30) + "," + (y2 + 10) + " L" +
									(x1 + 25) + "," + (y2 + 15)
							}
						}],
					};
				} else {
					return;
				}
			} else if(position == "horizon-up") {
				if(y1 == y2) {
					if(x1 > x2) {
						var tmp = x1;
						x1 = x2;
						x2 = tmp;
					}
					var pointsInfo = {
						name: "g",
						attrs: {
							"data-type": "text",
							id: windowLineId
						},
						child: [{
							name: "line",
							attrs: {
								x1: x1 + 10,
								y1: y1 + 10,
								x2: x1 + 10,
								y2: y1 + 40,
								stroke: "black",
								"stroke-width": "1"
							}
						}, {
							name: "line",
							attrs: {
								x1: x1 + 10,
								y1: y1 + 30,
								x2: translate[0],
								y2: y1 + 30,
								stroke: "black",
								"stroke-width": "1"
							}
						}, {
							name: "line",
							attrs: {
								x1: translate[0],
								y1: y1 + 10,
								x2: translate[0],
								y2: y1 + 40,
								stroke: "black",
								"stroke-width": "1"
							}
						}, {
							name: "text",
							attrs: {
								x: (x1 + translate[0]) / 2,
								y: y1 + 50,
								fill: "blue",
								"font-size": "8px",
								class: "text-border"
							}
						}, {
							name: "path",
							attrs: {
								d: "M" + (x1 + 15) + "," + (y1 + 35) + " L" + (x1 + 10) + "," + (y1 + 30) + " L" + (x1 + 15) + "," + (y1 + 25)
							}
						}, {
							name: "path",
							attrs: {
								d: "M" + (translate[0] - 5) + "," + (y1 + 35) + " L" + translate[0] + "," + (y1 + 30) + " L" + (translate[0] - 5) + "," + (y1 + 25)
							}
						}, {
							name: "line",
							attrs: {
								x1: translate[0],
								y1: y1 + 30,
								x2: translate[0] + realWidth,
								y2: y1 + 30,
								stroke: "black",
								"stroke-width": "1"
							}
						}, {
							name: "line",
							attrs: {
								x1: translate[0] + realWidth,
								y1: y1 + 10,
								x2: translate[0] + realWidth,
								y2: y1 + 40,
								stroke: "black",
								"stroke-width": "1"
							}
						}, {
							name: "text",
							attrs: {
								x: translate[0] + realWidth / 2,
								y: y1 + 50,
								fill: "blue",
								"font-size": "8px",
								class: "text-border"
							}
						}, {
							name: "path",
							attrs: {
								d: "M" + (translate[0] + 5) + "," + (y1 + 35) + " L" + translate[0] + "," + (y1 + 30) + " L" + (translate[0] + 5) + "," + (y1 + 25)
							}
						}, {
							name: "path",
							attrs: {
								d: "M" + (translate[0] + realWidth - 5) + "," + (y1 + 35) + " L" +
									(translate[0] + realWidth) + "," + (y1 + 30) + " L" + (translate[0] + realWidth - 5) + "," + (y1 + 25)
							}
						}, {
							name: "line",
							attrs: {
								x1: translate[0] + realWidth,
								y1: y1 + 30,
								x2: x2 - 10,
								y2: y1 + 30,
								stroke: "black",
								"stroke-width": "1"
							}
						}, {
							name: "line",
							attrs: {
								x1: x2 - 10,
								y1: y2 + 10,
								x2: x2 - 10,
								y2: y2 + 40,
								stroke: "black",
								"stroke-width": "1"
							}
						}, {
							name: "text",
							attrs: {
								x: (translate[0] + realWidth + x2) / 2,
								y: y1 + 50,
								fill: "blue",
								"font-size": "8px",
								class: "text-border"
							}
						}, {
							name: "path",
							attrs: {
								d: "M" + (translate[0] + realWidth + 5) + "," + (y1 + 35) + " L" + (translate[0] + realWidth) + "," + (y1 + 30) + " L" +
									(translate[0] + realWidth + 5) + "," + (y1 + 25)
							}
						}, {
							name: "path",
							attrs: {
								d: "M" + (x2 - 15) + "," + (y1 + 35) + " L" +
									(x2 - 10) + "," + (y1 + 30) + " L" + (x2 - 15) + "," + (y1 + 25)
							}
						}],
					};
				} else {
					return;
				}
			} else if(position == "horizon-down") {
				if(y1 == y2) {
					if(x1 > x2) {
						var tmp = x1;
						x1 = x2;
						x2 = tmp;
					}
					var pointsInfo = {
						name: "g",
						attrs: {
							"data-type": "text",
							id: windowLineId
						},
						child: [{
							name: "line",
							attrs: {
								x1: x1 + 10,
								y1: y1 - 10,
								x2: x1 + 10,
								y2: y1 - 40,
								stroke: "black",
								"stroke-width": "1"
							}
						}, {
							name: "line",
							attrs: {
								x1: x1 + 10,
								y1: y1 - 30,
								x2: translate[0],
								y2: y1 - 30,
								stroke: "black",
								"stroke-width": "1"
							}
						}, {
							name: "line",
							attrs: {
								x1: translate[0],
								y1: y1 - 10,
								x2: translate[0],
								y2: y1 - 40,
								stroke: "black",
								"stroke-width": "1"
							}
						}, {
							name: "text",
							attrs: {
								x: (x1 + translate[0]) / 2,
								y: y1 - 40,
								fill: "blue",
								"font-size": "8px",
								class: "text-border"
							}
						}, {
							name: "path",
							attrs: {
								d: "M" + (x1 + 15) + "," + (y1 - 35) + " L" + (x1 + 10) + "," + (y1 - 30) + " L" + (x1 + 15) + "," + (y1 - 25)
							}
						}, {
							name: "path",
							attrs: {
								d: "M" + (translate[0] - 5) + "," + (y1 - 35) + " L" + translate[0] + "," + (y1 - 30) + " L" + (translate[0] - 5) + "," + (y1 - 25)
							}
						}, {
							name: "line",
							attrs: {
								x1: translate[0],
								y1: y1 - 30,
								x2: translate[0] + realWidth,
								y2: y1 - 30,
								stroke: "black",
								"stroke-width": "1"
							}
						}, {
							name: "line",
							attrs: {
								x1: translate[0] + realWidth,
								y1: y1 - 10,
								x2: translate[0] + realWidth,
								y2: y1 - 40,
								stroke: "black",
								"stroke-width": "1"
							}
						}, {
							name: "text",
							attrs: {
								x: translate[0] + realWidth / 2,
								y: y1 - 40,
								fill: "blue",
								"font-size": "8px",
								class: "text-border"
							}
						}, {
							name: "path",
							attrs: {
								d: "M" + (translate[0] + 5) + "," + (y1 - 35) + " L" + translate[0] + "," + (y1 - 30) + " L" + (translate[0] + 5) + "," + (y1 - 25)
							}
						}, {
							name: "path",
							attrs: {
								d: "M" + (translate[0] + realWidth - 5) + "," + (y1 - 35) + " L" +
									(translate[0] + realWidth) + "," + (y1 - 30) + " L" + (translate[0] + realWidth - 5) + "," + (y1 - 25)
							}
						}, {
							name: "line",
							attrs: {
								x1: translate[0] + realWidth,
								y1: y1 - 30,
								x2: x2 - 10,
								y2: y1 - 30,
								stroke: "black",
								"stroke-width": "1"
							}
						}, {
							name: "line",
							attrs: {
								x1: x2 - 10,
								y1: y1 - 10,
								x2: x2 - 10,
								y2: y1 - 40,
								stroke: "black",
								"stroke-width": "1"
							}
						}, {
							name: "text",
							attrs: {
								x: (translate[0] + realWidth + x2) / 2,
								y: y1 - 40,
								fill: "blue",
								"font-size": "8px",
								class: "text-border"
							}
						}, {
							name: "path",
							attrs: {
								d: "M" + (translate[0] + realWidth + 5) + "," + (y1 - 35) + " L" + (translate[0] + realWidth) + "," + (y1 - 30) + " L" +
									(translate[0] + realWidth + 5) + "," + (y1 - 25)
							}
						}, {
							name: "path",
							attrs: {
								d: "M" + (x2 - 15) + "," + (y1 - 35) + " L" +
									(x2 - 10) + "," + (y1 - 30) + " L" + (x2 - 15) + "," + (y1 - 25)
							}
						}],
					};
				} else {
					return;
				}
			} else {
				return;
			}
			var element = document.createElementNS('http://www.w3.org/2000/svg', "g");
			for(var k in pointsInfo.attrs) {
				element.setAttribute(k, pointsInfo.attrs[k]);
			}
			for(var j = 0, len2 = pointsInfo.child.length; j < len2; j++) {
				var subElment = resetSVG(pointsInfo.child[j].name, pointsInfo.child[j].attrs);
				if(position == "horizon-down" || position == "horizon-up") {
					if(pointsInfo.child[j].name == "text" && j == 3) {
						subElment.textContent = (Math.abs(translate[0] - x1) / 100 - 0.1).toFixed(2);
					}
					if(pointsInfo.child[j].name == "text" && j == 8) {
						subElment.textContent = (realWidth / 100).toFixed(2);
					}
					if(pointsInfo.child[j].name == "text" && j == 13) {
						subElment.textContent = (Math.abs(x2 - (translate[0] + realWidth)) / 100 - 0.1).toFixed(2);
					}
				} else {
					if(pointsInfo.child[j].name == "text" && j == 3) {
						subElment.textContent = (Math.abs(translate[1] + realWidth - y1) / 100 - 0.1).toFixed(2);
					}
					if(pointsInfo.child[j].name == "text" && j == 8) {
						subElment.textContent = (realWidth / 100).toFixed(2);
					}
					if(pointsInfo.child[j].name == "text" && j == 13) {
						subElment.textContent = (Math.abs(translate[1] + y2) / 100 - 0.1).toFixed(2);
					}
				}

				element.appendChild(subElment);
			}
			this.roomDom.appendChild(element);
		},
		/**
		 * 重置墙壁上的门窗的长度信息
		 * @param  {[type]} data [长度相关数据]
		 */
		resetDoorInfoLine: function(data) {
			var childNodes = data.childNodes;
			var translate = data.translate;
			var realWidth = data.realWidth;
			var realHeight = data.realHeight;
			var x1 = data.x1;
			var y1 = data.y1;
			var x2 = data.x2;
			var y2 = data.y2;
			var position = data.position;
			if(position == "vertical-left") {
				if(x1 == x2) {
					if(y1 < y2) {
						var tmp = y1;
						y1 = y2;
						y2 = tmp;
					}
					childNodes[1].setAttribute("y2", translate[1] + realWidth);

					childNodes[2].setAttribute("y1", translate[1] + realWidth);
					childNodes[2].setAttribute("y2", translate[1] + realWidth);

					childNodes[3].setAttribute("y", (y1 + translate[1] + realWidth) / 2);
					childNodes[3].textContent = (Math.abs(translate[1] + realWidth - y1) / 100 - 0.1).toFixed(2);

					childNodes[4].setAttribute("d", "M" + (x1 + 35) + "," + (y1 - 15) + " L" + (x1 + 30) + "," +
						(y1 - 10) + " L" + (x1 + 25) + "," + (y1 - 15));

					childNodes[5].setAttribute("d", "M" + (x1 + 35) + "," + (translate[1] + realWidth + 5) + " L" +
						(x1 + 30) + "," + (translate[1] + realWidth) + " L" +
						(x1 + 25) + "," + (translate[1] + realWidth + 5));

					childNodes[6].setAttribute("y1", translate[1]);
					childNodes[6].setAttribute("y2", translate[1] + realWidth);

					childNodes[7].setAttribute("y1", translate[1]);
					childNodes[7].setAttribute("y2", translate[1]);

					childNodes[8].setAttribute("y", translate[1] + realWidth / 2);
					childNodes[8].textContent = (realWidth / 100).toFixed(2);

					childNodes[9].setAttribute("d", "M" + (x1 + 35) + "," + (translate[1] + realWidth - 5) + " L" +
						(x1 + 30) + "," + (translate[1] + realWidth) + " L" +
						(x1 + 25) + "," + (translate[1] + realWidth - 5));

					childNodes[10].setAttribute("d", "M" + (x1 + 35) + "," + (translate[1] + 5) + " L" +
						(x1 + 30) + "," + (translate[1]) + " L" +
						(x1 + 25) + "," + (translate[1] + 5));

					childNodes[11].setAttribute("y1", translate[1]);

					childNodes[13].setAttribute("y", (translate[1] + parseInt(y2)) / 2);
					childNodes[13].textContent = (Math.abs(translate[1] + y2) / 100 - 0.1).toFixed(2);

					childNodes[14].setAttribute("d", "M" + (x1 + 35) + "," + (translate[1] - 5) + " L" +
						(x1 + 30) + "," + (translate[1]) + " L" +
						(x1 + 25) + "," + (translate[1] - 5));

					childNodes[15].setAttribute("d", "M" + (x1 + 35) + "," + (y2 + 15) + " L" + (x1 + 30) + "," + (y2 + 10) + " L" +
						(x1 + 25) + "," + (y2 + 15));
				} else {
					return;
				}
			} else if(position == "vertical-right") {
				if(x1 == x2) {
					if(y1 < y2) {
						var tmp = y1;
						y1 = y2;
						y2 = tmp;
					}
					childNodes[1].setAttribute("y2", translate[1] + realWidth);

					childNodes[2].setAttribute("y1", translate[1] + realWidth);
					childNodes[2].setAttribute("y2", translate[1] + realWidth);

					childNodes[3].setAttribute("y", (y1 + translate[1] + realWidth) / 2);
					childNodes[3].textContent = (Math.abs(translate[1] + realWidth - y1) / 100 - 0.1).toFixed(2);

					childNodes[4].setAttribute("d", "M" + (x1 - 35) + "," + (y1 - 15) + " L" + (x1 - 30) + "," +
						(y1 - 10) + " L" + (x1 - 25) + "," + (y1 - 15));

					childNodes[5].setAttribute("d", "M" + (x1 - 35) + "," + (translate[1] + realWidth + 5) + " L" +
						(x1 - 30) + "," + (translate[1] + realWidth) + " L" +
						(x1 - 25) + "," + (translate[1] + realWidth + 5));

					childNodes[6].setAttribute("y1", translate[1]);
					childNodes[6].setAttribute("y2", translate[1] + realWidth);

					childNodes[7].setAttribute("y1", translate[1]);
					childNodes[7].setAttribute("y2", translate[1]);

					childNodes[8].setAttribute("y", translate[1] + realWidth / 2);
					childNodes[8].textContent = (realWidth / 100).toFixed(2);

					childNodes[9].setAttribute("d", "M" + (x1 - 35) + "," + (translate[1] + realWidth - 5) + " L" +
						(x1 - 30) + "," + (translate[1] + realWidth) + " L" +
						(x1 - 25) + "," + (translate[1] + realWidth - 5));

					childNodes[10].setAttribute("d", "M" + (x1 - 35) + "," + (translate[1] + 5) + " L" +
						(x1 - 30) + "," + (translate[1]) + " L" +
						(x1 - 25) + "," + (translate[1] + 5));

					childNodes[11].setAttribute("y1", translate[1]);

					childNodes[13].setAttribute("y", (translate[1] + parseInt(y2)) / 2);
					childNodes[13].textContent = (Math.abs(translate[1] + y2) / 100 - 0.1).toFixed(2);

					childNodes[14].setAttribute("d", "M" + (x1 - 35) + "," + (translate[1] - 5) + " L" +
						(x1 - 30) + "," + (translate[1]) + " L" +
						(x1 - 25) + "," + (translate[1] - 5));

					childNodes[15].setAttribute("d", "M" + (x1 - 35) + "," + (y2 + 15) + " L" + (x1 - 30) + "," + (y2 + 10) + " L" +
						(x1 - 25) + "," + (y2 + 15));
				} else {
					return;
				}
			} else if(position == "horizon-up") {
				if(y1 == y2) {
					if(x1 > x2) {
						var tmp = x1;
						x1 = x2;
						x2 = tmp;
					}
					childNodes[1].setAttribute("x2", translate[0]);

					childNodes[2].setAttribute("x1", translate[0]);
					childNodes[2].setAttribute("x2", translate[0]);

					childNodes[3].setAttribute("x", (x1 + translate[0]) / 2);
					childNodes[3].textContent = (Math.abs(translate[0] - x1) / 100 - 0.1).toFixed(2);

					childNodes[4].setAttribute("d", "M" + (x1 + 15) + "," + (y1 + 35) + " L" + (x1 + 10) + "," +
						(y1 + 30) + " L" + (x1 + 15) + "," + (y1 + 25));

					childNodes[5].setAttribute("d", "M" + (translate[0] - 5) + "," + (y1 + 35) + " L" +
						translate[0] + "," + (y1 + 30) + " L" +
						(translate[0] - 5) + "," + (y1 + 25));

					childNodes[6].setAttribute("x1", translate[0]);

					childNodes[6].setAttribute("x2", translate[0] + realWidth);

					childNodes[7].setAttribute("x1", translate[0] + realWidth);
					childNodes[7].setAttribute("x2", translate[0] + realWidth);

					childNodes[8].setAttribute("x", translate[0] + realWidth / 2);
					childNodes[8].textContent = (realWidth / 100).toFixed(2);

					childNodes[9].setAttribute("d", "M" + (translate[0] + 5) + "," + (y1 + 35) + " L" +
						translate[0] + "," + (y1 + 30) + " L" +
						(translate[0] + 5) + "," + (y1 + 25));

					childNodes[10].setAttribute("d", "M" + (translate[0] + realWidth - 5) + "," + (y1 + 35) + " L" +
						(translate[0] + realWidth) + "," + (y1 + 30) + " L" + (translate[0] + realWidth - 5) + "," + (y1 + 25));

					childNodes[11].setAttribute("x1", translate[0] + realWidth);

					childNodes[13].setAttribute("x", (translate[0] + realWidth + x2) / 2);
					childNodes[13].textContent = (Math.abs(x2 - (translate[0] + realWidth)) / 100 - 0.1).toFixed(2);

					childNodes[14].setAttribute("d", "M" + (translate[0] + realWidth + 5) + "," + (y1 + 35) + " L" +
						(translate[0] + realWidth) + "," + (y1 + 30) + " L" +
						(translate[0] + realWidth + 5) + "," + (y1 + 25));

					childNodes[15].setAttribute("d", "M" + (x2 - 15) + "," + (y1 + 35) + " L" +
						(x2 - 10) + "," + (y1 + 30) + " L" + (x2 - 15) + "," + (y1 + 25));
				}
			} else if(position == "horizon-down") {
				if(y1 == y2) {
					if(x1 > x2) {
						var tmp = x1;
						x1 = x2;
						x2 = tmp;
					}
					childNodes[1].setAttribute("x2", translate[0]);

					childNodes[2].setAttribute("x1", translate[0]);
					childNodes[2].setAttribute("x2", translate[0]);

					childNodes[3].setAttribute("x", (x1 + translate[0]) / 2);
					childNodes[3].textContent = (Math.abs(translate[0] - x1) / 100 - 0.1).toFixed(2);

					childNodes[4].setAttribute("d", "M" + (x1 + 15) + "," + (y1 - 35) + " L" +
						(x1 + 10) + "," + (y1 - 30) + " L" + (x1 + 15) + "," + (y1 - 25));

					childNodes[5].setAttribute("d", "M" + (translate[0] - 5) + "," + (y1 - 35) + " L" +
						translate[0] + "," + (y1 - 30) + " L" +
						(translate[0] - 5) + "," + (y1 - 25));

					childNodes[6].setAttribute("x1", translate[0]);

					childNodes[6].setAttribute("x2", translate[0] + realWidth);

					childNodes[7].setAttribute("x1", translate[0] + realWidth);
					childNodes[7].setAttribute("x2", translate[0] + realWidth);

					childNodes[8].setAttribute("x", translate[0] + realWidth / 2);
					childNodes[8].textContent = (realWidth / 100).toFixed(2);

					childNodes[9].setAttribute("d", "M" + (translate[0] + 5) + "," + (y1 - 35) + " L" +
						translate[0] + "," + (y1 - 30) + " L" +
						(translate[0] + 5) + "," + (y1 - 25));

					childNodes[10].setAttribute("d", "M" + (translate[0] + realWidth - 5) + "," + (y1 - 35) + " L" +
						(translate[0] + realWidth) + "," + (y1 - 30) + " L" + (translate[0] + realWidth - 5) + "," + (y1 - 25));

					childNodes[11].setAttribute("x1", translate[0] + realWidth);

					childNodes[13].setAttribute("x", (translate[0] + realWidth + x2) / 2);
					childNodes[13].textContent = (Math.abs(x2 - (translate[0] + realWidth)) / 100 - 0.1).toFixed(2);

					childNodes[14].setAttribute("d", "M" + (translate[0] + realWidth + 5) + "," + (y1 - 35) + " L" +
						(translate[0] + realWidth) + "," + (y1 - 30) + " L" +
						(translate[0] + realWidth + 5) + "," + (y1 - 25));

					childNodes[15].setAttribute("d", "M" + (x2 - 15) + "," + (y1 - 35) + " L" +
						(x2 - 10) + "," + (y1 - 30) + " L" + (x2 - 15) + "," + (y1 - 25));
				}
			}
		},
		/**
		 * 根据位置初始化绘制item距离墙壁的距离，只针对标准墙壁生效
		 * @param  {[type]} dom [room的dom]
		 */
		createItemInfoLine: function(dom) {
			var element = document.createElementNS('http://www.w3.org/2000/svg', "g");
			element.setAttribute("data-type", "itemText");
			element.setAttribute("itemId", this.id);

			var subElement = this.createPositionLine("top");
			element.appendChild(subElement);

			subElement = this.createPositionLine("left");
			element.appendChild(subElement);

			subElement = this.createPositionLine("right");
			element.appendChild(subElement);

			subElement = this.createPositionLine("bottom");
			element.appendChild(subElement);

			dom.appendChild(element);
		},
		/**
		 * 根据position初始化绘制item距离数据
		 * @param  {[type]} position [数据显示的位置]
		 */
		createPositionLine: function(position) {
			var subElement = document.createElementNS('http://www.w3.org/2000/svg', "g");
			subElement.setAttribute("position", position);
			var child = [{
				name: "polyline",
				attrs: {
					id: getUid("itemPostion"),
					points: "0,0 0,0",
					stroke: "black",
					"stroke-width": "0.5"
				}
			}, {
				name: "text",
				attrs: {
					id: getUid("itemPostion"),
					x: 0,
					y: 0,
					fill: "blue",
					"font-size": 0,
					"class": "text-border"
				}
			}];
			for(var i = 0, len = child.length; i < len; i++) {
				var lineElement = resetSVG(child[i].name, child[i].attrs);
				subElement.appendChild(lineElement);
			}
			return subElement;
		},
		/**
		 * 实时计算显示item距离墙壁的数据
		 * @param  {[type]} position   [数据显示的位置]
		 * @param  {[type]} length     [长度]
		 * @param  {[type]} translate  [位置改变的值]
		 * @param  {[type]} realWidth  [实际宽度]
		 * @param  {[type]} realHeight [实际高度]
		 */
		showInfoLine: function(position, length, translate, realWidth, realHeight) {
			var linePoints = [];
			linePoints[0] = {};
			linePoints[1] = {};
			var child = this.roomDom.childNodes;
			var index = child.length - 1; //选中包含item距离墙壁的数据的dom，所有的item共用
			if(child[index].getAttribute("data-type") == "itemText") {
				var childPos = child[index].childNodes;
				for(var j = 0, len = childPos.length; j < len; j++) {
					if(position == "top" && position == childPos[j].getAttribute("position")) {
						linePoints[0].x = parseInt(realWidth / 2 + translate[0]);
						linePoints[0].y = parseInt(length) + 7;
						linePoints[1].x = parseInt(realWidth / 2 + translate[0]);
						linePoints[1].y = parseInt(translate[1]);
						var lineChild = childPos[j].childNodes;

						if(linePoints[1].y - linePoints[0].y < 30) {
							lineChild[0].setAttribute("points", "0,0 0,0");
							lineChild[1].setAttribute("font-size", "0em");
						} else {
							lineChild[0].setAttribute("points", linePoints[0].x + "," + linePoints[0].y + " " +
								linePoints[1].x + "," + (linePoints[1].y - 7));
							lineChild[1].setAttribute("x", parseInt(linePoints[0].x) + 7);
							lineChild[1].setAttribute("y", parseInt((parseInt(linePoints[1].y) +
								parseInt(linePoints[0].y)) / 2) + 7);
							lineChild[1].textContent = ((linePoints[1].y - linePoints[0].y) / 100).toFixed(2);
							lineChild[1].setAttribute("font-size", "0.5em");
							lineChild[1].setAttribute("fill-opacity", "1");
						}

					} else if(position == "left" && position == childPos[j].getAttribute("position")) {
						linePoints[0].x = parseInt(length) + 7;
						linePoints[0].y = parseInt(realHeight / 2 + translate[1]);
						linePoints[1].x = parseInt(translate[0]);
						linePoints[1].y = parseInt(realHeight / 2 + translate[1]);
						var lineChild = childPos[j].childNodes;
						if(linePoints[1].x - linePoints[0].x < 30) {
							lineChild[0].setAttribute("points", "0,0 0,0");
							lineChild[1].setAttribute("font-size", "0em");
						} else {
							lineChild[0].setAttribute("points", linePoints[0].x + "," + linePoints[0].y +
								" " + (linePoints[1].x - 7) + "," + linePoints[1].y);
							lineChild[1].setAttribute("x", (parseInt((parseInt(linePoints[1].x) +
								parseInt(linePoints[0].x)) / 2)));
							lineChild[1].setAttribute("y", (linePoints[1].y - 7));
							lineChild[1].textContent = ((linePoints[1].x - linePoints[0].x) / 100).toFixed(2);
							lineChild[1].setAttribute("font-size", "0.5em");
							lineChild[1].setAttribute("fill-opacity", "1");
						}
					} else if(position == "right" && position == childPos[j].getAttribute("position")) {
						linePoints[0].x = parseInt(realWidth) + parseInt(translate[0]);
						linePoints[0].y = parseInt(realHeight / 2 + translate[1]);
						linePoints[1].x = parseInt(length) - 7;
						linePoints[1].y = parseInt(realHeight / 2 + translate[1]);
						var lineChild = childPos[j].childNodes;
						if(linePoints[1].x - linePoints[0].x < 30) {
							lineChild[0].setAttribute("points", "0,0 0,0");
							lineChild[1].setAttribute("font-size", "0em");
						} else {
							lineChild[0].setAttribute("points", (linePoints[0].x + 7) + "," + linePoints[0].y +
								" " + linePoints[1].x + "," + linePoints[1].y);
							lineChild[1].setAttribute("x", (parseInt((parseInt(linePoints[1].x) +
								parseInt(linePoints[0].x)) / 2)));
							lineChild[1].setAttribute("y", (linePoints[1].y - 7));
							lineChild[1].textContent = ((linePoints[1].x - linePoints[0].x) / 100).toFixed(2);
							lineChild[1].setAttribute("font-size", "0.5em");
							lineChild[1].setAttribute("fill-opacity", "1");
						}
					} else if(position == "bottom" && position == childPos[j].getAttribute("position")) {
						linePoints[0].x = parseInt(realWidth / 2 + translate[0]);
						linePoints[0].y = parseInt(realHeight) + parseInt(translate[1]);
						linePoints[1].x = parseInt(realWidth / 2 + translate[0]);
						linePoints[1].y = parseInt(length) - 7;
						var lineChild = childPos[j].childNodes;

						if(linePoints[1].y - linePoints[0].y < 30) {
							lineChild[0].setAttribute("points", "0,0 0,0");
							lineChild[1].setAttribute("font-size", "0em");
						} else {
							lineChild[0].setAttribute("points", linePoints[0].x + "," + (linePoints[0].y + 7) +
								" " + linePoints[1].x + "," + linePoints[1].y);
							lineChild[1].setAttribute("x", parseInt(linePoints[0].x) + 7);
							lineChild[1].setAttribute("y", parseInt((parseInt(linePoints[1].y) +
								parseInt(linePoints[0].y)) / 2) + 7);
							lineChild[1].textContent = ((linePoints[1].y - linePoints[0].y) / 100).toFixed(2);
							lineChild[1].setAttribute("font-size", "0.5em");
							lineChild[1].setAttribute("fill-opacity", "1");
						}
					}
				}

			}
		},
		/**
		 * 删除item距离墙壁的数据的dom
		 * @param  {[type]} dom [room的dom]
		 */
		deleteItemInfoLine: function(dom) {
			var child = dom.childNodes;
			for(var i = child.length - 1; i > 0; i--) {
				if(child[i].getAttribute("data-type") == "itemText") {
					dom.removeChild(child[i]);
				}
			}
		},
		/**
		 * 删除门窗的长度数据的dom
		 * @param  {[type]} windowLineId [门窗长度数据的id]
		 */
		deleteDoorInfoLine: function(windowLineId) {
			if(this.roomDom.childNodes[this.roomDom.childNodes.length - 1].id ==
				windowLineId) {
				this.roomDom.removeChild(document.getElementById(windowLineId));
			}
		},
		/**
		 * 绘制房间墙壁的外围长度数据，其position属性可作为墙壁位置的判断标准
		 * @param  {[type]} child     [description]
		 * @param  {[type]} lineCount [description]
		 * @return {[type]}           [description]
		 */
		drawInfoLine: function(child, lineCount) {
			var sizeTextList = []; //记录所有的寸尺标记数据

			/* 绘制前先删除房间内item的尺寸标记数据，防止打乱顺序，造成其他问题，在绘制完成后再重新添加，
			 * 保证尺寸标记的数据永远在墙壁长度数据的后面
			 */
			for(var i = child.length - 1; i >= 0; i--) {
				if(child[i].tagName == "g" && child[i].getAttribute("data-type") == "text") {
					this.roomDom.removeChild(child[i]);
				} else if(child[i].tagName == "g" &&
					child[i].getAttribute("data-type") == "size-text") {
					sizeTextList.push(child[i]);
					this.roomDom.removeChild(child[i]);
				}
			}

			var points = covertPolygon(child[0].getAttribute("points"));
			//var child = virtualData.child;
			for(var i = 0, len = child.length; i < len; i++) {
				if(child[i].tagName == "line") {
					var x1 = parseInt(child[i].getAttribute("x1")),
						y1 = parseInt(child[i].getAttribute("y1")),
						x2 = parseInt(child[i].getAttribute("x2")),
						y2 = parseInt(child[i].getAttribute("y2"));
					var childLineId = child[i].id;
					var line1X2, line1Y2, line2X1, line2Y1, line2X2, line2Y2,
						line3X1, line3Y1, line3X2, line3Y2, line4X, line4Y;
					var textX = (x1 + x2) / 2;
					var textY = (y1 + y2) / 2;
					var edgeLength = (Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) / 100).toFixed(2);
					/* 调整手动输入时0.01的误差 */
					if(Math.abs(Math.ceil(edgeLength) - edgeLength <= 0.01)) {
						edgeLength = Math.ceil(edgeLength).toFixed(2);
					}
					var textId = getUid("lineInfo");
					var position = "";
					var textStyle = "";
					var arrowPath1 = "";
					var arrowPath2 = "";
					/* 如果是水平方向的墙壁 */
					if(Math.abs(y2 - y1) / Math.abs(x2 - x1) <= 1) {
						textY += 50;
						textStyle = "lr";
						line1X1 = x1;
						line1X2 = x1;
						line3X1 = x2;
						line3X2 = x2;
						line2X1 = x1;
						line2X2 = x2;
						/* 利用射线算法计算相对于房间，墙壁数据应该显示的数据 */
						if(isInPolygon(textX, textY, points)) {
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
						if(x1 >= x2) {
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
						if(isInPolygon(textX, textY, points)) {
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
						if(y1 >= y2) {
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
					var pointsInfo = {
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
								fill: child[i].getAttribute("lock") == "true" ? "red" : "blue",
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

					var element = document.createElementNS('http://www.w3.org/2000/svg', "g");
					for(var k in pointsInfo.attrs) {
						element.setAttribute(k, pointsInfo.attrs[k]);
					}
					for(var j = 0, len2 = pointsInfo.child.length; j < len2; j++) {
						var subElment = resetSVG(pointsInfo.child[j].name, pointsInfo.child[j].attrs);
						if(pointsInfo.child[j].name == "text") {
							subElment.textContent = edgeLength;
						}
						element.appendChild(subElment);
					}
					this.roomDom.appendChild(element);
				}
			}

			/* 重新添加尺寸标记数据 */
			for(var i = 0, len = sizeTextList.length; i < len; i++) {
				this.roomDom.appendChild(sizeTextList[i]);
			}
		},
		/**
		 * 绘制item之间尺寸标记数据
		 * @param  {[type]} markData [尺寸标记的数据对象]
		 */
		drawMarkLine: function(markData) {
			var type = this.markType;
			var itemId = markData.itemId;
			var targetId = markData.targetId;
			var item = document.getElementById(itemId);
			var target = document.getElementById(targetId);
			var width = parseInt(item.getAttribute("width"));
			var height = parseInt(item.getAttribute("height"));
			var tWidth = parseInt(target.getAttribute("width"));
			var tHeight = parseInt(target.getAttribute("height"));
			var transform = this.mainFrame.getTransform(item.getAttribute("transform"));
			var tTransform = this.mainFrame.getTransform(target.getAttribute("transform"));
			var scale = transform.scale;
			var tScale = tTransform.scale;
			var midX = parseInt(transform.rotateX * scale);
			var midY = parseInt(transform.rotateY * scale);

			var midTX = parseInt(tTransform.rotateX * tScale);
			var midTY = parseInt(tTransform.rotateY * tScale);

			var cx1 = markData.cx1;
			var cy1 = markData.cy1;
			var tCx1 = markData.tCx1;
			var tCy1 = markData.tCy1;

			/* 考虑放缩后的真实值 */
			if(cx1 != 0 && cy1 == 0) {
				cx1 = parseInt(width * scale);
			} else if(cx1 != 0 && cy1 != 0) {
				cx1 = parseInt(width * scale);
				cy1 = parseInt(height * scale);
			} else if(cx1 == 0 && cy1 != 0) {
				cy1 = parseInt(height * scale);
			}

			if(tCx1 != 0 && tCy1 == 0) {
				tCx1 = parseInt(tWidth * tScale);
			} else if(tCx1 != 0 && tCy1 != 0) {
				tCx1 = parseInt(tWidth * tScale);
				tCy1 = parseInt(tHeight * tScale);
			} else if(tCx1 == 0 && tCy1 != 0) {
				tCy1 = parseInt(tHeight * tScale);
			}

			/* 计算旋转后真实的位置，下面两个公式是比较重要的公式，可以计算出旋转角度后某一点的新的坐标值，多处要使用
			 * nx = (x + (x1 - x) * cos(a) - (y1 - y) * sin(c));
			 * ny = (y + (x1 - x) * sin(a) - (y1 - y) * cos(c));
			 * 其中 x,y 是旋转中心， x1,y1 是原坐标值， c是旋转的角度，弧度制表示
			 */
			var angle = transform.angle / 180 * Math.PI;
			var nX = parseInt(midX + (cx1 - midX) * Math.cos(angle) - (cy1 - midY) * Math.sin(angle));
			var nY = parseInt(midY + (cx1 - midX) * Math.sin(angle) + (cy1 - midY) * Math.cos(angle));

			var tAngle = tTransform.angle / 180 * Math.PI;
			var tNX = parseInt(midTX + (tCx1 - midTX) * Math.cos(tAngle) - (tCy1 - midTY) * Math.sin(tAngle));
			var tNY = parseInt(midTY + (tCx1 - midTX) * Math.sin(tAngle) + (tCy1 - midTY) * Math.cos(tAngle));
			var x1 = nX + transform.translateX;
			var y1 = nY + transform.translateY;
			var x2 = tNX + tTransform.translateX;
			var y2 = tNY + tTransform.translateY;
			var tX2 = x2;
			var tY2 = y2;
			if(type == "horizon") {
				y2 = y1;
			} else if(type == "vertical") {
				x2 = x1;
			}
			var length = parseFloat(Math.sqrt((y1 - y2) * (y1 - y2) + (x1 - x2) * (x1 - x2)) / 100).toFixed(2);
			var arrowPath1 = '';
			var arrowPath2 = '';
			if(Math.abs(y2 - y1) / Math.abs(x2 - x1) <= 1) {
				if(x1 >= x2) {
					arrowPath1 = "M" + (x1 - 2) + "," + (y1 - 2) + " L" + x1 + "," + y1 + " L" +
						(x1 - 2) + "," + (y1 + 2);
					arrowPath2 = "M" + (x2 + 2) + "," + (y2 - 2) + " L" + x2 + "," + y2 + " L" +
						(x2 + 2) + "," + (y2 + 2);
				} else {
					arrowPath1 = "M" + (x1 + 2) + "," + (y1 - 2) + " L" + x1 + "," + y1 + " L" +
						(x1 + 2) + "," + (y1 + 2);
					arrowPath2 = "M" + (x2 - 2) + "," + (y2 - 2) + " L" + x2 + "," + y2 + " L" +
						(x2 - 2) + "," + (y2 + 2);
				}
			} else {
				if(y1 >= y2) {
					arrowPath1 = "M" + (x1 - 2) + "," + (y1 - 2) + " L" + x1 + "," + y1 + " L" +
						(x1 + 2) + "," + (y1 - 2);
					arrowPath2 = "M" + (x2 - 2) + "," + (y2 + 2) + " L" + x2 + "," + y2 + " L" +
						(x2 + 2) + "," + (y2 + 2);
				} else {
					arrowPath1 = "M" + (x1 - 2) + "," + (y1 + 2) + " L" + x1 + "," + y1 + " L" +
						(x1 + 2) + "," + (y1 + 2);
					arrowPath2 = "M" + (x2 - 2) + "," + (y2 - 2) + " L" + x2 + "," + y2 + " L" +
						(x2 + 2) + "," + (y2 - 2);
				}
			}
			var data = {
				name: "g",
				attrs: {
					"data-type": "size-text",
					"data-from": itemId,
					"data-target": targetId,
					"type": type
				},
				child: [{
					name: "line",
					attrs: {
						x1: x1,
						y1: y1,
						x2: x2,
						y2: y2,
						stroke: "black",
						"stroke-width": "0.5"
					}
				}, {
					name: "text",
					attrs: {
						x: (x1 + x2) / 2,
						y: (y1 + y2) / 2,
						fill: "blue",
						"font-size": "8px",
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
					name: "line",
					attrs: {
						x1: x2,
						y1: y2,
						x2: tX2,
						y2: tY2,
						stroke: "black",
						"stroke-width": "0.5"
					}
				}],
			}
			var border = resetSVG(data.name, data.attrs);
			for(var i = 0, len = data.child.length; i < len; i++) {
				var subElement = resetSVG(data.child[i].name, data.child[i].attrs);
				if(data.child[i].name == "text") {
					subElement.textContent = length;
				}
				border.appendChild(subElement);
			}
			this.roomDom.appendChild(border);
		},
		/**
		 * 绘制item与墙壁尺寸标记数据，与drawMarkLine有重复，可合并
		 * @param  {[type]} wall [墙壁的dom]
		 * @param  {[type]} markData [尺寸标记的数据对象]
		 */
		drawMarkLineByWall: function(wall, circleData) {
			var item = circleData.item;
			var x1 = parseInt(wall.getAttribute("x1"));
			var y1 = parseInt(wall.getAttribute("y1"));
			var x2 = parseInt(wall.getAttribute("x2"));
			var y2 = parseInt(wall.getAttribute("y2"));
			var isVertical = wall.getAttribute("isVertical");
			var cx = circleData.cx;
			var cy = circleData.cy;
			var transform = this.mainFrame.getTransform(circleData.transform);
			var width = circleData.width;
			var height = circleData.height;
			var scale = transform.scale;
			var midX = parseInt(transform.rotateX * scale);
			var midY = parseInt(transform.rotateY * scale);
			var x3 = 0,
				y3 = 0;
			//考虑放缩后的真实值
			if(cx != 0 && cy == 0) {
				cx = parseInt(width * scale);
			} else if(cx != 0 && cy != 0) {
				cx = parseInt(width * scale);
				cy = parseInt(height * scale);
			} else if(cx == 0 && cy != 0) {
				cy = parseInt(height * scale);
			}
			var angle = transform.angle / 180 * Math.PI;
			var nX = parseInt(midX + (cx - midX) * Math.cos(angle) - (cy - midY) * Math.sin(angle));
			var nY = parseInt(midY + (cx - midX) * Math.sin(angle) + (cy - midY) * Math.cos(angle));

			cx = nX + transform.translateX;
			cy = nY + transform.translateY;
			if(isVertical == "vertical" && (y2 - y1 != 0)) {
				x3 = parseInt((cy - y1) / (y2 - y1) * (x2 - x1) + x1);
				y3 = cy;
				x3 > cx ? x3 -= 7 : x3 += 7;
			} else if(isVertical == "horizon" && (x2 - x1 != 0)) {
				x3 = cx;
				y3 = parseInt((cx - x1) / (x2 - x1) * (y2 - y1) + y1);
				y3 > cy ? y3 -= 7 : y3 += 7;
			}
			var length = parseFloat(Math.sqrt((cy - y3) * (cy - y3) + (cx - x3) * (cx - x3)) / 100).toFixed(2);
			var arrowPath1 = '';
			var arrowPath2 = '';
			if(Math.abs(y3 - cy) / Math.abs(x3 - cx) <= 1) {
				if(cx >= x3) {
					arrowPath1 = "M" + (cx - 2) + "," + (cy - 2) + " L" + cx + "," + cy + " L" +
						(cx - 2) + "," + (cy + 2);
					arrowPath2 = "M" + (x3 + 2) + "," + (y3 - 2) + " L" + x3 + "," + y3 + " L" +
						(x3 + 2) + "," + (y3 + 2);
				} else {
					arrowPath1 = "M" + (cx + 2) + "," + (cy - 2) + " L" + cx + "," + cy + " L" +
						(cx + 2) + "," + (cy + 2);
					arrowPath2 = "M" + (x3 - 2) + "," + (y3 - 2) + " L" + x3 + "," + y3 + " L" +
						(x3 - 2) + "," + (y3 + 2);
				}
			} else {
				if(cy >= y3) {
					arrowPath1 = "M" + (cx - 2) + "," + (cy - 2) + " L" + cx + "," + cy + " L" +
						(cx + 2) + "," + (cy - 2);
					arrowPath2 = "M" + (x3 - 2) + "," + (y3 + 2) + " L" + x3 + "," + y3 + " L" +
						(x3 + 2) + "," + (y3 + 2);
				} else {
					arrowPath1 = "M" + (cx - 2) + "," + (cy + 2) + " L" + cx + "," + cy + " L" +
						(cx + 2) + "," + (cy + 2);
					arrowPath2 = "M" + (x3 - 2) + "," + (y3 - 2) + " L" + x3 + "," + y3 + " L" +
						(x3 + 2) + "," + (y3 - 2);
				}
			}
			var data = {
				name: "g",
				attrs: {
					"data-type": "size-text",
					"data-from": circleData.itemId,
					"data-target": wall.id,
					"data-wall": "true"
				},
				child: [{
					name: "line",
					attrs: {
						x1: cx,
						y1: cy,
						x2: x3,
						y2: y3,
						stroke: "black",
						"stroke-width": "0.5"
					}
				}, {
					name: "text",
					attrs: {
						x: (cx + x3) / 2,
						y: (cy + y3) / 2,
						fill: "blue",
						"font-size": "8px",
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
				}],
			}
			var border = resetSVG(data.name, data.attrs);
			for(var i = 0, len = data.child.length; i < len; i++) {
				var subElement = resetSVG(data.child[i].name, data.child[i].attrs);
				if(data.child[i].name == "text") {
					subElement.textContent = length;
				}
				border.appendChild(subElement);
			}
			this.roomDom.appendChild(border);

			itemChild = item.childNodes;
			itemChild[itemChild.length - 3].style.display = "none";
			this.mainFrame.isShowSize = false;
			this.deleteMark(circleData.itemId, false);
		},
		/**
		 * 重置尺寸标记数据
		 * @param  {[type]} markList [所有的需要改变的对象]
		 * @param  {[type]} deltaX   [x的改变值]
		 * @param  {[type]} deltaY   [y的改变值]
		 */
		resetMarkLine: function(markList, deltaX, deltaY) {
			var line, dom, child, x1, y1, x2, y2, tX2, tY2, type, midX, midY, length, arrowPath1, arrowPath2;
			for(var i in markList) {
				line = markList[i];
				dom = line.dom;
				type = dom.getAttribute("type");
				child = line.child;
				if(line.direct == "from") {
					x1 = line.x1 + deltaX;
					y1 = line.y1 + deltaY;
					x2 = line.x2;
					y2 = line.y2;
				} else {
					x1 = line.x1;
					y1 = line.y1;
					x2 = line.x2 + deltaX;
					y2 = line.y2 + deltaY;
				}

				tX2 = x2;
				tY2 = y2;
				if(type == "horizon") {
					y2 = y1;
				} else if(type == "vertical") {
					x2 = x1;
				}

				length = parseFloat(Math.sqrt((y1 - y2) * (y1 - y2) + (x1 - x2) * (x1 - x2)) / 100).toFixed(2);
				arrowPath1 = '';
				arrowPath2 = '';
				if(Math.abs(y2 - y1) / Math.abs(x2 - x1) <= 1) {
					if(x1 >= x2) {
						arrowPath1 = "M" + (x1 - 2) + "," + (y1 - 2) + " L" + x1 + "," + y1 + " L" +
							(x1 - 2) + "," + (y1 + 2);
						arrowPath2 = "M" + (x2 + 2) + "," + (y2 - 2) + " L" + x2 + "," + y2 + " L" +
							(x2 + 2) + "," + (y2 + 2);
					} else {
						arrowPath1 = "M" + (x1 + 2) + "," + (y1 - 2) + " L" + x1 + "," + y1 + " L" +
							(x1 + 2) + "," + (y1 + 2);
						arrowPath2 = "M" + (x2 - 2) + "," + (y2 - 2) + " L" + x2 + "," + y2 + " L" +
							(x2 - 2) + "," + (y2 + 2);
					}
				} else {
					if(y1 >= y2) {
						arrowPath1 = "M" + (x1 - 2) + "," + (y1 - 2) + " L" + x1 + "," + y1 + " L" +
							(x1 + 2) + "," + (y1 - 2);
						arrowPath2 = "M" + (x2 - 2) + "," + (y2 + 2) + " L" + x2 + "," + y2 + " L" +
							(x2 + 2) + "," + (y2 + 2);
					} else {
						arrowPath1 = "M" + (x1 - 2) + "," + (y1 + 2) + " L" + x1 + "," + y1 + " L" +
							(x1 + 2) + "," + (y1 + 2);
						arrowPath2 = "M" + (x2 - 2) + "," + (y2 - 2) + " L" + x2 + "," + y2 + " L" +
							(x2 + 2) + "," + (y2 - 2);
					}
				}
				child[0].setAttribute("x1", x1);
				child[0].setAttribute("y1", y1);
				child[0].setAttribute("x2", x2);
				child[0].setAttribute("y2", y2);
				child[1].setAttribute("x", (x1 + x2) / 2);
				child[1].setAttribute("y", (y1 + y2) / 2);
				child[1].textContent = length;
				child[2].setAttribute("d", arrowPath1);
				child[3].setAttribute("d", arrowPath2);

				if(line.direct == "from") {
					if(type == "horizon") {
						child[4].setAttribute("y1", y1);
					} else if(type == "vertical") {
						child[4].setAttribute("x1", x1);
					}
				} else {
					if(type == "horizon") {
						child[4].setAttribute("x1", x2);
						child[4].setAttribute("x2", x2);
					} else if(type == "vertical") {
						child[4].setAttribute("y1", y2);
						child[4].setAttribute("y2", y2);
					}
				}
			}
		},
		/**
		 * 根据id删除尺寸标注数据
		 * @param  {[type]} fromId   [起始点的dom的id]
		 * @param  {[type]} targetId [终点的dom的id]
		 */
		deleteMarkLineById: function(fromId, targetId) {
			for(var i = this.children.length - 1; i >= 0; i--) {
				if(this.children[i].tagName == "g" &&
					this.children[i].getAttribute("data-type") == "size-text" &&
					(this.children[i].getAttribute("data-target") == targetId &&
						this.children[i].getAttribute("data-from") == fromId)) {
					this.roomDom.removeChild(this.children[i]);
					break;
				}
			}
		},
		/**
		 * 绘制房间元素的函数
		 * @param  {[type]} attrs  [属性值]
		 * @param  {[type]} itemId [item的id]
		 */
		createSVG: function(attrs, itemId) {
			var element = document.createElementNS('http://www.w3.org/2000/svg', "g");
			element.setAttribute("id", itemId);
			console.log(attrs);
			for(var key in attrs) {
				if(key != "child") {
					element.setAttribute(key, attrs[key]);
				}
			}
			element.setAttribute("item-real", attrs['itemName'] +
				"(" + attrs["width"] * 10 + "x" + attrs["height"] * 10 + ")");
			var subArray = attrs.child;

			for(var i = 0, len = subArray.length; i < len; i++) {
				var subElement = resetSVG(subArray[i].name, subArray[i].attrs);
				// subElement.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink");
				var subChild = subArray[i].child;

				subElement = this.addSVGChild(subChild, subElement);

				element.appendChild(subElement);

			}
			var tmpData = {
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
			var tmp = resetSVG(tmpData.name, tmpData.attrs);
			element.appendChild(tmp);
			var sizeData = {
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
					"id": itemId + "-size",
				}
			};
			var border = resetSVG(sizeData.name, sizeData.attrs);
			for(var i = 0, len = sizeData.child.length; i < len; i++) {
				var subElement = resetSVG(sizeData.child[i].name, sizeData.child[i].attrs);
				border.appendChild(subElement);
			}
			element.appendChild(border);
			var domData = {
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
						"fill-opacity": "0.3",
						transform: "translate(" + (attrs.width - 75) / 2 + "," +
							(attrs.height - 75) / 2 + ") scale(0.15)",
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
						d: "M" + (attrs.width + 2) + " -2 L" + (attrs.width - 10) + "-2 M" +
							(attrs.width + 2) + " -2 L" + (attrs.width + 2) + " 10",
						stroke: "red",
						"stroke-width": 2,
					}
				}, {
					name: "path",
					attrs: {
						d: "M" + (attrs.width + 2) + " " + (attrs.height + 2) + " L" +
							(attrs.width - 10) + " " + (attrs.height + 2) + " M" + (attrs.width + 2) +
							" " + (attrs.height + 2) + " L" + (attrs.width + 2) + " " + (attrs.height - 10),
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
			var opacity = resetSVG(domData.name, domData.attrs);
			for(var i = 0, len = domData.child.length; i < len; i++) {
				var subElement = resetSVG(domData.child[i].name, domData.child[i].attrs);
				opacity.appendChild(subElement);
			}
			element.appendChild(opacity);
			return element;
		},
		/**
		 * 创建svg的dom的递归函数
		 * @param {[type]} child      [数据中的child]
		 * @param {[type]} subElement [子元素]
		 */
		addSVGChild: function(child, subElement) {
			if(!child) {} else {
				for(var i = 0, len = child.length; i < len; i++) {
					var childEle2 = resetSVG(child[i].name, child[i].attrs);
					childEle2 = addSVGChild(child[i].child, childEle2);
					subElement.appendChild(childEle2);
				}
			}
			return subElement;
		},
		/**
		 * 移动墙壁，顶点时重绘房间外围的数据
		 * @param  {[type]} child     [room的子元素]
		 * @param  {[type]} index     [当前待改变的dom的索引]
		 * @param  {[type]} lineIndex [移动墙壁的索引]
		 */
		resetLineInfo: function(child, index, lineIndex) {
			var line = child[lineIndex];
			var text = child[index];
			var x1 = parseInt(line.getAttribute("x1"));
			var y1 = parseInt(line.getAttribute("y1"));
			var x2 = parseInt(line.getAttribute("x2"));
			var y2 = parseInt(line.getAttribute("y2"));

			var posX = (x1 + x2) / 2;
			var posY = (y1 + y2) / 2;
			var len = (Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) / 100).toFixed(2);

			var position = text.getAttribute("position");
			var childNodes = text.childNodes;
			if(position == "horizon-up") {
				childNodes[0].setAttribute("x1", x1);
				childNodes[0].setAttribute("y1", y1 - 18);
				childNodes[0].setAttribute("x2", x1);
				childNodes[0].setAttribute("y2", y1 - 40);

				childNodes[1].setAttribute("x1", x1);
				childNodes[1].setAttribute("y1", y1 - 30);
				childNodes[1].setAttribute("x2", x2);
				childNodes[1].setAttribute("y2", y2 - 30);

				childNodes[2].setAttribute("x1", x2);
				childNodes[2].setAttribute("y1", y2 - 18);
				childNodes[2].setAttribute("x2", x2);
				childNodes[2].setAttribute("y2", y2 - 40);

				childNodes[3].textContent = len;
				childNodes[3].setAttribute("x", posX);
				childNodes[3].setAttribute("y", posY - 40);

				if(Math.abs(len) < 0.5) {
					childNodes[3].style.display = "none";
				} else {
					childNodes[3].style.display = "block";
				}

				var line2X1 = parseInt(x1);
				var line2X2 = parseInt(x2);
				var line2Y1 = parseInt(y1 - 30);
				var line2Y2 = parseInt(y2 - 30);
				if(x1 >= x2) {
					childNodes[4].setAttribute("d", "M" + (line2X1 - 5) + "," + (line2Y1 - 5) + " L" + line2X1 + "," +
						line2Y1 + " L" + (line2X1 - 5) + "," + (line2Y1 + 5));
					childNodes[5].setAttribute("d", "M" + (line2X2 + 5) + "," + (line2Y2 - 5) + " L" + line2X2 + "," +
						line2Y2 + " L" + (line2X2 + 5) + "," + (line2Y2 + 5));
				} else {
					childNodes[4].setAttribute("d", "M" + (line2X1 + 5) + "," + (line2Y1 - 5) + " L" + line2X1 + "," +
						line2Y1 + " L" + (line2X1 + 5) + "," + (line2Y1 + 5));
					childNodes[5].setAttribute("d", "M" + (line2X2 - 5) + "," + (line2Y2 - 5) + " L" + line2X2 + "," +
						line2Y2 + " L" + (line2X2 - 5) + "," + (line2Y2 + 5));
				}
			} else if(position == "horizon-down") {
				childNodes[0].setAttribute("x1", x1);
				childNodes[0].setAttribute("y1", y1 + 18);
				childNodes[0].setAttribute("x2", x1);
				childNodes[0].setAttribute("y2", y1 + 40);

				childNodes[1].setAttribute("x1", x1);
				childNodes[1].setAttribute("y1", y1 + 30);
				childNodes[1].setAttribute("x2", x2);
				childNodes[1].setAttribute("y2", y2 + 30);

				childNodes[2].setAttribute("x1", x2);
				childNodes[2].setAttribute("y1", y2 + 18);
				childNodes[2].setAttribute("x2", x2);
				childNodes[2].setAttribute("y2", y2 + 40);

				childNodes[3].textContent = len;
				childNodes[3].setAttribute("x", posX);
				childNodes[3].setAttribute("y", posY + 50);

				if(Math.abs(len) < 0.5) {
					childNodes[3].style.display = "none";
				} else {
					childNodes[3].style.display = "block";
				}

				var line2X1 = parseInt(x1);
				var line2X2 = parseInt(x2);
				var line2Y1 = parseInt(y1 + 30);
				var line2Y2 = parseInt(y2 + 30);

				if(x1 >= x2) {
					childNodes[4].setAttribute("d", "M" + (line2X1 - 5) + "," + (line2Y1 - 5) + " L" + line2X1 + "," +
						line2Y1 + " L" + (line2X1 - 5) + "," + (line2Y1 + 5));
					childNodes[5].setAttribute("d", "M" + (line2X2 + 5) + "," + (line2Y2 - 5) + " L" + line2X2 + "," +
						line2Y2 + " L" + (line2X2 + 5) + "," + (line2Y2 + 5));
				} else {
					childNodes[4].setAttribute("d", "M" + (line2X1 + 5) + "," + (line2Y1 - 5) + " L" + line2X1 + "," +
						line2Y1 + " L" + (line2X1 + 5) + "," + (line2Y1 + 5));
					childNodes[5].setAttribute("d", "M" + (line2X2 - 5) + "," + (line2Y2 - 5) + " L" + line2X2 + "," +
						line2Y2 + " L" + (line2X2 - 5) + "," + (line2Y2 + 5));
				}
			} else if(position == "vertical-left") {

				childNodes[0].setAttribute("x1", x1 - 18);
				childNodes[0].setAttribute("y1", y1);
				childNodes[0].setAttribute("x2", x1 - 40);
				childNodes[0].setAttribute("y2", y1);

				childNodes[1].setAttribute("x1", x1 - 30);
				childNodes[1].setAttribute("y1", y1);
				childNodes[1].setAttribute("x2", x2 - 30);
				childNodes[1].setAttribute("y2", y2);

				childNodes[2].setAttribute("x1", x2 - 18);
				childNodes[2].setAttribute("y1", y2);
				childNodes[2].setAttribute("x2", x2 - 40);
				childNodes[2].setAttribute("y2", y2);

				childNodes[3].textContent = len;
				childNodes[3].setAttribute("x", posX - 50);
				childNodes[3].setAttribute("y", posY);

				if(Math.abs(len) < 0.5) {
					childNodes[3].style.display = "none";
				} else {
					childNodes[3].style.display = "block";
				}

				var line2X1 = parseInt(x1 - 30);
				var line2X2 = parseInt(x2 - 30);
				var line2Y1 = parseInt(y1);
				var line2Y2 = parseInt(y2);
				if(y1 >= y2) {
					childNodes[4].setAttribute("d", "M" + (line2X1 - 5) + "," + (line2Y1 - 5) + " L" + line2X1 + "," +
						line2Y1 + " L" + (line2X1 + 5) + "," + (line2Y1 - 5));
					childNodes[5].setAttribute("d", "M" + (line2X2 - 5) + "," + (line2Y2 + 5) + " L" + line2X2 + "," +
						line2Y2 + " L" + (line2X2 + 5) + "," + (line2Y2 + 5));
				} else {
					childNodes[4].setAttribute("d", "M" + (line2X1 - 5) + "," + (line2Y1 + 5) + " L" + line2X1 + "," +
						line2Y1 + " L" + (line2X1 + 5) + "," + (line2Y1 + 5));
					childNodes[5].setAttribute("d", "M" + (line2X2 - 5) + "," + (line2Y2 - 5) + " L" + line2X2 + "," +
						line2Y2 + " L" + (line2X2 + 5) + "," + (line2Y2 - 5));
				}
			} else if(position == "vertical-right") {

				childNodes[0].setAttribute("x1", x1 + 18);
				childNodes[0].setAttribute("y1", y1);
				childNodes[0].setAttribute("x2", x1 + 40);
				childNodes[0].setAttribute("y2", y1);

				childNodes[1].setAttribute("x1", x1 + 30);
				childNodes[1].setAttribute("y1", y1);
				childNodes[1].setAttribute("x2", x2 + 30);
				childNodes[1].setAttribute("y2", y2);

				childNodes[2].setAttribute("x1", x2 + 18);
				childNodes[2].setAttribute("y1", y2);
				childNodes[2].setAttribute("x2", x2 + 40);
				childNodes[2].setAttribute("y2", y2);

				childNodes[3].textContent = len;
				childNodes[3].setAttribute("x", posX + 50);
				childNodes[3].setAttribute("y", posY);

				if(Math.abs(len) < 0.5) {
					childNodes[3].style.display = "none";
				} else {
					childNodes[3].style.display = "block";
				}

				var line2X1 = parseInt(x1 + 30);
				var line2X2 = parseInt(x2 + 30);
				var line2Y1 = parseInt(y1);
				var line2Y2 = parseInt(y2);
				if(y1 >= y2) {
					childNodes[4].setAttribute("d", "M" + (line2X1 - 5) + "," + (line2Y1 - 5) + " L" + line2X1 + "," +
						line2Y1 + " L" + (line2X1 + 5) + "," + (line2Y1 - 5));
					childNodes[5].setAttribute("d", "M" + (line2X2 - 5) + "," + (line2Y2 + 5) + " L" + line2X2 + "," +
						line2Y2 + " L" + (line2X2 + 5) + "," + (line2Y2 + 5));
				} else {
					childNodes[4].setAttribute("d", "M" + (line2X1 - 5) + "," + (line2Y1 + 5) + " L" + line2X1 + "," +
						line2Y1 + " L" + (line2X1 + 5) + "," + (line2Y1 + 5));
					childNodes[5].setAttribute("d", "M" + (line2X2 - 5) + "," + (line2Y2 - 5) + " L" + line2X2 + "," +
						line2Y2 + " L" + (line2X2 + 5) + "," + (line2Y2 - 5));
				}
			}
		},
		getLineCount: function(children) {
			var count = 0;
			for(var i = 0, len = children.length; i < len; i++) {
				if(children[i].tagName == "line") {
					count++;
				}
			}
			return count;
		},
		getItemCount: function(children) {
			var count = 0;
			for(var i = 1, len = children.length; i < len; i++) {
				if(children[i].tagName == "g" &&
					children[i].getAttribute("item-unique")) {
					count++;
				}
			}
			return count;
		},
		/**
		 * 获取门窗需要旋转的角度，拼接为transform
		 * @param  {[type]}  x1         [墙壁的x1]
		 * @param  {[type]}  y1         [墙壁的y1]
		 * @param  {[type]}  x2         [墙壁的x2]
		 * @param  {[type]}  y2         [墙壁的y2]
		 * @param  {Boolean} isVertical [是否是竖直的]
		 */
		getRotateAngle: function(x1, y1, x2, y2, isVertical) {
			var wallAngle = Math.atan((y1 - y2) / (x1 - x2)) * 180 / Math.PI;
			var svgCircle = document.getElementById("svg-circle");
			var midX = parseInt(svgCircle.getAttribute("cx"));
			var midY = parseInt(svgCircle.getAttribute("cy"));
			wallAngle = wallAngle.toFixed(5);
			var wallK = (y1 - y2) / (x1 - x2);
			var transform = "";
			if(wallK == "-Infinity" || wallK == "Infinity") {
				transform = "translate(" + (parseInt(x1) + 7) + "," + (midY - 50) +
					") scale(1,1) rotate(90)";
			} else {
				if(isVertical == "vertical") {
					if(wallAngle < 0) {
						wallAngle = wallAngle + 360;
						transform = "translate(" + (midX - 7) + "," + midY +
							") scale(1,1) rotate(" + wallAngle + ")";
					} else {
						transform = "translate(" + (midX + 7) + "," + midY +
							") scale(1,1) rotate(" + wallAngle + ")";
					}
				} else {
					transform = "translate(" + (midX) + "," + (midY - 7) +
						") scale(1,1) rotate(" + wallAngle + ")";
				}

			}
			return transform;
		},
	}
	window['Room'] = Room;
})(jQuery, window);