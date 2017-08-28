(function($, window) {
	//帮助界面的逻辑处理

	var Help = function() {
		var self = this;

		this.data={};
		this.hammer=null;//记录help展示section的手势处理对象
		this.itemType=1;//当前选择的item的type
		this.index=1;//当前helpItem显示的图片
		this.itemLength=0;//当前helpItem含有图片的长度
		this.init();
	};

	Help.prototype = {

		init: function() {
			this.initDatas();
			this.getAllElements();
			this.initHelpSection();

			this.hammer = new Hammer(document.getElementById("help-show-section"));
			this.addEvent();
			
		},
		initDatas:function(){
			//帮助信息的数据
			this.data={
				info:{
					length:7,
				},
				help1:{
					title:"创建新房间",
					number:6,
				},
				help2:{
					title:"调节家具大小",
					number:2,
				},
				help3:{
					title:"旋转与翻转家具",
					number:2,
				},
				help4:{
					title:"复制与批量复制家具",
					number:2,
				},
				help5:{
					title:"标注尺寸",
					number:4,
				},
				help6:{
					title:"制作报价单",
					number:9,
				},
				help7:{
					title:"导出方案",
					number:3,
				},
				
			};
		},
		getAllElements: function() {
			this.helpBtn = $(".ihelp");
			this.helpContent=$("#help-content");
			this.helpSection = $("#help-section");
			this.helpSectionClose = $("#help-section-close");
			this.helpShowSection = $("#help-show-section");
			this.helpShowSectionClose = $("#help-show-close");
			this.helpShowInfoImg = $("#help-show-info-img");
			this.helpShowSectionTitle = $("#help-show-title-content");
			this.helpShowSectionImg=$("#help-show-info-img");
			this.helpShowPreBtn=$("#help-show-pre-btn");
			this.helpShowNextBtn=$("#help-show-next-btn");
			this.helpContact=$("#help-contact");
			this.helpContactBtn=$("#help-section-contact");
			this.helpTitle=$("#help-title");
		},
		addEvent: function() {
			var self = this;

			this.helpBtn.on('click', function() {
				self.helpSection.fadeToggle(500);
			});
			this.helpContactBtn.on("click",function()
			{
				self.helpContent.css("display","none");
				self.helpContact.css("display","block");
				self.helpTitle.html("关于我们");
				self.helpContactBtn.css("visibility","hidden");
			});
			this.helpSectionClose.on("click", function() {
				self.helpSection.fadeOut(500,function()
				{
					self.helpContent.css("display","block");
					self.helpContact.css("display","none");
					self.helpTitle.html("如何操作");
					self.helpContactBtn.css("visibility","visible");
				});
			});
			$(".help-info").on("click", function(event) {
				var target = event.target;
				var type = target.getAttribute("data-type");

				//展示图片(默认显示第一张)
				self.helpShowPreBtn.css("visibility","hidden");
				self.helpShowNextBtn.css("visibility","visible");
				self.itemLength = self.data["help"+type].number;
				self.index = 1;
				self.itemType = type;
				var img ="help/help"+type+"/"+self.index+".png";
				self.helpShowSection.fadeIn(500);
				self.helpShowInfoImg.attr("src", img);
				self.helpShowSectionTitle.text(self.data["help"+type].title);
			});
			this.helpShowSectionClose.on("click", function() {
				self.helpShowSection.fadeOut(500);
			});

			//展示图片时候的滑动事件
			this.hammer.on("swiperight",function()
			{
				self.preShow();
			});
			this.hammer.on("swipeleft",function()
			{
				self.nextShow();
			});

			this.helpShowPreBtn.on("click",function()
			{
				self.preShow();
			});
			this.helpShowNextBtn.on("click",function()
			{
				self.nextShow();
			});

		},
		nextShow:function()
		{
			this.index++;
			if(this.index>this.itemLength)
				this.index=this.itemLength;
			if(this.index==this.itemLength){
				this.helpShowNextBtn.css("visibility","hidden");
			}
			this.helpShowPreBtn.css("visibility","visible");
			var img = "help/help"+this.itemType+"/"+this.index+".png";
			this.helpShowInfoImg.attr("src", img);
		},
		preShow:function()
		{
			this.index--;
			if(this.index<1)
				this.index=1;
			if(this.index==1){
				this.helpShowPreBtn.css("visibility","hidden");
			}	
			this.helpShowNextBtn.css("visibility","visible");
			var img = "help/help"+this.itemType+"/"+this.index+".png";
			this.helpShowInfoImg.attr("src", img);
		},
		initHelpSection:function()
		{
			

			var length = this.data["info"].length;
			for(var i=1;i<=length;i++)
			{
				var li = this.createHelpItem(i);
				this.helpContent.append(li);
			}
		},
		/*
			创建一个问题Item
		 	<div class="help-info">
		        <span class="help-info-img"><img src="img/usu/help.png"></span> 
                <span class="help-info-content" data-type="1">创建新房间</span>
            </div>
		*/
		createHelpItem:function(type){
			var li = document.createElement("li");
				var div = document.createElement("div");
				div.setAttribute("class","help-info");
				div.setAttribute("data-type",type);
					var span1 = document.createElement("span");
					var span2 = document.createElement("span");
					span1.setAttribute("class","help-info-img");
					span2.setAttribute("class","help-info-content");
					span2.setAttribute("data-type",type);
						var img = document.createElement("img");
						img.setAttribute("src","img/usu/help.png");
					span1.appendChild(img);
					span2.innerHTML=this.data["help"+type].title;
				div.appendChild(span1);
				div.appendChild(span2);
			li.appendChild(div);
			return li;
		},

	};

	window["Help"] = Help;

})(jQuery, window);