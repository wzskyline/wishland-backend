var live_live_inquire = {
    merchant: 'sgl818',
    jqGrid: null,
    init: function () {
        var _this = this;
        this.jqGrid = $("#jqGrid");
        return new Promise(function (resolve, reject) {
            // 初始化查询时间
            _this._start_time = utils.getDay(-30)[0].format("yyyy-MM-dd");
            _this._end_time = utils.getDay(0)[1].format("yyyy-MM-dd");

            _this.initComponent();
            _this.bindEvent();
            _this.getModelList();
            // 初始化显示时间
            _this.element.find("[name='dates']").val(_this._start_time + " 至 " + _this._end_time);
            resolve();
        })
    },
    destroy: function () {

    },
    initComponent: function () {

        var _this = this;
        this.element.find('input[name="dates"]').daterangepicker({
            autoUpdateInput: false,
            timePicker24Hour: true,
            format: 'YYYY-MM-DD',
            // startDate: utils.getDay(-30)[0].format(),
            // minDate: utils.getDay(-30)[0].format(),
            locale: {
                cancelLabel: 'Clear',
                format: 'YYYY-MM-DD HH:mm:ss',
                daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                applyLabel: '确认',
                cancelLabel: '取消',
            }
        });

        this.element.find("#jqGrid").jqGrid({
            url: "/live/live_show_mgt/getModelSummaryReport",
            postData: {
                modelUserId: "",
                fromDate: _this._start_time,
                toDate: _this._end_time
            },
            mtype: "GET",
            styleUI: 'Bootstrap',
            datatype: "json",
            jsonReader: {
                repeatitems: false,
                root: function (obj) {
                    if (obj.status) {
                        for (var i = 0, l = obj.data.length; i < l; i++) {
                            obj.data[i].OrderID = i + 1;
                        }
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
                    label: '日期',
                    name: 'summaryDate',
                    width: 150,
                    formatter: function (value, option, row) {
                        return new Date(row.summaryDate).format()
                    }
                },
                {
                    label: '品牌',
                    width: 100,
                    align: 'center'
                },
                {
                    label: '主播账号',
                    name: 'userKey',
                    width: 150
                },
                {
                    label: '主播昵称',
                    name: 'nickName',
                    width: 150
                },
                {
                    label: '香币',
                    name: 'livePoints',
                    width: 150
                },
                {
                    label: '真钱',
                    name: 'points',
                    width: 150
                },
                {
                    label: '托',
                    name: 'fakeLivePoints',
                    width: 150
                }
            ],
            beforeRequest: function () {
                _this.element.find("[page='inquire'] .search_button").addClass("processing");
            },
            loadComplete: function () {
                _this.element.find("[page='inquire'] .search_button").removeClass("processing");
            },
            viewrecords: true,
            height: 450,
            footerrow: true,
            gridComplete: function () {
                var rowNum = parseInt($(this).getGridParam('records'), 10);
                if (rowNum > 0) {

                    $(".ui-jqgrid-sdiv").show();
                    var livePoints = $(this).getCol('livePoints', true, 'sum');
                    var points = $(this).getCol('points', true, 'sum');
                    var fakeLivePoints = $(this).getCol('fakeLivePoints', true, 'sum');

                    $(this).footerData("set", {
                        "OrderID": "<span>钱币合计<span>",
                        "livePoints": "<span>" + livePoints.format() + "<span>",
                        "points": "<span>" + points.format() + "<span>",
                        "fakeLivePoints": "<span>" + fakeLivePoints.format() + "<span>"
                    });

                } else {
                    $(".ui-jqgrid-sdiv").hide();
                }
            },
            autowidth: true,
            // pager: "#jqGridPager"
        })
    },
    bindEvent: function () {
        var _this = this;

        //	按下'查詢'按鈕
        this.element.on("click", "[page='inquire'] .search_button", function (e) {
            var subData = {
                modelUserId: _this.element.find("[data-name='modeList'] option:selected").val(),
                fromDate: _this._start_time,
                toDate: _this._end_time
            }
            _this.search(subData);
        });

        // 日期查询
        this.element.find('input[name="dates"]').on('apply.daterangepicker', function (ev, picker) {
            var startDate = picker.startDate.format('YYYY-MM-DD'),
                endDate = picker.endDate.format('YYYY-MM-DD');
            if (utils.isExceedMonth(startDate, endDate)) {
                $.messager({
                    status: 'error',
                    message: "查询日期不能超过一个月"
                });
                return
            }
            _this._start_time = startDate;
            _this._end_time = endDate;
            $(this).val(startDate + " 至 " + endDate);

        });
    },
    // 窗口大小变化
    resize: function (width, height) {
        this.jqGrid.setGridWidth($(".x_panel").width());
    },
    /**
     * 查詢
     */
    search: function (subData) {
        //	TODO 查詢
        this.element.find("#jqGrid").jqGrid('setGridParam', {
            postData: {
                modelUserId: subData.modelUserId,
                fromDate: subData.fromDate,
                toDate: subData.toDate,
            }
        }).trigger("reloadGrid");
    },

    /**
     * 获取主播帐号列表
     */
    getModelList: function () {

        var _this = this;
        $.ajax({
            url: "/live/live_show_mgt/getModelList",
            dada: {
                merchant: _this.merchant
            }
        }).done(function (rs) {
            if (rs.status) {
                // 生成主播列表
                _this.settModeListShow(rs.data);
            }
        }).fail(function (xhr, status, err) {
            $.messager({
                status: 'error',
                message: xhr.responseJSON.errorCode
            });
        })
    },

    /**
     * 设置主播列表页面显示
     */
    settModeListShow: function (modeArr) {
        var html = '<option value="">全部</option>';
        modeArr = modeArr || [];
        for (var i = 0, l = modeArr.length; i < l; i++) {
            html += '<option value="' + modeArr[i].userId + '">' + modeArr[i].userKey + '-' + modeArr[i].nickName + '</option>'
        }
        this.element.find("[data-name='modeList']").html(html);
    },
}
