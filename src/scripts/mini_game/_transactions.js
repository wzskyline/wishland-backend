var mini_game_transactions = {
    parameters: {
        "merchantCode": $(".type-select option:selected").val()
    },
    jqGrid: null,
    init: function () {
        var _this = this;
        this.jqGrid = $("#jqGrid");
        return new Promise(function (resolve, reject) {
            _this.initSelect();
            _this.initComponent();
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
    initSelect: function (data) {
        this.typeInfo().then(function (value) {
            $.each(value.merchants, function (i, o) {
                if (i == 1) {
                    $(".type-select").append("<option value='" + o.code + "' selected>" + o.name + "</option>");
                } else {
                    $(".type-select").append("<option value='" + o.code + "'>" + o.name + "</option>");
                }
            });
        }, function (value) {
            return;
        });
    },
    initComponent: function () {
        var _this = this;
        this.typeInfo().then(function (value) {
            transactionNames = value.transactionNames;
            _this.element.find("#jqGrid").jqGrid({
                url: "./backend/transactions",
                postData: {
                    page: 1,
                    size: 30,
                    merchantCode: "sgl818"
                },
                mtype: "GET",
                styleUI: 'Bootstrap',
                datatype: "json",
                colModel: [{
                        label: '编号',
                        name: 'id',
                        key: true,
                        width: 75
                    },
                    {
                        label: '账号ID',
                        name: 'customer.id',
                        width: 100
                    },
                    {
                        label: '品牌',
                        name: 'merchantCode',
                        width: 75
                    },
                    {
                        label: 'UID',
                        name: 'customer.id',
                        width: 100
                    },
                    {
                        label: '账号',
                        name: 'customer.name',
                        width: 100
                    },
                    {
                        label: '应用',
                        name: 'merchantCode',
                        width: 75
                    },
                    {
                        label: '账变金额(元宝)',
                        name: 'amount',
                        width: 100
                    },
                    {
                        label: '变后金额(元宝)',
                        name: 'currentBalance',
                        width: 150
                    },
                    {
                        label: '账变类型',
                        width: 130,
                        formatter: function (value, options, row) {
                            var str = " "
                            Object.getOwnPropertyNames(transactionNames).forEach(function (val, idx, array) {
                                if (row.transactionType == val) str = transactionNames[val]
                            });
                            return str
                        }
                    },
                    {
                        label: '账变内容',
                        name: 'remark',
                        width: 150
                    },
                    {
                        label: '账变时间',
                        width: 150,
                        formatter: function (value, options, row) {
                            return moment(row.createdAt).format("YYYY-MM-DD HH:mm:ss");
                        }
                    },
                    {
                        label: ' ',
                        width: 600,
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
                height: 560,
                rowNum: 30,
                autowidth: true,
                pager: "#jqGridPager"
            });
        }, function (value) {
            return;
        });
        this.element.find("input[name='dates']").daterangepicker({
            autoUpdateInput: false,
            locale: {
                cancelLabel: 'Clear'
            }
        });
    },
    bindEvent: function () {
        var _this = this;
        //	按下'查詢'按鈕
        this.element.on("click", "[page='inquire'] .search_button", function (e) {
            _this.search();
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
        if ($(".user-select option:selected").val() == 1 && String.isNotEmpty($(".user-msg").val())) {
            _this.parameters["customerId"] = $(".user-msg").val();
        } else {
            _this.parameters["customerId"] = '';
        }
        this.element.find("#jqGrid").jqGrid('setGridParam', {
            postData: _this.parameters,
            page: 1,
        }).trigger("reloadGrid");
    },
    resize: function (width, height) {
        this.jqGrid.setGridWidth($(".x_content").width());
    },
}
