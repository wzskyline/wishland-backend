var live_member_configuration = {
    _jqGrid: null,
    init: function () {

        var _this = this;
        this._jqGrid = this.element.find("#jqGrid");

        return new Promise(function (resolve, reject) {
            _this.initComponent();
            _this.bindEvent();
            resolve();
        })
    },

    destroy: function () {},

    initComponent: function () {
        var _this = this;

        this.element.find("#jqGrid").jqGrid({
            url: "/live/live_show/getClassificationConfigs",
            postData: {
                merchant: this.merchant,
            },
            mtype: "GET",
            styleUI: 'Bootstrap',
            datatype: "json",
            jsonReader: {
                repeatitems: false,
                root: function (obj) {
                    if (obj.status) {
                        var mergeData = [];
                        for (var key in obj.data) {
                            mergeData = mergeData.concat(obj.data[key]);
                        }
                        return mergeData;
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
                    label: '类型',
                    name: 'name',
                    width: 150
                },
                {
                    label: '等级',
                    name: 'level',
                    width: 100,
                    align: 'center'
                },
                {
                    label: 'icon',
                    name: 'OrderDate',
                    width: 150
                },
                {
                    label: '升级参数',
                    name: 'endNum',
                    width: 150,
                    formatter: function (value, options, row) {

                        return row.endNum ? row.endNum.format() : row.endNum;

                    }
                },
                {
                    label: '冷却时间',
                    name: 'extraData.msg_cooling_secs',
                    width: 150,
                    formatter: function (value, options, row) {
                        var time = row.extraData ? row.extraData.msg_cooling_secs : 0;
                        return time ? utils.getHMS(time, '') : '0'
                    }
                },
                {
                    label: '字数',
                    name: 'extraData.msg_chars_limit',
                    width: 80
                },
                {
                    label: '编辑',
                    width: 80,
                    align: 'center',
                    formatter: function (value, options, row) {
                        var html = '';
                        // 权限检查 - 等级操作
                        var levelModify = user.hasPermissions("live:model:member_level_modify");
                        if (levelModify) {
                            // html += '<a class="btn btn-info btn-xs modify_button"><i class="fa fa-pencil"></i> 编辑 </a>';
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
            _this.initAdd();
            _this.element.find("[page='add']").addClass("active")
                .siblings("[page]").removeClass("active");
        });

        //	按下'修改'按鈕
        this.element.on("click", "[page='inquire'] .modify_button", function (e) {
            _this.initModify();
            _this.element.find("[page='modify']").addClass("active")
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
    initAdd: function () {},

    /**
     * 新增
     * @return {Promise}
     */
    add: function () {
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
