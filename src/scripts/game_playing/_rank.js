var game_playing_rank = {
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
    destroy: function () {
        this.element.off();
        this.element.remove();
        this.element = null;
    },
    initComponent: function () {
        var _this = this;
        this.initSelect()
        this.element.find(".all-rank-div").hide()
        this.showtoday()
    },
    bindEvent: function () {
        var _this = this;
        //  查询 按钮
        this.element.on("click", "[page='inquire'] .search_button", function (e) {
            _this.search()
        });
        this.element.find(".nav_tabs li").on("click", function () {
            $(this).addClass("active").siblings().removeClass("active");
        });
        this.element.on("click", "[page='inquire'] .add_button", function (e) {
            utils.clear(['add-rank-no', 'add-rank-uid', 'add-rank-nickname', 'add-rank-ico', 'add-rank-gain'])
            _this.element.find("[page='add']").addClass("active").siblings("[page]").removeClass("active");
        });
        this.element.on("click", "[page='inquire'] .del_rank_button", function (e) {
            $(this).parent().click()
            var id = $("#jqGrid").jqGrid("getGridParam", "selrow");
            utils.dialog(["确定删除此记录", function () {
                _this.delete(id)
            }, null])
        });
        this.element.on("click", "[page='add'] .save_button", function (e) {
            var data = {
                rank: parseInt($(".add-rank-no").val()),
                uid: parseInt($(".add-rank-uid").val()),
                unickname: $(".add-rank-nickname").val(),
                img: $("#add-rank-ico").val(),
                brand: $(".rank-brand-select").val(),
                gain: parseInt($(".add-rank-gain").val()),
            }
            if (_this.check(data)) {
                $(".add-rank-ret").html("")
                $.ajaxSettings.async = false;
                _this.uploadImg('add-rank-ico').then(function (icoimg) {
                    if (icoimg.status) {
                        data.img = icoimg.path
                        _this.add(data).then(function (ret) {
                            if (ret.status) {
                                $(".add-rank-ret").html("")
                                _this.flush({});
                                _this.element.find("[page='inquire']").addClass("active").siblings("[page]").removeClass("active");
                            } else {
                                $(".ret").html(ret.data)
                            }
                        }).finally(function () {});
                    } else {
                        $(".add-rank-ret").html("上传图片错误");
                    }

                })
            }
        });
        this.element.on("click", "[page='add'] .back_button", function (e) {
            _this.element.find("[page='inquire']").addClass("active").siblings("[page]").removeClass("active");
            _this.flush({});
        });
        //切换 查看类别选择
        this.element.on("click", ".today", function (e) {

            _this.showtoday()
        });
        this.element.on("click", ".all-rank", function (e) {

            _this.showall()
        });
        //导数据模块的四个绑定事件
        this.element.on("click", "[page='inquire'] .excle_button", function (e) {
            //选择导入 展开导入 面板 
            _this.element.find("[page='excle']").addClass("active").siblings("[page]").removeClass("active");
        });
        this.element.on("click", "[page='excle'] .back_button", function (e) {
            //elcle 返回 按钮
            _this.element.find("[page='inquire']").addClass("active").siblings("[page]").removeClass("active");
            _this.flush({});
        });
        this.element.on("click", "[page='excle'] .save_button", function (e) {
            //上传文件并 进行写数据库
            _this.uploadExcle("add-rank-excle").then(function (ret) {
                if (ret.status) {
                    _this.element.find("[page='inquire']").addClass("active").siblings("[page]").removeClass("active");
                    _this.flush({});
                }
            })
        });

        this.element.on("click", "[page='inquire'] .exported_button", function (e) {
            //传入导入类型进行 2次ajax 请求
            var obj = {
                type: $(".today-div").is(':hidden') ? "all" : "today"
            }
            $.get('./playing/rank/excel', obj, function (data) {
                _this.sleep(500)
                window.location.href = "/playing/rank/excel_file"
            }, 'json');
        });
    },
    /*
     * 共用代码 刷新表格 缩短代码篇幅
     */
    flush: function (data, page) {
        $("#jqGrid").jqGrid('setGridParam', {
            url: './playing/ranks',
            datatype: 'json',
            postData: data,
            page: page ? page : $('#jqGrid').getGridParam('page'),
        }).trigger("reloadGrid");
    },
    /*
     * 共用代码 刷新表格 缩短代码篇幅
     */
    flush2: function (data, page) {
        $("#jqGrid2").jqGrid('setGridParam', {
            url: './playing/ranks',
            datatype: 'json',
            postData: data,
            page: page ? page : $('#jqGrid2').getGridParam('page'),
        }).trigger("reloadGrid");
    },
    /**
     * 查詢
     */
    search: function () {
        var _this = this;
        var data = {
            uid: $(".search-rank-uid").val(),
            unickname: $(".search-rank-nickname").val(),
            type: 'today'
        }
        var type = $(".today-div").is(':hidden') ? "all" : "today"
        if (type == 'all') {
            data.type = 'all'
            _this.flush2(data, 1);
        } else {

            data.type = 'everday'
            _this.flush(data, 1);
        }
    },
    sleep: function (sec) {
        var exitTime = new Date().getTime() + sec;
        while (new Date().getTime() < exitTime) {}
    },
    check: function (data) {
        var maxRank = 0;
        var all = $("#jqGrid").jqGrid("getRowData");
        if (all.length > 1) {
            maxRank = parseInt(all[all.length - 1].rank)

        }
        if (!data.rank) {
            $(".add-rank-ret").html("排行不能为空");
            return false;
        }
        if (data.rank <= maxRank) {
            $(".add-rank-ret").html("排行应低于现有数据");
            return false;
        }
        if (!data.uid) {
            $(".add-rank-ret").html("玩家编号不能为空");
            return false;
        }
        if (data.unickname.length < 1) {
            $(".add-rank-ret").html("玩家昵称不能为空");
            return false;
        }
        if (data.img.length < 1) {
            $(".add-rank-ret").html("玩家头像不能为空");
            return false;
        }
        if (data.brand.length < 1) {
            $(".add-rank-ret").html("所在平台不能为空");
            return false;
        }
        if (!data.gain) {
            $(".add-rank-ret").html("盈利不能为空");
            return false;
        }
        return true;
    },
    add: function (data) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                "url": "./playing/rank",
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
    showtoday: function () {
        var _this = this;
        this.element.find(".today-div").show()
        this.element.find(".all-rank-div").hide()
        $("#jqGrid").jqGrid({
            url: "./playing/ranks",
            postData: {
                type: "everday"
            },
            mtype: "GET",
            styleUI: 'Bootstrap',
            datatype: "json",
            colModel: [{
                    label: '排行榜',
                    name: 'rank',
                    align: 'center',
                    width: 100
                },
                {
                    label: '日期',
                    name: 'created_at',
                    align: 'center',
                    width: 100,
                    formatter: function (value, options, row) {
                        return moment(value).format('YYYY-MM-DD');
                    }
                },

                {
                    label: '玩家账号',
                    name: 'uid',
                    width: 100,
                    align: 'center',
                },
                {
                    label: '玩家昵称',
                    name: 'unickname',
                    width: 150,
                    align: 'center',
                },
                {
                    label: '所在平台',
                    name: 'brand',
                    width: 150,
                    align: 'center',
                    formatter: function (value, options, row) {
                        return _this.brands[value] ? _this.brands[value] : '--';
                    }
                },
                {
                    label: '盈利',
                    width: 150,
                    name: "gain",
                    align: 'center',
                },
                {
                    label: '操作',
                    name: 'op',
                    align: 'center',
                    width: 157,
                    align: 'center',
                    formatter: function (value, options, row) {
                        var html = ' ';
                        html += ' <a class="bgbtn btn btn-info btn-xs del_rank_button"><i class="fa fa-pencil"></i>删除</a> ';
                        return html;
                    }
                },
                {
                    label: ' ',
                    width: 650,
                }
            ],
            width: '100%',
            height: 500,
            rowNum: 30,
            autowidth: true,
            shrinkToFit: false,
            pager: "#jqGridPager"
        });
    },
    showall: function () {
        this.element.find(".today-div").hide()
        this.element.find(".all-rank-div").show()
        $("#jqGrid2").jqGrid({
            url: "./playing/ranks",
            postData: {
                type: "all"
            },
            mtype: "GET",
            styleUI: 'Bootstrap',
            datatype: "json",
            colModel: [{
                    label: '排行榜',
                    name: 'rank',
                    align: 'center',
                    width: 100
                },
                {
                    label: '玩家账号',
                    name: 'uid',
                    align: 'center',
                    width: 100,
                },
                {
                    label: '玩家昵称',
                    name: 'unickname',
                    align: 'center',
                    width: 100,
                },

                {
                    label: '盈利',
                    width: 151,
                    name: "sum",
                    align: 'center',
                },

                {
                    label: ' ',
                    width: 1100,
                }
            ],
            width: '100%',
            height: 500,
            rowNum: 30,
            autowidth: true,
            shrinkToFit: false,
            rowNum: 30,
            pager: "#jqGridPager2"
        });
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
    /**
     * 上传excle
     */
    uploadExcle: function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            $.ajaxSettings.async = false;
            var imgPath = "";
            $.ajaxFileUpload({
                url: './playing/rank/excels',
                secureuri: false,
                fileElementId: id,
                processData: false,
                contentType: false,
                dataType: 'application/json',
                success: function (s, status) {
                    resolve(JSON.parse(s.substring(s.indexOf('{'), s.indexOf('}') + 1)));
                    _this.flush({});
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
    delete: function (id) {
        var _this = this;
        $.ajax({
            "url": "./playing/rank/" + id,
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
    initSelect: function () {
        var brands = [];
        var _this = this;
        $.ajaxSettings.async = false
        $.get("./playing/system/brand", function (data) {
            brands = data
            $.each(brands, function (i, o) {
                _this.brands[o.key] = o.value
                if (i == 1) {
                    $(".rank-brand-select").append("<option value='" + o.key + "' selected>" + o.value + "</option>");
                } else {
                    $(".rank-brand-select").append("<option value='" + o.key + "'>" + o.value + "</option>");
                }
            });
        }, 'json')
    },
    resize: function (width, height) {
        this.jqGrid.setGridWidth($(".x_content").width());
    },

}
