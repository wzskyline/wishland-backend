var mini_game_member_manage = {
    userId: 0,
    parameters: {
        "merchantCode": $(".type-select option:selected").val()
    },
    jqGrid: null,
    init: function () {
        var _this = this;
        this.jqGrid = $("#jqGrid");
        return new Promise(function (resolve, reject) {
            _this.initComponent();
            _this.bindEvent();
            _this.initSelect();
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
        var customerStatusArr = [];
        this.typeInfo().then(function (value) {
            _this.element.find("#jqGrid").jqGrid({
                url: "./backend/customers",
                postData: {
                    page: 1,
                    size: 30,
                    merchantCode: "sgl818"
                },
                mtype: "GET",
                styleUI: 'Bootstrap',
                datatype: "json",
                colModel: [{
                        label: 'UID',
                        name: 'id',
                        key: true,
                        width: 75
                    },
                    {
                        label: '用户账号',
                        name: 'name',
                        width: 100
                    },
                    {
                        label: '渠道',
                        name: 'merchantCode',
                        width: 75
                    },
                    {
                        label: '金额(元宝)',
                        name: 'balance',
                        width: 100
                    },
                    {
                        label: '累计投注金额(元宝)',
                        name: 'totalAmount',
                        width: 150
                    },
                    {
                        label: '奖金（元宝）',
                        name: 'totalWinAmount',
                        width: 150
                    },
                    {
                        label: '注册时间',
                        width: 150,
                        formatter: function (value, options, row) {
                            return moment(row.createdAt).format("YYYY-MM-DD HH:mm:ss");
                        }
                    },
                    {
                        label: '注册IP',
                        name: 'reigsterIp',
                        width: 120
                    },
                    {
                        label: '注册设备',
                        name: 'reigsterDevice',
                        width: 100
                    },
                    {
                        label: '操作',
                        width: 200,
                        name: 'op',
                        align: 'center',
                        formatter: function (value, options, row) {
                            var html = '';
                            html += '<a class="btn btn-info btn-xs modify_button"><i class="fa fa-pencil"></i> 上下分  </a>';
                            if (row.status == 1) { //正常 可以 锁定
                                html += '<a class="btn btn-primary btn-xs lock_button"><i class="fa fa-pencil"></i>  锁定  </a>';
                            } else { //  锁定  可以 解锁
                                html += '<a class="btn btn-success btn-xs unlock_button"><i class="fa fa-pencil"></i>   解锁 </a>';
                            }
                            return html;
                        }
                    }, {
                        label: ' ',
                        width: 700,
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
        this.element.find("[page='add'] [name='tags']").tagsInput();
        this.element.find('input.flat').iCheck({
            checkboxClass: 'icheckbox_flat-green',
            radioClass: 'iradio_flat-green'
        });
    },
    bindEvent: function () {
        var _this = this;
        //	按下'查詢'按鈕
        this.element.on("click", "[page='inquire'] .search_button", function (e) {
            _this.search();
        });
        //	按下'锁定'按鈕
        this.element.on("click", "[page='inquire'] .lock_button", function (e) {
            _this.getLineNumber();
            _this.changeStatus(1);
        });
        //	按下'解锁'按鈕
        this.element.on("click", "[page='inquire'] .unlock_button", function (e) {
            _this.getLineNumber();
            _this.changeStatus(2);
        });
        //	按下'上下分'按鈕
        this.element.on("click", "[page='inquire'] .modify_button", function (e) {
            _this.getLineNumber();
            if (_this.userId > 0) {
                _this.element.find("[page='modify']").addClass("active")
                    .siblings("[page]").removeClass("active");
            }
        });
        //	按下'儲存'按鈕
        this.element.on("click", "[page='modify'] .save_button", function (e) {
            _this.changeMoney();
        });
        //	按下'返回'按鈕
        this.element.on("click", "[page='modify'] .back_button", function (e) {
            _this.element.find("[page='inquire']").addClass("active")
                .siblings("[page]").removeClass("active");
        });
    },
    /**
     * 获取类别 
     */
    typeInfo: function () {
        return new Promise(function (resolve, reject) {
            $.get("./backend/question_info", function (data) {
                var data = data.data;
                resolve(data);
            }, 'json');
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
            var transactionNames = value.transactionNames;
            Object.getOwnPropertyNames(transactionNames).forEach(function (val, idx, array) {
                if (val == 0) {
                    $(".edit-type-select").append("<option value='" + val + "' selected>" + transactionNames[val] + "</option>");
                } else if (val == 1) {
                    $(".edit-type-select").append("<option value='" + val + "' >" + transactionNames[val] + "</option>");
                }
            });
        }, function (value) {
            return;
        });
    },
    /**
     * 查詢
     */
    search: function () {
        var _this = this;
        _this.parameters.merchantCode = $(".type-select option:selected").val();
        if ($(".user-select option:selected").val() == 1 && String.isNotEmpty($(".user-msg").val())) {
            _this.parameters["id"] = $(".user-msg").val();
        } else {
            _this.parameters.id = "";
        }
        this.element.find("#jqGrid").jqGrid('setGridParam', {
            postData: _this.parameters,
            page: 1,
        }).trigger("reloadGrid");
    },
    /**
     *  获取当前操作的行
     */
    getLineNumber: function () {
        var id = $('#jqGrid').jqGrid('getGridParam', 'selrow');
        var rowData = $('#jqGrid').jqGrid('getRowData', id);
        if (rowData.length >= 0) {} else {
            this.userId = rowData.id
            $(".user-name").val(rowData.name);
        }
    },
    /**
     *  上下分操作
     */
    changeMoney: function () {
        var _this = this;
        app.startLoading();
        var url = "";
        if ($(".edit-type-select option:selected").val() == 0) {
            url = "./backend/customer/add_money"
        } else {
            url = "./backend/customer/decrease_money"
        }
        var regu = /^[1-9]\d*$/;
        if (!regu.test($(".amount").val())) {
            $(".amount-tips").html("金额需要正值")
        } else {
            $(".amount-tips").html("")
            var remark = $(".remark").val();
            var amount = $(".amount").val();
            $.post(url, {
                "customerId": _this.userId,
                "walletType": 0,
                "amount": amount,
                "remark": remark
            }, function (data) {
                if (data.status) {
                    _this.parameters.page = $('#jqGrid').getGridParam('page');
                    _this.element.find("#jqGrid").jqGrid('setGridParam', {
                        postData: _this.parameters
                    }).trigger("reloadGrid");
                    _this.element.find("[page='modify'] .btn-app").addClass("processing");
                    _this.element.find("[page='inquire']").addClass("active").siblings("[page]").removeClass("active");
                    _this.element.find("[page='modify'] .btn-app").removeClass("processing");
                } else {
                    $(".return-tips").html(data.message)
                }
            }, 'json');
        }
        app.stopLoading();
        spanItems = ['edit-return-tips']
        $.each(spanItems, function (i, o) {
            $("." + o).html("")
        })
    },
    /**
     *  锁定操作
     */
    changeStatus: function (kind) {
        var _this = this;
        app.startLoading();
        var url = " ";
        if (kind == 1) {
            url = "./backend/customers/" + _this.userId + "/lock";
        } else {
            url = "./backend/customers/" + _this.userId + "/unlock";
        }
        $.post(url, {
            "customerId": _this.userId
        }, function (data) {
            _this.element.find("#jqGrid").jqGrid('setGridParam', {
                postData: _this.parameters
            }).trigger("reloadGrid");
        }, 'json');
        _this.userId = 0;
        app.stopLoading();
    },
    resize: function (width, height) {
        this.jqGrid.setGridWidth($(".x_content").width());
    },
}
