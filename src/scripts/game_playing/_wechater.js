var game_playing_wechater = {
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
        this.jqGrid = $("#jqGrid");
        this.element.find("#jqGrid").jqGrid({
            url: "./playing/wechaters",
            mtype: "GET",
            styleUI: 'Bootstrap',
            datatype: "json",
            colModel: [{
                    label: '编号',
                    name: 'id',
                    align: 'center',
                    key: true,
                    width: 125
                },
                {
                    label: '名称',
                    name: 'name',
                    align: 'center',
                    width: 125
                },
                {
                    label: '三围',
                    name: 'desc',
                    align: 'center',
                    width: 125
                },
                {
                    label: '微信号',
                    name: 'wechat',
                    align: 'center',
                    width: 125
                },
                {
                    label: '头像',
                    width: 150,
                    name: 'img',
                    formatter: function (value, options, row) {
                        return '<img  class="jqgird_ico" src="' + value + '"> </img>';
                    }
                },
                {
                    label: '二维码',
                    width: 150,
                    name: 'qrcode',
                    align: 'center',
                    formatter: function (value, options, row) {
                        return '<img  class="jqgird_ico" src="' + value + '"> </img>';
                    }
                },
                {
                    label: '操作',
                    name: 'op',
                    align: 'center',
                    width: 197,
                    align: 'center',
                    formatter: function (value, options, row) {
                        var html = ' ';
                        html += ' <a class="bgbtn btn btn-info btn-xs fix_wechater_button"><i class="fa fa-pencil"></i>修改</a> ';
                        html += ' <a class="bgbtn btn btn-success btn-xs del_wechater_button"><i class="fa fa-gg"></i>删除</a> ';
                        return html;
                    }
                },
                {
                    label: ' ',
                    width: 550,

                }
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
            utils.clear(['wechater-name', 'add-wechater-ico', 'wechater-desc', 'wechater-no', 'add-wechater-qrcode'])
            _this.element.find("[page='add']").addClass("active").siblings("[page]").removeClass("active");
        });
        this.element.on("click", "[page='add'] .back_button", function (e) {
            _this.element.find("[page='inquire']").addClass("active")
                .siblings("[page]").removeClass("active");
        });
        this.element.on("click", "[page='add'] .save_button", function (e) {
            var obj = {
                name: $(".wechater-name").val(),
                desc: $(".wechater-desc").val(),
                wechat: $(".wechater-no").val(),
                qrcode: $("#img-qrcode").val(),
                img: $("#img-ico").val(),
            }
            if (_this.check(obj)) {
                $.ajaxSettings.async = false;
                _this.uploadImg('img-ico').then(function (icoimg) {
                    if (icoimg.status) {
                        obj.img = icoimg.path
                        _this.uploadImg('img-qrcode').then(function (qrcode) {
                            if (qrcode.status) {
                                obj.qrcode = qrcode.path
                                _this.add(obj).then(function (data) { //上传图片完毕后关闭遮罩  刷新表数据
                                    if (data.status) {
                                        $(".wechat-ret").html("")
                                        _this.flush({});
                                        _this.element.find("[page='inquire']").addClass("active").siblings("[page]").removeClass("active");
                                    } else {
                                        $(".wechat-ret").html(data.message)
                                    }
                                })
                            } else {
                                $(".wechat-ret").html("图片上传异常")
                            }
                        })
                    } else {
                        $(".wechat-ret").html("图片上传异常")
                    }
                })
            }
        });
        //	  
        this.element.on("click", "[page='inquire'] .del_wechater_button", function (e) {
            $(this).parent().click()
            var id = $("#jqGrid").jqGrid("getGridParam", "selrow");

            utils.dialog(["确定删除此客服", function () {
                _this.delete(id)
            }, null])
        });
        //	 修改操作的三个按钮
        this.element.on("click", "[page='inquire'] .fix_wechater_button", function (e) {
            $(this).parent().click()
            utils.clear(['update-wechater-qrcode', 'update-wechater-ico'])
            var id = $("#jqGrid").jqGrid("getGridParam", "selrow");
            var rowData = $("#jqGrid").jqGrid('getRowData', parseInt(id));
            $(".update-wechater-id").val(id)
            $(".update-wechater-name").val(rowData.name)
            $(".update-wechater-no").val(rowData.wechat)
            $(".update-wechater-desc").val(rowData.desc)
            _this.element.find("[page='update']").addClass("active").siblings("[page]").removeClass("active");
        });
        this.element.on("click", "[page='update'] .back_button", function (e) {
            _this.element.find("[page='inquire']").addClass("active").siblings("[page]").removeClass("active");
        });
        this.element.on("click", "[page='update'] .save_button", function (e) {
            var data = {
                name: $(".update-wechater-name").val(),
                desc: $(".update-wechater-desc").val(),
                wechat: $(".update-wechater-no").val(),
                img: $("#update-wechater-ico").val(),
                qrcode: $("#update-wechater-qrcode").val(),
            }
            $.ajaxSettings.async = false;
            if (data.img.length == 0 && data.qrcode.length == 0) { //不更新任何图片直接上传
                _this.update(data)
            } else {
                if (data.img.length > 0) {
                    _this.uploadImg('update-wechater-ico').then(function (ico) {
                        if (ico.status) {
                            data.img = ico.path
                            if (data.qrcode.length == 0) { //仅上传头像
                                _this.update(data)
                            } else { //上传头像和二维码
                                _this.uploadImg('update-wechater-qrcode').then(function (qrcode) {
                                    if (qrcode.status) {
                                        data.qrcode = qrcode.path
                                        _this.update(data)
                                    } else {
                                        $(".update-wechater-ret").html("图片上传异常")
                                    }
                                })
                            }
                        } else {
                            $(".update-wechater-ret").html("图片上传异常")
                        }
                    })
                }
                if (data.img.length == 0 && data.qrcode.length > 0) { //仅上传二维码
                    _this.uploadImg('update-wechater-qrcode').then(function (qrcode) {
                        if (qrcode.status) {
                            data.qrcode = qrcode.path
                            _this.update(data)
                        } else {
                            $(".update-wechater-ret").html("图片上传异常")
                        }
                    })
                }
            }
        });
        //	按下'汇出'按鈕
        this.element.on("click", "[page='inquire'] .exported_button", function (e) {
            //	processing
            _this.element.find("[page='inquire'] .exported_button").addClass("processing");
            _this.exported().finally(function () {
                _this.element.find("[page='inquire'] .exported_button").removeClass("processing");
            });
        });
    },

    /*
     * 共用代码 刷新表格 缩短代码篇幅
     */
    flush: function (data, page) {
        $("#jqGrid").jqGrid('setGridParam', {
            url: './playing/wechaters',
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
            id: $(".search-wechater-id").val(),
            name: $(".search-wechater-name").val(),
            wechat: $(".search-wechater-wechat").val(),
        }
        this.flush(data, 1);
    },
    /**
     * 匯出
     */
    exported: function () {
        //	TODO 導出*.csv
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve();
            }, 500);
        });
    },
    /**
     * 初始化新增頁面
     */
    initAdd: function () {
        //	TODO 清除所有'新增'頁面欄位的數值
    },
    check: function (data) {
        if (data.name.length < 1) {
            $(".wechat-ret").html("名称不能为空");
            return false;
        }
        if (data.desc.length < 1) {
            $(".wechat-ret").html("三围不能为空");
            return false;
        }
        if (data.wechat.length == 0) {
            $(".wechat-ret").html("微信号不能为空");
            return false;
        }
        if (data.img.length == 0) {
            $(".wechat-ret").html("未选择头像图片");
            return false;
        }
        if (data.qrcode.length == 0) {
            $(".wechat-ret").html("未选择二维码图片");
            return false;
        }
        return true;
    },
    add: function (data) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                "url": "./playing/wechater",
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
    update: function (data) {
        var _this = this;
        if (data.name.length < 1) delete data.name;
        if (data.wechat.length < 1) delete data.wechat;
        if (data.desc.length < 1) delete data.desc;
        if (data.img.length < 1) delete data.img;
        if (data.qrcode.length < 1) delete data.qrcode;

        $.ajax({
            "url": "./playing/wechater/" + $(".update-wechater-id").val(),
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
            "url": "./playing/wechater/" + id,
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
            "error": function (xhr, txt) {

            }
        });
    },
    resize: function (width, height) {
        this.jqGrid.setGridWidth($(".x_content").width());
    },
}
