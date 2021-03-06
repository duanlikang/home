(function() {
	var SubSvgList = function() {
		var self = this;
		this.roomData = function(number) {
			var room = {
				attrs: {
					id: getUid("subSvg" + number),
					name: "房间",
					transform: "translate(100,100) scale(1) rotate(0 300,250)",
					type: "arbitrary",
					isClose: true,
					uniqueId: "",
				},
				text: ["3.00", "3.00", "3.00", "3.00"],
				subArray: [{
					name: "polygon",
					attrs: {
						id: getUid("subItem" + self.number + "-0"),
						points: "0,0 0,300 300,300 300,0",
						fill: "#f0f0f0",
						"fill-opacity": "1",
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
						stroke: "#000000",
						"stroke-width": "14",
						"stroke-opacity": "1",
						isVertical: "vertical"
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
						"stroke-width": "14",
						"stroke-opacity": "1",
						isVertical: "horizon"
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
						"stroke-width": "14",
						"stroke-opacity": "1",
						isVertical: "vertical"
					}
				}, {
					name: "line",
					attrs: {
						id: getUid("subItem" + self.number + "-4"),
						x1: "300",
						y1: "0",
						x2: "0",
						y2: "0",
						stroke: "#000000",
						"stroke-width": "14",
						"stroke-opacity": "1",
						isVertical: "horizon"
					}
				}, {
					name: "circle",
					attrs: {
						id: getUid("subItem" + self.number + "-5"),
						cx: "0",
						cy: "0",
						r: "7",
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
						r: "7",
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
						r: "7",
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
						r: "7",
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
			door: [{
				name: "开口",
				svg: "door1",
			}, {
				name: "铰链门（左开）",
				svg: "door2",
			}, {
				name: "铰链门（右开）",
				svg: "door5",
			}, {
				name: "双铰链门",
				svg: "door3",
			}, {
				name: "玻璃滑门",
				svg: "door4",
			}],
			windows: [{
				name: "平开窗",
				svg: "window1",
			}, {
				name: "弧形窗",
				svg: "window2",
			}],
			door1: {
				attrs: {
					width: 80,
					height: 14,
					"item-unique": "door1",
				},
				child: [{
					name: "polygon",
					attrs: {
						points: "0,0 80,0 80,14 0,14",
						fill: "#f0f0f0",
						stroke: "#f0f0f0",
						"stroke-width": "2"
					}
				}]
			},
			door2: {
				attrs: {
					width: 80,
					height: 14,
					"item-unique": "door2",
				},
				child: [{
					name: "polygon",
					attrs: {
						points: "0,0 80,0 80,14 0,14",
						fill: "#f0f0f0",
						stroke: "#f0f0f0",
						"stroke-width": "2"
					}
				}, {
					name: "g",
					attrs: {
						transform: "rotate(0 40,7)",
						"data-style": "sub"
					},
					child: [{
						name: "path",
						attrs: {
							d: "M0,14A 90 90, 0, 0, 1, 80 -80L 80 14",
							"stroke-width": "1",
							fill: "#f0f0f0",
							stroke: "rgb(128,128,128)"
						}
					}, {
						name: "polygon",
						attrs: {
							points: "80,-80 80,14",
							"stroke-width": 10,
							fill: "#f0f0f0",
							stroke: "#888",
						}
					}]
				}]
			},
			door3: {
				attrs: {
					width: 160,
					height: 14,
					"item-unique": "door3",
				},
				child: [{
					name: "polygon",
					attrs: {
						points: "0,0 160,0 160,14 0,14",
						fill: "#f0f0f0",
						stroke: "#f0f0f0",
						"stroke-width": "2"
					}
				}, {
					name: "g",
					attrs: {
						transform: "rotate(0 80,7)",
						"data-style": "sub"
					},
					child: [{
						name: "path",
						attrs: {
							d: "M80,14A 90 90, 0, 0, 0, 0 -80L 0 14",
							"stroke-width": "1",
							fill: "#f0f0f0",
							stroke: "rgb(128,128,128)"
						}
					}, {
						name: "polygon",
						attrs: {
							points: "0,-80 0,14",
							"stroke-width": 10,
							fill: "#f0f0f0",
							stroke: "#888",
						}
					}, {
						name: "path",
						attrs: {
							d: "M80,14A 90 90, 0, 0, 1, 160 -80L 160 14",
							"stroke-width": "1",
							fill: "#f0f0f0",
							stroke: "rgb(128,128,128)"
						}
					}, {
						name: "polygon",
						attrs: {
							points: "160,-80 160,14",
							"stroke-width": 10,
							fill: "#f0f0f0",
							stroke: "#888",
						}
					}]
				}]
			},
			door4: {
				attrs: {
					width: 120,
					height: 14,
					"item-unique": "door4",
				},
				child: [{
					name: "polygon",
					attrs: {
						points: "0,0 120,0 120,14 0,14",
						fill: "#f0f0f0",
						stroke: "#f0f0f0",
						"stroke-width": "2"
					}
				}, {
					name: "g",
					attrs: {
						transform: "rotate(0 60,7)",
						"data-style": "sub"
					},
					child: [{
						name: "polygon",
						attrs: {
							points: "-1,4 59,4",
							stroke: "blue",
							"stroke-width": 4
						}
					}, {
						name: "polygon",
						attrs: {
							points: "5,4 55,4",
							stroke: "black",
							"stroke-width": 4
						}
					}, {
						name: "polygon",
						attrs: {
							points: "61,8 121,8",
							stroke: "blue",
							"stroke-width": 4
						}
					}, {
						name: "polygon",
						attrs: {
							points: "65,8 115,8",
							stroke: "black",
							"stroke-width": 4
						}
					}]
				}]
			},
			door5: {

				attrs: {
					width: 80,
					height: 14,
					"item-unique": "door5",
				},
				child: [{
					name: "polygon",
					attrs: {
						points: "0,0 80,0 80,14 0,14",
						fill: "#f0f0f0",
						stroke: "#f0f0f0",
						"stroke-width": "2"
					}
				}, {
					name: "g",
					attrs: {
						transform: "rotate(0 40,7)",
						"data-style": "sub"
					},
					child: [{
						name: "path",
						attrs: {
							d: "M80,14A 90 90, 0, 0, 0, 0 -80L 0 14",
							"stroke-width": "1",
							fill: "#f0f0f0",
							stroke: "rgb(128,128,128)"
						}
					}, {
						name: "polygon",
						attrs: {
							points: "0,-80 0,14",
							"stroke-width": 10,
							fill: "#f0f0f0",
							stroke: "#888",
						}
					}]
				}]
			},
			window1: {
				attrs: {
					width: 100,
					height: 14,
					"item-unique": "window1",
				},
				child: [{
					name: "polygon",
					attrs: {
						points: "0,0 100,0 100,14 0,14",
						fill: "#f0f0f0",
						stroke: "blue",
						"stroke-width": 2
					}
				}, {
					name: "polygon",
					attrs: {
						points: "0,7 100,7",
						fill: "#f0f0f0",
						stroke: "blue",
						"stroke-width": 2
					}
				}, {
					name: "g",
					attrs: {
						transform: "rotate(0 100,7)",
						"data-style": "sub"
					},
					child: [],
				}]
			},
			window2: {
				attrs: {
					width: 200,
					height: 14,
					"item-unique": "window2",
				},
				child: [{
					name: "g",
					attrs: {
						transform: "rotate(0 100,7)",
						"data-style": "sub"
					},
					child: [{
						name: "polygon",
						attrs: {
							points: "0,0 200,0 200,14 0,14",
							fill: "#f0f0f0",
							stroke: "#f0f0f0",
							"stroke-width": "2"
						}
					}, {
						name: "path",
						attrs: {
							d: "M0 10 C60 -30 140 -30 200 10",
							fill: "#f0f0f0",
							stroke: "blue",
							"stroke-width": 4
						}
					}, {
						name: "polygon",
						attrs: {
							points: "0,0 5,0 5,14 0,14",
							fill: "#f0f0f0",
							stroke: "#000",
							"stroke-width": "2"
						}
					}, {
						name: "polygon",
						attrs: {
							points: "195,0 200,0 200,14 195,14",
							fill: "#f0f0f0",
							stroke: "#000",
							"stroke-width": "2"
						}
					}]
				}]

			},
			wall: [{
				name: "1000x160",
				icon: "",
				svg: "wall_1000x160"
			}, {
				name: "160x1000",
				icon: "",
				svg: "wall_160x1000"
			}, {
				name: "3000x160",
				icon: "",
				svg: "wall_3000x160"
			}, {
				name: "160x3000",
				icon: "",
				svg: "wall_160x3000"
			}],
			hotel: [{
				name: "半圆椅660x640",
				icon: "data/icon/hotel/半圆椅660x640a.png",
				svg: "hotel_半圆椅660x640",
			}, {
				name: "圆凳400x400",
				icon: "data/icon/hotel/圆凳400x400a.png",
				svg: "hotel_圆凳400x400",
			}, {
				name: "450x450",
				icon: "data/icon/hotel/450x450a.png",
				svg: "hotel_450x450",
			}, {
				name: "椅子560x500",
				icon: "data/icon/hotel/椅子560x500a.png",
				svg: "hotel_椅子560x500",
			}, {
				name: "1200x2000",
				icon: "data/icon/hotel/1200x2000a.png",
				svg: "hotel_1200x2000",
			}, {
				name: "1800x2000",
				icon: "data/icon/hotel/1800x2000a.png",
				svg: "hotel_1800x2000",
			}, {
				name: "床头柜500x420",
				icon: "data/icon/hotel/床头柜500x420a.png",
				svg: "hotel_床头柜500x420",
			}, {
				name: "单人床1500x2000",
				icon: "data/icon/hotel/单人床1500x2000a.png",
				svg: "hotel_单人床1500x2000",
			}, {
				name: "双人床1800x2000",
				icon: "data/icon/hotel/双人床1800x2000a.png",
				svg: "hotel_双人床1800x2000",
			}],
			wallcolumn: [{
				name: "圆柱400x400",
				icon: "",
				svg: "wallcolumn_圆柱400x400"
			}, {
				name: "方柱400x400",
				icon: "",
				svg: "wallcolumn_方柱400x400"
			}, ],
			chair: [{
				name: "班椅750x750",
				icon: "data/icon/chair/班椅750x750a.png",
				svg: "chair_班椅750x750",
			}, {
				name: "椅子550x500",
				icon: "data/icon/chair/椅子550x500a.png",
				svg: "chair_椅子550x500",
			}, {
				name: "椅子560x550",
				icon: "data/icon/chair/椅子560x550a.png",
				svg: "chair_椅子560x550",
			}, {
				name: "椅子600x570",
				icon: "data/icon/chair/椅子600x570a.png",
				svg: "chair_椅子600x570",
			}, {
				name: "椅子610x600",
				icon: "data/icon/chair/椅子610x600a.png",
				svg: "chair_椅子610x600",
			}, {
				name: "椅子620x580",
				icon: "data/icon/chair/椅子620x580a.png",
				svg: "chair_椅子620x580",
			}, {
				name: "椅子620x600",
				icon: "data/icon/chair/椅子620x600a.png",
				svg: "chair_椅子620x600",
			}, {
				name: "椅子630x620",
				icon: "data/icon/chair/椅子630x620a.png",
				svg: "chair_椅子630x620",
			}, {
				name: "椅子650x650",
				icon: "data/icon/chair/椅子650x650a.png",
				svg: "chair_椅子650x650",
			}, {
				name: "半圆椅660x640",
				icon: "data/icon/chair/半圆椅660x640a.png",
				svg: "chair_半圆椅660x640",
			}, {
				name: "圆凳400x400",
				icon: "data/icon/chair/圆凳400x400a.png",
				svg: "chair_圆凳400x400",
			}, {
				name: "培训椅460x500",
				icon: "data/icon/chair/培训椅460x500a.png",
				svg: "chair_培训椅460x500",
			}, {
				name: "扶手椅500x460",
				icon: "data/icon/chair/扶手椅500x460a.png",
				svg: "chair_扶手椅500x460",
			}, {
				name: "排椅1750x650",
				icon: "data/icon/chair/排椅1750x650a.png",
				svg: "chair_排椅1750x650",
			}, {
				name: "椅子450x450",
				icon: "data/icon/chair/椅子450x450a.png",
				svg: "chair_椅子450x450",
			}, {
				name: "椅子560x500",
				icon: "data/icon/chair/椅子560x500a.png",
				svg: "chair_椅子560x500",
			}, {
				name: "450x450",
				icon: "data/icon/chair/450x450a.png",
				svg: "chair_450x450",
			}, {
				name: "460x460",
				icon: "data/icon/chair/460x460a.png",
				svg: "chair_460x460",
			}, {
				name: "460x560",
				icon: "data/icon/chair/460x560a.png",
				svg: "chair_460x560",
			}, ],
			deskitem: [{
				name: "打印机415x375",
				icon: "data/icon/deskitem/打印机415x375a.png",
				svg: "deskitem_打印机415x375"
			}, {
				name: "打印机570x398",
				icon: "data/icon/deskitem/打印机570x398a.png",
				svg: "deskitem_打印机570x398"
			}, {
				name: "电话160x190",
				icon: "data/icon/deskitem/电话160x190a.png",
				svg: "deskitem_电话160x190"
			}, {
				name: "笔记本电脑325x220",
				icon: "data/icon/deskitem/笔记本电脑325x220a.png",
				svg: "deskitem_笔记本电脑325x220"
			}, {
				name: "花200x200",
				icon: "data/icon/deskitem/花200x200a.png",
				svg: "deskitem_花200x200"
			}, {
				name: "花210x210",
				icon: "data/icon/deskitem/花210x210a.png",
				svg: "deskitem_花210x210"
			}, {
				name: "花300x110",
				icon: "data/icon/deskitem/花300x110a.png",
				svg: "deskitem_花300x110"
			}, {
				name: "花400x400",
				icon: "data/icon/deskitem/花400x400a.png",
				svg: "deskitem_花400x400"
			}, {
				name: "530x150",
				icon: "data/icon/deskitem/530x150a.png",
				svg: "deskitem_530x150"
			}, ],
			frontdesk: [{
				name: "前台2400x900",
				icon: "data/icon/frontdesk/前台2400x900a.png",
				svg: "frontdesk_前台2400x900"
			}, {
				name: "前台2600x900",
				icon: "data/icon/frontdesk/前台2600x900a.png",
				svg: "frontdesk_前台2600x900"
			}, {
				name: "前台2600x1800",
				icon: "data/icon/frontdesk/前台2600x1800a.png",
				svg: "frontdesk_前台2600x1800"
			}, {
				name: "前台2800x900",
				icon: "data/icon/frontdesk/前台2800x900a.png",
				svg: "frontdesk_前台2800x900"
			}, {
				name: "前台3000x900",
				icon: "data/icon/frontdesk/前台3000x900a.png",
				svg: "frontdesk_前台3000x900"
			}, ],
			meetdesk: [
			{
				name: "会议桌4500x1800",
				icon: "data/icon/meetdesk/会议桌4500x1800a.png",
				svg: "meetdesk_会议桌4500x1800",
			},
			{
				name: "会议桌4800x1800",
				icon: "data/icon/meetdesk/会议桌4800x1800a.png",
				svg: "meetdesk_会议桌4800x1800",
			},
			{
				name: "会议桌5000x2000",
				icon: "data/icon/meetdesk/会议桌5000x2000a.png",
				svg: "meetdesk_会议桌5000x2000",
			},
			{
				name: "主席台1600x600",
				icon: "data/icon/meetdesk/主席台1600x600a.png",
				svg: "meetdesk_主席台1600x600",
			},
			{
				name: "主席台2100x720",
				icon: "data/icon/meetdesk/主席台2100x720a.png",
				svg: "meetdesk_主席台2100x720",
			},
			{
				name: "会议桌5000x2000",
				icon: "data/icon/meetdesk/会议桌5000x2000a.png",
				svg: "meetdesk_会议桌5000x2000",
			},
			{
				name: "条桌1200x40",
				icon: "data/icon/meetdesk/条桌1200x40a.png",
				svg: "meetdesk_条桌1200x40",
			}, {
				name: "会议桌2200x1100",
				icon: "data/icon/meetdesk/会议桌2200x1100a.png",
				svg: "meetdesk_会议桌2200x1100",
			}, {
				name: "会议桌2400x1200",
				icon: "data/icon/meetdesk/会议桌2400x1200a.png",
				svg: "meetdesk_会议桌2400x1200",
			}, {
				name: "会议桌2800x1200",
				icon: "data/icon/meetdesk/会议桌2800x1200a.png",
				svg: "meetdesk_会议桌2800x1200",
			}, {
				name: "会议桌3000x1200",
				icon: "data/icon/meetdesk/会议桌3000x1200a.png",
				svg: "meetdesk_会议桌3000x1200",
			}, {
				name: "会议桌3800x1800",
				icon: "data/icon/meetdesk/会议桌3800x1800a.png",
				svg: "meetdesk_会议桌3800x1800",
			}, {
				name: "会议台2800x1200",
				icon: "data/icon/meetdesk/会议台2800x1200a.png",
				svg: "meetdesk_会议台2800x1200",
			}, {
				name: "会议台3200x1200",
				icon: "data/icon/meetdesk/会议台3200x1800a.png",
				svg: "meetdesk_会议台3200x1200",
			}, {
				name: "会议桌2400x1200",
				icon: "data/icon/meetdesk/会议桌2400x1200a.png",
				svg: "meetdesk_会议桌2400x1200",
			}, {
				name: "会议桌2800x1400",
				icon: "data/icon/meetdesk/会议桌2800x1400a.png",
				svg: "meetdesk_会议桌2800x1400",
			}, {
				name: "会议桌3600x1390",
				icon: "data/icon/meetdesk/会议桌3600x1390a.png",
				svg: "meetdesk_会议桌3600x1390",
			}, {
				name: "洽谈桌800x800",
				icon: "data/icon/meetdesk/洽谈桌800x800a.png",
				svg: "meetdesk_洽谈桌800x800",
			}, {
				name: "会议桌5600x1800",
				icon: "data/icon/meetdesk/会议桌5600x1800a.png",
				svg: "meetdesk_会议桌5600x1800",
			}, {
				name: "圆桌2200x2200",
				icon: "data/icon/meetdesk/圆桌2200x2200a.png",
				svg: "meetdesk_圆桌2200x2200",
			}, {
				name: "圆桌1800x1800",
				icon: "data/icon/meetdesk/圆桌1800x1800a.png",
				svg: "meetdesk_圆桌1800x1800"
			}, {
				name: "椭圆会议桌3500x1800",
				icon: "data/icon/meetdesk/椭圆会议桌3500x1800a.png",
				svg: "meetdesk_椭圆会议桌3500x1800",
			}, {
				name: "2200x1400 8人",
				icon: "data/icon/meetdesk/2200x1400 8人a.png",
				svg: "meetdesk_2200x1400 8人",
			}, {
				name: "2600x1200 8人会议桌",
				icon: "data/icon/meetdesk/2600x1200 8人会议桌a.png",
				svg: "meetdesk_2600x1200 8人会议桌",
			}, {
				name: "3200x2000 12人",
				icon: "data/icon/meetdesk/3200x2000 12人a.png",
				svg: "meetdesk_3200x2000 12人",
			}, {
				name: "3800x1800 12人会议桌",
				icon: "data/icon/meetdesk/3800x1800 12人会议桌a.png",
				svg: "meetdesk_3800x1800 12人会议桌",
			}, ],
			other: [{
					name: "便池428x545",
					icon: "data/icon/other/便池428x545a.png",
					svg: "other_便池428x545"
				},

				{
					name: "洗衣机",
					icon: "data/icon/other/洗衣机a.png",
					svg: "other_洗衣机"
				}, {
					name: "马桶",
					icon: "data/icon/other/马桶a.png",
					svg: "other_马桶"
				},
			],
			sofa: [{
				name: "三人沙发1680x730",
				icon: "data/icon/sofa/三人沙发1680x730a.png",
				svg: "sofa_三人沙发1680x730",
			}, {
				name: "三人沙发1980x870",
				icon: "data/icon/sofa/三人沙发1980x870a.png",
				svg: "sofa_三人沙发1980x870",
			}, {
				name: "单人沙发840x730",
				icon: "data/icon/sofa/单人沙发840x730a.png",
				svg: "sofa_单人沙发840x730",
			}, {
				name: "单人沙发980x870",
				icon: "data/icon/sofa/单人沙发980x870a.png",
				svg: "sofa_单人沙发980x870",
			}, {
				name: "双人沙发1400x870",
				icon: "data/icon/sofa/双人沙发1400x870a.png",
				svg: "sofa_双人沙发1400x870",
			}, {
				name: "沙发三人1680x730",
				icon: "data/icon/sofa/沙发三人1680x730a.png",
				svg: "sofa_沙发三人1680x730",
			}, {
				name: "沙发三人2080x890",
				icon: "data/icon/sofa/沙发三人2080x890a.png",
				svg: "sofa_沙发三人2080x890",
			}, {
				name: "沙发二人1580x890",
				icon: "data/icon/sofa/沙发二人1580x890a.png",
				svg: "sofa_沙发二人1580x890",
			}, {
				name: "沙发单人1080x890",
				icon: "data/icon/sofa/沙发单人1080x890a.png",
				svg: "sofa_沙发单人1080x890",
			}, {
				name: "沙发单人890x850",
				icon: "data/icon/sofa/沙发单人890x850a.png",
				svg: "sofa_沙发单人890x850",
			}, {
				name: "沙发单人900x870",
				icon: "data/icon/sofa/沙发单人900x870a.png",
				svg: "sofa_沙发单人900x870",
			}, {
				name: "沙发单人980x940",
				icon: "data/icon/sofa/沙发单人980x940a.png",
				svg: "sofa_沙发单人980x940",
			}, {
				name: "沙发双人1280x730",
				icon: "data/icon/sofa/沙发双人1280x730a.png",
				svg: "sofa_沙发双人1280x730",
			}, {
				name: "沙发双人1480x940",
				icon: "data/icon/sofa/沙发双人1480x940a.png",
				svg: "sofa_沙发双人1480x940",
			}, {
				name: "沙发双人1800x870",
				icon: "data/icon/sofa/沙发双人1800x870a.png",
				svg: "sofa_沙发双人1800x870",
			}, {
				name: "沙发二人1580x890",
				icon: "",
				svg: "sofa_沙发二人1580x890",
			}, {
				name: "1000x900",
				icon: "data/icon/sofa/1000x9000a.png",
				svg: "sofa_1000x900",
			}, {
				name: "890x730",
				icon: "data/icon/sofa/890x730a.png",
				svg: "sofa_890x730",
			}, {
				name: "900x1500",
				icon: "data/icon/sofa/900x1500a.png",
				svg: "sofa_900x1500",
			}, {
				name: "方茶几600x600",
				icon: "data/icon/sofa/方茶几600x600a.png",
				svg: "sofa_方茶几600x600"
			}, {
				name: "长茶几1200x600",
				icon: "",
				svg: "sofa_长茶几1200x600"
			}, ],
			workdesk: [{
				name: "行政桌1600x1800",
				icon: "data/icon/workdesk/行政桌1600x1800.png",
				svg: "workdesk_行政桌1600x1800",
			}, {
				name: "行政桌1880x1800",
				icon: "data/icon/workdesk/行政桌1880x1800.png",
				svg: "workdesk_行政桌1880x1800",
			}, {
				name: "办公桌1400x700",
				icon: "data/icon/workdesk/办公桌1400x700a.png",
				svg: "workdesk_办公桌1400x700",
			}, {
				name: "办公桌1800x1480",
				icon: "data/icon/workdesk/办公桌1800x1480a.png",
				svg: "workdesk_办公桌1800x1480",
			}, {
				name: "办公桌2000x2100",
				icon: "data/icon/workdesk/办公桌2000x2100a.png",
				svg: "workdesk_办公桌2000x2100",
			}, {
				name: "办公桌2200x2000",
				icon: "data/icon/workdesk/办公桌2200x2000a.png",
				svg: "workdesk_办公桌2200x2000",
			}, {
				name: "办公桌2400x2200",
				icon: "data/icon/workdesk/办公桌2400x2200a.png",
				svg: "workdesk_办公桌2400x2200",
			}, {
				name: "班台2800x2600",
				icon: "data/icon/workdesk/班台2800x2600a.png",
				svg: "workdesk_班台2800x2600",
			}, {
				name: "班台2800x2000",
				icon: "data/icon/workdesk/班台2800x2000a.png",
				svg: "workdesk_班台2800x2000",
			}, {
				name: "班台2800x2300",
				icon: "data/icon/workdesk/班台2800x2300a.png",
				svg: "workdesk_班台2800x2300",
			}, {
				name: "班台3200x2650",
				icon: "data/icon/workdesk/班台3200x2650a.png",
				svg: "workdesk_班台3200x2650",
			}, {
				name: "班台3200x3200",
				icon: "data/icon/workdesk/班台3200x3200a.png",
				svg: "workdesk_班台3200x3200",
			}, {
				name: "2000x2100",
				icon: "data/icon/workdesk/2000x2100a.png",
				svg: "workdesk_2000x2100",
			}, ],
			workstation: [
			{
				name: "工位1400x1600",
				icon: "data/icon/workstation/工位1400x1600a.png",
				svg: "workstation_工位1400x1600"
			}
			,{
				name: "工位1200x1400",
				icon: "data/icon/workstation/工位1200x1400a.png",
				svg: "workstation_工位1200x1400"
			}
			,{
				name: "工位1200x1220",
				icon: "data/icon/workstation/工位1200x1220a.png",
				svg: "workstation_工位1200x1220"
			}, {
				name: "工位1400x1200",
				icon: "data/icon/workstation/工位1400x1200a.png",
				svg: "workstation_工位1400x1200"
			}, {
				name: "工位2400x1400",
				icon: "data/icon/workstation/工位2400x1400a.png",
				svg: "workstation_工位2400x1400"
			}, {
				name: "工位1500x600",
				icon: "data/icon/workstation/工位1500x600a.png",
				svg: "workstation_工位1500x600"
			}, {
				name: "工位1780x1600",
				icon: "data/icon/workstation/工位1780x1600a.png",
				svg: "workstation_工位1780x1600"
			}, {
				name: "工位1400x1400",
				icon: "data/icon/workstation/工位1400x1400a.png",
				svg: "workstation_工位1400x1400"
			}, {
				name: "工位3000x1530",
				icon: "data/icon/workstation/工位3000x1530a.png",
				svg: "workstation_工位3000x1530"
			}, {
				name: "工位3080x1600",
				icon: "data/icon/workstation/工位3080x1600a.png",
				svg: "workstation_工位3080x1600"
			}, {
				name: "工作位1200x600",
				icon: "data/icon/workstation/工作位1200x600a.png",
				svg: "workstation_工作位1200x600"
			}, {
				name: "工作位2810x1200",
				icon: "data/icon/workstation/工作位2810x1200a.png",
				svg: "workstation_工作位2810x1200"
			}, {
				name: "屏风1240x1220",
				icon: "data/icon/workstation/屏风1240x1220a.png",
				svg: "workstation_屏风1240x1220"
			}, {
				name: "屏风1420x1440",
				icon: "data/icon/workstation/屏风1420x1440a.png",
				svg: "workstation_屏风1420x1440"
			}, {
				name: "屏风1440x1420",
				icon: "data/icon/workstation/屏风1440x1420a.png",
				svg: "workstation_屏风1440x1420"
			}, {
				name: "屏风1840x1240",
				icon: "data/icon/workstation/屏风1840x1240a.png",
				svg: "workstation_屏风1840x1240"
			}, {
				name: "屏风2880x1420",
				icon: "data/icon/workstation/屏风2880x1420a.png",
				svg: "workstation_屏风2880x1420"
			}, {
				name: "屏风3080x3040",
				icon: "data/icon/workstation/屏风3080x3040a.png",
				svg: "workstation_屏风3080x3040"
			}, {
				name: "屏风3680x1500",
				icon: "data/icon/workstation/屏风3680x1500a.png",
				svg: "workstation_屏风3680x1500"
			}, {
				name: "工位2700x2500",
				icon: "data/icon/workstation/工位2700x2500a.png",
				svg: "workstation_工位2700x2500"
			}, {
				name: "工位2800x2800",
				icon: "data/icon/workstation/工位2800x2800a.png",
				svg: "workstation_工位2800x2800"
			}, {
				name: "工作位1400x1400",
				icon: "data/icon/workstation/工作位1400x1400a.png",
				svg: "workstation_工作位1400x1400"
			}, {
				name: "1400x1400",
				icon: "data/icon/workstation/1400x1400a.png",
				svg: "workstation_1400x1400"
			}, ],
			cupboard: [{
				name: "柜子1800x450",
				icon: "data/icon/cupboard/柜子1800x450a.png",
				svg: "cupboard_柜子1800x450"
			}, {
				name: "文件柜800x400",
				icon: "data/icon/cupboard/文件柜800x400a.png",
				svg: "cupboard_文件柜800x400"
			}, {
				name: "文件柜900x400",
				icon: "data/icon/cupboard/文件柜900x400a.png",
				svg: "cupboard_文件柜900x400"
			}, {
				name: "文件柜1200x400",
				icon: "data/icon/cupboard/文件柜1200x400a.png",
				svg: "cupboard_文件柜1200x400"
			}, {
				name: "文件柜2400x400",
				icon: "data/icon/cupboard/文件柜2400x400a.png",
				svg: "cupboard_文件柜2400x400"
			}, {
				name: "文件柜3200x400",
				icon: "data/icon/cupboard/文件柜3200x400a.png",
				svg: "cupboard_文件柜3200x400"
			}, ],
			other: [{
				name: "便池428x545",
				icon: "data/icon/other/便池428x545a.png",
				svg: "other_便池428x545"
			}, {
				name: "马桶",
				icon: "data/icon/other/马桶a.png",
				svg: "other_马桶"
			}, {
				name: "洗衣机",
				icon: "data/icon/other/洗衣机a.png",
				svg: "other_洗衣机"
			}, ],
			"wall_1000x160": {
				name: "g",
				itemName: "1000x160",
				"item-unique": "wall_1000x160",
				"isArbitrary": true,
				"width": 100,
				"height": 16,
				"transform": "translate(50,50) scale(1,1) rotate(0 50,8)",
				child: [{
					"name": "line",
					"attrs": {
						"x1": 0,
						"y1": 8,
						"x2": 100,
						"y2": 8,
						stroke: "black",
						"stroke-width": 16
					}
				}]
			},
			"wall_160x1000": {
				name: "g",
				itemName: "160x1000",
				"item-unique": "wall_160x1000",
				"isArbitrary": true,
				"isVertical": true,
				"width": 16,
				"height": 100,
				"transform": "translate(50,50) scale(1,1) rotate(0 8,50)",
				child: [{
					"name": "line",
					"attrs": {
						"x1": 8,
						"y1": 0,
						"x2": 8,
						"y2": 100,
						stroke: "black",
						"stroke-width": 16
					}
				}]
			},
			"wall_3000x160": {
				name: "g",
				itemName: "3000x160",
				"item-unique": "wall_3000x160",
				"isArbitrary": true,
				"width": 300,
				"height": 16,
				"transform": "translate(50,50) scale(1) rotate(0 150,8)",
				child: [{
					"name": "line",
					"attrs": {
						"x1": 0,
						"y1": 8,
						"x2": 300,
						"y2": 8,
						stroke: "black",
						"stroke-width": 16
					}
				}]
			},
			"wall_160x3000": {
				name: "g",
				itemName: "160x3000",
				"item-unique": "wall_160x3000",
				"isArbitrary": true,
				"isVertical": true,
				"width": 16,
				"height": 300,
				"transform": "translate(50,50) scale(1) rotate(0 8,150)",
				child: [{
					"name": "line",
					"attrs": {
						"x1": 8,
						"y1": 0,
						"x2": 8,
						"y2": 300,
						stroke: "black",
						"stroke-width": 16
					}
				}]
			},
			"hotel_单人床1500x2000": {
				name: "g",
				itemName: "单人床1500x2000",
				"item-unique": "hotel_单人床1500x2000",
				"width": 150,
				"height": 200,
				"transform": "translate(50,50) scale(1) rotate(0 75,100)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/hotel/单人床1500x2000.png",
						width: "150px",
						height: "200px"
					}
				}]
			},
			"hotel_双人床1800x2000": {
				name: "g",
				itemName: "双人床1800x2000",
				"item-unique": "hotel_双人床1800x2000",
				"width": 180,
				"height": 200,
				"transform": "translate(50,50) scale(1) rotate(0 90,100)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/hotel/双人床1800x2000.png",
						width: "180px",
						height: "200px"
					}
				}]
			},
			"hotel_床头柜500x420": {
				name: "g",
				itemName: "床头柜500x420",
				"item-unique": "hotel_床头柜500x420",
				"width": 50,
				"height": 42,
				"transform": "translate(50,50) scale(1) rotate(0 25,21)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/hotel/床头柜500x420.png",
						width: "50px",
						height: "42px"
					}
				}]
			},
			"hotel_1200x2000": {
				name: "g",
				itemName: "1200x2000",
				"item-unique": "hotel_1200x2000",
				"width": 120,
				"height": 200,
				"transform": "translate(50,50) scale(1) rotate(0 60,100)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/hotel/1200x2000.png",
						width: "120px",
						height: "200px"
					}
				}]
			},
			"hotel_1800x2000": {
				name: "g",
				itemName: "1800x2000",
				"item-unique": "hotel_1800x2000",
				"width": 180,
				"height": 200,
				"transform": "translate(50,50) scale(1) rotate(0 90,100)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/hotel/1800x2000.png",
						width: "180px",
						height: "200px"
					}
				}]
			},
			"hotel_半圆椅660x640": {
				name: "g",
				itemName: "半圆椅660x640",
				"item-unique": "hotel_半圆椅660x640",
				"width": 66,
				"height": 64,
				"transform": "translate(50,50) scale(1) rotate(0 33,32)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/hotel/半圆椅660x640.png",
						width: "66px",
						height: "64px"
					}
				}]
			},
			"hotel_圆凳400x400": {
				name: "g",
				itemName: "圆凳400x400",
				"item-unique": "hotel_圆凳400x400",
				"width": 40,
				"height": 40,
				"transform": "translate(50,50) scale(1) rotate(0 40,40)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/hotel/圆凳400x400.png",
						width: "40px",
						height: "40px"
					}
				}]
			},
			"hotel_椅子560x500": {
				name: "g",
				itemName: "椅子560x500",
				"item-unique": "hotel_椅子560x500",
				"width": 56,
				"height": 50,
				"transform": "translate(50,50) scale(1) rotate(0 28,25)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/hotel/椅子560x500.png",
						width: "56px",
						height: "50px"
					}
				}]
			},
			"hotel_450x450": {
				name: "g",
				itemName: "450x450",
				"item-unique": "hotel_450x450",
				"width": 45,
				"height": 45,
				"transform": "translate(50,50) scale(1) rotate(0 23,23)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/hotel/450x450.png",
						width: "45px",
						height: "45px"
					}
				}]
			},
			"hotel_餐桌1100x1400": {
				name: "g",
				itemName: "餐桌1100x1400",
				"item-unique": "hotel_餐桌1100x1400",
				"width": 110,
				"height": 140,
				"transform": "translate(50,50) scale(1) rotate(0 110,140)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/hotel/餐桌1100x1400.png",
						width: "110px",
						height: "140px"
					}
				}]
			},
			"hotel_餐桌1600x1500": {
				name: "g",
				itemName: "餐桌1600x1500",
				"item-unique": "hotel_餐桌1600x1500",
				"width": 160,
				"height": 150,
				"transform": "translate(50,50) scale(1) rotate(0 160,150)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/hotel/餐桌1600x1500.png",
						width: "160px",
						height: "150px"
					}
				}]
			},
			"hotel_衣柜1100x450": {
				name: "g",
				itemName: "衣柜1100x450",
				"item-unique": "hotel_衣柜1100x450",
				"width": 110,
				"height": 45,
				"transform": "translate(50,50) scale(1) rotate(0 55,23)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/hotel/衣柜1100x450.png",
						width: "110px",
						height: "45px"
					}
				}]
			},
			"chair_班椅750x750": {
				name: "g",
				itemName: "班椅750x750",
				"item-unique": "chair_班椅750x750",
				"width": 75,
				"height": 75,
				"transform": "translate(50,50) scale(1) rotate(0 38,38)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/chair/班椅750x750.png",
						width: "75px",
						height: "75px"
					}
				}]
			},
			"chair_椅子550x500": {
				name: "g",
				itemName: "椅子550x500",
				"item-unique": "chair_椅子550x500",
				"width": 55,
				"height": 50,
				"transform": "translate(50,50) scale(1) rotate(0 28,25)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/chair/椅子550x500.png",
						width: "55px",
						height: "50px"
					}
				}]
			},
			"chair_椅子560x550": {
				name: "g",
				itemName: "椅子560x550",
				"item-unique": "chair_椅子560x550",
				"width": 56,
				"height": 55,
				"transform": "translate(50,50) scale(1) rotate(0 28,28)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/chair/椅子560x550.png",
						width: "56px",
						height: "55px"
					}
				}]
			},
			"chair_椅子600x570": {
				name: "g",
				itemName: "椅子600x570",
				"item-unique": "chair_椅子600x570",
				"width": 60,
				"height": 57,
				"transform": "translate(50,50) scale(1) rotate(0 30,29)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/chair/椅子600x570.png",
						width: "60px",
						height: "57px"
					}
				}]
			},
			"chair_椅子610x600": {
				name: "g",
				itemName: "椅子610x600",
				"item-unique": "chair_椅子610x600",
				"width": 61,
				"height": 60,
				"transform": "translate(50,50) scale(1) rotate(0 31,30)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/chair/椅子610x600.png",
						width: "61px",
						height: "60px"
					}
				}]
			},
			"chair_椅子620x580": {
				name: "g",
				itemName: "椅子620x580",
				"item-unique": "chair_椅子620x580",
				"width": 62,
				"height": 58,
				"transform": "translate(50,50) scale(1) rotate(0 31,29)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/chair/椅子620x580.png",
						width: "62px",
						height: "58px"
					}
				}]
			},
			"chair_椅子620x600": {
				name: "g",
				itemName: "椅子620x600",
				"item-unique": "chair_椅子620x600",
				"width": 62,
				"height": 60,
				"transform": "translate(50,50) scale(1) rotate(0 31,30)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/chair/椅子620x600.png",
						width: "62px",
						height: "60px"
					}
				}]
			},
			"chair_椅子630x620": {
				name: "g",
				itemName: "椅子630x620",
				"item-unique": "chair_椅子630x620",
				"width": 63,
				"height": 62,
				"transform": "translate(50,50) scale(1) rotate(0 32,31)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/chair/椅子630x620.png",
						width: "63px",
						height: "62px"
					}
				}]
			},
			"chair_椅子650x650": {
				name: "g",
				itemName: "椅子650x650",
				"item-unique": "chair_椅子650x650",
				"width": 65,
				"height": 65,
				"transform": "translate(50,50) scale(1) rotate(0 33,33)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/chair/椅子650x650.png",
						width: "65px",
						height: "65px"
					}
				}]
			},
			"chair_半圆椅660x640": {
				name: "g",
				itemName: "半圆椅660x640",
				"item-unique": "chair_半圆椅660x640",
				"width": 66,
				"height": 64,
				"transform": "translate(50,50) scale(1) rotate(0 33,32)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/chair/半圆椅660x640.png",
						width: "66px",
						height: "64px"
					}
				}]
			},
			"chair_圆凳400x400": {
				name: "g",
				itemName: "圆凳400x400",
				"item-unique": "chair_圆凳400x400",
				"width": 40,
				"height": 40,
				"transform": "translate(50,50) scale(1) rotate(0 40,40)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/chair/圆凳400x400.png",
						width: "40px",
						height: "40px"
					}
				}]
			},
			"chair_培训椅460x500": {
				name: "g",
				itemName: "培训椅460x500",
				"item-unique": "chair_培训椅460x500",
				"width": 46,
				"height": 50,
				"transform": "translate(50,50) scale(1) rotate(0 23,25)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/chair/培训椅460x500.png",
						width: "46px",
						height: "50px"
					}
				}]
			},
			"chair_扶手椅500x460": {
				name: "g",
				itemName: "扶手椅500x460",
				"item-unique": "chair_扶手椅500x460",
				"width": 50,
				"height": 46,
				"transform": "translate(50,50) scale(1) rotate(0 25,23)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/chair/扶手椅500x460.png",
						width: "50px",
						height: "46px"
					}
				}]
			},
			"chair_排椅1750x650": {
				name: "g",
				itemName: "排椅1750x650",
				"item-unique": "chair_排椅1750x650",
				"width": 175,
				"height": 65,
				"transform": "translate(50,50) scale(1) rotate(0 88,33)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/chair/排椅1750x650.png",
						width: "175px",
						height: "65px"
					}
				}]
			},
			"chair_椅子450x450": {
				name: "g",
				itemName: "椅子450x450",
				"item-unique": "chair_椅子450x450",
				"width": 45,
				"height": 45,
				"transform": "translate(50,50) scale(1) rotate(0 23,23)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/chair/椅子450x450.png",
						width: "45px",
						height: "45px"
					}
				}]
			},
			"chair_椅子560x500": {
				name: "g",
				itemName: "椅子560x500",
				"item-unique": "chair_椅子560x500",
				"width": 56,
				"height": 50,
				"transform": "translate(50,50) scale(1) rotate(0 28,25)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/chair/椅子560x500.png",
						width: "56px",
						height: "50px"
					}
				}]
			},
			"chair_450x450": {
				name: "g",
				itemName: "450x450",
				"item-unique": "chair_450x450",
				"width": 45,
				"height": 45,
				"transform": "translate(50,50) scale(1) rotate(0 23,23)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/chair/450x450.png",
						width: "45px",
						height: "45px"
					}
				}]
			},
			"chair_460x460": {
				name: "g",
				itemName: "460x460",
				"item-unique": "chair_460x460",
				"width": 46,
				"height": 46,
				"transform": "translate(50,50) scale(1) rotate(0 23,23)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/chair/460x460.png",
						width: "46px",
						height: "46px"
					}
				}]
			},
			"chair_460x560": {
				name: "g",
				itemName: "460x560",
				"item-unique": "chair_460x560",
				"width": 46,
				"height": 56,
				"transform": "translate(50,50) scale(1) rotate(0 23,28)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/chair/460x560.png",
						width: "46px",
						height: "56px"
					}
				}]
			},
			"deskitem_打印机415x375": {
				name: "g",
				itemName: "打印机415x375",
				"item-unique": "deskitem_打印机415x375",
				"width": 42,
				"height": 38,
				"transform": "translate(50,50) scale(1) rotate(0 21,19)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/deskitem/打印机415x375.png",
						width: "42px",
						height: "38px"
					}
				}]
			},
			"deskitem_打印机570x398": {
				name: "g",
				itemName: "打印机570x398",
				"item-unique": "deskitem_打印机570x398",
				"width": 57,
				"height": 40,
				"transform": "translate(50,50) scale(1) rotate(0 29,20)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/deskitem/打印机570x398.png",
						width: "57px",
						height: "40px"
					}
				}]
			},
			"deskitem_电话160x190": {
				name: "g",
				itemName: "电话160x190",
				"item-unique": "deskitem_电话160x190",
				"width": 16,
				"height": 19,
				"transform": "translate(50,50) scale(1) rotate(0 8,10)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/deskitem/电话160x190.png",
						width: "16px",
						height: "20px"
					}
				}]
			},
			"deskitem_笔记本电脑325x220": {
				name: "g",
				itemName: "笔记本电脑325x220",
				"item-unique": "deskitem_笔记本电脑325x220",
				"width": 33,
				"height": 22,
				"transform": "translate(50,50) scale(1) rotate(0 17,11)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/deskitem/笔记本电脑325x220.png",
						width: "33px",
						height: "22px"
					}
				}]
			},
			"deskitem_花200x200": {
				name: "g",
				itemName: "花200x200",
				"item-unique": "deskitem_花200x200",
				"width": 20,
				"height": 20,
				"transform": "translate(50,50) scale(1) rotate(0 10,10)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/deskitem/花200x200.png",
						width: "20px",
						height: "20px"
					}
				}]
			},
			"deskitem_花210x210": {
				name: "g",
				itemName: "花210x210",
				"item-unique": "deskitem_花210x210",
				"width": 21,
				"height": 21,
				"transform": "translate(50,50) scale(1) rotate(0 11,11)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/deskitem/花210x210.png",
						width: "21px",
						height: "21px"
					}
				}]
			},
			"deskitem_花300x110": {
				name: "g",
				itemName: "花300x110",
				"item-unique": "deskitem_花300x110",
				"width": 30,
				"height": 11,
				"transform": "translate(50,50) scale(1) rotate(0 15,6)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/deskitem/花300x110.png",
						width: "30px",
						height: "11px"
					}
				}]
			},
			"deskitem_花400x400": {
				name: "g",
				itemName: "花400x400",
				"item-unique": "deskitem_花400x400",
				"width": 40,
				"height": 40,
				"transform": "translate(50,50) scale(1) rotate(0 20,20)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/deskitem/花400x400.png",
						width: "40px",
						height: "40px"
					}
				}]
			},
			"deskitem_530x150": {
				name: "g",
				itemName: "530x150",
				"item-unique": "deskitem_530x150",
				"width": 53,
				"height": 15,
				"transform": "translate(50,50) scale(1) rotate(0 27,8)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/deskitem/530x150.png",
						width: "53px",
						height: "15px"
					}
				}]
			},
			"frontdesk_前台2400x900": {
				name: "g",
				itemName: "前台2400x900",
				"item-unique": "frontdesk_前台2400x900",
				"width": 240,
				"height": 90,
				"transform": "translate(50,50) scale(1) rotate(0 120,45)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/frontdesk/前台2400x900.png",
						width: "240px",
						height: "90px"
					}
				}]
			},
			"frontdesk_前台2600x900": {
				name: "g",
				itemName: "前台2600x900",
				"item-unique": "frontdesk_前台2600x900",
				"width": 260,
				"height": 90,
				"transform": "translate(50,50) scale(1) rotate(0 130,45)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/frontdesk/前台2600x900.png",
						width: "260px",
						height: "90px"
					}
				}]
			},
			"frontdesk_前台2600x1800": {
				name: "g",
				itemName: "前台2600x1800",
				"item-unique": "frontdesk_前台2600x1800",
				"width": 260,
				"height": 180,
				"transform": "translate(50,50) scale(1) rotate(0 130,90)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/frontdesk/前台2600x1800.png",
						width: "260px",
						height: "180px"
					}
				}]
			},
			"frontdesk_前台2800x900": {
				name: "g",
				itemName: "前台2800x900",
				"item-unique": "frontdesk_前台2800x900",
				"width": 280,
				"height": 90,
				"transform": "translate(50,50) scale(1) rotate(0 140,45)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/frontdesk/前台2800x900.png",
						width: "280px",
						height: "90px"
					}
				}]
			},
			"frontdesk_前台3000x900": {
				name: "g",
				itemName: "前台3000x900",
				"item-unique": "frontdesk_前台3000x900",
				"width": 300,
				"height": 90,
				"transform": "translate(50,50) scale(1) rotate(0 150,45)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/frontdesk/前台3000x900.png",
						width: "300px",
						height: "90px"
					}
				}]
			},
			"meetdesk_条桌1380x460": {
				name: "g",
				itemName: "条桌1380x460",
				"item-unique": "meetdesk_条桌1380x460",
				"width": 138,
				"height": 46,
				"transform": "translate(50,50) scale(1) rotate(0 69,23)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/meetdesk/条桌1380x460.png",
						width: "138px",
						height: "46px"
					}
				}]
			},
			"meetdesk_会议桌4500x1800": {
				name: "g",
				itemName: "会议桌4500x1800",
				"item-unique": "meetdesk_会议桌4500x1800",
				"width": 450,
				"height": 180,
				"transform": "translate(50,50) scale(1) rotate(0 225,90)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/meetdesk/会议桌4500x1800.png",
						width: "450px",
						height: "180px"
					}
				}]
			},
			"meetdesk_会议桌4800x1800": {
				name: "g",
				itemName: "会议桌4800x1800",
				"item-unique": "meetdesk_会议桌4800x1800",
				"width": 480,
				"height": 180,
				"transform": "translate(50,50) scale(1) rotate(0 240,90)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/meetdesk/会议桌4800x1800.png",
						width: "480px",
						height: "180px"
					}
				}]
			},
			"meetdesk_会议桌5000x2000": {
				name: "g",
				itemName: "会议桌5000x2000",
				"item-unique": "meetdesk_会议桌5000x2000",
				"width": 500,
				"height": 200,
				"transform": "translate(50,50) scale(1) rotate(0 250,100)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/meetdesk/会议桌5000x2000.png",
						width: "500px",
						height: "200px"
					}
				}]
			},
			"meetdesk_主席台1600x600": {
				name: "g",
				itemName: "主席台1600x600",
				"item-unique": "meetdesk_主席台1600x600",
				"width": 160,
				"height": 60,
				"transform": "translate(50,50) scale(1) rotate(0 80,30)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/meetdesk/主席台1600x600.png",
						width: "160px",
						height: "60px"
					}
				}]
			},
			"meetdesk_主席台2100x720": {
				name: "g",
				itemName: "主席台2100x720",
				"item-unique": "meetdesk_主席台2100x720",
				"width": 210,
				"height": 72,
				"transform": "translate(50,50) scale(1) rotate(0 105,36)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/meetdesk/主席台2100x720.png",
						width: "210px",
						height: "72px"
					}
				}]
			},			
			"meetdesk_条桌1200x40": {
				name: "g",
				itemName: "条桌1200x40",
				"item-unique": "meetdesk_条桌1200x40",
				"width": 120,
				"height": 40,
				"transform": "translate(50,50) scale(1) rotate(0 60,20)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/meetdesk/条桌1200x40.png",
						width: "120px",
						height: "40px"
					}
				}]
			},
			"meetdesk_会议桌2200x1100": {
				name: "g",
				itemName: "会议桌2200x1100",
				"item-unique": "meetdesk_会议桌2200x1100",
				"width": 220,
				"height": 110,
				"transform": "translate(50,50) scale(1) rotate(0 110,55)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/meetdesk/会议桌2200x1100.png",
						width: "220px",
						height: "110px"
					}
				}]
			},
			"meetdesk_会议桌2400x1200": {
				name: "g",
				itemName: "会议桌2400x1200",
				"item-unique": "meetdesk_会议桌2400x1200",
				"width": 240,
				"height": 120,
				"transform": "translate(50,50) scale(1) rotate(0 120,60)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/meetdesk/会议桌2400x1200.png",
						width: "240px",
						height: "120px"
					}
				}]
			},
			"meetdesk_会议桌2800x1200": {
				name: "g",
				itemName: "会议桌2800x1200",
				"item-unique": "meetdesk_会议桌2800x1200",
				"width": 280,
				"height": 120,
				"transform": "translate(50,50) scale(1) rotate(0 140,60)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/meetdesk/会议桌2800x1200.png",
						width: "280px",
						height: "120px"
					}
				}]
			},
			"meetdesk_会议桌2800x1400": {
				name: "g",
				itemName: "会议桌2800x1400",
				"item-unique": "meetdesk_会议桌2800x1400",
				"width": 280,
				"height": 140,
				"transform": "translate(50,50) scale(1) rotate(0 140,70)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/meetdesk/会议桌2800x1400.png",
						width: "280px",
						height: "140px"
					}
				}]
			},
			"meetdesk_会议桌3600x1390": {
				name: "g",
				itemName: "会议桌3600x1390",
				"item-unique": "meetdesk_会议桌3600x1390",
				"width": 360,
				"height": 140,
				"transform": "translate(50,50) scale(1) rotate(0 180,70)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/meetdesk/会议桌3600x1390.png",
						width: "360px",
						height: "140px"
					}
				}]
			},
			"meetdesk_会议桌5600x1800": {
				name: "g",
				itemName: "会议桌5600x1800",
				"item-unique": "meetdesk_会议桌5600x1800",
				"width": 560,
				"height": 180,
				"transform": "translate(50,50) scale(1) rotate(0 280,90)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/meetdesk/会议桌5600x1800.png",
						width: "560px",
						height: "180px"
					}
				}]
			},
			"meetdesk_洽谈桌800x800": {
				name: "g",
				itemName: "洽谈桌800x800",
				"item-unique": "meetdesk_洽谈桌800x800",
				"width": 80,
				"height": 80,
				"transform": "translate(50,50) scale(1) rotate(0 40,40)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/meetdesk/洽谈桌800x800.png",
						width: "80px",
						height: "80px"
					}
				}]
			},
			"meetdesk_会议桌3000x1200": {
				name: "g",
				itemName: "会议桌3000x1200",
				"item-unique": "meetdesk_会议桌3000x1200",
				"width": 300,
				"height": 120,
				"transform": "translate(50,50) scale(1) rotate(0 150,60)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/meetdesk/会议桌3000x1200.png",
						width: "300px",
						height: "120px"
					}
				}]
			},
			"meetdesk_会议桌3800x1800": {
				name: "g",
				itemName: "会议桌3800x1800",
				"item-unique": "meetdesk_会议桌3800x1800",
				"width": 380,
				"height": 180,
				"transform": "translate(50,50) scale(1) rotate(0 190,90)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/meetdesk/会议桌3800x1800.png",
						width: "380px",
						height: "180px"
					}
				}]
			},
			"meetdesk_会议台2800x1200": {
				name: "g",
				itemName: "会议台2800x1200",
				"item-unique": "meetdesk_会议台2800x1200",
				"width": 280,
				"height": 120,
				"transform": "translate(50,50) scale(1) rotate(0 140,60)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/meetdesk/会议台2800x1200.png",
						width: "280px",
						height: "120px"
					}
				}]
			},
			"meetdesk_会议台3200x1200": {
				name: "g",
				itemName: "会议台3200x1200",
				"item-unique": "meetdesk_会议台3200x1200",
				"width": 320,
				"height": 120,
				"transform": "translate(50,50) scale(1) rotate(0 160,60)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/meetdesk/会议台3200x1200.png",
						width: "320px",
						height: "120px"
					}
				}]
			},

			"meetdesk_圆桌2200x2200": {
				name: "g",
				itemName: "圆桌2200x2200",
				"item-unique": "meetdesk_圆桌2200x2200",
				"width": 220,
				"height": 220,
				"transform": "translate(50,50) scale(1) rotate(0 110,110)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/meetdesk/圆桌2200x2200.png",
						width: "220px",
						height: "220px"
					}
				}]
			},
			"meetdesk_圆桌1800x1800": {
				name: "g",
				itemName: "圆桌1800x1800",
				"item-unique": "meetdesk_圆桌1800x1800",
				"width": 180,
				"height": 180,
				"transform": "translate(50,50) scale(1) rotate(0 90,90)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/meetdesk/圆桌1800x1800.png",
						width: "180px",
						height: "180px"
					}
				}]
			},
			"meetdesk_椭圆会议桌3500x1800": {
				name: "g",
				itemName: "椭圆会议桌3500x1800",
				"item-unique": "meetdesk_椭圆会议桌3500x1800",
				"width": 350,
				"height": 180,
				"transform": "translate(50,50) scale(1) rotate(0 175,90)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/meetdesk/椭圆会议桌3500x1800.png",
						width: "350px",
						height: "180px"
					}
				}]
			},
			"meetdesk_2200x1400 8人": {
				name: "g",
				itemName: "2200x1400 8人",
				"item-unique": "meetdesk_2200x1400 8人",
				"width": 220,
				"height": 140,
				"transform": "translate(50,50) scale(1) rotate(0 110,70)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/meetdesk/2200x1400 8人.png",
						width: "220px",
						height: "140px"
					}
				}]
			},
			"meetdesk_2600x1200 8人会议桌": {
				name: "g",
				itemName: "2600x1200 8人会议桌",
				"item-unique": "meetdesk_2600x1200 8人会议桌",
				"width": 260,
				"height": 120,
				"transform": "translate(50,50) scale(1) rotate(0 130,60)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/meetdesk/2600x1200 8人会议桌.png",
						width: "260px",
						height: "120px"
					}
				}]
			},
			"meetdesk_3200x2000 12人": {
				name: "g",
				itemName: "3200x2000 12人",
				"item-unique": "meetdesk_3200x2000 12人",
				"width": 320,
				"height": 200,
				"transform": "translate(50,50) scale(1) rotate(0 160,100)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/meetdesk/3200x2000 12人.png",
						width: "320px",
						height: "200px"
					}
				}]
			},
			"meetdesk_3800x1800 12人会议桌": {
				name: "g",
				itemName: "3800x1800 12人会议桌",
				"item-unique": "meetdesk_3800x1800 12人会议桌",
				"width": 380,
				"height": 180,
				"transform": "translate(50,50) scale(1) rotate(0 190,90)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/meetdesk/3800x1800 12人会议桌.png",
						width: "380px",
						height: "180px"
					}
				}]
			},
			"wallcolumn_方柱400x400": {
				name: "g",
				itemName: "方柱400x400",
				"item-unique": "wallcolumn_方柱400x400",
				"width": 40,
				"height": 40,
				"transform": "translate(50,50) scale(1) rotate(0 20,20)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/wallcolumn/方柱400x400.png",
						width: "40px",
						height: "40px"
					}
				}]
			},
			"wallcolumn_圆柱400x400": {
				name: "g",
				itemName: "圆柱400x400",
				"item-unique": "wallcolumn_圆柱400x400",
				"width": 40,
				"height": 40,
				"transform": "translate(50,50) scale(1) rotate(0 20,20)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/wallcolumn/圆柱400x400.png",
						width: "40px",
						height: "40px"
					}
				}]
			},

			"other_便池428x545": {
				name: "g",
				itemName: "便池428x545",
				"item-unique": "other_便池428x545",
				"width": 43,
				"height": 55,
				"transform": "translate(50,50) scale(1) rotate(0 22,28)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/other/便池428x545.png",
						width: "43px",
						height: "55px"
					}
				}]
			},

			"other_洗衣机": {
				name: "g",
				itemName: "洗衣机",
				"item-unique": "other_洗衣机",
				"width": 52,
				"height": 55,
				"transform": "translate(50,50) scale(1) rotate(0 26,28)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/other/洗衣机.png",
						width: "52px",
						height: "55px"
					}
				}]
			},

			"other_马桶": {
				name: "g",
				itemName: "马桶",
				"item-unique": "other_马桶",
				"width": 63,
				"height": 88,
				"transform": "translate(50,50) scale(1) rotate(0 32,44)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/other/马桶.png",
						width: "63px",
						height: "88px"
					}
				}]
			},
			"sofa_方茶几600x600": {
				name: "g",
				itemName: "方茶几600x600",
				"item-unique": "sofa_方茶几600x600",
				"width": 60,
				"height": 60,
				"transform": "translate(50,50) scale(1) rotate(0 30,30)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/sofa/方茶几600x600.png",
						width: "60px",
						height: "60px"
					}
				}]
			},
			"sofa_长茶几1200x600": {
				name: "g",
				itemName: "长茶几1200x600",
				"item-unique": "sofa_长茶几1200x600",
				"width": 120,
				"height": 60,
				"transform": "translate(50,50) scale(1) rotate(0 60,30)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/sofa/长茶几1200x600.png",
						width: "120px",
						height: "60px"
					}
				}]
			},
			"sofa_三人沙发1680x730": {
				name: "g",
				itemName: "三人沙发1680x730",
				"item-unique": "sofa_三人沙发1680x730",
				"width": 168,
				"height": 73,
				"transform": "translate(50,50) scale(1) rotate(0 84,37)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/sofa/三人沙发1680x730.png",
						width: "168px",
						height: "73px"
					}
				}]
			},
			"sofa_三人沙发1980x870": {
				name: "g",
				itemName: "三人沙发1980x870",
				"item-unique": "sofa_三人沙发1980x870",
				"width": 198,
				"height": 87,
				"transform": "translate(50,50) scale(1) rotate(0 99,44)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/sofa/三人沙发1980x870.png",
						width: "198px",
						height: "87px"
					}
				}]
			},
			"sofa_单人沙发840x730": {
				name: "g",
				itemName: "单人沙发840x730",
				"item-unique": "sofa_单人沙发840x730",
				"width": 84,
				"height": 73,
				"transform": "translate(50,50) scale(1) rotate(0 42,37)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/sofa/单人沙发840x730.png",
						width: "84px",
						height: "73px"
					}
				}]
			},
			"sofa_单人沙发980x870": {
				name: "g",
				itemName: "单人沙发980x870",
				"item-unique": "sofa_单人沙发980x870",
				"width": 98,
				"height": 87,
				"transform": "translate(50,50) scale(1) rotate(0 98,44)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/sofa/单人沙发980x870.png",
						width: "98px",
						height: "87px"
					}
				}]
			},
			"sofa_双人沙发1400x870": {
				name: "g",
				itemName: "双人沙发1400x870",
				"item-unique": "sofa_双人沙发1400x870",
				"width": 140,
				"height": 87,
				"transform": "translate(50,50) scale(1) rotate(0 70,44)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/sofa/双人沙发1400x870.png",
						width: "140px",
						height: "87px"
					}
				}]
			},
			"sofa_沙发三人1680x730": {
				name: "g",
				itemName: "沙发三人1680x730",
				"item-unique": "sofa_沙发三人1680x730",
				"width": 168,
				"height": 73,
				"transform": "translate(50,50) scale(1) rotate(0 84,37)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/sofa/沙发三人1680x730.png",
						width: "168px",
						height: "73px"
					}
				}]
			},
			"sofa_沙发三人2080x890": {
				name: "g",
				itemName: "沙发三人2080x890",
				"item-unique": "sofa_沙发三人2080x890",
				"width": 208,
				"height": 89,
				"transform": "translate(50,50) scale(1) rotate(0 104,45)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/sofa/沙发三人2080x890.png",
						width: "208px",
						height: "89px"
					}
				}]
			},
			"sofa_沙发二人1580x890": {
				name: "g",
				itemName: "沙发二人1580x890",
				"item-unique": "sofa_沙发二人1580x890",
				"width": 158,
				"height": 89,
				"transform": "translate(50,50) scale(1) rotate(0 79,45)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/sofa/沙发二人1580x890.png",
						width: "158px",
						height: "89px"
					}
				}]
			},
			"sofa_沙发单人1080x890": {
				name: "g",
				itemName: "沙发单人1080x890",
				"item-unique": "sofa_沙发单人1080x890",
				"width": 108,
				"height": 89,
				"transform": "translate(50,50) scale(1) rotate(0 54,45)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/sofa/沙发单人1080x890.png",
						width: "108px",
						height: "89px"
					}
				}]
			},
			"sofa_沙发单人890x850": {
				name: "g",
				itemName: "沙发单人890x850",
				"item-unique": "sofa_沙发单人890x850",
				"width": 89,
				"height": 85,
				"transform": "translate(50,50) scale(1) rotate(0 45,43)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/sofa/沙发单人890x850.png",
						width: "89px",
						height: "85px"
					}
				}]
			},
			"sofa_沙发单人900x870": {
				name: "g",
				itemName: "沙发单人900x870",
				"item-unique": "sofa_沙发单人900x870",
				"width": 90,
				"height": 87,
				"transform": "translate(50,50) scale(1) rotate(0 45,44)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/sofa/沙发单人900x870.png",
						width: "90px",
						height: "87px"
					}
				}]
			},
			"sofa_沙发单人980x940": {
				name: "g",
				itemName: "沙发单人980x940",
				"item-unique": "sofa_沙发单人980x940",
				"width": 98,
				"height": 94,
				"transform": "translate(50,50) scale(1) rotate(0 49,47)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/sofa/沙发单人980x940.png",
						width: "98px",
						height: "94px"
					}
				}]
			},
			"sofa_沙发双人1280x730": {
				name: "g",
				itemName: "沙发双人1280x730",
				"item-unique": "sofa_沙发双人1280x730",
				"width": 128,
				"height": 73,
				"transform": "translate(50,50) scale(1) rotate(0 64,37)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/sofa/沙发双人1280x730.png",
						width: "128px",
						height: "73px"
					}
				}]
			},
			"sofa_沙发双人1480x940": {
				name: "g",
				itemName: "沙发双人1480x940",
				"item-unique": "sofa_沙发双人1480x940",
				"width": 148,
				"height": 94,
				"transform": "translate(50,50) scale(1) rotate(0 74,47)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/sofa/沙发双人1480x940.png",
						width: "148px",
						height: "94px"
					}
				}]
			},
			"sofa_沙发双人1800x870": {
				name: "g",
				itemName: "沙发双人1800x870",
				"item-unique": "sofa_沙发双人1800x870",
				"width": 180,
				"height": 87,
				"transform": "translate(50,50) scale(1) rotate(0 90,44)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/sofa/沙发双人1800x870.png",
						width: "180px",
						height: "87px"
					}
				}]
			},
			"sofa_1000x900": {
				name: "g",
				itemName: "1000x900",
				"item-unique": "sofa_1000x900",
				"width": 100,
				"height": 90,
				"transform": "translate(50,50) scale(1) rotate(0 50,45)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/sofa/1000x900.png",
						width: "100px",
						height: "90px"
					}
				}]
			},
			"sofa_890x730": {
				name: "g",
				itemName: "890x730",
				"item-unique": "sofa_890x730",
				"width": 89,
				"height": 73,
				"transform": "translate(50,50) scale(1) rotate(0 45,37)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/sofa/890x730.png",
						width: "89px",
						height: "73px"
					}
				}]
			},
			"sofa_900x1500": {
				name: "g",
				itemName: "900x1500",
				"item-unique": "sofa_900x1500",
				"width": 90,
				"height": 150,
				"transform": "translate(50,50) scale(1) rotate(0 45,75)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/sofa/900x1500.png",
						width: "90px",
						height: "150px"
					}
				}]
			},
			"workdesk_行政桌1600x1800": {
				name: "g",
				itemName: "行政桌1600x1800",
				"item-unique": "workdesk_行政桌1600x1800",
				"width": 160,
				"height": 180,
				"transform": "translate(50,50) scale(1) rotate(0 80,90)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workdesk/行政桌1600x1800.png",
						width: "160px",
						height: "180px"
					}
				}]
			},
			"workdesk_行政桌1880x1800": {
				name: "g",
				itemName: "行政桌1880x1800",
				"item-unique": "workdesk_行政桌1880x1800",
				"width": 188,
				"height": 180,
				"transform": "translate(50,50) scale(1) rotate(0 94,90)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workdesk/行政桌1880x1800.png",
						width: "188px",
						height: "180px"
					}
				}]
			},
			"workdesk_办公桌1400x700": {
				name: "g",
				itemName: "办公桌1400x700",
				"item-unique": "workdesk_办公桌1400x700",
				"width": 140,
				"height": 70,
				"transform": "translate(50,50) scale(1) rotate(0 70,35)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workdesk/办公桌1400x700.png",
						width: "140px",
						height: "70px"
					}
				}]
			},
			"workdesk_办公桌1800x1480": {
				name: "g",
				itemName: "办公桌1800x1480",
				"item-unique": "workdesk_办公桌1800x1480",
				"width": 180,
				"height": 148,
				"transform": "translate(50,50) scale(1) rotate(0 90,74)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workdesk/办公桌1800x1480.png",
						width: "180px",
						height: "148px"
					}
				}]
			},
			"workdesk_办公桌2000x2100": {
				name: "g",
				itemName: "办公桌2000x2100",
				"item-unique": "workdesk_办公桌2000x2100",
				"width": 200,
				"height": 210,
				"transform": "translate(50,50) scale(1) rotate(0 100,105)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workdesk/办公桌2000x2100.png",
						width: "200px",
						height: "210px"
					}
				}]
			},
			"workdesk_办公桌2200x2000": {
				name: "g",
				itemName: "办公桌2200x2000",
				"item-unique": "workdesk_办公桌2200x2000",
				"width": 220,
				"height": 200,
				"transform": "translate(50,50) scale(1) rotate(0 110,100)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workdesk/办公桌2200x2000.png",
						width: "220px",
						height: "200px"
					}
				}]
			},
			"workdesk_办公桌2400x2200": {
				name: "g",
				itemName: "办公桌2400x2200",
				"item-unique": "workdesk_办公桌2400x2200",
				"width": 240,
				"height": 220,
				"transform": "translate(50,50) scale(1) rotate(0 120,110)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workdesk/办公桌2400x2200.png",
						width: "240px",
						height: "220px"
					}
				}]
			},
			"workdesk_班台2800x2000": {
				name: "g",
				itemName: "班台2800x2000",
				"item-unique": "workdesk_班台2800x2000",
				"width": 280,
				"height": 200,
				"transform": "translate(50,50) scale(1) rotate(0 140,100)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workdesk/班台2800x2000.png",
						width: "280px",
						height: "200px"
					}
				}]
			},
			"workdesk_班台2800x2300": {
				name: "g",
				itemName: "班台2800x2300",
				"item-unique": "workdesk_班台2800x2300",
				"width": 280,
				"height": 230,
				"transform": "translate(50,50) scale(1) rotate(0 140,115)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workdesk/班台2800x2300.png",
						width: "280px",
						height: "230px"
					}
				}]
			},
			"workdesk_班台2800x2600": {
				name: "g",
				itemName: "班台2800x2600",
				"item-unique": "workdesk_班台2800x2600",
				"width": 280,
				"height": 260,
				"transform": "translate(50,50) scale(1) rotate(0 140,130)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workdesk/班台2800x2600.png",
						width: "280px",
						height: "260px"
					}
				}]
			},
			"workdesk_班台2800x2600": {
				name: "g",
				itemName: "班台2800x2600",
				"item-unique": "workdesk_班台2800x2600",
				"width": 280,
				"height": 260,
				"transform": "translate(50,50) scale(1) rotate(0 140,130)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workdesk/班台2800x2600.png",
						width: "280px",
						height: "260px"
					}
				}]
			},
			"workdesk_班台3200x2650": {
				name: "g",
				itemName: "班台3200x2650",
				"item-unique": "workdesk_班台3200x2650",
				"width": 320,
				"height": 265,
				"transform": "translate(50,50) scale(1) rotate(0 160,133)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workdesk/班台3200x2650.png",
						width: "320px",
						height: "265px"
					}
				}]
			},
			"workdesk_班台3200x3200": {
				name: "g",
				itemName: "班台3200x3200",
				"item-unique": "workdesk_班台3200x3200",
				"width": 320,
				"height": 320,
				"transform": "translate(50,50) scale(1) rotate(0 160,160)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workdesk/班台3200x3200.png",
						width: "320px",
						height: "320px"
					}
				}]
			},
			"workdesk_2000x2100": {
				name: "g",
				itemName: "2000x2100",
				"item-unique": "workdesk_2000x2100",
				"width": 200,
				"height": 210,
				"transform": "translate(50,50) scale(1) rotate(0 100,105)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workdesk/2000x2100.png",
						width: "200px",
						height: "210px"
					}
				}]
			},
			"workstation_工位1400x1600": {
				name: "g",
				itemName: "工位1400x1600",
				"item-unique": "workstation_工位1400x1600",
				"width": 140,
				"height": 160,
				"transform": "translate(50,50) scale(1) rotate(0 70,80)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workstation/工位1400x1600.png",
						width: "140px",
						height: "160px"
					}
				}]
			},
			"workstation_工位1200x1400": {
				name: "g",
				itemName: "工位1200x1400",
				"item-unique": "workstation_工位1200x1400",
				"width": 120,
				"height": 140,
				"transform": "translate(50,50) scale(1) rotate(0 60,70)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workstation/工位1200x1400.png",
						width: "120px",
						height: "140px"
					}
				}]
			},
			"workstation_工位1400x1200": {
				name: "g",
				itemName: "工位1400x1200",
				"item-unique": "workstation_工位1400x1200",
				"width": 140,
				"height": 120,
				"transform": "translate(50,50) scale(1) rotate(0 70,60)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workstation/工位1400x1200.png",
						width: "140px",
						height: "120px"
					}
				}]
			},
			"workstation_工位2400x1400": {
				name: "g",
				itemName: "工位2400x1400",
				"item-unique": "workstation_工位2400x1400",
				"width": 240,
				"height": 140,
				"transform": "translate(50,50) scale(1) rotate(0 120,70)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workstation/工位2400x1400.png",
						width: "240px",
						height: "140px"
					}
				}]
			},
			"workstation_工位1780x600": {
				name: "g",
				itemName: "工位1780x600",
				"item-unique": "workstation_工位1780x600",
				"width": 178,
				"height": 60,
				"transform": "translate(50,50) scale(1) rotate(0 89,30)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workstation/工位1780x600.png",
						width: "178px",
						height: "60px"
					}
				}]
			},
			"workstation_工位3000x1530": {
				name: "g",
				itemName: "工位3000x1530",
				"item-unique": "workstation_工位3000x1530",
				"width": 300,
				"height": 153,
				"transform": "translate(50,50) scale(1) rotate(0 150,77)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workstation/工位3000x1530.png",
						width: "300px",
						height: "153px"
					}
				}]
			},
			"workstation_工位3080x1600": {
				name: "g",
				itemName: "工位3080x1600",
				"item-unique": "workstation_工位3080x1600",
				"width": 308,
				"height": 160,
				"transform": "translate(50,50) scale(1) rotate(0 154,80)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workstation/工位3080x1600.png",
						width: "308px",
						height: "160px"
					}
				}]
			},
			"workstation_工作位1200x600": {
				name: "g",
				itemName: "工作位1200x600",
				"item-unique": "workstation_工作位1200x600",
				"width": 120,
				"height": 60,
				"transform": "translate(50,50) scale(1) rotate(0 60,30)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workstation/工作位1200x600.png",
						width: "120px",
						height: "60px"
					}
				}]
			},
			"workstation_屏风1240x1220": {
				name: "g",
				itemName: "屏风1240x1220",
				"item-unique": "workstation_屏风1240x1220",
				"width": 124,
				"height": 122,
				"transform": "translate(50,50) scale(1) rotate(0 62,61)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workstation/屏风1240x1220.png",
						width: "124px",
						height: "122px"
					}
				}]
			},
			"workstation_屏风1420x1440": {
				name: "g",
				itemName: "屏风1420x1440",
				"item-unique": "workstation_屏风1420x1440",
				"width": 142,
				"height": 144,
				"transform": "translate(50,50) scale(1) rotate(0 71,72)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workstation/屏风1420x1440.png",
						width: "142px",
						height: "144px"
					}
				}]
			},
			"workstation_屏风1440x1420": {
				name: "g",
				itemName: "屏风1440x1420",
				"item-unique": "workstation_屏风1440x1420",
				"width": 144,
				"height": 142,
				"transform": "translate(50,50) scale(1) rotate(0 72,71)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workstation/屏风1440x1420.png",
						width: "144px",
						height: "142px"
					}
				}]
			},
			"workstation_屏风1840x1240": {
				name: "g",
				itemName: "屏风1840x1240",
				"item-unique": "workstation_屏风1840x1240",
				"width": 184,
				"height": 124,
				"transform": "translate(50,50) scale(1) rotate(0 92,62)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workstation/屏风1840x1240.png",
						width: "184px",
						height: "124px"
					}
				}]
			},
			"workstation_屏风2880x1420": {
				name: "g",
				itemName: "屏风2880x1420",
				"item-unique": "workstation_屏风2880x1420",
				"width": 288,
				"height": 142,
				"transform": "translate(50,50) scale(1) rotate(0 144,71)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workstation/屏风2880x1420.png",
						width: "288px",
						height: "142px"
					}
				}]
			},
			"workstation_屏风3080x3040": {
				name: "g",
				itemName: "屏风3080x3040",
				"item-unique": "workstation_屏风3080x3040",
				"width": 308,
				"height": 304,
				"transform": "translate(50,50) scale(1) rotate(0 154,152)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workstation/屏风3080x3040.png",
						width: "308px",
						height: "304px"
					}
				}]
			},
			"workstation_屏风3680x1500": {
				name: "g",
				itemName: "屏风3680x1500",
				"item-unique": "workstation_屏风3680x1500",
				"width": 368,
				"height": 150,
				"transform": "translate(50,50) scale(1) rotate(0 184,75)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workstation/屏风3680x1500.png",
						width: "368px",
						height: "150px"
					}
				}]
			},
			"workstation_工作位2810x1200": {
				name: "g",
				itemName: "工作位2810x1200",
				"item-unique": "workstation_工作位2810x1200",
				"width": 281,
				"height": 120,
				"transform": "translate(50,50) scale(1) rotate(0 141,60)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workstation/工作位2810x1200.png",
						width: "281px",
						height: "120px"
					}
				}]
			},
			"workstation_工位1500x600": {
				name: "g",
				itemName: "工位1500x600",
				"item-unique": "workstation_工位1500x600",
				"width": 150,
				"height": 60,
				"transform": "translate(50,50) scale(1) rotate(0 75,30)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workstation/工位1500x600.png",
						width: "150px",
						height: "60px"
					}
				}]
			},
			"workstation_工位1200x1220": {
				name: "g",
				itemName: "工位1200x1220",
				"item-unique": "workstation_工位1200x1220",
				"width": 120,
				"height": 122,
				"transform": "translate(50,50) scale(1) rotate(0 60,61)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workstation/工位1200x1220.png",
						width: "120px",
						height: "122px"
					}
				}]
			},
			"workstation_工位1780x1600": {
				name: "g",
				itemName: "工位1780x1600",
				"item-unique": "workstation_工位1780x1600",
				"width": 178,
				"height": 160,
				"transform": "translate(50,50) scale(1) rotate(0 89,80)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workstation/工位1780x1600.png",
						width: "178px",
						height: "160px"
					}
				}]
			},
			"workstation_工位1400x1400": {
				name: "g",
				itemName: "工位1400x1400",
				"item-unique": "workstation_工位1400x1400",
				"width": 140,
				"height": 140,
				"transform": "translate(50,50) scale(1) rotate(0 70,70)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workstation/工位1400x1400.png",
						width: "140px",
						height: "140px"
					}
				}]
			},
			"workstation_工位2700x2500": {
				name: "g",
				itemName: "工位2700x2500",
				"item-unique": "workstation_工位2700x2500",
				"width": 270,
				"height": 250,
				"transform": "translate(50,50) scale(1) rotate(0 135,125)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workstation/工位2700x2500.png",
						width: "270px",
						height: "250px"
					}
				}]
			},
			"workstation_工位2800x2800": {
				name: "g",
				itemName: "工位2800x2800",
				"item-unique": "workstation_工位2800x2800",
				"width": 280,
				"height": 280,
				"transform": "translate(50,50) scale(1) rotate(0 140,140)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workstation/工位2800x2800.png",
						width: "280px",
						height: "280px"
					}
				}]
			},
			"workstation_工作位1400x1400": {
				name: "g",
				itemName: "工作位1400x1400",
				"item-unique": "workstation_工作位1400x1400",
				"width": 140,
				"height": 140,
				"transform": "translate(50,50) scale(1) rotate(0 70,70)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workstation/工作位1400x1400.png",
						width: "140px",
						height: "140px"
					}
				}]
			},
			"workstation_1400x1400": {
				name: "g",
				itemName: "1400x1400",
				"item-unique": "workstation_1400x1400",
				"width": 140,
				"height": 140,
				"transform": "translate(50,50) scale(1) rotate(0 70,70)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/workstation/1400x1400.png",
						width: "140px",
						height: "140px"
					}
				}]
			},
			"cupboard_柜子1800x450": {
				name: "g",
				itemName: "柜子1800x450",
				"item-unique": "cupboard_柜子1800x450",
				"width": 180,
				"height": 45,
				"transform": "translate(50,50) scale(1) rotate(0 90,23)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/cupboard/柜子1800x450.png",
						width: "180px",
						height: "45px"
					}
				}]
			},
			"cupboard_文件柜800x400": {
				name: "g",
				itemName: "文件柜800x400",
				"item-unique": "cupboard_文件柜800x400",
				"width": 80,
				"height": 40,
				"transform": "translate(50,50) scale(1) rotate(0 40,20)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/cupboard/文件柜800x400.png",
						width: "80px",
						height: "40px"
					}
				}]
			},
			"cupboard_文件柜900x400": {
				name: "g",
				itemName: "文件柜900x400",
				"item-unique": "cupboard_文件柜900x400",
				"width": 90,
				"height": 40,
				"transform": "translate(50,50) scale(1) rotate(0 45,20)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/cupboard/文件柜900x400.png",
						width: "90px",
						height: "40px"
					}
				}]
			},
			"cupboard_文件柜1200x400": {
				name: "g",
				itemName: "文件柜1200x400",
				"item-unique": "cupboard_文件柜1200x400",
				"width": 120,
				"height": 40,
				"transform": "translate(50,50) scale(1) rotate(0 60,20)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/cupboard/文件柜1200x400.png",
						width: "120px",
						height: "40px"
					}
				}]
			},
			"cupboard_文件柜2400x400": {
				name: "g",
				itemName: "文件柜2400x400",
				"item-unique": "cupboard_文件柜2400x400",
				"width": 240,
				"height": 40,
				"transform": "translate(50,50) scale(1) rotate(0 120,20)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/cupboard/文件柜2400x400.png",
						width: "240px",
						height: "40px"
					}
				}]
			},
			"cupboard_文件柜3200x400": {
				name: "g",
				itemName: "文件柜3200x400",
				"item-unique": "cupboard_文件柜3200x400",
				"width": 320,
				"height": 40,
				"transform": "translate(50,50) scale(1) rotate(0 160,20)",
				child: [{
					"name": "image",
					"attrs": {
						"xlink:href": "data/cupboard/文件柜3200x400.png",
						width: "320px",
						height: "40px"
					}
				}]
			},
		}
	};
	SubSvgList.prototype.getData = function(name, number) {
		if(name == "room") {
			return this.roomData(number);
		}
		return this.data[name];
	};
	window['SubSvgList'] = SubSvgList;
})();