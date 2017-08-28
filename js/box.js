;(function($){
    var LightBox = function(){
        var self = this;

        //创建弹出框和遮罩
        this.Mask = $('<div id="light-mask">');
        this.popup = $('<div id="popup">');

        //保存body
        this.bodyNode = $(document.body);

        //渲染剩余dom并插入body
        this.renderDOM();
        this.picViewArea = this.popup.find("div.pic-view"); //图片预览区域
        this.popupPic = this.popup.find("img.image"); //图片
        this.scale = 1;

        //准备事件，获取数据
        this.groupName = null;
        this.groupData = [];
        this.bodyNode.delegate(".light,[data-role=light]","click",function(e){
            e.stopPropagation();
            var currentGroup = $(this).attr("data-group");
            if(currentGroup != self.groupName){
                self.groupName = currentGroup;
                self.getGroup();
            }
            self.initPopup($(this));
        });
        this.Mask.click(function(){
            $(this).fadeOut();
            self.popup.fadeOut();
            self.clear = false;
            self.scale=1;
        });
       
        this.flag = true;
       
        var timer = null;
        this.clear = false;
        $(window).resize(function(){
            if(self.clear){
                window.clearTimeout(timer);
                timer = window.setTimeout(function(){
                    self.loadPicSize(self.groupData[self.index].src);
                },500);
            }
        });
    };
    LightBox.prototype={

        showMask: function(sourceSrc,currentId){
            var self = this;
            this.popupPic.hide();

            this.Mask.fadeIn();
            this.addEvent();
            var winWidth = $(window).width();
            var winHeight = $(window).height();

            this.picViewArea.css({
                width:winWidth/2,
                height:winHeight/2
            });
            this.popup.fadeIn();

            var viewHeight = winHeight/2+10;

            this.popup.css({
                width:winWidth/2+10,
                height:winHeight/2+10,
                marginLeft:-(winWidth/2+10)/2,
                top: -viewHeight
            }).animate({
                top:(winHeight-viewHeight)/2
            },function(){
                self.loadPicSize(sourceSrc);
            });
           
        },
        addEvent: function(){
            var self = this;
            var tmpScale = 1;
            this.picViewArea.css({
                transform:"scale("+self.scale+")"
            })
            document.body.onmousewheel = function(event) {
                if(event.target.id==self.Mask[0].id||event.target.id==self.popup[0].id
                    ||event.target.tagName=="IMG"){
                    event.preventDefault();
                }
                
                if (event.wheelDelta > 0&&self.scale<3) {
                    self.scale *=1.1;
                    self.picViewArea.css({
                        transform:"scale("+self.scale+")"
                    })
                }else{
                     self.scale *=0.9;
                    self.picViewArea.css({
                        transform:"scale("+self.scale+")"
                    })
                }
            };
            var hammer = new propagating(Hammer(document.getElementById(self.Mask[0].id)));
            hammer.get('pinch').set({
                enable: true
            });

            hammer.on("pinchstart pinchmove pinchend", function(ev) {
                ev.stopPropagation();
                ev.preventDefault();
                switch (ev.type) {
                    case "pinchstart":
                        break;
                    case "pinchmove":
                        tmpScale = ev.scale-1 + self.scale;
                        self.picViewArea.css({
                            transform:"scale("+tmpScale+")"
                        });
                        break;
                    case "pinchend":
                        self.scale = tmpScale;
                        break;
                }
            });
        },
        loadPicSize: function(sourceSrc){
            var self = this;
            self.popupPic.css({width:"auto",height:"auto"}).hide();
            this.preLoading(sourceSrc,function(){
                self.popupPic.attr("src",sourceSrc);
                var picWidth = self.popupPic.width();
                var picHeight = self.popupPic.height();

                self.changePic(picWidth,picHeight);
            });
        },
        changePic: function(width,height){
            var self = this;
            var winWidth = $(window).width();
            var winHeight = $(window).height();

            //判断宽高
            var scale = Math.min(winWidth/(width+10),winHeight/(height+10),1);
            width = width*scale;
            height = height*scale;
            this.picViewArea.animate({
                width:width+10,
                height:height+10
            });
            this.popup.animate({
                width:width,
                height:height,
                marginLeft:-(width/2),
                top: (winHeight-height)/2
            },function(){
                self.popupPic.css({
                    width:width,
                    height:height
                }).fadeIn();
                self.flag = true;
                self.clear = true;
            });
},
        preLoading: function(src,callback){
            var img = new Image();

            if(!!window.ActiveXObject){
                img.onreadystatechange = function(){
                    if(this.readyState == "complete"){
                        callback();
                    }
                }
            }else{
                img.onload = function(){
                    callback();
                }
            }
            img.src = src;
        },
        initPopup: function(currObj){
            var self = this;
            sourceSrc = currObj.attr("data-source");
            currentId = currObj.attr("data-id");
            this.showMask(sourceSrc,currentId);
        },
        getGroup: function(){
            var self = this;
            var groupList = this.bodyNode.find("*[data-group="+this.groupName+"]");
            self.groupData.length=0;
            groupList.each(function(){
                self.groupData.push({
                    src:$(this).attr("data-source"),
                    id:$(this).attr("data-id"),
                });
            });
        },
        renderDOM: function(){
            var strDom = '<div class="pic-view">'+
                            '<img class="image" src=""></img>'+
                        '</div>';
            //插入popup
            this.popup.html(strDom);
            this.bodyNode.append(this.Mask,this.popup);
        }
    };
    window["LightBox"] = LightBox;
})(jQuery);