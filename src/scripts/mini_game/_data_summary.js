var mini_game_data_summary = {
    jqGrid: null,
    parameters: {
        "merchantCode": $(".type-select option:selected").val()
    },
    init: function () {
        var _this = this;
        this.jqGrid = $("#jqGrid");
        return new Promise(function (resolve, reject) {
            _this.initComponent();
            _this.initSelect();
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
        this.typeInfo().then(function (value) {
            var merchants = [];
            $.each(value.merchants, function (i, o) {
                merchants[o.code] = o.name
            });
            _this.element.find("#jqGrid").jqGrid({
                url: "./backend/summaries",
                postData: {
                    size: 30
                },
                mtype: "GET",
                styleUI: 'Bootstrap',
                datatype: "json",
                colModel: [{
                        label: '编号',
                        name: 'id',
                        key: true,
                        width: 40
                    },
                    {
                        label: '日期',
                        width: 150,
                        formatter: function (value, options, row) {
                            return moment(row.summaryDate).format("YYYY-MM-DD HH:mm:ss");
                        }
                    },
                    {
                        label: '品牌',
                        width: 150,
                        formatter: function (value, options, row) {
                            return merchants[row.merchantCode];
                        }
                    },
                    {
                        label: '总参与人数',
                        name: 'customerCount',
                        width: 120
                    },
                    {
                        label: '总参与人次',
                        name: 'orderCount',
                        width: 120
                    },
                    {
                        label: '总下注金额',
                        name: 'betAmount',
                        width: 120
                    },
                    {
                        label: '总结算金额',
                        name: 'winAmount',
                        width: 120
                    },
                    {
                        label: '总访问人数',
                        name: 'loginCustomerCount',
                        width: 120
                    },
                    {
                        label: '平台利润',
                        name: 'profit',
                        width: 120
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
                height: 560,
                rowNum: 30,
                autowidth: true,
                pager: "#jqGridPager"
            });
        });
        this.element.find('input[name="dates"]').daterangepicker({
            autoUpdateInput: false,
            locale: {
                cancelLabel: 'Clear'
            }
        });
    },
    bindEvent: function () {
        var _this = this;
        this.element.find('input[name="dates"]').on('apply.daterangepicker', function (ev, picker) {
            var startDate = picker.startDate.format('YYYY-MM-DD HH:mm:ss'),
                endDate = picker.endDate.format('YYYY-MM-DD HH:mm:ss');
            $(this).val(startDate + " ~ " + endDate);
        });

        //	按下'查詢'按鈕
        this.element.on("click", "[page='inquire'] .search_button", function (e) {
            _this.search();
        });
    },
    /**
     * 获取类别  装填 表单 select
     */
    initSelect: function () {
        this.typeInfo().then(function (value) {
            $.each(value.merchants, function (i, o) {
                if (i == 1) {
                    $(".type-select").append("<option value='" + o.code + "' selected>" + o.name + "</option>");
                } else {
                    $(".type-select").append("<option value='" + o.code + "'>" + o.name + "</option>");
                }
            });
        });
    },
    typeInfo: function () {
        return new Promise(function (resolve, reject) {
            $.get("./backend/question_info", function (data) {
                var data = data.data;
                resolve(data);
            }, 'json');
        });
    },
    /**
     * 查詢
     */
    search: function () {
        var _this = this;
        _this.parameters.merchantCode = $(".type-select option:selected").val();
        var timeArr = $(".bet-time").val().split("~");
        if (String.isNotEmpty($(".bet-time").val())) {
            _this.parameters["startTime"] = new Date(timeArr[0]).getTime();
            _this.parameters["endTime"] = new Date(timeArr[1]).getTime();
        } else {
            _this.parameters["startTime"] = new Date().getTime() - 31507200;
            _this.parameters["endTime"] = new Date().getTime();
        }
        this.element.find("#jqGrid").jqGrid('setGridParam', {
            postData: _this.parameters,
            page: 1
        }).trigger("reloadGrid");
    },
    resize: function (width, height) {
        this.jqGrid.setGridWidth($(".x_content").width());
    },
}
