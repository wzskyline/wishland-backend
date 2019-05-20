var live_gift_configuration = {
    merchant: 'sgl818',
    init: function () {
        var _this = this;
        this._jqGrid = this.element.find("#jqGrid");

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
        // 权限检查 - 新增
        var giftAdd = user.hasPermissions("live:model:gift_add");
        if (!giftAdd) {
            this.element.find("[data-permissions='giftAdd']").remove();
        }

        this.element.find("#jqGrid").jqGrid({
            url: "live/live_show_mgt/getGiftList",
            postData: {
                merchant: _this.merchant
            },
            mtype: "GET",
            styleUI: 'Bootstrap',
            datatype: "json",
            jsonReader: {
                repeatitems: false,
                root: function (obj) {
                    if (obj.status) {
                        return obj.data;
                    } else {
                        $.messager({
                            status: 'error',
                            message: obj.message
                        });
                    }
                }
            },
            colModel: [{
                    label: '编号',
                    name: 'OrderID',
                    key: true,
                    width: 75
                },
                {
                    label: '显示名称',
                    name: 'code',
                    width: 150
                },
                {
                    label: '礼物图片编号',
                    width: 100,
                    align: 'center'
                },
                {
                    label: '等级',
                    name: 'group',
                    width: 100,
                    align: 'center'
                },
                {
                    label: '价格(香币)',
                    name: 'livePoints',
                    width: 150,
                    formatter: function (value, options, row) {
                        return (row.livePoints * 1).format();
                    }
                },
                {
                    label: '价格(真钱)',
                    name: 'points',
                    width: 150,
                    formatter: function (value, options, row) {
                        return (row.points * 1).format();
                    }
                },
                {
                    label: '添加时间',
                    name: 'ShipName',
                    width: 150
                },
                {
                    label: '操作',
                    width: 200,
                    align: 'center',
                    formatter: function (value, options, row) {
                        var html = '';

                        // 权限检查 - 修改
                        var giftModify = user.hasPermissions("live:model:gift_modify");
                        if (giftModify) {
                            // html += '<a class="btn btn-info btn-xs modify_button"><i class="fa fa-pencil"></i> 修改 </a>';
                            html += '<a class="btn btn-info btn-xs "><i class="fa fa-pencil"></i> 待开发 </a>';
                        }
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
            viewrecords: true,
            width: '100%',
            height: 530,
            rowNum: 30,
            autowidth: true,
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

        //	按下'说明'按鈕
        this.element.on("click", "[page='inquire'] .support_button", function () {
            _this.element.find(".support_modal").modal("show");
        });

        //	按下'修改'按鈕
        this.element.on("click", "[page='inquire'] .modify_button", function (e) {
            //	初始化修改頁面
            _this.initModify();
            //	跳轉至'修改'頁面
            _this.element.find("[page='modify']").addClass("active")
                .siblings("[page]").removeClass("active");
        });

        //	按下'儲存'按鈕
        this.element.on("click", "[page='add'] .save_button", function (e) {
            //	processing
            _this.element.find("[page='add'] .btn-app").addClass("processing");

            _this.add().then(function () {
                _this.element.find("[page='inquire']").addClass("active")
                    .siblings("[page]").removeClass("active");
            }).finally(function () {
                _this.element.find("[page='add'] .btn-app").removeClass("processing");
            });
        });

        //	按下'返回'按鈕
        this.element.on("click", "[page='add'] .back_button", function (e) {
            _this.element.find("[page='inquire']").addClass("active")
                .siblings("[page]").removeClass("active");
        });

        //	按下'儲存'按鈕
        this.element.on("click", "[page='modify'] .save_button", function (e) {
            //	processing
            _this.element.find("[page='modify'] .btn-app").addClass("processing");

            _this.modify().then(function () {
                _this.element.find("[page='inquire']").addClass("active")
                    .siblings("[page]").removeClass("active");
            }).finally(function () {
                _this.element.find("[page='modify'] .btn-app").removeClass("processing");
            });
        });

        //	按下'返回'按鈕
        this.element.on("click", "[page='modify'] .back_button", function (e) {
            _this.element.find("[page='inquire']").addClass("active")
                .siblings("[page]").removeClass("active");
        });
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
     * 新增
     * @return {Promise}
     */
    add: function () {
        //	//	TODO Ajax提交修改後的內容
        return new Promise(function (resolve, reject) {
            resolve();
        });
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

    /**
     * 清除訊息
     */
    clearMessage: function () {
        this.element.find(".alert_message .alert .close").trigger("click");
    },

    // 窗口大小变化
    resize: function (width, height) {
        this._jqGrid.setGridWidth($(".x_panel").width());
    },
}
