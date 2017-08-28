/**
 * 该文件是对一些通用方法的封装，可以在全局调用
 * @author chaoglas 
 * 
 */
function p() {
	for(var i = 0; i < arguments.length; i++) {
		console.log(arguments[i]);
	}
}
// var shareToNetUrl = "http://usuapp.com/project/visit";
// var uploadProjectUrl = "http://usuapp.com/project/create";
// var loginUrl = "http://usuapp.com/user/login";
// var verifyUrl = "http://usuapp.com/user/sendCheckCode";
// var regUrl = "http://usuapp.com/user/regist";
// var forgetPasswordUrl = "http://usuapp.com/user/findPwd";
// var downloadProjectUrl = "http://usuapp.com/project/getAllProject";
// var removeProjectUrl = "http://usuapp.com/project/remove";
var outPutToEmailUrl = "http://usuapp.com/project/sendProject";
var uploadPictureUrl = "http://usuapp.com/picture/upload"; //图片上传的URL
var uploadEditUrl = "http://usuapp.com/picture/cut"; //裁剪后的上传url
var imageHostUrl = "http://usuapp.com/";
var errorUrl = "http://usuapp.com/error";

/**
 * 错误信息处理
 */
function errorResult(data, self) {
	if(data) {
		console.log(data);
	}
}
/**
 * 获取当前时间
 */
function nowTime() {
	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth();
	var date = now.getDate();
	var day = now.getDay();
	var hour = now.getHours();
	var minu = now.getMinutes();
	var sec = now.getSeconds();
	var week;
	month = month + 1;
	if(month < 10) month = "0" + month;
	if(date < 10) date = "0" + date;
	if(hour < 10) hour = "0" + hour;
	if(minu < 10) minu = "0" + minu;
	if(sec < 10) sec = "0" + sec;
	var time = year + "-" + month + "-" + date + "" + " " + hour + ":" + minu + ":" + sec;
	return time;
}

/**
 * 生成唯一的ID
 * @param {Object} proId
 */
function getUid(proId) {
	var timeStamp = new Date().getTime();
	var uid = hex_md5(timeStamp + proId);
	return uid;
}

/**
 * 获取url的参数
 * @param {Object} name
 */
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null)
		return unescape(r[2]);
	return null;
};

/**
 * 计算各边的长度
 * @param {Object} x1
 * @param {Object} y1
 * @param {Object} x2
 * @param {Object} y2
 */
function edge(x1, y1, x2, y2) {
	var len = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
	return len;
}

/**
 * 动态添加svg元素
 * @param {Object} tag
 * @param {Object} attrs
 */
function resetSVG(tag, attrs) {
	var element = document.createElementNS('http://www.w3.org/2000/svg', tag);
	if(tag == "image") {
		element.href.baseVal = attrs["xlink:href"];
	}
	for(var k in attrs) {
		element.setAttribute(k, attrs[k]);
	}
	return element;
}

/**
 * 加载已保存的项目
 * @param {Object} proId
 */
function showCreatedProject(svg, proId) {
	var dataList = new SubSvgList();
	var info = window.localStorage.getItem(proId); //从localStorage提取数据;
	info = JSON.parse(info); //转化成json对象

	/* 对于从服务器下载获取的数据，含有转义后的\ ，需要解析两次才可以去除掉 */
	if(typeof info == "string") {
		info = JSON.parse(info);
	}
	if(info) {
		svg.setAttribute("transform", info.svgData.attrs.transform);
		var roomList = info.room; //获取房间列表

		/* 加此判断防止在用户没有保存项目而刷新页面时出现负值的问题 */
		if(roomList.length > 0) {
			num = roomList.length - 1; //保存当前房间的数量
		} else {
			num = 0;
		}

		for(var i = 0, len = roomList.length; i < len; i++) {
			var roomId = []; //此变量用来存储room的id，为了再次绑定事件
			var subSvgId = []; //此变量用来存储item的Id和info，为了再次绑定事件
			if(roomList[i] != null) {
				var roomDom = document.createElementNS('http://www.w3.org/2000/svg', "g");
				var roomAttrs = roomList[i].svgData.attrs;
				var roomId = "";
				for(var k in roomAttrs) {
					if(k == "id") {
						roomId = roomAttrs[k];
					}
					roomDom.setAttribute(k, roomAttrs[k])
				}

				var items = roomList[i].child;
				for(var j = 0, len2 = items.length; j < len2; j++) {

					if(items[j].svgData.name == "polygon" || items[j].svgData.name == "circle" || items[j].svgData.name == "line") {
						var subElement = resetSVG(items[j].svgData.name, items[j].svgData.attrs);
					}
					if(items[j].svgData.name == "g" && items[j].svgData.unique) {
						var unique = items[j].svgData.unique;
						var isTurn = false;
						if(unique.charAt(unique.length - 1) == "t") {
							unique = unique.substr(0, unique.length - 1);
							isTurn = true;
						}
						var itemInfo = dataList.getData(unique);
						var subElement = showRoomItem(items[j].svgData.attrs, itemInfo, isTurn);
						if(subElement.getAttribute("wallId")) {
							var tmpChild = subElement.children;
							for(var k = 0, len3 = tmpChild.length; k < len3; k++) {
								if(tmpChild[k].tagName == "g" && tmpChild[k].getAttribute("data-style")) {
									tmpChild[k].setAttribute("transform", items[j].svgData.child[0].svgData.attrs.transform)
								}
							}
						}
					}
					roomDom.appendChild(subElement);
				}
				svg.appendChild(roomDom);
			}
		}
	}

}

function showRoomItem(attrs, itemInfo, isTurn) {
	var element = document.createElementNS('http://www.w3.org/2000/svg', "g");
	for(var key in attrs) {
		element.setAttribute(key, attrs[key]);
	}
	attrs.width = parseInt(attrs.width);
	attrs.height = parseInt(attrs.height);
	if(itemInfo && itemInfo.child) {
		var subArray = itemInfo.child;
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
	return element;
}

function covertPolygon(prePolygon) {
	var arrays = prePolygon.split(" ");
	var newPolygon = new Array();
	for(var i = 0; i < arrays.length; i++) {
		var point = arrays[i];
		var pointXY = point.split(",", 2);
		var x = parseFloat(pointXY[0]);
		var y = parseFloat(pointXY[1]);
		if(i == arrays.length - 1) {
			newPolygon[i] = new Array(x, y, newPolygon[0][0], newPolygon[0][1]);
		} else {
			var pointAnother = arrays[i + 1].split(",", 2);
			newPolygon[i] = new Array(x, y, parseFloat(pointAnother[0]), parseFloat(pointAnother[1]));
		}
	};
	return newPolygon;
}

function createItemSVG(attrs) {
	var element = document.createElementNS('http://www.w3.org/2000/svg', "g");
	for(var key in attrs) {
		if(key != "child") {
			element.setAttribute(key, attrs[key]);
		}
	}

	var subArray = attrs.child;
	if(subArray) {
		for(var i = 0, len = subArray.length; i < len; i++) {
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
		var opacity = resetSVG(domData.name, domData.attrs);
		for(var i = 0, len = domData.child.length; i < len; i++) {
			var subElement = resetSVG(domData.child[i].name, domData.child[i].attrs);
			opacity.appendChild(subElement);
		}
	}
	element.appendChild(opacity);
	return element;
}

/**
 * 射线算法，判断点(pointX,pointY)是否在多变形polygon中
 **/
function isInPolygon(pointX, pointY, polygon) {
	var count = 0;
	for(var i = 0; i < polygon.length; i++) {
		if(pointX < max(polygon[i][0], polygon[i][2])) {
			if(min(polygon[i][1], polygon[i][3]) < pointY &&
				pointY <= max(polygon[i][1], polygon[i][3])) {
				if(pointX > min(polygon[i][0], polygon[i][2])) {
					var k1 = (polygon[i][3] - polygon[i][1]) / (polygon[i][2] - polygon[i][0]);
					var b1 = polygon[i][1] - k1 * polygon[i][0];
					var b2 = pointY;
					var x0 = (b2 - b1) / k1;
					if(x0 > pointX) {
						count++;
					}
				} else {
					count++;
				}
			}
		}
	};
	return count % 2 != 0;
}

function min(a, b) {
	return a > b ? b : a;
}

function max(a, b) {
	return a > b ? a : b;
}

function saveOneStep(info) {
	var history = window.localStorage.getItem("history");
	history = JSON.parse(history);
	if(history.length > 20) {
		history.shift();
	}
	history.push(info);
	$("#reset-btn").show();
	window.localStorage.setItem("history", JSON.stringify(history));
}

/**
 * 通过解析dom获取信息并转换成json数据
 * @param {Object} info
 */
function getProjectInfo(info) {
	console.log(info)
	var svg_g = document.getElementById("svg-g");
	var svgAttr = svg_g.attributes;
	var tmpRoom = [];
	var svgData = {};
	svgData.name = "g";
	svgData.attrs = {};
	for(var i = 0, len = svgAttr.length; i < len; i++) {
		svgData.attrs[svgAttr[i].name] = svgAttr[svgAttr[i].name].value;
	}

	info.svgData = svgData;
	var roomNodes = svg_g.children;
	for(var i = 0, len = roomNodes.length; i < len; i++) {
		var roomInfo = {};
		roomInfo.id = "room" + i;
		roomInfo.svgData = {};
		roomInfo.svgData.name = "g";
		roomInfo.svgData.attrs = {};

		var roomAttrs = roomNodes[i].attributes;
		for(var m = 0, attrsLen = roomAttrs.length; m < attrsLen; m++) {
			if(roomAttrs[m].name != "style") {

				roomInfo.svgData.attrs[roomAttrs[m].name] = roomAttrs[roomAttrs[m].name].value;
			}

		}

		roomInfo.child = [];
		var items = roomNodes[i].childNodes;

		for(var j = 0, len2 = items.length; j < len2; j++) {
			var item = {};
			item.id = roomInfo.id + "-" + j;
			item.svgData = {};
			item.svgData.name = items[j].tagName;
			var attrs = {};
			itemAttr = items[j].attributes;
			if(items[j].tagName == "g" && itemAttr["item-unique"]) {
				item.svgData.unique = itemAttr["item-unique"].value;
				var itemChild = items[j].children;
				for(var k = 0, len3 = itemChild.length; k < len3; k++) {
					if(itemChild[k].tagName == "g" && itemChild[k].getAttribute("data-style")) {
						item.svgData.child = [];
						item.svgData.child[0] = {
							svgData: {
								name: "g",
								attrs: {
									transform: itemChild[k].getAttribute("transform")
								}
							}
						};
					}
				}
			}
			for(var k = 0, len3 = itemAttr.length; k < len3; k++) {
				if(itemAttr[k].name != "style") {
					attrs[itemAttr[k].name] = itemAttr[itemAttr[k].name].value;
				}
			}
			item.svgData.attrs = attrs;

			if(items[j].tagName == "g" && itemAttr["data-type"]) {
				var textChild = [];
				var domChild = items[j].childNodes;

				for(var m = 0, textLen = domChild.length; m < textLen; m++) {
					domChildAttr = domChild[m].attributes;
					textChild[m] = {};
					textChild[m].svgData = {};
					textChild[m].svgData.name = domChild[m].tagName;
					textChild[m].svgData.attrs = {}
					for(var n = 0, attrLen = domChildAttr.length; n < attrLen; n++) {
						textChild[m].svgData.attrs[domChildAttr[n].name] = domChildAttr[domChildAttr[n].name].value;
					}
					if(domChild[m].tagName == "text") {

						textChild[m].svgData.textContent = domChild[m].textContent;
					}
				}
				item.svgData.child = textChild;
			}
			if(info.room[i] && typeof info.room[i].itemInfo != "undefined") {
				roomInfo.itemInfo = info.room[i].itemInfo;
			} else {
				roomInfo.itemInfo = {};
			}
			roomInfo.child[j] = item;
		}

		tmpRoom[i] = roomInfo;
	}
	info.room = tmpRoom;

	return info;
}