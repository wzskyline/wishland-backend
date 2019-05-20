 var game_playing_masters = {
     jqGrid: null,
     imgBtn: null,
     history_count: 0,
     brands: {},
     socket: null,
     id: 0,
     users: [], //当切换大师时 全刷新  当有用户进出 时 则变动
     curpage: 1, //当切换大师时 还原为 1 
     count: 0, //总条数
     allpage: 0, //总页数 
     isAll: false, //默认只显示真人
     choose: "1", //选择的预测结果
      
     init: function () {
         var _this = this;
         this.jqGrid = $("#jqGrid");
         this.imgBtn = $(".room-imgs");
         return new Promise(function (resolve, reject) {
             _this.initSelect();
             _this.initComponent();
             _this.bindEvent();
             resolve();
         })
     },
     destroy: function () {
         //	unbind event
         this.element.off();
         //	remove by myself
         this.element.remove();
         this.element = null;
     },
     initComponent: function () {
         var _this = this;
         this.element.find(".subdiv").hide()
         this.element.find("#jqGrid").jqGrid({
             url: "./playing/masters",
             postData: {},
             mtype: "GET",
             styleUI: 'Bootstrap',
             datatype: "json",
             colModel: [{
                     label: '编号',
                     name: 'id',
                     align: 'center',
                     key: true,
                     width: 112
                 },
                 {
                     label: '名称',
                     name: 'name',
                     align: 'center',
                     width: 120,
                 },

                 {
                     label: '头像',
                     name: 'img',
                     width: 155,
                     align: 'center',
                     formatter: function (value, options, row) {
                         var html = '';
                         html += '<img class="jqgird_ico" src="' + value + '"> </img>';

                         return html;
                     }
                 },
                 {
                     label: '介绍',
                     name: 'desc',
                     width: 320,
                 },
                 {
                     label: '带打时间',
                     name: 'timestr',
                     align: 'center',
                     width: 120,

                 },
                 {
                     label: '状态',
                     name: 'state',
                     width: 120,
                     formatter: function (value, options, row) {
                         var html = '';
                         switch (value) {
                             case 0:
                                 html = '休息中';
                                 break;
                             case 1:
                                 html = '带打中';
                                 break;
                         }
                         return html;
                     }
                 },
                 {
                     label: '操作',
                     width: 250,
                     name: 'op',
                     formatter: function (value, options, row) {
                         var str = ''
                         if (row.state == 0) {
                             str += '<a class="bgbtn btn btn-info btn-xs modify_button"><i class="fa fa-gg">修改</i>   </a>';
                             str += '<a class="bgbtn btn btn-info btn-xs  start_button"><i class="fa fa-pencil"></i>开启带打  </a>';
                             str += "<br>"
                             str += '<a class="bgbtn btn btn-success btn-xs del_master_button"><i class="fa fa-gg"></i>删除</a>';
                         } else {
                             str += '<a class="bgbtn btn btn-info btn-xs modify_button"><i class="fa fa-gg">修改</i>   </a>';
                             str += '<a class="bgbtn btn btn-success btn-xs enter_button"><i class="fa fa-gg"></i> 进入房间  </a>';
                             str += '<a class="bgbtn btn btn-info btn-xs  close_button"><i class="fa fa-pencil"></i>结束带打  </a>';
                             str += "<br>"
                             str += '<a class="bgbtn btn btn-success btn-xs del_master_button"><i class="fa fa-gg"></i>删除</a>';
                         }
                         return str;
                     }
                 },
                 {
                     label: ' ',
                     width: 350,

                 }
             ],
             width: '100%',
             height: 580,
             rowNum: 30,
             autowidth: true,
             shrinkToFit: false,
             pager: "#jqGridPager"
         });
         //带打时间选择段
         $('.timestr').daterangepicker({
             "timePicker": true,
             "timePicker24Hour": true,
             "linkedCalendars": false,
             "autoUpdateInput": false,
             "locale": {
                 format: 'YYYY-MM-DD',
                 separator: ' ~ ',
                 applyLabel: "应用",
                 cancelLabel: "取消",
                 resetLabel: "重置",
             }
         }, function (start, end, label) {
             v = moment(start._d).format("HH:mm") + "--" + moment(end._d).format("HH:mm")
             this.element.val(v);
         });

     },
     bindEvent: function () {
         var _this = this;
         var main = document.getElementById("main-txt")
         main.onkeydown = KeyPress;

         function KeyPress() {
             key = KeyPress.arguments[0].keyCode;
             if (key == 13) {
                 var txt = $(".room-txt").val()
                 if (txt.length > 1) {
                     $.get("./playing/makePridict", {
                         room: 'daida:master:' + _this.id,
                         predict: "",
                         txt: txt,
                         users: _this.users.length,
                     }, function (data) {
                         _this.divScroll()
                     }, 'json')
                 }
                 $(".room-txt").val("");
             }
         }
          //自己点赞
          this.element.on("click", "[page='room'] .fa-thumbs-up", function (e) {
            data = {
                room:"daida:master:"+ _this.id, 
                userId:1,
                id:$(this).data("xid"),
                }
              $.get("./playing/praise",data,function(){})
          })
           //自己点踩
           this.element.on("click", "[page='room'] .fa-thumbs-down", function (e) {
            data = {
                room:"daida:master:"+ _this.id, 
                userId:1,
                id:$(this).data("cid"),
                }
              $.get("./playing/cai",data,function(){})
             
          })
         // 点击用户 进行禁言功能
         this.element.on("click", "[page='room'] .state-a", function (e) {
           id = $(this).data("id")
           data = {
               state :1
           }
           if(id){               
              _this.update(id,data).then(function (res) {
              if(res.state){
                    _this.sendBannedMsg({  room: 'daida:master:' +  _this.id, type: "master",userId: id,})
                 }
              })
           }
         })

         //点击图片放大功能
         this.element.on("click", "[page='room'] img", function (e) {
             var src = $(this).attr('src')
             $(".img-detail").html("<img style='width:100%' src = '" + src + "' / >");
             //	processing
             _this.element.find("[page='inquire'] .config_button").addClass("processing");

             _this.element.find(".config_modal").modal("show");

             _this.element.find("[page='inquire'] .config_button").removeClass("processing");



         })

         // 房间需要发送图片 room-imgs  room-img-msg 
         $('#ajax-upload').on('submit', function (e) {
             e.preventDefault();
             var form = e.target;
             var data = new FormData(form);
             $.ajax({
                 url: './playing/wechater/upimg',
                 method: 'post',
                 processData: false,
                 contentType: false,
                 data: data,
                 processData: false,
                 success: function (data) {
                     $.get("./playing/makePridict", {
                         room: 'daida:master:' + _this.id,
                         predict: "",
                         txt: '<img style="width:60px" src="' + data.path + '"/>',
                         users: _this.users.length,
                     }, function (data) {
                         _this.divScroll()
                     }, 'json')
                 }
             })
         })
         this.element.on("change", "[page='room'] .room-imgs", function (e) {
             if (utils.isImg($(this).val())) {
                 $("#ajax-upload").submit();
             }
         })
         this.element.on("click", "[page='room'] .room-img-msg", function (e) {
             _this.imgBtn.click()
         })

         //大师房间面板只关闭当前房间
         this.element.on("click", "[page='room'] .close_room_button", function (e) {
             $.get("./playing/closeRoom", {
                 room: 'daida:master:' + _this.id
             }, function (data) {}, 'json')

         })
         //大师房间面板 右侧监听事件 1.显示全部 2. 翻页事件
         this.element.on("click", "[page='room'] .slider", function (e) {
             _this.isAll = _this.isAll == true ? false : true;
             _this.curpage = 1;
             _this.showUsers()
         })
         //改变页面渲染以及页码值
         this.element.on("click", "[page='room'] .user-foot-pre", function (e) {
             $(".user-foot-next").show()
             if (_this.curpage == 1) {
                 $(".user-foot-pre").hide()
             } else {
                 _this.curpage--
             }
             _this.showUsers()
         })
         this.element.on("click", "[page='room'] .user-foot-next", function (e) {
             $(".user-foot-pre").show()
             if (_this.curpage == _this.allpage) {
                 $(".user-foot-next").hide()
             } else {
                 _this.curpage++
             }
             _this.showUsers()
         })
          
         //点击选择结果按钮切换不同样式
         this.element.on("click", "[page='room'] .choose-btn", function (e) {
             $(this).siblings().css("background-color", "#ffffff")
             $(this).siblings().css("color", "#000")
             $(this).css("background-color", "#8c8c8c")
             $(this).css("color", "#fff")
             _this.choose = $(this).data("predict")
         })
         // 更新预测值  的两个按钮监听事件

         this.element.on("click", "[page='room'] .new-line", function (e) { // bug 在于ajax 失败 显示状态缺变了 

////////  xxx
             var ret = $(this).data("state")
             if (ret == '1') { //第一个兄弟span显示 第二个不显示 第三个不显示
                 $(this).removeClass("new-line").attr('class', "state-span  state-btn1").attr('style', "")
                 $(this).next().removeClass("new-line").attr('class', "state-span  state-btn2").attr('style', "")
                 $(this).next().next().removeClass("new-line").attr('class', "state-span  state-btn2").attr('style', "")
                 $(this).parent().find("span").eq(0).show();
                 $(this).parent().find("span").eq(1).hide();
                 $(this).parent().find("span").eq(2).hide();
             }else  if (ret == '2') { //第三个兄弟span显示 第一个不显示 第二个不显示
                    $(this).removeClass("new-line").attr('class', "state-span  state-btn3").attr('style', "")
                    $(this).prev().prev().removeClass("new-line").attr('class', "state-span  state-btn1").attr('style', "")
                    $(this).prev().removeClass("new-line").attr('class', "state-span  state-btn2").attr('style', "")
                    $(this).parent().find("span").eq(2).show();
                    $(this).parent().find("span").eq(0).hide();   
                    $(this).parent().find("span").eq(1).hide();   
             } else { //第二个兄弟span显示 第一个不显示  第三个不显示
                 $(this).removeClass("new-line").attr('class', "state-span  state-btn2").attr('style', "")
                 $(this).prev().removeClass("new-line").attr('class', "state-span  state-btn1").attr('style', "")
                 $(this).next().removeClass("new-line").attr('class', "state-span  state-btn3").attr('style', "")
                 $(this).parent().find("span").eq(0).hide();
                 $(this).parent().find("span").eq(2).hide(); 
                 $(this).parent().find("span").eq(1).show();
             }

             var id = $(this).data("id")
             _this.updatePredict(id, {
                 state: parseInt(ret)
             })
         })

         this.element.on("click", "[page='room'] .state-span", function (e) { // bug 在于ajax 失败 显示状态缺变了 



             var ret = $(this).data("state")
             if (ret == '1') { //1 0 0 

                 $(this).parent().find("span").eq(0).show();
                 $(this).parent().find("span").eq(1).hide();
                 $(this).parent().find("span").eq(2).hide();
             }else if (ret == '2') {  // 0  0 1
                $(this).parent().find("span").eq(0).hide();
                $(this).parent().find("span").eq(1).hide();
                $(this).parent().find("span").eq(2).show();
            } 
             else { // 0 1 0 
                 $(this).parent().find("span").eq(0).hide();
                 $(this).parent().find("span").eq(1).show();
                 $(this).parent().find("span").eq(2).hide();
             }
             var id = $(this).data("id")
             _this.updatePredict(id, {
                 state: parseInt(ret)
             })
         })
         this.element.on("blur", "[page='room'] .roomtitle", function (e) {
             $.get("./playing/editTitle", {
                 room: 'daida:master:' + _this.id,
                 title: $(".roomtitle").val()
             }, function (data) {}, 'json')
         })
         this.element.on("click", "[page='room'] .master-choose-submit", function (e) {
             $.get("./playing/makePridict", {
                 room: 'daida:master:' + _this.id,
                 users: _this.users.length,
                 txt: "",
                 predict: $(".deskno").val() + "," + _this.choose + "," + $(".choose-input").val() + "," + $(".setno").val()
             }, function () {
                 _this.divScroll()
             }, 'json')
         })
         this.element.on("click", "[page='room'] .master-txt-submit", function (e) {
             var txt = $(".room-txt").val()
             if (txt.length > 1) {
                 $.get("./playing/makePridict", {
                     room: 'daida:master:' + _this.id,
                     predict: "",
                     txt: txt,
                     users: _this.users.length,
                 }, function () {
                     _this.divScroll()
                 }, 'json')
             }
             $(".room-txt").val("");
         })
         //  查询 按钮
         this.element.on("click", "[page='inquire'] .search_button", function (e) {
             _this.search();
         });
         // 新增操作 的三个按钮
         this.element.on("click", "[page='inquire'] .add_button", function (e) {
             utils.clear(['add-master-name', 'add-master-pwd', 'add-master-ico', 'add-master-desc', 'timestr'])
             _this.element.find("[page='add']").addClass("active").siblings("[page]").removeClass("active");
         });
         this.element.on("click", "[page='add'] .back_button", function (e) {
             _this.element.find("[page='inquire']").addClass("active").siblings("[page]").removeClass("active");
             _this.flush();
         });
         this.element.on("click", "[page='add'] .save_button", function (e) {
             var data = {
                 name: _this.element.find(".add-master-name").val(),
                 brand: _this.element.find(".add-master-brand").val(),
                 password: _this.element.find(".add-master-pwd").val(),
                 desc: _this.element.find(".add-master-desc").val(),
                 img: _this.element.find("#add-master-ico").val(),
                 timestr: _this.element.find(".add-master-timestr").val(),
             }
             if (_this.check(data)) {
                 _this.uploadImg('add-master-ico').then(function (icoimg) {
                     if (icoimg.status) {
                         data.img = icoimg.path
                         _this.add(data).then(function (ret) {
                             if (ret.status) {
                                 $(".add-master-ret").html("")
                                 _this.flush({});
                                 _this.element.find("[page='inquire']").addClass("active").siblings("[page]").removeClass("active");
                             } else {
                                 $(".add-master-ret").html(ret.message)
                             }
                         }).finally(function () {

                         });

                     } else {
                         $(".add-master-ret").html("图片上传异常")
                     }
                 })
             }
         });
         //进入房间 相关
         this.element.on("click", "[page='room'] .back_button", function (e) {
             _this.users = []
             _this.socket.disconnect(true) //如果没有这个代码 一个人管理多个房间时 socket 有重复发送  要使用多个房间请多开浏览器页面
             _this.socket = null;
             _this.updateLogin(_this.id,"out")
             _this.element.find("[page='inquire']").addClass("active").siblings("[page]").removeClass("active");
         });
         this.element.on("click", "[page='inquire'] .del_master_button", function (e) { //del
             $(this).parent().click()
             var id = $("#jqGrid").jqGrid("getGridParam", "selrow");
             utils.dialog(["确定删除此带打师", function () {
                 _this.deleteMaster(id)
             }, null])
         });
         //修改操作的三个按钮
         this.element.on("click", "[page='inquire'] .modify_button", function (e) { //修改
             $(this).parent().click()
             var id = $("#jqGrid").jqGrid("getGridParam", "selrow");
             var rowData = $("#jqGrid").jqGrid('getRowData', id);
             utils.clear(['update-master-ico'])
             $.get("./playing/master/" + id, function (data) {
                 $(".update-master-id").val(rowData.id)
                 $(".update-master-name").val(rowData.name)
                 $(".update-master-desc").val(data.desc)
                 $(".update-master-timestr").val(data.timestr)
                 $(".update-master-code").val(data.roomcode)
                 $(".update-master-brand").val(data.brand);
                 _this.element.find("[page='update']").addClass("active").siblings("[page]").removeClass("active");
             }, 'json')
         });
         this.element.on("click", "[page='update'] .back_button", function (e) {
             _this.element.find("[page='inquire']").addClass("active").siblings("[page]").removeClass("active");
         });
         this.element.on("click", "[page='update'] .save_button", function (e) {
             var data = {
                 name: _this.element.find(".update-master-name").val(),
                 password: _this.element.find(".update-master-pwd").val(),
                 desc: _this.element.find(".update-master-desc").val(),
                 img: _this.element.find("#update-master-ico").val(),
                 timestr: _this.element.find(".update-master-timestr").val(),
             }
             var id = $(".update-master-id").val();

             if (data.img.length > 1) {
                 _this.uploadImg('update-master-ico').then(function (icoimg) {
                     if (icoimg.status) {
                         data.img = icoimg.path
                         _this.updateMaster(id, data)
                     } else {
                         $(".add-master-ret").html("图片上传异常")
                     }
                 })
             } else {
                 _this.updateMaster(id, data)
             }
         });
         this.element.on("click", "[page='inquire'] .start_button", function (e) { //开启房间休息改为带打中
             $(this).parent().click()
             var id = $("#jqGrid").jqGrid("getGridParam", "selrow");
             var data = {
                 name: "",
                 password: "",
                 desc: "",
                 img: "",
                 timestr: "",
                 state: 1
             }
             $.get("./playing/robot", {
                 room: 'daida:master:' + id,
             }, 'json')
             _this.updateMaster(id, data)
         })
         this.element.on("click", "[page='inquire'] .close_button", function (e) { //结束带打 开启房间带打中改为休息  发送对应socket
             $(this).parent().click()
             var id = $("#jqGrid").jqGrid("getGridParam", "selrow");
             var data = {
                 name: "",
                 password: "",
                 desc: "",
                 img: "",
                 timestr: "",
                 state: 0
             }
             _this.updateMaster(id, data)
             var socketTmp = io('http://10.101.150.213:7112/');

             $.get("./playing/closeRoom", {
                 room: 'daida:master:' + id,
             }, function (data) {}, 'json')
         })
         this.element.on("click", "[page='inquire'] .enter_button", function (e) {

             $(this).parent().click()
             _this.showUsers()
             var id = $("#jqGrid").jqGrid("getGridParam", "selrow");
             var rowData = $("#jqGrid").jqGrid('getRowData', parseInt(id));
             _this.id = id;
             _this.isAll = false;
             _this.curpage = 1;
             _this.users = [];
             _this.history_count = 0;
             $(".room-out").html("");
             $(".right-user").remove();
             $(".master-img").html(rowData.img);
             $(".master-name").html("带打师 :" + rowData.name);
             $.get("./playing/check/login",{id},function(res){
                if(res.master.login>0){
                   utils.dialog(["当前有人管理这个房间 是否进入房间",function(){
                    _this.updateLogin(id,"in")
                    _this.inRoom(id);
                 }])
                }else{
                    _this.updateLogin(id,"in")
                   _this.inRoom(id) 
                   
                }
           }) 
         });
     },

     inRoom: function (id) { 
        var _this = this; 
        _this.element.find("[page='room']").addClass("active").siblings("[page]").removeClass("active");
        _this.socket = io('http://10.101.150.213:7112/', {});
        _this.socket.on('connect', function () {
            _this.socket.emit('join', {
                rooms: ['daida:master:' + id] //
            })
        });
        setTimeout(function () {
            $.get("./playing/getInfo", {
                room: 'daida:master:' + id,
                type: "master",
                userId: id,
            }, 'json')
        }, 2000);
        $.get("./playing/getInfo", {
            room: 'daida:master:' + id,
            type: "master",
            userId: id,
        }, function (data) {
            var all = data.data;
            for (var i = 0; i < all.length; i++) {
                _this.history_count++;
                var center_time = ""
                if ((typeof all[i] == 'object') && all[i]) {
                    type = all[i].type;
                    time = all[i].time
                    message = all[i].msg
                    if (type == 'masterPredict') {
                        each_id = all[i].id //变量名不能是id 会干扰的到 socket

                        html ='<i    data-xid="'+each_id+'"  class="fa fa-thumbs-up" aria-hidden="true">'+all[i].praise+'</i>' + '<i    data-cid="'+each_id+'"  class="fa fa-thumbs-down" aria-hidden="true">'+all[i].cai+'</i>'
                        btnHtml =""
                        btnHtml+="<span class='state-span  state-btn1' data-id='" + each_id + "' data-state='1'>中</span>"
                        btnHtml+="<span class='state-span  state-btn2' data-id='" + each_id + "' data-state='0'>挂</span>"
                        btnHtml+="<span class='state-span  state-btn3' data-id='" + each_id + "' data-state='2'>和</span>"
                        if (all[i].state == 0) {
                           html+="<span class='state-out-span1' >中</span>"
                           html+="<span class='state-out-span2' >挂</span>"
                           html+="<span class='state-out-span3' style='display:inline'>和</span>"  
                           html+= btnHtml
                        } else if (all[i].state == 1) {
                           html+="<span class='state-out-span1'  style='display:inline' >中</span>"
                           html+="<span class='state-out-span2' >挂</span>"
                           html+="<span class='state-out-span3' >和</span>"  
                           html+= btnHtml
                        } else if (all[i].state == 2) {
                           html+="<span class='state-out-span1' >中</span>"
                           html+="<span class='state-out-span2' >挂</span>"
                           html+="<span class='state-out-span3' style='display:inline'>和</span>"  
                           html+= btnHtml
                        } else {
                           html+="<span class='state-out-span1'>中</span>"
                           html+="<span class='state-out-span2'>挂</span> "
                           html+="<span class='state-out-span3'>和</span> "
                           html+="<span  style='display:inline-block' class='new-line  state-btn1' data-id='" + each_id + "'   data-state='1'>中</span>"
                           html+="<span  style='display:inline-block' class='new-line  state-btn2' data-id='" + each_id + "'   data-state='0'>挂</span>"
                           html+="<span  style='display:inline-block' class='new-line  state-btn3' data-id='" + each_id + "'   data-state='2'>和</span>"
                        }

                        $(".room-out").append(time + "  <a class='state-a'>" + message + html+"</a></br>")
                    } else if(  type =='masterImg'){ //图片信息 
                        $(".room-out").append(time + "  <a class='state-a'>" + message + "</a></br>")
                     } else if(  type =='userTxt'){ //用户信息
                           $(".room-out").append(time + "  <a data-id='"+all[i].uid+"'  class='state-a'>" + all[i].message + "</a></br>")
                       }
                    center_time = time
                }
                if (_this.history_count % 5 == 0 && center_time) {
                    $(".room-out").append("<span class='center_time'>" + center_time + "</br>")
                }
            }
            _this.divScroll()
        }, 'json')

        // 接收 title  信息
        _this.socket.on('title', function (msg) {
            $(".roomtitle").html(msg.data.title)
        });
        // 接收   在线用户信息

        _this.socket.on('users', function (msg) {
            window.users = _this.users = msg.data.users.rows
            _this.showUsers()
        });
        //接收发送的预测信息 以及文字信息
        _this.socket.on('predict', function (msg) {
            id = msg.data.id
            type = msg.data.type
            time = msg.data.time
            message = msg.data.msg
            _this.history_count++;
            if (type == 'txt') { // 普通消息
                $(".room-out").append(time + "  <a class='state-a'>" + message + "</a></br>")
            } else {
                 html ='<i   data-xid="'+id+'"  class="fa fa-thumbs-up" aria-hidden="true"></i>' + '<i   data-cid="'+id+'"  class="fa fa-thumbs-down" aria-hidden="true"></i>'
                 html+= "<span class='state-out-span1'>中</span>"
                 html+= "<span class='state-out-span2'>挂</span>"
                 html+= "<span class='state-out-span3'>和</span>"
                 html+= "<span class='new-line  state-btn1' data-id='" + id + "'data-state='1' style='display:inline-block'>中</span>"
                 html+= "<span class='new-line  state-btn2' data-id='" + id + "'data-state='0' style='display:inline-block'>挂</span>"
                 html+= "<span class='new-line  state-btn3' data-id='" + id + "'data-state='2' style='display:inline-block'>和</span>"

                $(".room-out").append(time + "  <a class='state-a'>" + message + html+"</a></br>")
            }
            if (_this.history_count % 5 == 0) {
                $(".room-out").append("<span class='center_time'> " + time + " </span><br>")
            }
        });

        //接收发送的预测信息 以及文字信息
        _this.socket.on('speak', function (msg) {
            id = msg.data.id
            type = msg.data.type
            time = msg.data.time
            message = msg.data.msg
            _this.history_count++;
             
            $(".room-out").append(time + "  <a data-id='"+all[i].uid+"'  class='state-a'>" + message + "</a></br>")
            if (_this.history_count % 5 == 0) {
                $(".room-out").append("<span class='center_time'> " + time + " </span><br>")
            }
        });
         //接收点赞
         _this.socket.on('praise', function (msg) {
            $("i[data-xid='"+msg.data.id+"']").html(msg.data.praise)
       });
           //接收踩
         _this.socket.on('cai', function (msg) {
            $("i[data-cid='"+msg.data.id+"']").html(msg.data.cai)
       });
           
        // 接收   关闭房间信息
        _this.socket.on('roomClose', function (msg) {
            _this.history_count = 0;
            $(".room-out").append(msg.data.time + "  " + msg.data.msg + "<br>")
            //优化使用  更新状态
            var data = {
                name: "",
                password: "",
                desc: "",
                img: "",
                timestr: "",
                state: 0
            };
            _this.updateMaster(id, data);


        });
        _this.socket.on('error', function (msg) {

        });

     },

     divScroll: function () { //因为 改变 滚动条的位置需要等socket 传回后 增加内容 
         setTimeout(function () {
             $(".room-out").scrollTop($('.room-out')[0].scrollHeight)
         }, 500);
     },
     search: function () {
         // 获取 查询面板值 进行对 jqgird 表刷新
         var data = {
             id: $(".search-master-id").val(),
             name: $(".search-master-name").val(),
             state: $(".search-master-state").val(),
         }
         this.flush(data, 1);
     },
     /**
      * 上传图片
      */
     uploadImg: function (id) {
         var _this = this;
         return new Promise(function (resolve, reject) {
             $.ajaxSettings.async = false;
             $.ajaxFileUpload({
                 url: './playing/wechater/upimg',
                 secureuri: false,
                 fileElementId: id,
                 processData: false,
                 contentType: false,
                 dataType: 'application/json',
                 success: function (s, status) {
                     _this.sleep(300)
                     resolve(JSON.parse(s.substring(s.indexOf('{'), s.indexOf('}') + 1)));
                 },
                 error: function () {
                     resolve({
                         "status": false,
                         "path": "ERROR AJAX"
                     });
                 }
             });
         });
     },
     /*
      * 共用代码 刷新表格 缩短代码篇幅
      */
     flush: function (data, page) {
         $("#jqGrid").jqGrid('setGridParam', {
             url: './playing/masters',
             datatype: 'json',
             postData: data,
             page: page ? page : $('#jqGrid').getGridParam('page'),
         }).trigger("reloadGrid");
     },
     check: function (data) {
         if (data.name.length < 1) {
             $(".add-master-ret").html("请添加名称");
             return false;
         }
         if (!data.password) {
             $(".add-master-ret").html("请添加密码");
             return false;
         }
         if (!data.img) {
             $(".add-master-ret").html("请选择头像");
             return false;
         }
         if (!data.desc) {
             $(".add-master-ret").html("请简单介绍一下");
             return false;
         }
         if (!data.timestr) {
             $(".add-master-ret").html("描述一下带打时间");
             return false;
         }
         return true;
     },
     add: function (data) {
         return new Promise(function (resolve, reject) {
             $.ajax({
                 "url": "./playing/master",
                 "type": "post",
                 "data": data,
                 "dataType": "json",
                 "success": function (data) {
                     resolve(data);
                 },
                 "error": function (xhr, txt) {
                     resolve(xhr.responseJSON);
                 }
             });
         });
     },
     
    updateLogin: function (id, type) {
        $.ajax({
            "url": "./playing/check/loginfix",
            "type": "get",
            "data": {id,type},
            "dataType": "json",
            "success": function (ret) {  
            },
            "error": function (xhr, txt) {
                $(".update-master-ret").html(txt)
            }
        });
    },
     updateMaster: function (id, data) {
         var _this = this
         if (data.name.length < 1) delete data.name;
         if (data.password.length < 1) delete data.password;
         if (data.desc.length < 1) delete data.desc;
         if (data.img.length < 1) delete data.img;
         if (data.timestr.length < 1) delete data.timestr;

         $.ajax({
             "url": "./playing/master/" + id,
             "type": "put",
             "data": data,
             "dataType": "json",
             "success": function (ret) {
                 if (ret.status) {
                     _this.flush()
                     $("[page='inquire']").addClass("active").siblings("[page]").removeClass("active");
                 } else {
                     $(".update-master-ret").html(ret.message)
                 }
             },
             "error": function (xhr, txt) {
                 $(".update-master-ret").html(txt)
             }
         });
     },
     updatePredict: function (id, data) {
         var _this =this
         $.ajax({
             "url": "./playing/predict/" + id,
             "type": "put",
             "data": data,
             "dataType": "json",
             "success": function (ret) {},
             "error": function (xhr, txt) {}
         });
         //2 期间 添加通知
         $.ajax({
            "url": "./playing/change",
            "type": "get",
            "data": {id,state:data.state, room: 'daida:master:' + _this.id,},
            "dataType": "json",
            "success": function (ret) {},
            "error": function (xhr, txt) {}
        });
     },
     deleteMaster: function (id) {
         var _this = this;
         $.ajax({
             "url": "./playing/master/" + id,
             "type": "delete",
             "dataType": "json",
             "success": function (ret) {
                 if (ret.status) {
                     _this.flush()
                     $("[page='inquire']").addClass("active").siblings("[page]").removeClass("active");
                 } else {

                 }
             },
             "error": function (xhr, txt) {}
         });
     },
     initSelect: function () {
         var brands = [];
         var _this = this;
         $.ajaxSettings.async = false
         $.get("./playing/system/brand", function (data) {
             brands = data
             $.each(brands, function (i, o) {
                 _this.brands[o.key] = o.value
                 $(".update-master-brand").append("<option value='" + o.key + "'>" + o.value + "</option>");
                 if (i == 1) {
                     $(".add-master-brand").append("<option value='" + o.key + "' selected>" + o.value + "</option>");
                 } else {
                     $(".add-master-brand").append("<option value='" + o.key + "'>" + o.value + "</option>");
                 }
             });
         }, 'json')

         $.get("./playing/system/system", function (data) {
             game = data.config.game
             $.each(game, function (i, o) {
                 if (i == 1) {
                     $("[page='room'] .setno").append("<option value='" + o.key + "' selected>" + o.value + "</option>");
                 } else {
                     $("[page='room'] .setno").append("<option value='" + o.key + "'>" + o.value + "</option>");
                 }
             });
         }, 'json')
     },
     sleep: function (sec) {
         var exitTime = new Date().getTime() + sec;
         while (new Date().getTime() < exitTime) {}
     },
     showUsers: function () { //根据 _this.users  _this.isAll, _this.curpage 进行渲染右侧面板
         var newusers = []
         if (this.isAll) {
             newusers = this.users;
         } else { //过滤掉机器人
             newusers = this.users.filter(function (x) {
                 if (x.type == 1) return x;
             })
         }
         //更新页面显示
         $(".user-summary").html("用户列表(" + newusers.length + "人)")
         this.allpage = parseInt((newusers.length + 12) / 13)
         $(".user-foot-page").html(this.curpage + "/" + this.allpage)
         //再从这个数组中 分页
         newusers = newusers.slice((this.curpage - 1) * 13, this.curpage * 13)
         if (newusers.length == 0) $(".user-foot-page").html("0/" + this.allpage)
         if ($(".user-foot-page").html() == '0/0') {
             $(".user-foot-next").hide()
         } else {
             $(".user-foot-next").show()
         }
         if (this.curpage == 1) $(".user-foot-pre").hide()
         if (this.curpage == this.allpage) $(".user-foot-next").hide()
         //最后统一渲染
         $(".right-user").remove()
         //拿着数组去渲染  去移除
         for (var i = 0; i < newusers.length; i++) {
             var html = ''
             if (i == 12) {
                 html += '<div class="right-user row"  style=" border-bottom: solid 0px"> <span class="right-user-no">'
             } else {
                 html += '<div class="right-user row" > <span class="right-user-no">'
             }
             //var x = Math.random()*100; x = ~~ x 
             newusers[i].nickname = newusers[i].nickname ? newusers[i].nickname : newusers[i].name; //' -- ';
             newusers[i].img = newusers[i].img ? newusers[i].img : ' /media/daida/image/2018/11/20/ico/2.jpg'
             html += newusers[i].id
             html += '</span>  <div class ="right-img-div">'
             html += '<img src="' + newusers[i].img + '" style="width: 40px;height: 40px;border-radius: 30px;"/>'
             html += '</div> <span class="right-user-name">'
             html += newusers[i].nickname
             html += '</span><span class="right-user-type">'
             html += newusers[i].type == 0 ? '机器人' : ' 真人'
             html += '</span> </div>'
             $(".users-div").append(html)
         }
     },
     resize: function (width, height) {
         this.jqGrid.setGridWidth($(".x_content").width());
     },
     /**
      * 設定訊息
      * @param type - 訊息種類，success, info, warning, danger
      * @param message - 訊息內容
      */
     setMessage: function (type, message) {
         var html = '';

         html += '<div class="alert alert-' + type + ' alert-dismissible fade in" role="alert">';
         html += '	<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>';
         html += message;
         html += '</div>';

         this.element.find(".alert_message").html(html);
     },
     update: function (id,data) {
         
        return new Promise(function (resolve, reject) {
        $.ajax({
            "url": "./playing/user/" + id,
            "type": "put",
            "data": data,
            "dataType": "json",
            "success": function (ret) {
                $.messager({
                    status: 'success',
                    message: "已经禁言"
                });
                resolve({state:true});
            },
            "error": function (xhr, txt) {
                resolve({state:false}); 
            }
        });
    });
    },
    sendBannedMsg: function (data) {
         
        
        $.ajax({
            "url": "./playing/user/Banned",
            "type": "get",
            "data": data,
            "dataType": "json",
            "success": function (ret) { 
            },
            "error": function (xhr, txt) {
                
            }
        });
    },
 }
