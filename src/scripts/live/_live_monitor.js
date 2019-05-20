var live_live_monitor = {
    roomData: {
        userId: null,
        nickName: null,
        userKey: null
    },
    merchant: 'sgl818',
    intervalId: null,
    _jqGrid: null,
    init: function () {

        var _this = this;
        this._jqGrid = this.element.find("#jqGrid");

        return new Promise(function (resolve, reject) {
            _this.initComponent();
            _this.bindEvent();
            _this.interval();
            // 点击查询
            _this.element.find(".search_button").trigger("click");
            resolve();
        })
    },
    destroy: function () {
        clearInterval(this.intervalId);
    },

    initComponent: function () {
        var _this = this;
        // 直播状态查询
        this.element.find("#jqGrid").jqGrid({
            url: "live/live_show_mgt/getUsersInShow",
            postData: {
                size: 50
            },
            mtype: "GET",
            styleUI: 'Bootstrap',
            datatype: "json",
            jsonReader: {
                repeatitems: false,
                total: function (obj) {
                    if (obj.status) {
                        return obj.data.totalPages
                    }
                },
                records: function (obj) {
                    if (obj.status) {
                        return obj.data.totalRecords
                    }
                },
                root: function (obj) {
                    if (obj.status) {
                        var data = obj.data.data;
                        return data
                    }
                }
            },
            colModel: [{
                    label: '编号',
                    name: 'OrderID',
                    key: true,
                    width: 60,
                    formatter: function (value, options, row) {
                        return options.rowId;
                    }
                },
                {
                    label: '玩家账号',
                    name: 'merchant_user_key',
                    width: 150
                },
                {
                    label: '玩家昵称',
                    name: 'nick_name',
                    width: 150
                },
                {
                    label: '访问IP',
                    name: '',
                    width: 160
                },
                {
                    label: '状态',
                    name: 'Freight',
                    width: 100,
                    formatter: function (value, options, row) {
                        return '观看中';
                    }
                },
                {
                    label: '累计观看时长',
                    name: 'last_access_ts',
                    align: 'center',
                    width: 150,
                    formatter: function (value, options, row) {
                        var time = new Date().getTime() - new Date(row.last_access_ts).getTime();
                        return utils.getHMS(time, 'color:#0ba3f7');
                    }
                },
                {
                    label: '操作',
                    width: 90,
                    formatter: function (value, options, row) {
                        var html = '<a class="btn btn-info btn-xs view_button" data-name="' + row.merchant_user_key + '"><i class="glyphicon glyphicon-eye-open"></i> 查看 </a>';
                        return html;
                    }
                }
            ],
            beforeRequest: function () {
                _this.element.find("[page='inquire'] .search_button").addClass("processing");
            },
            loadComplete: function () {
                _this.element.find("[page='inquire'] .search_button").removeClass("processing");
                // 获取在线人数
                _this.element.find("[data-name='onlineUsers']").text($("#jqGrid").jqGrid('getGridParam', 'records'));
            },
            viewrecords: true,
            width: '100%',
            height: 330,
            rowNum: 30,
            autowidth: true,
            pager: "#jqGridPager"
        });

    },

    bindEvent: function () {
        var _this = this;
        // 刷新当前页面
        this.element.find(".exported_button").on("click", function () {
            _this.search();
            // 重置定时器
            _this.interval();
        });
        // 查询
        this.element.find(".search_button").on("click", function () {
            var merchant = _this.element.find("[name='merchant'] option:selected").val();
            _this.merchant = merchant;
            _this.getModelList(merchant);
            _this.interval();
        });
        // 切换房间
        this.element.find("[data-name='roo_tabs']").on("click", "li", function () {
            var userKey;
            if ($(this).hasClass("active")) {
                return
            }
            $(this).addClass("active").siblings().removeClass("active");
            var rooData = $(this).data();
            _this.roomData.userId = rooData.user_id;
            _this.roomData.userKey = rooData.user_key;
            _this.roomData.nickName = rooData.nick_name;

            // 去除账户的“.”，并且转小写
            userKey = _this.setUserkeyEndToLowerCase(rooData.user_key, true);
            _this.search();
            _this.interval();
            _this.element.find("[data-name='modelUser']").text(rooData.nick_name);
            _this.showModeMessage({
                nickName: rooData.nick_name,
                userKey: userKey
            });
        });
        // 进入直播会员统计
        this.element.on("click", '.view_button', function () {
            window.location.hash = '#/live_member_statistics?&userKey=' + $(this).attr("data-name")
        });
    },

    /**
     * 获取主播列表
     */
    getModelList: function (merchant) {
        var _this = this;
        $.ajax({
            url: "/live/live_show_mgt/getModelList",
            method: 'GET',
            data: {
                merchant: merchant
            }
        }).done(function (rs) {
            if (rs.status) {
                _this.showRoomList(rs.data);
            }
        }).fail(function (xhr, status, err) {
            $.messager({
                status: 'error',
                message: xhr.responseJSON.errorCode
            });
        });
    },

    /**
     * 显示主播房间
     */
    showRoomList: function (data) {

        var _this = this;
        var index = -1;
        var html = '',
            newDataArr = [],
            userKey;

        // 过滤
        if (data.length === 0) {
            $("#jqGrid").jqGrid('clearGridData');
            this.element.find("[data-name='roo_tabs']").html('');
            return
        }
        for (var i = 0, l = data.length; i < l; i++) {

            if (data[i].onShow) {
                index++;
                newDataArr.push(data[i]);
                html += ' <li class="' + (index === 0 ? 'active' : '') + '" data-user_key="' + data[i].userKey + '" data-nick_name="' + data[i].nickName + '" data-user_id="' + data[i].userId + '">' + data[i].nickName + '</li>'
            }
        }
        // 储存新数据
        this.roomData.userId = newDataArr[0].userId;
        this.roomData.nickName = newDataArr[0].nickName;
        this.roomData.userKey = newDataArr[0].userKey;

        // 去除账户的“.”，并且转小写
        userKey = this.setUserkeyEndToLowerCase(this.roomData.userKey, true);

        // 生成节点
        this.element.find("[data-name='roo_tabs']").html(html);
        this.showModeMessage({
            nickName: newDataArr[0].nickName,
            userKey: userKey
        });

        // 查询(写延迟的原因是给表单初始化一些时间)
        setTimeout(function () {
            _this.search();
        }, 100)
    },

    /**
     * 直播会员统计
     */
    search: function () {
        var _this = this;
        $("#jqGrid").jqGrid('setGridParam', {
            postData: {
                modelUserId: _this.roomData.userId
            }
        }).trigger("reloadGrid");

    },

    /**
     * 定时器
     */
    interval: function () {
        var _this = this;
        clearInterval(this.intervalId);

        this.intervalId = setInterval(function () {
            _this.search();
        }, 1000 * 30);
    },

    /**
     * 显示主播信息
     */
    showModeMessage: function (data) {
        this.element.find("[data-name='modelUser']").text(data.nickName);
        this.element.find("[data-name='user_img']").attr('src', '../images/mode/' + data.userKey + '.png');
    },

    /**
     * 处理帐号有. 并且是否统一转小写
     */
    setUserkeyEndToLowerCase: function (userKey, status) {
        var userKey
        userKey = userKey.split(".");
        userKey = userKey.length >= 1 ? userKey[1] : userKey[0];
        if (status) {
            userKey = userKey.toLowerCase();
        };
        return userKey
    },

    // 窗口大小变化
    resize: function (width, height) {
        this._jqGrid.setGridWidth($(".left_live_content").width());
    },

}
