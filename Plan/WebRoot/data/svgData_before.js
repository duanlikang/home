(function(){
	var SubSvgList = function(){
		var self = this;
		this.roomData = function(number){
			var room = {
				attrs:{
					id: getUid("subSvg"+number),
					name: "房间",
					transform: "translate(100,100) scale(1) rotate(0 300,250)",
					type: "arbitrary",
					isClose: true,
					uniqueId:"",
				},
				text: ["3.00", "3.00", "3.00", "3.00"],
				subArray: [{
					name: "polygon",
					attrs: {
						id: getUid("subItem" + self.number + "-0"),
						points: "0,0 0,300 300,300 300,0",
						fill: "#f0f0f0",
						"fill-opacity":"0.6",
						stroke: "#000000",
						"stroke-width": "1"
					},
				}, {
					name: "line",
					attrs: {
						id: getUid("subItem" + self.number + "-1"),
						x1: "0",
						y1: "0",
						x2: "0",
						y2: "300",
						stroke:"#000000",
						"stroke-width": "12",
						"stroke-opacity": "1",
						isVertical:"vertical"
					}
				}, {
					name: "line",
					attrs: {
						id: getUid("subItem" + self.number + "-2"),
						x1: "0",
						y1: "300",
						x2: "300",
						y2: "300",
						stroke: "#000000",
						"stroke-width": "12",
						"stroke-opacity": "1",
						isVertical:"horizon"
					}
				}, {
					name: "line",
					attrs: {
						id: getUid("subItem" + self.number + "-3"),
						x1: "300",
						y1: "300",
						x2: "300",
						y2: "0",
						stroke: "#000000",
						"stroke-width": "12",
						"stroke-opacity": "1",
						isVertical:"vertical"
					}
				}, {
					name: "line",
					attrs: {
						id: getUid("subItem" + self.number + "-4"),
						x1: "300",
						y1: "0",
						x2: "0",
						y2: "0",
						stroke:"#000000",
						"stroke-width": "12",
						"stroke-opacity": "1",
						isVertical:"horizon"
					}
				}, {
					name: "circle",
					attrs: {
						id: getUid("subItem" + self.number + "-5"),
						cx: "0",
						cy: "0",
						r: "5",
						stroke: "black",
						"stroke-opacity": "0.8",
						"stroke-width": "2",
						fill: "black"
					}
				}, {
					name: "circle",
					attrs: {
						id: getUid("subItem" + self.number + "-6"),
						cx: "0",
						cy: "300",
						r: "5",
						stroke: "black",
						"stroke-opacity": "0.8",
						"stroke-width": "2",
						fill: "black"
					}
				}, {
					name: "circle",
					attrs: {
						id: getUid("subItem" + self.number + "-7"),
						cx: "300",
						cy: "300",
						r: "5",
						stroke: "black",
						"stroke-opacity": "0.8",
						"stroke-width": "2",
						fill: "black"
					}
				}, {
					name: "circle",
					attrs: {
						id: getUid("subItem" + self.number + "-8"),
						cx: "300",
						cy: "0",
						r: "5",
						stroke: "black",
						"stroke-opacity": "0.8",
						"stroke-width": "2",
						fill: "black"
					}
				}]
			};
			return room;
		}
		this.data = {
			door:{
				child:[{
					name: "polygon",
						attrs: {
							points: "0,0 100,0 100,20 0,20",
							fill: "#f0f0f0",
							stroke: "blue",
							"stroke-width": "2"
						}
					}, {
						name: "polygon",
						attrs: {
							points: "0,10 100,10",
							fill: "#f0f0f0",
							stroke: "blue",
							"stroke-width": "2"
						}
					}]
			},
			door2:{
				child: [{
					name: "polygon",
					attrs: {
						points: "0,0 100,0 100,20 0,20",
						"stroke-width": "2",
						fill: "#f0f0f0",
						stroke: "none",
					}
				}, {
					name: "path",
					attrs: {
						d: "M0,20A 90 90, 0, 0, 1, 100 -80L 100 20",
						"stroke-width": "1",
						fill: "#f0f0f0",
						stroke: "rgb(128,128,128)"
					}
				}, {
					name: "polygon",
					attrs: {
						points: "100,-80 100,20 ",
						"stroke-width": "2",
						fill: "#f0f0f0",
						stroke: "blue",
					}
				}]
			},
			bed:[
			{
				name: "1500乘2000",
				icon:"",
				svg:"bed_1500乘2000",
			},
			{
				name: "1800乘2000",
				icon:"",
				svg:"bed_1800乘2000",
			},{
				name: "单人床1500乘2000",
				icon:"",
				svg:"bed_单人床1500乘2000",
			},{
				name: "双人床1800乘2000",
				icon:"",
				svg:"bed_双人床1800乘2000",
			},{
				name: "双人床1800乘2100",
				icon:"",
				svg:"bed_双人床1800乘2100",
			}
			],
			chair:[
			{
				name: "450乘450",
				icon:"",
				svg:"chair_450乘450",
			},
			{
				name: "460乘460",
				icon:"",
				svg:"chair_460乘460",
			},
			{
				name: "460乘470",
				icon:"",
				svg:"chair_460乘470",
			},
			{
				name: "半圆椅660乘640",
				icon:"",
				svg:"chair_半圆椅660乘640",
			},
			{
				name: "扶手椅500乘460",
				icon:"",
				svg:"chair_扶手椅500乘460",
			},
			{
				name: "排椅1750乘650",
				icon:"",
				svg:"chair_排椅1750乘650",
			},
			{
				name: "培训椅460乘470",
				icon:"",
				svg:"chair_培训椅460乘470",
			},
			{
				name: "椅子450乘450",
				icon:"",
				svg:"chair_椅子450乘450",
			},
			{
				name: "圆凳400乘400",
				icon:"",
				svg:"chair_圆凳400乘400",
			}
			],
			meetdesk:[
			{
				name:"1200乘2600",
				icon:"",
				svg:"meet_1200乘2600",
			},
			{
				name:"3800乘1800",
				icon:"",
				svg:"meet_3800乘1800",
			},
			{
				name:"会议桌2000乘1000",
				icon:"",
				svg:"meet_会议桌2000乘1000",
			},
			{
				name:"会议桌2200乘1100",
				icon:"",
				svg:"meet_会议桌2200乘1100",
			},
			{
				name:"会议桌2400乘1200",
				icon:"",
				svg:"meet_会议桌2400乘1200",
			},
			{
				name:"会议桌3000乘1200",
				icon:"",
				svg:"meet_会议桌3000乘1200",
			},
			{
				name:"会议桌3800乘1800",
				icon:"",
				svg:"meet_会议桌3800乘1800",
			},
			{
				name:"椭圆会议桌2800乘1200",
				icon:"",
				svg:"meet_椭圆会议桌2800乘1200",
			},
			{
				name:"椭圆会议桌3500乘1800",
				icon:"",
				svg:"meet_椭圆会议桌3500乘1800",
			},
			{
				name:"圆桌2200乘2200",
				icon:"",
				svg:"meet_圆桌2200乘2200",
			},
			
			],
			sofa:[
			{
				name:"890乘730",
				icon:"",
				svg:"sofa_890乘730",
			},
			{
				name:"900乘1500",
				icon:"",
				svg:"sofa_900乘1500",
			},
			{
				name:"单人沙发1680乘730",
				icon:"",
				svg:"sofa_单人沙发1680乘730",
			},
			{
				name:"单人沙发900乘730",
				icon:"",
				svg:"sofa_单人沙发900乘870",
			},
			{
				name:"三人沙发1680乘730",
				icon:"",
				svg:"sofa_三人沙发1680乘730",
			},
			{
				name:"三人沙发1980乘870",
				icon:"",
				svg:"sofa_三人沙发1980乘870",
			},
			{
				name:"沙发单人1080乘890",
				icon:"",
				svg:"sofa_沙发单人1080乘890",
			},
			{
				name:"沙发单人890乘730",
				icon:"",
				svg:"sofa_沙发单人890乘730",
			},
			{
				name:"沙发单人900乘870",
				icon:"",
				svg:"sofa_沙发单人900乘870",
			},
			{
				name:"沙发单人980乘940",
				icon:"",
				svg:"sofa_沙发单人980乘940",
			},
			{
				name:"沙发二人1580乘890",
				icon:"",
				svg:"sofa_沙发二人1580乘890",
			},
			{
				name:"沙发三人1680乘730",
				icon:"",
				svg:"sofa_沙发三人1680乘730",
			},
			{
				name:"沙发三人2080乘890",
				icon:"",
				svg:"sofa_沙发三人2080乘890",
			},
			{
				name:"沙发双人1280乘730",
				icon:"",
				svg:"sofa_沙发双人1280乘730",
			},
			{
				name:"沙发双人1400乘870",
				icon:"",
				svg:"sofa_沙发双人1400乘870",
			},
			{
				name:"沙发双人1480乘940",
				icon:"",
				svg:"sofa_沙发双人1480乘940",
			},
			{
				name:"双人沙发1400乘870",
				icon:"",
				svg:"sofa_双人沙发1400乘870",
			},
			],
			workdesk:[
			{
				name:"2000乘2100",
				icon:"",
				svg:"work_2000乘2100",
			},
			{
				name:"班台2800乘2600",
				icon:"",
				svg:"work_班台2800乘2600",
			},
			{
				name:"班台3200乘2650",
				icon:"",
				svg:"work_班台3200乘2650",
			},
			{
				name:"办公桌1400乘700",
				icon:"",
				svg:"work_办公桌1400乘700",
			},
			{
				name:"办公桌1800乘1800",
				icon:"",
				svg:"work_办公桌1800乘1800",
			},
			{
				name:"办公桌2000乘2100",
				icon:"",
				svg:"work_办公桌2000乘2100",
			},
			{
				name:"办公桌2200乘2000",
				icon:"",
				svg:"work_办公桌2200乘2000",
			},
			{
				name:"办公桌2400乘2150",
				icon:"",
				svg:"work_办公桌2400乘2150",
			},
			{
				name:"办公桌2400乘2200",
				icon:"",
				svg:"work_办公桌2400乘2200",
			},
			{
				name:"办公桌2400乘2250",
				icon:"",
				svg:"work_办公桌2400乘2250",
			},
			{
				name:"办公桌椅1400乘1500",
				icon:"",
				svg:"work_办公桌椅1400乘1500",
			},
			],
			frontdesk:[
			{
				name:"前台2200乘900",
				icon:"",
				svg:"front_前台2200乘900"
			},
			{
				name:"前台2400乘900",
				icon:"",
				svg:"front_前台2400乘900"
			},
			{
				name:"前台2600乘1800",
				icon:"",
				svg:"front_前台2600乘1800"
			},
			{
				name:"前台3000乘900",
				icon:"",
				svg:"front_前台3000乘900"
			},
			{
				name:"前台3320乘1280",
				icon:"",
				svg:"front_前台3320乘1280"
			},
			],
			workstation:[
			{
				name:"1400乘1400",
				icon:"",
				svg:"station_1400乘1400"
			},
			{
				name:"工位1200乘1220",
				icon:"",
				svg:"station_工位1200乘1220"
			},
			{
				name:"工位1400乘1400",
				icon:"",
				svg:"station_工位1400乘1400"
			},
			{
				name:"工位2400乘2400",
				icon:"",
				svg:"station_工位2400乘2400"
			},
			{
				name:"工位2800乘2800",
				icon:"",
				svg:"station_工位2800乘2800"
			},
			{
				name:"工作位1400乘1400",
				icon:"",
				svg:"station_工作位1400乘1400"
			},
			],
			deskitem:[
			{
				name:"电视530乘190",
				icon:"",
				svg:"item_530乘190"
			},
			{
				name:"笔记本电脑325乘227",
				icon:"",
				svg:"item_笔记本电脑325乘227"
			},
			{
				name:"打印机415乘265",
				icon:"",
				svg:"item_打印机415乘265"
			},
			{
				name:"打印机477乘398",
				icon:"",
				svg:"item_打印机477乘398"
			},
			{
				name:"电话160乘190",
				icon:"",
				svg:"item_电话160乘190"
			},
			{
				name:"花200乘200",
				icon:"",
				svg:"item_花200乘200"
			},
			{
				name:"花210乘210",
				icon:"",
				svg:"item_花210乘210"
			},
			{
				name:"花300乘110",
				icon:"",
				svg:"item_花300乘110"
			},
			{
				name:"花400乘400",
				icon:"",
				svg:"item_花400乘400"
			},
			],
			other:[
			{
				name:"便池428乘545",
				icon:"",
				svg:"other_便池428乘545"
			},
			{
				name:"餐桌1100乘1400",
				icon:"",
				svg:"other_餐桌1100乘1400"
			},
			{
				name:"餐桌1600乘1500",
				icon:"",
				svg:"other_餐桌1600乘1500"
			},
			{
				name:"长茶几1200乘600",
				icon:"",
				svg:"other_长茶几1200乘600"
			},
			{
				name:"底色",
				icon:"",
				svg:"other_底色160乘136"
			},
			{
				name:"方茶几600乘600",
				icon:"",
				svg:"other_方茶几600乘600"
			},
			{
				name:"方柱400乘400",
				icon:"",
				svg:"other_方柱400乘400"
			},
			{
				name:"柜子900乘450",
				icon:"",
				svg:"other_柜子900乘450"
			},
			{
				name:"柜子900乘450",
				icon:"",
				svg:"other_柜子900乘450"
			},
			{
				name:"马桶",
				icon:"",
				svg:"other_马桶630乘880"
			},
			{
				name:"洗衣机",
				icon:"",
				svg:"other_洗衣机520乘550"
			},
			{
				name:"衣柜1100乘450",
				icon:"",
				svg:"other_衣柜1100乘450"
			},
			{
				name:"圆柱400乘400",
				icon:"",
				svg:"other_圆柱400乘400"
			},
			{
				name:"圆桌1800乘1800",
				icon:"",
				svg:"other_圆桌1800乘1800"
			},
			],
			"other_便池428乘545":{
				name:"g",
				itemName:"便池428乘545",
				"item-unique" :"other_便池428乘545",
				"width":43,
			    "height":55,
				"transform": "translate(50,50) scale(1) rotate(0 22,28)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/other/便池428乘545.png","style":"display:block",width:"43px",height:"55px"}}]
			},
			"other_餐桌1100乘1400":{
				name:"g",
				itemName:"餐桌1100乘1400",
				"item-unique" :"other_餐桌1100乘1400",
				"width":110,
			    "height":140,
				"transform": "translate(50,50) scale(1) rotate(0 110,140)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/other/餐桌1100乘1400.png","style":"display:block",width:"110px",height:"140px"}}]
			},
			"other_餐桌1600乘1500":{
				name:"g",
				itemName:"餐桌1600乘1500",
				"item-unique" :"other_餐桌1600乘1500",
				"width":160,
			    "height":150,
				"transform": "translate(50,50) scale(1) rotate(0 160,150)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/other/餐桌1600乘1500.png","style":"display:block",width:"160px",height:"150px"}}]
			},
			"other_长茶几1200乘600":{
				name:"g",
				itemName:"长茶几1200乘600",
				"item-unique" :"other_长茶几1200乘600",
				"width":120,
			    "height":60,
				"transform": "translate(50,50) scale(1) rotate(0 120,60)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/other/长茶几1200乘600.png","style":"display:block",width:"120px",height:"60px"}}]
			},
			"other_底色160乘136":{
				name:"g",
				itemName:"底色",
				"item-unique" :"other_底色160乘136",
				"width":16,
			    "height":14,
				"transform": "translate(50,50) scale(1) rotate(0 8,7)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/other/底色1.jpg","style":"display:block",width:"16px",height:"14px"}}]
			},
			"other_方茶几600乘600":{
				name:"g",
				itemName:"方茶几600乘600",
				"item-unique" :"other_方茶几600乘600",
				"width":60,
			    "height":60,
				"transform": "translate(50,50) scale(1) rotate(0 30,30)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/other/方茶几600乘600.png","style":"display:block",width:"60px",height:"60px"}}]
			},
			"other_方柱400乘400":{
				name:"g",
				itemName:"方柱400乘400",
				"item-unique" :"other_方柱400乘400",
				"width":40,
			    "height":40,
				"transform": "translate(50,50) scale(1) rotate(0 20,20)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/other/方柱400乘400.png","style":"display:block",width:"40px",height:"40px"}}]
			},
			"other_柜子900乘450":{
				name:"g",
				itemName:"柜子900乘450",
				"item-unique" :"other_柜子900乘450",
				"width":90,
			    "height":45,
				"transform": "translate(50,50) scale(1) rotate(0 45,23)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/other/柜子900乘450.png","style":"display:block",width:"90px",height:"45px"}}]
			},
			"other_马桶630乘880":{
				name:"g",
				itemName:"马桶630乘880",
				"item-unique" :"other_马桶630乘880",
				"width":63,
			    "height":88,
				"transform": "translate(50,50) scale(1) rotate(0 32,44)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/other/马桶.png","style":"display:block",width:"63px",height:"88px"}}]
			},
			"other_洗衣机520乘550":{
				name:"g",
				itemName:"洗衣机520乘550",
				"item-unique" :"other_洗衣机520乘550",
				"width":52,
			    "height":55,
				"transform": "translate(50,50) scale(1) rotate(0 26,28)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/other/洗衣机.png","style":"display:block",width:"52px",height:"55px"}}]
			},
			"other_衣柜1100乘450":{
				name:"g",
				itemName:"衣柜1100乘450",
				"item-unique" :"other_衣柜1100乘450",
				"width":110,
			    "height":45,
				"transform": "translate(50,50) scale(1) rotate(0 55,23)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/other/衣柜1100乘450.png","style":"display:block",width:"110px",height:"45px"}}]
			},
			"other_圆柱400乘400":{
				name:"g",
				itemName:"圆柱400乘400",
				"item-unique" :"other_圆柱400乘400",
				"width":40,
			    "height":40,
				"transform": "translate(50,50) scale(1) rotate(0 20,20)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/other/圆柱400乘400.png","style":"display:block",width:"40px",height:"40px"}}]
			},
			"other_圆桌1800乘1800":{
				name:"g",
				itemName:"圆桌1800乘1800",
				"item-unique" :"other_圆桌1800乘1800",
				"width":180,
			    "height":180,
				"transform": "translate(50,50) scale(1) rotate(0 90,90)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/other/圆桌1800乘1800.png","style":"display:block",width:"180px",height:"180px"}}]
			},
			"item_530乘190":{
				name:"g",
				itemName:"电视530乘190",
				"item-unique" :"item_530乘190",
				"width":53,
			    "height":19,
				"transform": "translate(50,50) scale(1) rotate(0 27,10)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/deskitem/530乘190.png","style":"display:block",width:"53px",height:"19px"}}]
			},
			"item_笔记本电脑325乘227":{
				name:"g",
				itemName:"笔记本电脑325乘227",
				"item-unique" :"item_笔记本电脑325乘227",
				"width":33,
			    "height":23,
				"transform": "translate(50,50) scale(1) rotate(0 17,12)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/deskitem/笔记本电脑325乘227.png","style":"display:block",width:"33px",height:"23px"}}]
			},
			"item_打印机415乘265":{
				name:"g",
				itemName:"打印机415乘265",
				"item-unique" :"item_打印机415乘265",
				"width":42,
			    "height":27,
				"transform": "translate(50,50) scale(1) rotate(0 21,14)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/deskitem/打印机415乘265.png","style":"display:block",width:"42px",height:"27px"}}]
			},
			"item_打印机477乘398":{
				name:"g",
				itemName:"打印机477乘398",
				"item-unique" :"item_打印机477乘398",
				"width":48,
			    "height":40,
				"transform": "translate(50,50) scale(1) rotate(0 24,20)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/deskitem/打印机477乘398.png","style":"display:block",width:"48px",height:"40px"}}]
			},
			"item_电话160乘190":{
				name:"g",
				itemName:"电话160乘190",
				"item-unique" :"item_电话160乘190",
				"width":16,
			    "height":19,
				"transform": "translate(50,50) scale(1) rotate(0 8,10)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/deskitem/电话160乘190.png","style":"display:block",width:"16px",height:"20px"}}]
			},
			"item_花200乘200":{
				name:"g",
				itemName:"花200乘200",
				"item-unique" :"item_花200乘200",
				"width":20,
			    "height":20,
				"transform": "translate(50,50) scale(1) rotate(0 10,10)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/deskitem/花200乘200.png","style":"display:block",width:"20px",height:"20px"}}]
			},
			"item_花210乘210":{
				name:"g",
				itemName:"花210乘210",
				"item-unique" :"item_花210乘210",
				"width":21,
			    "height":21,
				"transform": "translate(50,50) scale(1) rotate(0 11,11)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/deskitem/花210乘210.png","style":"display:block",width:"21px",height:"21px"}}]
			},
			"item_花300乘110":{
				name:"g",
				itemName:"花300乘110",
				"item-unique" :"item_花300乘110",
				"width":30,
			    "height":11,
				"transform": "translate(50,50) scale(1) rotate(0 15,6)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/deskitem/花300乘110.png","style":"display:block",width:"30px",height:"11px"}}]
			},
			"item_花400乘400":{
				name:"g",
				itemName:"花400乘400",
				"item-unique" :"item_花400乘400",
				"width":40,
			    "height":40,
				"transform": "translate(50,50) scale(1) rotate(0 20,20)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/deskitem/花400乘400.png","style":"display:block",width:"40px",height:"40px"}}]
			},
			"station_1400乘1400":{
				name:"g",
				itemName:"工位_1400乘1400",
				"item-unique" :"station_1400乘1400",
				"width":140,
			    "height":140,
				"transform": "translate(50,50) scale(1) rotate(0 70,70)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/workstation/1400乘1400.png","style":"display:block",width:"140px",height:"140px"}}]
			},
			"station_工位1200乘1220":{
				name:"g",
				itemName:"工位1200乘1220",
				"item-unique" :"station_工位1200乘1220",
				"width":120,
			    "height":122,
				"transform": "translate(50,50) scale(1) rotate(0 60,61)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/workstation/工位1200乘1220.png","style":"display:block",width:"120px",height:"122px"}}]
			},
			"station_工位1400乘1400":{
				name:"g",
				itemName:"工位1400乘1400",
				"item-unique" :"station_工位1400乘1400",
				"width":140,
			    "height":140,
				"transform": "translate(50,50) scale(1) rotate(0 70,70)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/workstation/工位1400乘1400.png","style":"display:block",width:"140px",height:"140px"}}]
			},
			"station_工位2400乘2400":{
				name:"g",
				itemName:"工位2400乘2400",
				"item-unique" :"station_工位2400乘2400",
				"width":240,
			    "height":240,
				"transform": "translate(50,50) scale(1) rotate(0 120,120)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/workstation/工位2400乘2400.png","style":"display:block",width:"240px",height:"240px"}}]
			},
			"station_工位2800乘2800":{
				name:"g",
				itemName:"工位2800乘2800",
				"item-unique" :"station_工位2800乘2800",
				"width":280,
			    "height":280,
				"transform": "translate(50,50) scale(1) rotate(0 140,140)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/workstation/工位2800乘2800.png","style":"display:block",width:"280px",height:"280px"}}]
			},
			"station_工作位1400乘1400":{
				name:"g",
				itemName:"工作位1400乘1400",
				"item-unique" :"station_工作位1400乘1400",
				"width":140,
			    "height":140,
				"transform": "translate(50,50) scale(1) rotate(0 70,70)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/workstation/工作位1400乘1400.png","style":"display:block",width:"140px",height:"140px"}}]
			},
			"front_前台2200乘900":{
				name:"g",
				itemName:"前台2200乘900",
				"item-unique" :"front_前台2200乘900",
				"width":220,
			    "height":90,
				"transform": "translate(50,50) scale(1) rotate(0 110,45)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/frontdesk/前台2200乘900.png","style":"display:block",width:"220px",height:"90px"}}]
			},
			"front_前台2400乘900":{
				name:"g",
				itemName:"前台2400乘900",
				"item-unique" :"front_前台2400乘900",
				"width":240,
			    "height":90,
				"transform": "translate(50,50) scale(1) rotate(0 120,45)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/frontdesk/前台2400乘900.png","style":"display:block",width:"240px",height:"90px"}}]
			},
			"front_前台2600乘1800":{
				name:"g",
				itemName:"前台2600乘1800",
				"item-unique" :"front_前台2600乘1800",
				"width":260,
			    "height":180,
				"transform": "translate(50,50) scale(1) rotate(0 130,90)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/frontdesk/前台2600乘1800.png","style":"display:block",width:"260px",height:"180px"}}]
			},
			"front_前台3000乘900":{
				name:"g",
				itemName:"前台3000乘900",
				"item-unique" :"front_前台3000乘900",
				"width":300,
			    "height":90,
				"transform": "translate(50,50) scale(1) rotate(0 150,45)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/frontdesk/前台3000乘900.png","style":"display:block",width:"300px",height:"90px"}}]
			},
			"front_前台3320乘1280":{
				name:"g",
				itemName:"前台3320乘1280",
				"item-unique" :"front_前台3320乘1280",
				"width":332,
			    "height":128,
				"transform": "translate(50,50) scale(1) rotate(0 166,64)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/frontdesk/前台3320乘1280.png","style":"display:block",width:"332px",height:"128px"}}]
			},
			"work_2000乘2100":{
				name:"g",
				itemName:"办公桌_2000乘2100",
				"item-unique" :"work_2000乘2100",
				"width":200,
			    "height":210,
				"transform": "translate(50,50) scale(1) rotate(0 100,105)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/workdesk/2000乘2100.png","style":"display:block",width:"200px",height:"210px"}}]
			},
			"work_班台2800乘2600":{
				name:"g",
				itemName:"班台2800乘2600",
				"item-unique" :"work_班台2800乘2600",
				"width":280,
			    "height":260,
				"transform": "translate(50,50) scale(1) rotate(0 140,130)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/workdesk/班台2800乘2600.png","style":"display:block",width:"280px",height:"260px"}}]
			},
			"work_班台3200乘2650":{
				name:"g",
				itemName:"班台3200乘2650",
				"item-unique" :"work_班台3200乘2650",
				"width":320,
			    "height":265,
				"transform": "translate(50,50) scale(1) rotate(0 160,133)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/workdesk/班台3200乘2650.png","style":"display:block",width:"320px",height:"265px"}}]
			},
			"work_办公桌1400乘700":{
				name:"g",
				itemName:"办公桌1400乘700",
				"item-unique" :"work_办公桌1400乘700",
				"width":140,
			    "height":70,
				"transform": "translate(50,50) scale(1) rotate(0 70,35)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/workdesk/办公桌1400乘700.png","style":"display:block",width:"140px",height:"70px"}}]
			},
			"work_办公桌1800乘1800":{
				name:"g",
				itemName:"办公桌1800乘1800",
				"item-unique" :"work_办公桌1800乘1800",
				"width":180,
			    "height":180,
				"transform": "translate(50,50) scale(1) rotate(0 90,90)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/workdesk/办公桌1800乘1800.png","style":"display:block",width:"180px",height:"180px"}}]
			},
			"work_办公桌2000乘2100":{
				name:"g",
				itemName:"办公桌2000乘2100",
				"item-unique" :"work_办公桌2000乘2100",
				"width":200,
			    "height":210,
				"transform": "translate(50,50) scale(1) rotate(0 100,105)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/workdesk/办公桌2000乘2100.png","style":"display:block",width:"200px",height:"210px"}}]
			},
			"work_办公桌2200乘2000":{
				name:"g",
				itemName:"办公桌2200乘2000",
				"item-unique" :"work_办公桌2200乘2000",
				"width":220,
			    "height":200,
				"transform": "translate(50,50) scale(1) rotate(0 110,100)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/workdesk/办公桌2200乘2000.png","style":"display:block",width:"220px",height:"200px"}}]
			},
			"work_办公桌2400乘2150":{
				name:"g",
				itemName:"办公桌2400乘2150",
				"item-unique" :"work_办公桌2400乘2150",
				"width":240,
			    "height":215,
				"transform": "translate(50,50) scale(1) rotate(0 120,108)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/workdesk/办公桌2400乘2150.png","style":"display:block",width:"240px",height:"215px"}}]
			},
			"work_办公桌2400乘2200":{
				name:"g",
				itemName:"办公桌2400乘2200",
				"item-unique" :"work_办公桌2400乘2200",
				"width":240,
			    "height":220,
				"transform": "translate(50,50) scale(1) rotate(0 120,110)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/workdesk/办公桌2400乘2200.png","style":"display:block",width:"240px",height:"220px"}}]
			},
			"work_办公桌2400乘2250":{
				name:"g",
				itemName:"办公桌2400乘2250",
				"item-unique" :"work_办公桌2400乘2250",
				"width":240,
			    "height":225,
				"transform": "translate(50,50) scale(1) rotate(0 120,113)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/workdesk/办公桌2400乘2250.png","style":"display:block",width:"240px",height:"225px"}}]
			},
			"work_办公桌椅1400乘1500":{
				name:"g",
				itemName:"办公桌椅1400乘1500",
				"item-unique" :"work_办公桌椅1400乘1500",
				"width":140,
			    "height":150,
				"transform": "translate(50,50) scale(1) rotate(0 70,75)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/workdesk/办公桌椅1400乘1500.png","style":"display:block",width:"140px",height:"150px"}}]
			},
			"sofa_890乘730":{
				name:"g",
				itemName:"沙发890乘730",
				"item-unique" :"sofa_890乘730",
				"width":89,
			    "height":73,
				"transform": "translate(50,50) scale(1) rotate(0 45,37)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/sofa/890乘730.png","style":"display:block",width:"89px",height:"73px"}}]
			},
			"sofa_900乘1500":{
				name:"g",
				itemName:"沙发900乘1500",
				"item-unique" :"sofa_900乘1500",
				"width":90,
			    "height":150,
				"transform": "translate(50,50) scale(1) rotate(0 45,75)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/sofa/900乘1500.png","style":"display:block",width:"90px",height:"150px"}}]
			},
			"sofa_单人沙发1680乘730":{
				name:"g",
				itemName:"单人沙发1680乘730",
				"item-unique" :"sofa_单人沙发1680乘730",
				"width":168,
			    "height":73,
				"transform": "translate(50,50) scale(1) rotate(0 84,37)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/sofa/单人沙发1680乘730.png","style":"display:block",width:"168px",height:"73px"}}]
			},
			"sofa_单人沙发900乘870":{
				name:"g",
				itemName:"单人沙发900乘870",
				"item-unique" :"sofa_单人沙发900乘870",
				"width":90,
			    "height":87,
				"transform": "translate(50,50) scale(1) rotate(0 90,44)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/sofa/单人沙发900乘870.png","style":"display:block",width:"90px",height:"87px"}}]
			},
			"sofa_三人沙发1680乘730":{
				name:"g",
				itemName:"三人沙发1680乘730",
				"item-unique" :"sofa_三人沙发1680乘730",
				"width":168,
			    "height":73,
				"transform": "translate(50,50) scale(1) rotate(0 84,37)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/sofa/三人沙发1680乘730.png","style":"display:block",width:"168px",height:"73px"}}]
			},
			"sofa_三人沙发1980乘870":{
				name:"g",
				itemName:"三人沙发1980乘870",
				"item-unique" :"sofa_三人沙发1980乘870",
				"width":198,
			    "height":87,
				"transform": "translate(50,50) scale(1) rotate(0 99,44)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/sofa/三人沙发1980乘870.png","style":"display:block",width:"198px",height:"87px"}}]
			},
			"sofa_沙发单人1080乘890":{
				name:"g",
				itemName:"沙发单人1080乘890",
				"item-unique" :"sofa_沙发单人1080乘890",
				"width":108,
			    "height":89,
				"transform": "translate(50,50) scale(1) rotate(0 54,45)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/sofa/沙发单人1080乘890.png","style":"display:block",width:"108px",height:"89px"}}]
			},
			"sofa_沙发单人890乘730":{
				name:"g",
				itemName:"沙发单人890乘730",
				"item-unique" :"sofa_沙发单人890乘730",
				"width":89,
			    "height":73,
				"transform": "translate(50,50) scale(1) rotate(0 45,37)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/sofa/沙发单人890乘730.png","style":"display:block",width:"89px",height:"73px"}}]
			},
			"sofa_沙发单人900乘870":{
				name:"g",
				itemName:"沙发单人900乘870",
				"item-unique" :"sofa_沙发单人900乘870",
				"width":90,
			    "height":87,
				"transform": "translate(50,50) scale(1) rotate(0 45,44)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/sofa/沙发单人900乘870.png","style":"display:block",width:"90px",height:"87px"}}]
			},
			"sofa_沙发单人980乘940":{
				name:"g",
				itemName:"沙发单人980乘940",
				"item-unique" :"sofa_沙发单人980乘940",
				"width":98,
			    "height":94,
				"transform": "translate(50,50) scale(1) rotate(0 49,47)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/sofa/沙发单人980乘940.png","style":"display:block",width:"98px",height:"94px"}}]
			},
			"sofa_沙发二人1580乘890":{
				name:"g",
				itemName:"沙发二人1580乘890",
				"item-unique" :"sofa_沙发二人1580乘890",
				"width":158,
			    "height":89,
				"transform": "translate(50,50) scale(1) rotate(0 79,45)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/sofa/沙发二人1580乘890.png","style":"display:block",width:"158px",height:"89px"}}]
			},
			"sofa_沙发三人1680乘730":{
				name:"g",
				itemName:"沙发三人1680乘730",
				"item-unique" :"sofa_沙发三人1680乘730",
				"width":168,
			    "height":73,
				"transform": "translate(50,50) scale(1) rotate(0 84,37)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/sofa/沙发三人1680乘730.png","style":"display:block",width:"168px",height:"73px"}}]
			},
			"sofa_沙发三人2080乘890":{
				name:"g",
				itemName:"沙发三人2080乘890",
				"item-unique" :"sofa_沙发三人2080乘890",
				"width":208,
			    "height":89,
				"transform": "translate(50,50) scale(1) rotate(0 104,45)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/sofa/沙发三人2080乘890.png","style":"display:block",width:"208px",height:"89px"}}]
			},
			"sofa_沙发双人1280乘730":{
				name:"g",
				itemName:"沙发双人1280乘730",
				"item-unique" :"sofa_沙发双人1280乘730",
				"width":128,
			    "height":73,
				"transform": "translate(50,50) scale(1) rotate(0 64,37)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/sofa/沙发双人1280乘730.png","style":"display:block",width:"128px",height:"73px"}}]
			},
			"sofa_沙发双人1400乘870":{
				name:"g",
				itemName:"沙发双人1400乘870",
				"item-unique" :"sofa_沙发双人1400乘870",
				"width":140,
			    "height":87,
				"transform": "translate(50,50) scale(1) rotate(0 70,44)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/sofa/沙发双人1400乘870.png","style":"display:block",width:"140px",height:"87px"}}]
			},
			"sofa_沙发双人1480乘940":{
				name:"g",
				itemName:"沙发双人1480乘940",
				"item-unique" :"sofa_沙发双人1480乘940",
				"width":148,
			    "height":94,
				"transform": "translate(50,50) scale(1) rotate(0 74,47)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/sofa/沙发双人1480乘940.png","style":"display:block",width:"148px",height:"94px"}}]
			},
			"sofa_双人沙发1400乘870":{
				name:"g",
				itemName:"双人沙发1400乘870",
				"item-unique" :"sofa_双人沙发1400乘870",
				"width":140,
			    "height":87,
				"transform": "translate(50,50) scale(1) rotate(0 70,44)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/sofa/双人沙发1400乘870.png","style":"display:block",width:"140px",height:"87px"}}]
			},
			"meet_1200乘2600":{
				name:"g",
				itemName:"会议桌1200乘2600",
				"item-unique" :"meet_1200乘2600",
				"width":120,
			    "height":260,
				"transform": "translate(50,50) scale(1) rotate(0 60,130)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/meetdesk/1200x2600_8人会议桌.png","style":"display:block",width:"120px",height:"260px"}}]
			},
			"meet_3800乘1800":{
				name:"g",
				itemName:"会议桌3800乘1800",
				"item-unique" :"meet_3800乘1800",
				"width":380,
			    "height":180,
				"transform": "translate(50,50) scale(1) rotate(0 190,90)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/meetdesk/3800x1800_12人会议桌.png","style":"display:block",width:"380px",height:"180px"}}]
			},
			"meet_会议桌2000乘1000":{
				name:"g",
				itemName:"会议桌2000乘1000",
				"item-unique" :"meet_会议桌2000乘1000",
				"width":200,
			    "height":100,
				"transform": "translate(50,50) scale(1) rotate(0 100,50)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/meetdesk/会议桌2000乘1000.png","style":"display:block",width:"200px",height:"100px"}}]
			},
			"meet_会议桌2200乘1100":{
				name:"g",
				itemName:"会议桌2200乘1100",
				"item-unique" :"meet_会议桌2200乘1100",
				"width":220,
			    "height":110,
				"transform": "translate(50,50) scale(1) rotate(0 110,55)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/meetdesk/会议桌2200乘1100.png","style":"display:block",width:"220px",height:"110px"}}]
			},
			"meet_会议桌2400乘1200":{
				name:"g",
				itemName:"会议桌2400乘1200",
				"item-unique" :"meet_会议桌2400乘1200",
				"width":240,
			    "height":120,
				"transform": "translate(50,50) scale(1) rotate(0 120,60)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/meetdesk/会议桌2400乘1200.png","style":"display:block",width:"240px",height:"120px"}}]
			},
			"meet_会议桌3000乘1200":{
				name:"g",
				itemName:"会议桌3000乘1200",
				"item-unique" :"meet_会议桌3000乘1200",
				"width":300,
			    "height":120,
				"transform": "translate(50,50) scale(1) rotate(0 150,60)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/meetdesk/会议桌3000乘1200.png","style":"display:block",width:"300px",height:"120px"}}]
			},
			"meet_会议桌3800乘1800":{
				name:"g",
				itemName:"会议桌3800乘1800",
				"item-unique" :"meet_会议桌3800乘1800",
				"width":380,
			    "height":180,
				"transform": "translate(50,50) scale(1) rotate(0 190,90)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/meetdesk/会议桌3800乘1800.png","style":"display:block",width:"380px",height:"180px"}}]
			},
			"meet_椭圆会议桌2800乘1200":{
				name:"g",
				itemName:"椭圆会议桌2800乘1200",
				"item-unique" :"meet_椭圆会议桌2800乘1200",
				"width":280,
			    "height":120,
				"transform": "translate(50,50) scale(1) rotate(0 140,60)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/meetdesk/椭圆会议桌2800乘1200.png","style":"display:block",width:"280px",height:"120px"}}]
			},
			"meet_椭圆会议桌3500乘1800":{
				name:"g",
				itemName:"椭圆会议桌3500乘1800",
				"item-unique" :"meet_椭圆会议桌3500乘1800",
				"width":350,
			    "height":180,
				"transform": "translate(50,50) scale(1) rotate(0 175,90)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/meetdesk/椭圆会议桌3500乘1800.png","style":"display:block",width:"350px",height:"180px"}}]
			},
			"meet_圆桌2200乘2200":{
				name:"g",
				itemName:"圆桌2200乘2200",
				"item-unique" :"meet_圆桌2200乘2200",
				"width":220,
			    "height":220,
				"transform": "translate(50,50) scale(1) rotate(0 110,110)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/meetdesk/圆桌2200乘2200.png","style":"display:block",width:"220px",height:"220px"}}]
			},
			"chair_450乘450":{
				name:"g",
				itemName:"椅子450乘450",
				"item-unique" :"chair_450乘450",
				"width":45,
			    "height":45,
				"transform": "translate(50,50) scale(1) rotate(0 23,23)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/chair/450乘450.png","style":"display:block",width:"45px",height:"45px"}}]
			},
			"chair_460乘460":{
				name:"g",
				itemName:"椅子460乘460",
				"item-unique" :"chair_460乘460",
				"width":46,
			    "height":46,
				"transform": "translate(50,50) scale(1) rotate(0 23,23)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/chair/460乘460.png","style":"display:block",width:"46px",height:"46px"}}]
			},
			"chair_460乘470":{
				name:"g",
				itemName:"椅子460乘470",
				"item-unique" :"chair_460乘470",
				"width":46,
			    "height":47,
				"transform": "translate(50,50) scale(1) rotate(0 23,23)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/chair/460乘470.png","style":"display:block",width:"46px",height:"47px"}}]
			},
			"chair_半圆椅660乘640":{
				name:"g",
				itemName:"半圆椅660乘640",
				"item-unique" :"chair_半圆椅660乘640",
				"width":66,
			    "height":64,
				"transform": "translate(50,50) scale(1) rotate(0 33,32)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/chair/半圆椅660乘640.png","style":"display:block",width:"66px",height:"64px"}}]
			},
			"chair_扶手椅500乘460":{
				name:"g",
				itemName:"扶手椅500乘460",
				"item-unique" :"chair_扶手椅500乘460",
				"width":50,
			    "height":46,
				"transform": "translate(50,50) scale(1) rotate(0 25,23)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/chair/扶手椅500乘460.png","style":"display:block",width:"50px",height:"46px"}}]
			},
			"chair_排椅1750乘650":{
				name:"g",
				itemName:"排椅1750乘650",
				"item-unique" :"chair_排椅1750乘650",
				"width":175,
			    "height":65,
				"transform": "translate(50,50) scale(1) rotate(0 88,33)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/chair/排椅1750乘650.png","style":"display:block",width:"175px",height:"65px"}}]
			},
			"chair_培训椅460乘470":{
				name:"g",
				itemName:"培训椅460乘470",
				"item-unique" :"chair_排椅1750乘650",
				"width":46,
			    "height":47,
				"transform": "translate(50,50) scale(1) rotate(0 23,23)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/chair/培训椅460乘470.png","style":"display:block",width:"46px",height:"47px"}}]
			},
			"chair_椅子450乘450":{
				name:"g",
				itemName:"椅子_450乘450",
				"item-unique" :"chair_椅子450乘450",
				"width":45,
			    "height":45,
				"transform": "translate(50,50) scale(1) rotate(0 23,23)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/chair/椅子450乘450.png","style":"display:block",width:"45px",height:"45px"}}]
			},
			"chair_椅子560乘500":{
				name:"g",
				itemName:"椅子_560乘500",
				"item-unique" :"chair_椅子560乘500",
				"width":56,
			    "height":50,
				"transform": "translate(50,50) scale(1) rotate(0 28,25)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/chair/椅子560乘500.png","style":"display:block",width:"56px",height:"50px"}}]
			},
			"chair_圆凳400乘400":{
				name:"g",
				itemName:"圆凳400乘400",
				"item-unique" :"chair_圆凳400乘400",
				"width":40,
			    "height":40,
				"transform": "translate(50,50) scale(1) rotate(0 40,40)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/chair/圆凳400乘400.png","style":"display:block",width:"40px",height:"40px"}}]
			},
			"bed_1500乘2000":{
				name:"g",
				itemName:"床1500乘2000",
				"item-unique" :"bed_1500乘2000",
				"width":150,
			    "height":200,
				"transform": "translate(50,50) scale(1) rotate(0 75,100)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/bed/1500乘2000.png","style":"display:block",width:"150px",height:"200px"}}]
			},
			"bed_1800乘2000":{
				name:"g",
				itemName:"床1800乘2000",
				"item-unique" :"bed_1800乘2000",
				"width":180,
			    "height":200,
				"transform": "translate(50,50) scale(1) rotate(0 90,100)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/bed/1800乘2000.png","style":"display:block",width:"180px",height:"200px"}}]
			},
			"bed_单人床1500乘2000":{
				name:"g",
				itemName:"单人床1500乘2000",
				"item-unique" :"bed_单人床1500乘2000",
				"width":150,
			    "height":200,
				"transform": "translate(50,50) scale(1) rotate(0 75,100)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/bed/单人床1500乘2000.png","style":"display:block",width:"150px",height:"200px"}}]
			},
			"bed_双人床1800乘2000":{
				name:"g",
				itemName:"双人床1800乘2000",
				"item-unique" :"bed_双人床1800乘2000",
				"width":180,
			    "height":200,
				"transform": "translate(50,50) scale(1) rotate(0 90,100)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/bed/双人床1800乘2000.png","style":"display:block",width:"180px",height:"200px"}}]
			},
			"bed_双人床1800乘2100":{
				name:"g",
				itemName:"双人床1800乘2100",
				"item-unique" :"bed_双人床1800乘2100",
				"width":180,
			    "height":210,
				"transform": "translate(50,50) scale(1) rotate(0 90,105)",
				child:[{"name":"image","attrs":{"xmlns:xlink":"http://www.w3.org/1999/xlink","xlink:href":"data/bed/双人床1800乘2100.png","style":"display:block",width:"180px",height:"210px"}}]
			},
		}
	};
	SubSvgList.prototype.getData = function(name,number){
		if(name=="room"){
			return this.roomData(number);
		}
		return this.data[name];
	};
	window['SubSvgList'] = SubSvgList;
})();