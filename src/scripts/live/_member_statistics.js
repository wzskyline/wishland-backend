var live_member_statistics = {
    liveType: 'admin',
    upperRecord: {
        merchant: 'sgl818',
        type: 'LIVE_POINTS_UPDATE'
    },
    batchJobId: null,
    upperRecordArr: [],
    userKey: null,
    admin_merchant: 'sgl818',
    levelSMap: {},
    _hashS: null,
    // 直播会员管理
    _jqGrid_admin: null,
    // 批量上分记录-批次
    _jqGrid_upperRecordRecording: null,

    init: function (params) {
        var _this = this;
        this.userKey = params.userKey;
        this._hashS = $("#sidebar-menu").find('[data-name="hash"]');
        // 直播会员管理
        this._jqGrid_admin = $("#jqGrid_admin");
        // 批量上分记录-批次
        this._jqGrid_upperRecordRecording = $("#jqGrid_upperRecordRecording");

        return new Promise(function (resolve, reject) {
            _this.initComponent();
            _this.bindEvent();
            _this.switchliveType(_this.userKey === null ? _this.liveType : 'admin');
            _this.getClassificationConfigs();
            resolve();
        })
    },
    destroy: function () {},
    initComponent: function () {
        var _this = this;
        //  检查权限 - 批量上分
        var batchAddScore = user.hasPermissions("live:model:member_batch_add_score"),
            //  检查权限 - 直播会员统计
            statistics = user.hasPermissions("live:model:member_statistics"),
            //  检查权限 - 批量上分记录
            batchScoreList = user.hasPermissions("live:model:member_batch_score_list");
        if (!batchAddScore) {
            this.element.find("[data-permissions='batchAddScore']").remove();
        }
        if (!statistics) {
            this.element.find("[data-permissions='statistics']").remove();
        }
        if (!batchScoreList) {
            this.element.find("[data-permissions='batchScoreList']").remove();
        }

        // 直播会员统计
        this.element.find("#jqGrid_statistics").jqGrid({
            url: "./resources/example1_data.json",
            postData: {
                size: 30
            },
            mtype: "GET",
            styleUI: 'Bootstrap',
            datatype: "json",
            colModel: [{
                    label: '编号',
                    name: 'OrderID',
                    align: 'center',
                    key: true,
                    width: 60
                },
                {
                    label: '会员类型',
                    name: 'CustomerID',
                    align: 'center',
                    width: 150,
                    formatter: function (value, options, row) {
                        var html = '';
                        html = '贵宾';
                        return html;
                    }
                },
                {
                    label: '等级',
                    width: 100,
                    align: 'center',
                    formatter: function (value, options, row) {
                        var html = '';
                        html = '1';
                        return html;
                    }
                },
                {
                    label: '数量',
                    name: '',
                    width: 150,
                    formatter: function (value, options, row) {
                        var html = '';
                        html = 10;
                        return html;
                    }
                },
                {
                    label: '统计时间',
                    name: 'OrderDate',
                    width: 150
                },
                {
                    label: '操作',
                    width: 200,
                    align: 'center',
                    formatter: function (value, options, row) {
                        var html = '';
                        html += '<a class="btn btn-primary btn-xs"><i class="glyphicon glyphicon-refresh"></i> 刷新 </a>';
                        html += '<a class="btn btn-info btn-xs view_button"><i class="glyphicon glyphicon-eye-open"></i> 查看 </a>';
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
            height: 550,
            rowNum: 30,
            autowidth: true,
            pager: "#jqGridPager_statistics"
        });

        // 批量上分记录-批次
        this.element.find("#jqGrid_upperRecordRecording").jqGrid({
            url: "./live/live_show_mgt/getLivePointsUpdateBatches",
            postData: {
                merchant: _this.upperRecord.merchant,
                type: _this.upperRecord.type,
                size: 30
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
                        return obj.data.data
                    }
                }
            },
            colModel: [{
                    label: '编号',
                    name: '',
                    key: true,
                    align: 'center',
                    width: 75,
                    formatter: function (value, options, row) {
                        var text = options.rowId;
                        return text
                    }
                },
                {
                    label: '备注',
                    name: 'description',
                    width: 200
                },
                {
                    label: '操作人员',
                    name: '',
                    width: 150
                },
                {
                    label: '上传时间',
                    name: 'createTS',
                    width: 200,
                    align: 'center',
                    formatter: function (value, options, row) {
                        return utils.getTime(new Date(row.createTS).getTime());
                    }
                },
                {
                    label: '提交时间',
                    name: 'updateTS',
                    width: 200,
                    align: 'center',
                    formatter: function (value, options, row) {
                        return utils.getTime(new Date(row.updateTS).getTime());
                    }
                },
                {
                    label: '数据量',
                    name: 'totalCount',
                    width: 100,
                    formatter: function (value, options, row) {
                        // 因为上传文件的时候第一行文本格式（帐号,上分金额）会被忽略不做出来，当这里请求的时候，也会被返回来，所以需要减去-个；
                        var text = (row.processedCount >= 1 ? row.processedCount - 1 : row.processedCount) + '/' + row.totalCount;
                        return text
                    }
                },
                {
                    label: '状态',
                    name: 'status',
                    width: 80,
                    formatter: function (value, options, row) {
                        var text = '';
                        if (row.status === "U") {
                            text = '未处理'
                        } else if (row.status === 'D') {
                            text = '已成功'
                        }
                        return text
                    }
                },
                {
                    label: '操作',
                    name: 'center',
                    width: 120,
                    formatter: function (value, options, row) {
                        var html = '';
                        html += '<a class="btn btn-info btn-xs upperRecord_button" data-batch_job_id="' + row.batchJobId + '"><i class="glyphicon glyphicon-eye-open"></i> 数据预览 </a>';
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
            height: 570,
            rowNum: 30,
            autowidth: true,
            pager: "#jqGridPager_upperRecordRecording"
        });

        // 批量上分记录-数据详情
        this.element.find("#jqGrid_upperRecordDetails").jqGrid({
            url: "./live/live_show_mgt/getLivePointsUpdateBatchDetails",
            postData: {
                size: 30
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
                    var data = obj.data.data;
                    var dataArr = [];

                    for (var i = 0, l = data.length; i < l; i++) {
                        if (data[i].type !== "H") {
                            dataArr.push(data[i])
                        }
                    }
                    return dataArr
                }
            },
            colModel: [{
                    label: '玩家账号',
                    name: 'data',
                    width: 150,
                    formatter: function (value, options, row) {
                        var account = row.data.split(",")[0];
                        return account;
                    }
                },
                {
                    label: '玩家昵称',
                    name: '',
                    width: 150
                },
                {
                    label: '添加直播币',
                    name: 'data',
                    width: 120,
                    formatter: function (value, options, row) {
                        var amount = row.data.split(",")[1];
                        return (amount * 1).format();
                    }
                },
                {
                    label: '实时余额',
                    name: '',
                    width: 120
                },
                {
                    label: '状态',
                    name: 'status',
                    width: 80,
                    formatter: function (value, options, row) {
                        var text = '';
                        if (row.status === "U") {
                            text = '未处理'
                        } else if (row.status === 'D') {
                            text = '已成功'
                        }
                        return text
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
            height: 550,
            rowNum: 30,
            pager: "#jqGridPager_upperRecordDetails"
        });

        // 批量上分文件内容
        this.element.find("#jqGrid_upperRecord").jqGrid({
            url: "./live/live_show_mgt/getLivePointsUpdateBatchDetails",
            postData: {
                size: 30
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
                    var data = obj.data.data;
                    var dataArr = [];

                    for (var i = 0, l = data.length; i < l; i++) {
                        if (data[i].type !== "H") {
                            dataArr.push(data[i])
                        }
                    }
                    return dataArr
                }
            },
            colModel: [{
                    label: '玩家账号',
                    name: 'data',
                    width: 150,
                    formatter: function (value, options, row) {
                        var account = row.data.split(",")[0];
                        return account;
                    }
                },
                {
                    label: '玩家昵称',
                    name: '',
                    width: 150
                },
                {
                    label: '添加直播币',
                    name: 'data',
                    width: 120,
                    formatter: function (value, options, row) {
                        var amount = row.data.split(",")[1];
                        return (amount * 1).format();
                    }
                },
                {
                    label: '实时余额',
                    name: '',
                    width: 120
                },
                {
                    label: '状态',
                    name: 'status',
                    width: 80,
                    formatter: function (value, options, row) {
                        var text = '';
                        if (row.status === "U") {
                            text = '未处理';
                        } else if (row.status === 'D') {
                            text = '已成功';
                        }
                        _this.upperRecordArr.push(row.status);
                        return text
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
            height: 550,
            rowNum: 30,
            pager: "#jqGridPager_upperRecord"
        });
    },

    bindEvent: function () {
        var _this = this;

        //	按下'查詢'按鈕
        this.element.on("click", "[page='inquire'] .search_button", function (e) {
            _this.getSearchVal($(this).attr("data-name"));
        });

        // 按下刷新
        var clickType;
        this.element.on("click", "[page='inquire'] .exported_button", function (e) {
            clickType = $(this).attr("data-name");
            if (clickType === 'admin') {
                _this.getSearchVal('admin');
            } else if (clickType === 'upperRecordRecording') {
                _this.searchUpperRecord();
            }
            _this.resize();
        });

        //	按下'修改'按鈕
        this.element.on("click", "[page='inquire'] .view_button", function (e) {
            _this.initView(_this.testData);
            _this.element.find("[page='view']").addClass("active").siblings("[page]").removeClass("active");
        });

        // 按下'返回'按钮
        this.element.on("click", '.back_button', function () {
            _this.element.find("[page='inquire']").addClass("active")
                .siblings("[page='" + $(this).attr("data-name") + "']").removeClass("active");
            // 按下的是批量上分的'返回'按钮
            if ($(this).attr("data-name") === 'modifyScore') {
                _this.clearModifyScoreData();
            }
        });

        //	批量上分记录- 按下'数据预览'按鈕
        var batchJobId;
        this.element.on("click", "[page='inquire'] .upperRecord_button", function (e) {
            batchJobId = $(this).attr("data-batch_job_id");
            _this.searchLivePointsUpdateBatchDetails_upperRecordDetails(batchJobId);
            _this.element.find("[page='upperRecord']").addClass("active").siblings("[page]").removeClass("active");
        });

        // 按下上分按钮
        this.element.find(".push_button").on("click", function () {
            _this.element.find("[page='modifyScore']").addClass("active").siblings("[page]").removeClass("active");
        });

        // 切换直播类型
        this.element.find("[data-name='live_type']").on("click", "li", function () {
            _this.switchliveType($(this).attr("data-type"));
        });

        // 选择文件
        this.element.on("change", '#file', function () {
            var file = this.files[0];
            _this.element.find(".showTextName").val(file.name);
        });

        // 上传文件
        var data, _merchant, _type, _description;
        this.element.find("[data-name='upload']").on("click", function () {
            var modifyScore = _this.element.find("[data-name='modifyScore']");
            data = {};
            if (_this.element.find(".showTextName").val() === '' || $(this).hasClass('disabled')) {
                return
            }
            // 存储参数
            _merchant = modifyScore.find("[data-name='merchant'] option:selected").val();
            _description = modifyScore.find("[data-name='textarea']").val();
            _type = modifyScore.find("[data-name='livePointsType'] option:selected").val();

            // 设置参数
            _this.element.find("[name='merchant']").val(_merchant);
            _this.element.find("[name='type']").val(_type);
            _this.element.find("[name='description']").val(_description);

            // 提交参数
            _this.updateLivePoints(data, $(this));

        });

        // 提交上分成功ID
        this.element.find("[data-name='submit']").on("click", function () {
            if ($(this).hasClass("disabled") && !_this.batchJobId) {
                return
            }
            _this.submitLivePointsUpdateBatch(_this.batchJobId, $(this));
        });

        // 提交单个上分
        var singleModifyScore, data;
        this.element.find("[data-name='submitSingleModifyScore']").on("click", function () {
            data = {};
            singleModifyScore = _this.element.find("[data-name='singleModifyScore']");
            var userId = singleModifyScore.find("[data-name='userId']").attr("data-user_id");
            var creditPoints = singleModifyScore.find("[data-name='amount_creditPoints']").val();
            var forcedBalance = singleModifyScore.find("[data-name='amount_forcedBalance']").val();
            if (!creditPoints && !forcedBalance) {
                _this.element.find(".modal-backdrop").hide();
                _this.element.find("[data-name='singleModifyScore']").hide();
                $.messager({
                    status: 'error',
                    message: "【上分金额】与【强制修改金额】请选择一项填写",
                    determine: function () {
                        _this.element.find(".modal-backdrop").show();
                        _this.element.find("[data-name='singleModifyScore']").show();
                    }
                });

                return
            } else if (creditPoints && forcedBalance) {
                _this.element.find(".modal-backdrop").hide();
                _this.element.find("[data-name='singleModifyScore']").hide();
                $.messager({
                    status: 'error',
                    message: "【上分金额】与【强制修改金额】只能二选一填写",
                    determine: function () {
                        _this.element.find(".modal-backdrop").show();
                        _this.element.find("[data-name='singleModifyScore']").show();
                    }
                });
                return
            }
            if (creditPoints) {
                data.creditPoints = creditPoints;
            }
            if (forcedBalance) {
                data.forcedBalance = forcedBalance;
            }
            data.userId = userId;
            _this.submitSingleModifyScore(data, $(this));
        });

        // 限制【上分金额】只能为数字和小数点
        this.element.find("[data-name='amount_creditPoints']").on('input', function () {
            utils.onlyNumber(this);
        });

        // 限制【强制修改金额】只能为数字和小数点
        this.element.find("[data-name='amount_forcedBalance']").on('input', function () {
            utils.onlyNumber(this);
        });

        // 关闭提交单个上分信息窗口
        this.element.find("[data-dismiss='modal']").on("click", function () {
            _this.closeModal();
        });

        // 打开提交单个上分信息窗口
        var userInfo;
        this.element.on("click", "[data-button='openModal']", function () {
            // 获取ID和帐号
            userInfo = _this.getUserInfo($(this));
            // 设置ID和帐号
            _this.element.find("[data-name='singleModifyScore'] [data-name='userId']")
                .attr("data-user_id", userInfo.userId).text(userInfo.userKey);
            // 打开单个上分窗口
            _this.openModal();
        });

        // 禁言/解除禁言
        this.element.on("click", "[data-name='prohibited']", function () {
            userInfo = _this.getUserInfo($(this));
            _this.setProhibitedStatus(userInfo.userId, userInfo.status);
        });

        // 修改会员类型
        this.element.on("click", "[data-name='modifyPlayerType']", function () {
            userInfo = _this.getUserInfo($(this));
            userType = userInfo.userType == 'A' ? '-' : 'A'
            _this.modifyPlayerType(userInfo.userId, {
                userType: userType
            });
        });

        // 点击帐号 进入香格里拉 【会员管理】
        this.element.on("click", "[data-name='queryMember']", function () {
            if (_this.isHash('#/' + $(this).attr("data-url"))) {
                window.location.hash = '#/' + $(this).attr("data-url") + '?&userKey=' + $(this).attr("data-user_key");
            }
        });

        // 输入框回车查询
        this.element.find("[data-name='admin_input']").on("keyup", function (ev) {
            if (ev.keyCode === 13) {
                _this.getSearchVal('admin');
            }
        });
    },

    /**
     *  获取等级列表配置
     */
    getClassificationConfigs: function () {
        var _this = this;
        $.ajax({
            url: "/live/live_show/getClassificationConfigs",
            method: 'GET',
            data: {
                merchant: _this.admin_merchant
            }
        }).done(function (rs) {

            if (rs.status) {
                var levelArr = rs.data;
                var levelInfo;

                for (var i in levelArr) {
                    for (var j = 0, k = levelArr[i].length; j < k; j++) {
                        levelInfo = levelArr[i][j];
                        _this.levelSMap[levelInfo.classificationId] = levelInfo;
                    }
                }

                // 获取直播会员列表
                _this.getUsers();
            } else {
                $.messager({
                    status: 'error',
                    message: rs.message
                });
            }
        }).fail(function (xhr, status, err) {

            $.messager({
                status: 'error',
                message: xhr.responseJSON.errorCode
            });

        })
    },

    /**
     *  获取直播会员
     */
    getUsers: function () {
        var _this = this;
        // 直播会员管理
        this.element.find("#jqGrid_admin").jqGrid({
            url: "/live/live_show_mgt/getUsers",
            postData: {
                merchant: _this.admin_merchant,
                page: 1,
                size: 30
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
                root: function (obj) {
                    if (obj.status) {
                        return obj.data.data
                    }
                }
            },
            colModel: [{
                    label: '编号',
                    name: 'OrderID',
                    key: true,
                    width: 60,
                    align: 'center',
                    formatter: function (value, options, row) {
                        return options.rowId
                    }
                },
                {
                    label: '玩家账号',
                    name: 'merchant_user_key',
                    width: 150,
                    align: 'center',
                    formatter: function (value, options, row) {
                        return '<a href="javascript:;" style="color: #0ba3f7;padding: 10px;padding-left: 0" data-name="queryMember" data-url="sgl818_member_manage" data-user_key="' + row.merchant_user_key + '">' + row.merchant_user_key + '</a>'
                    }
                },
                {
                    label: '玩家昵称',
                    name: 'nick_name',
                    align: 'center',
                    width: 150

                },
                {
                    label: '香币',
                    name: 'live_points_bal',
                    width: 100,
                    formatter: function (value, options, row) {
                        return row.live_points_bal.format()
                    }
                },
                {
                    label: '贵宾经验',
                    name: 'classification_2_val',
                    width: 100,
                    formatter: function (value, options, row) {
                        return row.classification_2_val.format();
                    }
                },
                {
                    label: '贵宾等级',
                    name: 'classification_2_id',
                    align: 'center',
                    width: 100,
                    formatter: function (value, options, row) {
                        return _this.levelSMap[row.classification_2_id].name;
                    }
                },
                {
                    label: '贡献经验',
                    name: 'classification_1_val',
                    width: 80,
                    formatter: function (value, options, row) {
                        return row.classification_1_val.format();
                    }
                },
                {
                    label: '贡献等级',
                    name: 'classification_1_id',
                    align: 'center',
                    width: 80,
                    formatter: function (value, options, row) {
                        return _this.levelSMap[row.classification_1_id].name;
                    }
                },
                {
                    label: '玩家类型',
                    name: 'user_type',
                    width: 80,
                    formatter: function (value, options, row) {
                        return value == 'A' ? '托' : '真人';
                    }
                },
                {
                    label: '登录IP',
                    name: 'center',
                    width: 150
                },
                {
                    label: '登录直播时间',
                    name: 'last_access_ts',
                    width: 150,
                    align: 'center',
                    formatter: function (value, options, row) {
                        return utils.getTime(new Date(row.last_access_ts).getTime());
                    }
                },
                {
                    label: '状态',
                    align: 'center',
                    name: 'msgForbidden',
                    width: 80,
                    formatter: function (value, options, row) {
                        var text = '';
                        if (row.msg_forbidden === 'N') {
                            text = '正常';
                        } else if (row.msg_forbidden === 'YP') {
                            text = '禁言'
                        }
                        return '<span style="color:' + (row.msg_forbidden === 'N' ? '' : ' red') + '">' + text + '</span>';
                    }
                },
                {
                    label: '操作',
                    width: 90,
                    align: 'center',
                    formatter: function (value, options, row) {
                        var html = '',
                            text = '';
                        var status;

                        //  检查权限 - 禁言
                        var permissionsProhibited = user.hasPermissions("live:model:member_prohibited"),
                            //  检查权限 - 加入黑名单
                            permissionsAddBlacklist = user.hasPermissions("live:model:member_add_blacklist"),
                            //  检查权限 - 上分
                            permissionsAddScore = user.hasPermissions("live:model:member_add_score");

                        if (row.msg_forbidden === 'N') {
                            status = 'YP';
                            text = '禁言';
                        } else if (row.msg_forbidden === 'YP') {
                            status = 'N';
                            text = '解除禁言';
                        }
                        html += '<div class="btn-group">';
                        html += '<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">操作';
                        html += '<span class="caret"></span>';
                        html += '</button>';
                        html += '<ul class="dropdown-menu" role="menu" data-status="' + status + '"    data-user_type="' + row.user_type + '" data-user_id="' + row.user_id + '" data-user_key="' + row.merchant_user_key + '" style="left: -93px">';
                        if (permissionsProhibited) {
                            html += '<li data-name="prohibited"><a href="javscript:;">' + text + '</a></li>';
                        }
                        if (permissionsAddBlacklist) {
                            html += '<li><a href="javscript:;">加入黑名单</a></li>';
                        }
                        if (permissionsAddScore) {
                            html += '<li data-button="openModal"><a href="javscript:;">上分</a></li>';
                        }
                        html += '<li data-name="modifyPlayerType"><a href="javscript:;">修改类型</a></li>';
                        html += '<li data-name="queryMember" data-url="sgl818_member_manage"><a href="javscript:;">玩家详情</a></li>';
                        html += '</ul>';
                        html += '</div>';
                        return html;
                    }
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
            height: 550,
            rowNum: 30,
            autowidth: true,
            pager: "#jqGridPager_admin"
        });
    },

    /**
     * 获取查询条件 
     */
    getSearchVal: function (searchType) {
        var upperRecord = this.element.find("[name='upperRecordRecording']"),
            admin = this.element.find("[name='admin']");
        // 直播会员管理查询
        if (searchType === "admin") {
            var data = {};
            // 品牌查询
            data.merchant = admin.find("[name='admin_merchant'] option:selected").val();
            // 账号查询
            data.userName = utils.space(admin.find("[name='userName']").val());
            // 昵称查询
            data.nickName = utils.space(admin.find("[name='nickName']").val());
            // 等级类型查询
            data.classification = admin.find("[name='classification'] option:selected").val();
            // 等级id
            data.classificationId = admin.find("[name='classificationId'] option:selected").val() + "@" + data.classification;
            // 玩家类型
            var userType = admin.find("[name='playerType'] option:selected").val();
            if (userType != 'all') {
                data.userType = userType;
            }
            // 状态
            data.messageForbidden = admin.find("[name='messageForbidden'] option:selected").val();
            // 调用查询
            this.searchAdmin(data);
        }
        // 直播会员统计
        else if (searchType === "statistics") {
            this.searchStatistics();
        }
        // 批量上分记录
        else if (searchType === "upperRecordRecording") {
            this.upperRecord.merchant = upperRecord.find("[name='merchant'] option:selected").val();
            this.upperRecord.type = upperRecord.find("[name='inquireType'] option:selected").val();
            this.searchUpperRecord();
        }
    },

    /**
     * 直播会员管理查询
     */
    searchAdmin: function (data) {
        var _this = this;
        var optionsData = {
            userKey: data.userName,
            nickName: data.nickName,
            userType: data.userType,
            lassAccessFromTS: '',
            lassAccessToTS: '',
            livePointsBalanceFrom: '',
            livePointsBalanceTo: '',
            messageForbidden: data.messageForbidden,
        }
        //  贵宾
        if (data.classification === '0') {
            optionsData.gbClassificationId = data.classificationId
        }
        // 贡献
        else if (data.classification === '1') {
            optionsData.gxClassificationId = data.classificationId
        }
        // 全部
        else if (data.classificationId.length >= 2) {
            optionsData.gbClassificationId = data.classificationId + "0";
            optionsData.gxClassificationId = data.classificationId + "1";
        }
        this.admin_merchant = data.merchant || this.admin_merchant;
        this.element.find("#jqGrid_admin").jqGrid('setGridParam', {
            postData: {
                merchant: data.merchant,
                options: JSON.stringify(optionsData)
            },
            page: 1,
        }).trigger("reloadGrid");
    },

    /**
     * 直播会员统计
     */
    searchStatistics: function () {
        this.element.find("#jqGrid_statistics").jqGrid('setGridParam', {
            postData: {},
            page: 1,
        }).trigger("reloadGrid");
    },

    /**
     * 查询批量上分记录
     */
    searchUpperRecord: function () {
        var _this = this;
        this.element.find("#jqGrid_upperRecordRecording").jqGrid('setGridParam', {
            postData: {
                merchant: _this.upperRecord.merchant,
                type: _this.upperRecord.type
            },
            page: 1,
        }).trigger("reloadGrid");
    },

    /**
     * 查询实时积分跟新批次详细信息-批量上分记录详细信息
     */
    searchLivePointsUpdateBatchDetails_upperRecordDetails: function (batchJobId) {
        this.element.find("#jqGrid_upperRecordDetails").jqGrid('setGridParam', {
            postData: {
                batchJobId: batchJobId
            },
            page: 1,
        }).trigger("reloadGrid");
    },

    /**
     * 查询实时积分跟新批次详细信息-批量上分
     */
    searchLivePointsUpdateBatchDetails_upperRecord: function (batchJobId) {
        this.element.find("#jqGrid_upperRecord").jqGrid('setGridParam', {
            postData: {
                batchJobId: batchJobId
            },
            page: 1,
        }).trigger("reloadGrid");
    },

    /**
     * 初始化查看頁面
     */
    initView: function (data) {
        data = data || [];
        var html = '';
        var id, account, nickname, memberLabel, quantity, grade, regDate;
        if (data.length >= 12) {
            this.element.find("[data-name='table_header']").addClass("padding_right");
        } else {
            this.element.find("[data-name='table_header']").removeClass("padding_right");
        }
        for (var i = 0, l = data.length; i < l; i++) {
            id = i + 1;
            account = data[i].account;
            nickname = data[i].nickname;
            memberLabel = data[i].memberLabel;
            quantity = data[i].quantity;
            grade = data[i].grade;
            regDate = data[i].regDate;
            html += ' <tr role="row"  tabindex="-1" class="jqgrow ui-row-ltr">';
            html += ' 	<td role="gridcell" title="' + id + '" aria-describedby="jqGrid_OrderID" style="width: 10%">' + id + '</td>';
            html += '	<td role="gridcell" title="' + account + '" aria-describedby="jqGrid_CustomerID"  style="width: 16%">' + account + '</td>';
            html += ' 	<td role="gridcell" title="' + nickname + '" aria-describedby="jqGrid_undefined" style="width: 16.1%">' + nickname + '</td>';
            html += ' 	<td role="gridcell" title="' + memberLabel + '" aria-describedby="jqGrid_OrderDate" style="width: 16.1%">' + memberLabel + '</td>';
            html += ' 	<td role="gridcell" title="' + quantity + '" aria-describedby="jqGrid_Freight" style="width: 10.1%">' + quantity + '</td>';
            html += ' 	<td role="gridcell" title="' + grade + '" aria-describedby="jqGrid_undefined" style="width: 10%">' + grade + '</td>';
            html += '  	<td role="gridcell" title="' + regDate + '" aria-describedby="jqGrid_undefined" style="width: 20.1%">' + regDate + '</td>';
            html += ' </tr>';
        }
        this.element.find("[data-name='member_statistics']").html(html);
    },

    /**
     * 設定訊息
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

    /**
     * 切换主播类型
     */
    switchliveType: function (liveType) {
        // 切换类型
        this.liveType = liveType || this.liveType;
        this.element.find("[data-name='live_type']").find("li").removeClass("active");
        this.element.find("[data-name='live_type']").find("[data-type='" + liveType + "']").addClass("active");
        // 切换对应的内容
        this.element.find(".menu").hide();
        this.element.find(".formContent").hide();
        this.element.find("[name='" + liveType + "']").show();
        this.element.find("[data-name='jqGrid_" + liveType + "']").show();
        // 设置查询按钮属性
        this.element.find(".search_button").attr("data-name", liveType);
        this.element.find(".exported_button").attr("data-name", liveType);
        // 请求对应数据
        this.getSearchVal(liveType);
    },

    /**
     * 更新直播点数(上传文件)
     */
    updateLivePoints: function (data, upload) {
        var _this = this;
        upload.addClass("disabled btn-primary").removeClass('btn-danger').text("提交中...");
        _this.setButtonStatus('loding', upload);
        var form = new FormData(document.getElementById("form"));

        $.ajax({
            url: "./live/live_show_mgt/uploadLivePointsUpdateBatch",
            type: "post",
            data: form,
            processData: false,
            contentType: false,
            success: function (data) {
                _this.batchJobId = data.data;
                // 获取实时积分跟新批次详细信息
                _this.searchLivePointsUpdateBatchDetails_upperRecord(data.data);
                _this.setButtonStatus('success', upload);
                _this.element.find("[data-name='modifyScore']").find("[data-name='submit']").removeClass("disabled");
            },
            error: function (e) {
                _this.setButtonStatus('', upload);
                _this.element.find("[data-name='modifyScore']").find("[data-name='submit']").addClass("disabled");
            }
        });
    },

    /**
     * 提交实时积分更新批处理
     */
    submitLivePointsUpdateBatch: function (batchJobId, submit) {
        var _this = this;
        _this.setButtonStatus('loding', submit);
        var element = _this.element.find("[page='modifyScore']").find("[data-name='modifyScore']");
        $.ajax({
            url: "/live/live_show_mgt/submitLivePointsUpdateBatch",
            method: 'POST',
            data: {
                batchJobId: batchJobId
            }
        }).done(function (rs) {
            if (rs.status) {
                _this.setButtonStatus('success', submit);
                _this.closeModalShowStatus(element, 'success', '恭喜你，操作成功');
            } else {
                _this.setButtonStatus('', submit);
                _this.closeModalShowStatus(element, 'error', '操作失败');
            }
        }).fail(function (xhr, status, err) {
            _this.setButtonStatus('', submit);
            _this.closeModalShowStatus(element, 'error', xhr.responseJSON.errorCode);
        })
    },

    /**
     * 提交单个上分
     */
    submitSingleModifyScore: function (data, submit) {
        var _this = this;
        var element = _this.element.find("[data-dismiss='modal']");
        this.setButtonStatus('loding', submit);
        $.ajax({
            url: "/live/live_show_mgt/updateUserLivePoints",
            method: 'POST',
            data: data
        }).always(function () {

        }).done(function (rs) {
            if (rs.status) {
                // 刷新直播会员管理界面
                _this.element.find("[page='inquire'] .exported_button").trigger("click");
                _this.closeModalShowStatus(element, 'success', '恭喜你，操作成功');
            } else {
                _this.closeModalShowStatus(element, 'error', '格式错误，请重试');
            }

        }).fail(function (xhr) {
            _this.closeModalShowStatus(element, 'error', xhr.responseJSON.errorCode);
        });
    },

    /**
     * 关闭单个上分弹窗
     */
    closeModal: function () {
        var singleModifyScore = this.element.find("[data-name='singleModifyScore']");
        singleModifyScore.hide();
        singleModifyScore.find("[data-name='userId']").attr("data-user_id", '').text('');
        singleModifyScore.find("[data-name='amount_creditPoints']").val("");
        singleModifyScore.find("[data-name='amount_forcedBalance']").val("");
        singleModifyScore.find('[data-name="submitSingleModifyScore"]')
            .removeClass('btn-danger disabled').addClass("btn-primary").text("提交");
        this.element.find(".modal-backdrop").hide();
    },

    /**
     * 打开单个上分弹窗
     */
    openModal: function () {
        this.element.find(".modal-backdrop").show();
        this.element.find("[data-name='singleModifyScore']").show();
    },

    /**
     * 设置禁言/解除禁言状态
     */
    setProhibitedStatus: function (userId, status) {
        var _this = this;
        if (!userId && !status) {
            $.messager({
                status: 'error',
                message: '格式错误，请检查代码'
            });
            return
        }
        $.ajax({
            url: "/live/live_show_mgt/updateUserMessageStatus",
            method: 'POST',
            data: {
                userId: userId,
                status: status
            }
        }).done(function (rs1) {
            var status;
            if (rs1.status) {
                status = rs1.data.msgForbidden === "N" ? '解除禁言' : '禁言';
                _this.element.find("[page='inquire'] .exported_button").trigger("click");
                $.messager({
                    message: status + '成功'
                });
            } else {
                $.messager({
                    status: 'error',
                    message: rs1.message
                });
            }

        }).fail(function (xhr, status, err) {
            $.messager({
                status: 'error',
                message: xhr.responseJSON.errorCode
            });
        })
    },

    /**
     * 修改会员类型 托 /真人
     */
    modifyPlayerType: function (userId, updatedInfo) {
        var _this = this;
        if (!userId && !updatedInfo) {
            $.messager({
                status: 'error',
                message: '格式错误，请检查代码'
            });
            return
        }
        $.ajax({
            url: "/live/live_show_mgt/updateUserInfo",
            method: 'POST',
            data: {
                userId: userId,
                updatedInfo: JSON.stringify(updatedInfo),
            }
        }).done(function (rs1) {
            var status;
            if (rs1.status) {

                $.messager({
                    message: '已成功修改玩家类型'
                });

                utils.flushTable('jqGrid_admin', '/live/live_show_mgt/getUsers', {})
            } else {
                $.messager({
                    status: 'error',
                    message: rs1.message
                });
            }
        }).fail(function (xhr, status, err) {
            $.messager({
                status: 'error',
                message: xhr.responseJSON.errorCode
            });
        })
    },

    /**
     * 关闭操作界面弹框，显示状态
     */
    closeModalShowStatus: function (element, status, message) {
        element.trigger("click");
        $.messager({
            status: status, // 三个参数doubt、error、success 默认为 success
            message: message, // 需要填写的text
            determine: '', // 确认回调函数
            cancel: '', // 取消回调函数
            buttonType: '' // 按钮类型默认只有 确定按钮 参数为 addCancel，就会有取消按钮
        });
    },

    /**
     * 设置按钮状态
     */
    setButtonStatus: function (status, element, rm_disabled) {
        if (status === 'loding') {
            element.addClass("disabled btn-primary").removeClass('btn-danger').text("提交中...");
        } else if (status === 'success') {
            element.text("已成功");
        } else {
            element.removeClass("disabled btn-primary").addClass("btn-danger").text("失败重试");
        }
    },

    /**
     *  清除上分数据
     */
    clearModifyScoreData: function () {
        var modifyScore = this.element.find("[page='modifyScore']");
        this.batchJobId = null;
        $("#jqGrid_upperRecord").jqGrid("clearGridData");
        modifyScore.find('.file').remove();
        modifyScore.find('.showTextName').val('');
        modifyScore.find('[data-name="textarea"]').val('');
        modifyScore.find('.fileBox').append('<input type="file" id="file" class="file" name="file-to-upload">');
        modifyScore.find('[data-name="upload"]').removeClass('disabled btn-danger').addClass("btn-primary").text("开始上传");
        modifyScore.find('[data-name="submit"]').removeClass('btn-danger').addClass("disabled  btn-primary").text("开始处理");

        // 重置界面宽度
        this.resize();
    },

    /**
     *  直播会员管理-获取当前操作用户信息
     */
    getUserInfo: function (element) {
        var userObj = {};
        userObj.userId = element.parent().attr('data-user_id');
        userObj.userType = element.parent().attr('data-user_type');
        userObj.userKey = element.parent().attr('data-user_key');
        userObj.status = element.parent().attr('data-status');
        return userObj;
    },

    // 判断hash
    isHash: function (hash) {
        var hashArr = [];
        // 获取到左侧菜单栏中的hash
        var hashS = $("#sidebar-menu").find('[data-name="hash"]');
        for (var i = 0, l = hashS.length; i < l; i++) {
            hashArr.push(hashS.eq(i).attr('href'));
        }
        //  检查当前hash是否存在与左侧菜单栏中
        if (hashArr.indexOf(hash) === -1) {
            return false
        } else {
            return true
        }
    },

    // 窗口大小变化
    resize: function (width, height) {
        var xPanelWidth = $(".x_panel").width();

        // 直播会员管理
        this._jqGrid_admin.setGridWidth(xPanelWidth);
        // 批量上分记录-批次
        this._jqGrid_upperRecordRecording.setGridWidth(xPanelWidth);
    },
}
