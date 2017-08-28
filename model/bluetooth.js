(function($,window){
  var Bluetooth = function(options){
    var self = this;
    this.scaning = false;
    this.currentName = '';
    this.value = 0;
    this.init();
  };
  Bluetooth.prototype = {
    init: function(){
      this.getElement();
      this.deleteAll();
      this.addEvent();
    },
    getElement: function(){
      this.section = $("#tabbar-with-bluetooth");
      this.scanDom = document.getElementById("scan");
      this.stateInfo = document.getElementById("bluebooth-info");
      this.clearBluetooth = document.getElementById("clear-bluetooth");
      this.disconnectDom = document.getElementById("disconnect");
      this.reconnectDom = document.getElementById("reconnect");
      this.bluetoothValue = $("#bluetooth-value");
      this.realtimeData = $("#realtime-num");
    },
    addEvent: function(){
      var self = this;
      this.section.on("click", ".button", function(e){
        e.stopPropagation();
        switch(this.id){
          case "scan":
            self.actionControll(this.textContent);
          break;
          case "clear-bluetooth":
            self.deleteAll();
          break;
          case "disconnect":
            self.disconnect();
          break;
          case "reconnect":
            self.reconnect();
          break;
          case "reconnect":
            self.reconnect();
          break;
        }
      });
    },
    scan: function(){
      var self = this;
      if(typeof plus != "undefined"){
        plus.PluginBluetooth.scanStart(function(result) {
          if (result[0] == "NO") {
            self.stopScan();
            mui.alert("蓝牙未开启！", "IHome");
          } else {
            self.addItem(result[1],true);
          }
        }, function(result) {
          self.stopScan();
          mui.alert("出错了："+result, "IHome");
        });
      }else{
        this.addItem("test",true);
        var data = "3.00m";
        this.value = data.substring(0,data.length-1);
        this.bluetoothValue.val(this.value);
        this.realtimeData.html(this.value+"m");
      }
      this.scaning = true;
      this.scanDom.innerHTML = "正在扫描,点击停止";
    },
    stopScan: function(){
      if(typeof plus != "undefined")
       plus.PluginBluetooth.scanCancel();
       this.scaning = false;
       this.scanDom.innerHTML = "扫描设备";
    },
    connect: function(name){
      var self = this;
      this.periName = name;
      
      this.stateInfo.innerHTML = "<span>正在连接："+this.periName+"</span>";
      if(typeof plus != "undefined"){
        plus.PluginBluetooth.connectPeri(this.periName,function(result){
          if(result[0] == "state") {
            if(result[1] == "fail") {
              //连接失败
              self.stateInfo.innerHTML = "<span>连接"+self.periName+"失败。</span>";
              self.clearBluetooth.style.display = "none";
              self.disconnectDom.style.display = "none";
              self.reconnectDom.style.display = "block";
            }else {
              //连接成功
              self.stateInfo.innerHTML ="<span>"+self.periName + ": " + result[1]+"</span>";
              self.deletAll();
              self.clearBluetooth.style.display = "none";
              self.reconnectDom.style.display = "none";
              self.disconnectDom.style.display = "block";
            }
          }else if(result[0] == "cut"){
            //连接断开
            self.stateInfo.innerHTML = "<span>"+self.periName + ": 连接丢失。</span>";
            self.clearBluetooth.style.display = "none";
            self.disconnectDom.style.display = "none";
            self.reconnectDom.style.display = "block";
          }else if(result[0] == "data") {
            //接收到数据
            self.addItem(result[1],false);
          }
        },
        function(result){
          alert("出错了："+result);
        });
      }else{
       this.deleteAll();
       this.stateInfo.innerHTML ="<span>"+self.periName + ": " + "SSS"+"</span>";
       self.clearBluetooth.style.display = "none";
       self.reconnectDom.style.display = "none";
       self.disconnectDom.style.display = "block";
      }
    },
    addItem: function(text,flag){
      var self = this;
      if(flag) {
        var content = document.getElementById("plist");
        var new_li = document.createElement("li");
        new_li.innerHTML = text;
        content.appendChild(new_li);
        new_li.onclick=function(){
          if(self.scaning) {
            self.stopScan();
          }
          var comfirmConnect = confirm("准备和"+this.textContent+"建立蓝牙连接吗？");
          if(comfirmConnect) {
            self.connect(this.textContent);
          }
        };
      }else{
        this.value = parseFloat(text).toFixed(3);
        this.bluetoothValue.val(this.value);
        this.realtimeData.html(this.value+"m");
      }
    },
    deleteAll: function() {
      var content = document.getElementById("plist");
      while(content.hasChildNodes()) {
        content.removeChild(content.firstChild);
      }
    },
    actionControll: function(text) {
      if(text == "扫描设备") {
        this.scan();
      }else if(text == "正在扫描,点击停止") {
        this.stopScan();
      }
    },
    reconnect: function() {
      if(this.periName) {
        this.connect(this.periName);
      }else {
        mui.alert("之前没有连接设备！", "IHome");
      }
    },
    disconnect: function() {
      if(typeof plus != "undefined"){
        plus.PluginBluetooth.disconnectPeri();
        this.stateInfo.innerHTML = "<span>"+this.periName + ": 已断开连接。</span>";
        this.clearBluetooth.style.display = "none";
        this.disconnectDom.style.display = "none";
        this.reconnectDom.style.display = "block";
      } 
    }
  };
  window['Bluetooth'] = Bluetooth;
})(jQuery,window);