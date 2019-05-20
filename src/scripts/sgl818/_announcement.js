var sgl818_announcement = {
    jqGrid: null,
    _merchant: 'sgl818',
    daterangepickerConfig: {
        autoUpdateInput: true,
        language: 'zh-CN',
        format: 'YYYY-MM-DD HH:mm:ss',
        timePicker: true,
        singleDatePicker: true,
        timePicker24Hour: true,
        locale: {
            applyLabel: "确定",
            cancelLabel: "取消",
            format: 'YYYY-MM-DD HH:mm:ss',
            daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        }
    },
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

    },
    initComponent: function () {
        var _this = this;

        // 初始化时间
        this.element.find('input[name="start_time"]').daterangepicker(this.daterangepickerConfig);
        this.daterangepickerConfig.startDate = utils.getDay(0)[1].format();
        this.element.find('input[name="end_time"]').daterangepicker(this.daterangepickerConfig);

        this.element.find("#jqGrid").jqGrid({
            url: "",
            postData: {

            },
            mtype: "GET",
            styleUI: 'Bootstrap',
            datatype: "json",
            colModel: [{
                    label: '消息类型',
                    name: 'OrderID',
                    key: true,
                },
                {
                    label: '开始时间',
                    name: 'CustomerID',
                },
                {
                    label: '状态',
                    align: 'center',
                    formatter: function (value, options, row) {
                        return '<a class="btn btn-primary btn-xs" style="width:60px;">状态</a>';
                    }
                },
                {
                    label: '创建人',
                    name: 'OrderDate',
                },
                {
                    label: '结束时间',
                    name: 'Freight',
                },
                {
                    label: '状态',
                    name: 'ShipName',
                },
                {
                    label: '操作',
                    align: 'center',
                    formatter: function (value, options, row) {
                        var html = '';
                        html += '<a class="btn btn-primary btn-xs"><i class="fa fa-folder"></i> 检视 </a>';
                        html += '<a class="btn btn-info btn-xs modify_button"><i class="fa fa-pencil"></i> 编辑 </a>';
                        html += '<a class="btn btn-danger btn-xs"><i class="fa fa-trash-o"></i> 删除 </a>';
                        return html;
                    }
                }
            ],
            beforeRequest: function () {
                _this.element.find("[page='inquire'] .search_button").addClass("processing");
            },
            loadComplete: function () {
                _this.element.find("[page='inquire'] .search_button").removeClass("processing");
            },
            autowidth: true,
            viewrecords: true,
            height: 450,
            rowNum: 30,
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
            //	跳轉至'新增'頁面
            _this.element.find("[page='add']").addClass("active")
                .siblings("[page]").removeClass("active");
        });

        //	按下'返回'按鈕
        this.element.on("click", "[page='add'] .back_button", function (e) {
            _this.element.find("[page='inquire']").addClass("active")
                .siblings("[page]").removeClass("active");
            _this.clearMessage();
        });

        // 按下‘发布公告'按钮
        var announcementData = {},
            $this_success;
        this.element.on("click", "[data-name='release_buttom']", function () {

            $this_success = $(this);
            announcementData.eventType = _this.element.find("[data-name='announcement_type'] option:selected").val();
            announcementData.priority = _this.element.find("[data-name='grade'] option:selected").val();
            announcementData.msg = _this.element.find("[data-name='textarea']").val();
            if (_this.verification(announcementData.msg)) {

                $this_success.button('loading');
                _this.sendBroadcastAnnouncement(announcementData, $this_success);

            }
        });
    },

    // 窗口大小变化
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
     * 清除訊息
     */
    clearMessage: function () {
        this.element.find("[data-name='textarea']").val("");
    },

    /**
     * 验证公告
     */
    verification: function (meg) {

        if (meg === "") {
            $.messager({
                status: 'error',
                message: "请输入需要发送的公告内容"
            });
            return false
        }

        return true;
    },

    /**
     * 发送公告
     */
    sendBroadcastAnnouncement: function (data, $this_success) {
        var _this = this;
        $.ajax({
            url: "/live/live_show_mgt/sendBroadcastAnnouncement",
            method: 'POST',
            data: {
                senderUserKey: user.getUsername(),
                receiverMerchant: _this._merchant,
                eventCategory: "LIVE_SHOW_PUBLIC",
                eventType: data.eventType,
                priority: data.priority,
                msg: data.msg,
            }
        }).always(function () {
            $this_success.button('reset');
        }).done(function (rs) {
            if (rs.status) {
                $.messager({
                    message: "发送公告成功"
                });
            } else {
                $.messager({
                    status: 'error',
                    message: "发送公告失败"
                });
            }

        }).fail(function (xhr, status, err) {
            $.messager({
                status: 'error',
                message: xhr.responseJSON.message
            });
        })
    }
}
