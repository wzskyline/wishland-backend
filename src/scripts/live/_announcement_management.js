var live_announcement_management = {
    jqGrid: null,
    merchant: 'sgl818',
    _publisherArr: [{
        admin: user.getUsername(),
        text: '管理员'
    }],
    _announcementData: {
        userId: null,
        modelUserId: null,
        message: null
    },
    init: function () {
        var _this = this;
        this.jqGrid = $("#jqGrid");
        return new Promise(function (resolve, reject) {

            _this.initComponent();

            _this.bindEvent();

            _this.getModelList();

            _this.publisherLsit();
            resolve();
        })
    },
    destroy: function () {

    },
    initComponent: function () {
        var _this = this;

        // 检查权限 - 新增公告
        var announcementAdd = user.hasPermissions("live:model:announcement_add");
        if (!announcementAdd) {
            this.element.find("[data-permissions='announcementAdd']").remove();
        }

        this.element.find("[data-name='adminName']")

        // 日期控件
        this.element.find('input[name="dates"]').daterangepicker({
            autoUpdateInput: false,
            locale: {
                cancelLabel: 'Clear'
            }
        });

        this.element.find("#jqGrid").jqGrid({
            // url: "./resources/example1_data.json",
            postData: {

            },
            mtype: "GET",
            styleUI: 'Bootstrap',
            datatype: "json",
            colModel: [{
                    label: '编号',
                    name: 'OrderID',
                    key: true,
                },
                {
                    label: '内容',
                    name: 'CustomerID',
                },
                {
                    label: '发布人',
                    align: 'center'
                },
                {
                    label: '发布类型',
                    name: '',
                },
                {
                    label: '发布时间',
                    name: 'OrderDate',
                },
            ],
            beforeRequest: function () {
                _this.element.find("[page='inquire'] .search_button").addClass("processing");
            },
            loadComplete: function () {
                _this.element.find("[page='inquire'] .search_button").removeClass("processing");
            },
            height: 500,
            rowNum: 30,
            shrinkToFit: false,
            viewrecords: true,
            pager: "#jqGridPager"
        });
    },
    bindEvent: function () {
        var _this = this;

        //	按下'查詢'按鈕
        this.element.on("click", "[page='inquire'] .search_button", function (e) {
            _this.search();
        });

        //	按下'新增'按鈕
        this.element.on("click", "[page='inquire'] .add_button", function (e) {
            //	初始化新增頁面
            _this.initAdd();
            //	跳轉至'新增'頁面
            _this.element.find("[page='add']").addClass("active")
                .siblings("[page]").removeClass("active");
        });


        //	按下'返回'按鈕
        this.element.on("click", "[page='add'] .back_button", function (e) {
            _this.element.find("[page='inquire']").addClass("active")
                .siblings("[page]").removeClass("active");
        });

        //	按下'返回'按鈕
        this.element.on("click", "[page='modify'] .back_button", function (e) {
            _this.element.find("[page='inquire']").addClass("active")
                .siblings("[page]").removeClass("active");
        });

        // 选择房间
        this.element.on("click", "[data-name='roomBox'] li", function () {

            $(this).addClass("active").siblings().removeClass("active");
            _this._announcementData.modelUserId = $(this).attr("data-model_user_id");
        });

        // 按下'发布公告'按钮
        this.element.on("click", "[data-name='release_buttom']", function () {
            _this._announcementData.senderUserKey = _this.element.find("[data-name='adminName'] option:selected").val();
            _this._announcementData.sendType = _this.element.find("[data-name='sendType'] option:selected").val();
            _this._announcementData.message = _this.element.find("[data-name='textarea']").val();
            _this._announcementData.modelUserId = _this.element.find(".roomBox .active").data("model_user_id");

            if (!_this._announcementData.message) {
                $.messager({
                    status: 'error',
                    message: "公告内容不能为空!"
                });
                return
            }
            if (_this._announcementData.message.length > 200) {
                $.messager({
                    status: 'error',
                    message: "公告内容应不超过200长度!"
                });
                return
            }
            // 发布公告
            _this.sendRoomAnnouncement(_this._announcementData);

        });
    },
    resize: function (width, height) {
        this.jqGrid.setGridWidth($(".x_content").width());
    },
    /**
     * 查詢
     */
    search: function () {
        //	TODO 查詢
        this.element.find("#jqGrid").jqGrid('setGridParam', {
            postData: {

            }
        }).trigger("reloadGrid");
    },
    /**
     * 初始化新增頁面
     */
    initAdd: function () {
        //	TODO 清除所有'新增'頁面欄位的數值
    },


    /**
     * 初始化修改頁面
     */
    initModify: function (data) {
        //	TODO 設定所有'修改'頁面欄位的數值
    },
    /**
     * 修改
     */
    modify: function () {
        //	TODO Ajax提交修改後的內容
        return new Promise(function (resolve, reject) {
            resolve();
        });
    },
    /**
     * 初始化設定 
     */
    initConfig: function () {
        return new Promise(function (resolve, reject) {
            resolve();
        });
    },
    /**
     * 更新設定
     */
    updateConfig: function () {
        return new Promise(function (resolve, reject) {
            resolve();
        });
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

    // 发布人员列表
    publisherLsit: function () {
        var publisherArr = this._publisherArr || [];
        var html = '';

        for (var i = 0, l = publisherArr.length; i < l; i++) {
            html += '<option value="' + publisherArr[i].admin + '">' + publisherArr[i].text + '</option>';
        }

        this.element.find("[data-name='adminName']").html(html);
    },

    // 发布公告
    sendRoomAnnouncement: function (data) {
        var _this = this;
        var buttomData = {
            element: this.element.find("[data-name='release_buttom']"),
            status: true,
            text: '发布中...'
        }
        // 修改按钮状态
        utils.buttomStatus(buttomData);
        $.ajax({
            url: "/live/live_show_mgt/sendRoomAnnouncement",
            method: 'POST',
            data: {
                senderUserKey: data.senderUserKey,
                modelUserId: data.modelUserId,
                msg: data.message
            }
        }).always(function () {
            // 修改按钮状态
            buttomData.status = false;
            buttomData.text = '发布公告'
            utils.buttomStatus(buttomData);
        }).done(function (rs) {
            if (rs.status) {
                $.messager({
                    message: '发布公告成功',
                    determine: function () {
                        _this.clearMessage();
                    }
                })
            } else {
                $.messager({
                    status: 'error',
                    message: '发布公告失败'
                })
            }
        }).fail(function (xhr, status, err) {
            $.messager({
                status: 'error',
                message: xhr.responseJSON.errorCode
            });
        })
    },

    /**
     *  获取主播列表
     */
    getModelList: function () {
        var _this = this;
        $.ajax({
            url: "/live/live_show_mgt/getModelList",
            method: 'GET',
            data: {
                merchant: _this.merchant
            }
        }).done(function (rs) {
            if (rs.status) {
                var data = rs.data;
                var html = '',
                    index = -1;
                var newArr = [];
                for (var i = 0, l = data.length; i < l; i++) {

                    if (data[i].onShow) {
                        index++;
                        newArr.push(data[i]);
                        html += '<li class="' + (index === 0 ? "active" : "") + '" data-model_user_id="' + data[i].userId + '">' + data[i].nickName + '</li>'
                    }
                }

                // 储存默认主播房间
                _this._announcementData.modelUserId = newArr[0].userId;
                _this.element.find(".roomBox").html(html);
            }
        }).fail(function (xhr, status, err) {

        })
    },

    /**
     * 清除訊息
     */
    clearMessage: function () {
        this.element.find("[page='add'] .back_button").trigger("click");
        this.element.find("[data-name='textarea']").val(' ');

        //  初始化选中的房间
        this.element.find("[data-name='roomBox'] li").eq(0)
            .addClass("active").siblings().removeClass("active");
        this._announcementData.modelUserId = this.element.find("[data-name='roomBox'] li")
            .eq(0).attr("data-model_user_id");

    },
}
