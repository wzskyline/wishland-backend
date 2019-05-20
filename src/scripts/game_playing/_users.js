var game_playing_users = {
    brands: {},
    jqGrid: null,
    init: function () {
        var _this = this;
        this.jqGrid = $("#jqGrid");
        return new Promise(function (resolve, reject) {
            _this.initComponent();
            _this.bindEvent();
            resolve();
        })
    },
    destroy: function () {},
    initComponent: function () {
        var _this = this;
        this.element.find(".subdiv").hide()

        this.element.find("#jqGrid").jqGrid({
            url: "./playing/users",
            mtype: "GET",
            styleUI: 'Bootstrap',
            datatype: "json",
            colModel: [{
                    label: '编号',
                    name: 'id',
                    align: 'center',
                    key: true,
                    width: 50
                },
                {
                    label: '用户账号',
                    name: 'number',
                    align: 'center',
                    width: 170
                },

                {
                    label: '用户头像',
                    width: 350,
                    name: 'img',
                    align: 'center',
                    formatter: function (value, options, row) {
                        return '<img  class="user_table_img" src="' + value + '"/> </br>' + value;
                    }
                },
                {
                    label: '用户',
                    name: 'name',
                    align: 'center',
                    width: 80,
                },
                {
                    label: '用户昵称',
                    name: 'nickname',
                    align: 'center',
                    width: 180
                },
                {
                    label: '是否为机器人',
                    width: 100,
                    name: 'type',
                    align: 'center',
                    formatter: function (value, options, row) {
                        return value == 1 ? '否' : '是';
                    }
                },
                {
                    label: '',
                    width: 0,
                    name: 'type',
                    align: 'center',
                    hidden: true,
                },
                {
                    label: 'QQ',
                    name: 'qq',
                    align: 'center',
                    width: 120
                },
                {
                    label: '微信',
                    name: 'wechat',
                    align: 'center',
                    width: 120
                },
                {
                    label: '邮箱',
                    name: 'email',
                    align: 'center',
                    width: 120
                },
                {
                    label: '手机号',
                    name: 'phone',
                    align: 'center',
                    width: 120
                },
                {
                    label: '状态隐藏域',
                    name: 'state', 
                    width: 0,
                    hidden:true,
                },
                {
                    label: '操作',
                    name: 'op',
                    width: 140,
                    align: 'center',
                    formatter: function (value, options, row) { //null 0.正常  1.禁言 2.封号    解除封号 恢复正常
                        var html = ' ';
                        html += ' <a class="bgbtn btn btn-info btn-xs fix_user_button"><i class="fa fa-pencil"></i>修改</a> ';
                        html += ' <a class="bgbtn btn btn-success btn-xs del_user_button"><i class="fa fa-gg"></i>删除</a> ';
                        if(row.state < 1 ){
                            html += ' <a data-op="1" class="bgbtn btn btn-info btn-xs update_user_button"><i class="fa fa-pencil"></i>禁言</a> ';
                            html += ' <a data-op="2" class="bgbtn btn btn-success btn-xs update_user_button"><i class="fa fa-gg"></i>封号</a> ';
                        }
                        if(row.state == 1 ){
                             html += ' <a   data-op="0" class="bgbtn btn btn-info btn-xs update_user_button"><i class="fa fa-pencil"></i>解禁言</a> '
                             html += ' <a data-op="2" class="bgbtn btn btn-success btn-xs update_user_button"><i class="fa fa-gg"></i>封号</a> ';
                        }
                        if(row.state == 2 ){    
                            html += ' <a   data-op="0" class="bgbtn btn btn-success btn-xs update_user_button"><i class="fa fa-gg"></i>解封号</a> ';
                        }
                        return html;
                    }
                },

            ],
            beforeRequest: function () {
                _this.element.find("[page='inquire'] .search_button").addClass("processing");
            },
            loadComplete: function () {
                _this.element.find("[page='inquire'] .search_button").removeClass("processing");
            },
            viewrecords: true,
            width: '100%',
            height: 580,
            rowNum: 30,
            autowidth: true,
            shrinkToFit: false,
            pager: "#jqGridPager"
        });
    },
    bindEvent: function () {
        var _this = this;
        //  查询 按钮
        this.element.on("click", "[page='inquire'] .search_button", function (e) {
            _this.search()
        });
        // 新增 操作的三个按钮
        this.element.on("click", "[page='inquire'] .add_button", function (e) {
            utils.clear(['add-user-name', 'add-user-pwd', 'add-user-nickname', 'add-user-ico'])
            _this.element.find("[page='add']").addClass("active").siblings("[page]").removeClass("active");
        });
        this.element.on("click", "[page='add'] .back_button", function (e) {
            _this.element.find("[page='inquire']").addClass("active")
                .siblings("[page]").removeClass("active");
        });
        this.element.on("click", "[page='add'] .save_button", function (e) {
            var obj = {
                name: $(".add-user-name").val(),
                number: $(".add-user-number").val(),
                password: $(".add-user-pwd").val(),
                nickname: $(".add-user-nickname").val(),
                img: $("#add-user-ico").val(),
                type: $(".add-user-type").val(),
                qq: $("#add-user-qq").val() || ' ',
                wechat: $("#add-user-wechat").val() || ' ',
                email: $("#add-user-email").val() || ' ',
                phone: $("#add-user-phone").val() || ' ',
            }
            if (_this.check(obj)) {
                $.ajaxSettings.async = false;
                _this.uploadImg('add-user-ico').then(function (icoimg) {
                    if (icoimg.status) {
                        obj.img = icoimg.path
                        _this.add(obj).then(function (data) {
                            if (data.status) {
                                $(".add-user-ret").html("")
                                _this.flush({});
                                _this.element.find("[page='inquire']").addClass("active").siblings("[page]").removeClass("active");
                            } else {
                                $(".add-user-ret").html(data.message)
                            }
                        })
                    } else {
                        $(".add-user-ret").html("图片上传异常")
                    }
                })
            }
        });
        this.element.on("click", "[page='inquire'] .exported_button", function (e) {

            $.get('./playing/user/excel', {  type: $(".search-user-type").val(), }, function (data) {
                _this.sleep(500)
                window.location.href = "/playing/rank/excel_file"
            }, 'json');
        });
        this.element.on("click", "[page='inquire'] .update_user_button", function (e) {
            $(this).parent().click()
            var id = $("#jqGrid").jqGrid("getGridParam", "selrow");
            var data ={
                state:$(this).data("op") 
            }
            utils.dialog(["确定更改此用户", function () {
                _this.update(id,data)
            }, null])
        });
        this.element.on("click", "[page='inquire'] .del_user_button", function (e) {
            $(this).parent().click()
            var id = $("#jqGrid").jqGrid("getGridParam", "selrow");

            utils.dialog(["确定删除此用户", function () {
                _this.delete(id)
            }, null])
        });
        //	 修改操作的三个按钮
        this.element.on("click", "[page='inquire'] .fix_user_button", function (e) {
            $(this).parent().click()
            utils.clear(['update-user-ico'])
            var id = $("#jqGrid").jqGrid("getGridParam", "selrow");
            var rowData = $("#jqGrid").jqGrid('getRowData', id);
            $(".update-user-name").val(rowData.name)
            $(".update-user-id").val(id)
            $(".update-user-number").val(rowData.number)
            $(".update-user-nickname").val(rowData.nickname)
            $(".update-user-type").val(rowData.type)

            $(".update-user-qq").val(rowData.qq)
            $(".update-user-wechat").val(rowData.wechat)
            $(".update-user-email").val(rowData.email)
            $(".update-user-phone").val(rowData.phone)
            _this.element.find("[page='update']").addClass("active").siblings("[page]").removeClass("active");
        });

        this.element.on("click", "[page='update'] .back_button", function (e) {
            _this.element.find("[page='inquire']").addClass("active").siblings("[page]").removeClass("active");
        });

        this.element.on("click", "[page='update'] .save_button", function (e) {
            var data = {
                name: $(".update-user-name").val(),
                number: $(".update-user-number").val(),
                password: $(".update-user-pwd").val(),
                nickname: $(".update-user-nickname").val(),
                img: $("#update-user-ico").val(),
                type: $(".update-user-type").val(),
                qq: $("#update-user-qq").val(),
                wechat: $("#update-user-wechat").val(),
                email: $("#update-user-email").val(),
                phone: $("#update-user-phone").val(),
            }
            var id = $(".update-user-id").val();
            if (data.img.length > 0) { //仅上传二维码
                _this.uploadImg('update-user-ico').then(function (ico) {
                    if (ico.status) {
                        data.img = ico.path
                        _this.update(id,data)
                    } else {
                        $(".update-user-ret").html("图片上传异常")
                    }
                })
            } else {
                _this.update(id,data)
            }
        });
    },

    /*
     * 共用代码 刷新表格 缩短代码篇幅
     */
    flush: function (data, page) {
        $("#jqGrid").jqGrid('setGridParam', {
            url: './playing/users',
            datatype: 'json',
            postData: data,
            page: page ? page : $('#jqGrid').getGridParam('page'),
        }).trigger("reloadGrid");
    },

    /**
     * 查詢
     */
    search: function () {
        var data = {
            id: $(".search-user-id").val().trim(),
            number: $(".search-user-number").val().trim(),
            nickname: $(".search-user-nickname").val().trim(),
            type: $(".search-user-type").val(),
        }
        this.flush(data, 1);
    },

    /**
     * 初始化新增頁面
     */
    initAdd: function () {
        //	TODO 清除所有'新增'頁面欄位的數值
    },
    check: function (data) {
        if (data.name.length < 1) {
            $(".add-user-ret").html("请输入名称");
            return false;
        }

        if (data.password.length == 0) {
            $(".add-user-ret").html("请设置一个密码");
            return false;
        }
        if (data.nickname.length == 0) {
            $(".add-user-ret").html("请取个昵称");
            return false;
        }
        if (data.img.length == 0) {
            $(".add-user-ret").html("选择一个头像图片");
            return false;
        }
        return true;
    },
    add: function (data) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                "url": "./playing/user",
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
    /**
     * 初始化修改頁面
     */
    initModify: function (data) {},
    /**
     * 初始化設定
     */
    initConfig: function () {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve();
            }, 500);
        });
    },
    /**
     * 更新設定
     */
    updateConfig: function () {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve();
            }, 500);
        });
    },

    sleep: function (sec) {
        var exitTime = new Date().getTime() + sec;
        while (new Date().getTime() < exitTime) {}
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
    update: function (id,data) {
        var _this = this;
        $.ajax({
            "url": "./playing/user/" + id,
            "type": "put",
            "data": data,
            "dataType": "json",
            "success": function (ret) {
                if (ret.status) {
                    _this.flush({});
                    $("[page='inquire']").addClass("active").siblings("[page]").removeClass("active");
                    $(".update-master-ret").html("")
                } else {
                    $(".update-master-ret").html(ret.message)
                }
            },
            "error": function (xhr, txt) {
                $(".update-master-ret").html(txt)
            }
        });
    },
    delete: function (id) {
        var _this = this;
        $.ajax({
            "url": "./playing/user/" + id,
            "type": "delete",
            "dataType": "json",
            "success": function (ret) {
                if (ret.status) {
                    _this.flush({});
                    $("[page='inquire']").addClass("active").siblings("[page]").removeClass("active");
                } else {
                    alert(ret.message)
                }
            },
            "error": function (xhr, txt) {}
        });
    },
    resize: function (width, height) {
        this.jqGrid.setGridWidth($(".x_content").width());
    },
}
