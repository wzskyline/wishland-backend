var live_gift_recording = {
    merchant: 'sgl818',
    modeData: {
        tcgAccountName: null,
        tcgToken: null,
        nickName: null,
        modelUserId: ' '
    },
    giftId: null,
    _start_time: new Date(utils.getDay(0)[0]).getTime(),
    _end_time: new Date(utils.getDay(0)[1]).getTime(),
    _userKey: null,
    _giftId: null,
    giftsMap: null,
    init: function () {
        var _this = this;
        this._jqGrid = this.element.find("#jqGrid_list");

        return new Promise(function (resolve, reject) {

            _this.initComponent();

            _this.bindEvent();

            // 获取主播列表、礼物列表
            _this.getModelListGiftList();

            resolve();
        })
    },
    destroy: function () {

    },

    initComponent: function () {
        var _this = this;

        // 日期控件
        this.element.find('input[name="dates"]').daterangepicker({
            autoUpdateInput: true,
            timePicker24Hour: true,
            locale: {
                applyLabel: "确定",
                cancelLabel: "取消",
                format: 'YYYY-MM-DD HH:mm:ss',
                daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            }
        });

        // 礼物列表
        this.element.find("#jqGrid").jqGrid({
            url: "./live/live_show_mgt/getLiveItemTransactions",
            postData: {
                merchant: _this.merchant,
                userKey: _this._userKey,
                modelUserId: _this.modeData.modelUserId,
                itemId: _this._giftId,
                page: 1,
                size: 50,
                fromTS: _this._start_time,
                toTS: _this._end_time
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
                        return obj.data.data;
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
                    width: 60,
                    formatter: function (value, options, row) {

                        return options.rowId
                    }
                },
                {
                    label: '玩家账号',
                    name: 'userKey',
                    width: 150
                },
                {
                    label: '玩家昵称',
                    name: 'nickName',
                    width: 100
                },
                {
                    label: '礼物名称',
                    name: 'itemId',
                    width: 150,
                    formatter: function (value, options, row) {

                        return _this.giftsMap[row.itemId] ? _this.giftsMap[row.itemId].description : '未知礼物';
                    }
                },
                {
                    label: '消耗香币',
                    name: 'livePoints',
                    width: 150,
                    formatter: function (value, options, row) {
                        var livePoints = row.livePoints === 0 ? '' : row.livePoints;
                        return livePoints = livePoints ? livePoints.format() : '';
                    }
                },
                {
                    label: '消耗真钱币',
                    name: 'points',
                    width: 150,
                    formatter: function (value, options, row) {

                        return row.points === 0 ? '' : row.points;
                    }
                },
                {
                    label: '主播账号',
                    name: 'modelUserKey',
                    width: 100
                },
                {
                    label: '主播昵称',
                    name: 'modelNickName',
                    width: 100
                },
                {
                    label: '送礼时间',
                    name: 'txnTS',
                    width: 150,
                    align: 'center',
                    formatter: function (value, options, row) {

                        return utils.getTime(new Date(row.txnTS).getTime());
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
            rowNum: 50,
            autowidth: true,
            pager: "#jqGridPager"
        });

    },
    bindEvent: function () {
        var _this = this;

        //	按下'查詢'按鈕
        var modelUserId, giftId, userId;
        this.element.on("click", "[page='inquire'] .search_button", function (e) {

            // 获取
            modelUserId = _this.element.find("[data-name='modeList'] option:selected").val();
            giftId = _this.element.find("[data-name='giftList'] option:selected").val();
            userId = _this.element.find("[data-name='userId']").val();

            // 存储
            _this.giftId = giftId;
            _this._userKey = userId.replace(/\s/g, "");
            _this.modeData.modelUserId = modelUserId;
            _this._giftId = giftId;
            _this.search();
        });

        // 日期查询
        this.element.find('input[name="dates"]').on('apply.daterangepicker', function (ev, picker) {
            var startDate = picker.startDate.format('YYYY/MM/DD HH:mm:ss'),
                endDate = picker.endDate.format('YYYY/MM/DD HH:mm:ss');

            _this._start_time = new Date(startDate).getTime();
            _this._end_time = new Date(endDate).getTime();

            _this._timeLength = $(this).val().length;
            _this.search();
        });

        // 导出礼物数据
        this.element.on("click", ".export_button", function () {
            utils.exporExcel("刷礼物记录", 'export');
        });

        // 回车查询
        this.element.find("[data-name='userId']").on("keyup", function (ev) {
            if (ev.keyCode === 13) {
                _this.element.find("[page='inquire'] .search_button").trigger("click");
            }
        });
    },

    /**
     * 获取礼物列表与主播列表
     */
    getModelListGiftList: function () {
        var _this = this;
        $.when(
            $.ajax({
                url: "/live/live_show_mgt/getModelList",
                dada: {
                    merchant: _this.merchant,
                    type: "onShow"
                }
            }),
            $.ajax({
                url: "/live/live_show_mgt/getGiftList",
                data: {
                    merchant: _this.merchant
                }
            })

        ).done(function (modelList, giftList) {

            // 主播列表
            if (modelList[0].status) {

                // 生成主播列表
                _this.setModeListShow(modelList[0].data);

                // 存储默认主播数据
                _this.modeData.tcgToken = '';
                _this.modeData.modelUserId = modelList[0].data[0].userId;
            }

            // 礼物列表
            if (giftList[0].status) {

                var list = giftList[0].data;
                var giftArr = [];
                _this.giftsMap = {};
                for (var i = 0, il = list.length; i < il; i++) {
                    var giftInfo = list[i];
                    _this.giftsMap[giftInfo.itemId] = giftInfo;
                    giftArr.push(giftInfo);
                }

                _this.setGiftListShow(giftArr);
            }

        }).fail(function (xhr) {
            $.messager({
                status: 'error',
                message: xhr.responseJSON.errorCode
            });
        });
    },

    /**
     * 设置主播列表页面显示
     */
    setModeListShow: function (modeArr) {
        var html = '<option value="">全部</option>';
        modeArr = modeArr || [];

        for (var i = 0, l = modeArr.length; i < l; i++) {
            html += '<option value="' + modeArr[i].userId + '">' + modeArr[i].userKey + '-' + modeArr[i].nickName + '</option>'
        }

        this.element.find("[data-name='modeList']").html(html);
    },

    /**
     * 设置礼物列表页面显示
     */
    setGiftListShow: function (giftArr) {
        var html = '<option value="">全部</option>';
        giftArr = giftArr || [];

        for (var i = 0, l = giftArr.length; i < l; i++) {
            html += '<option value="' + giftArr[i].itemId + '">' + giftArr[i].description + '</option>'
        }

        this.element.find("[data-name='giftList']").html(html);
    },

    /**
     * 查詢
     */
    search: function () {
        var _this = this;
        //	TODO 查詢
        this.element.find("#jqGrid").jqGrid('setGridParam', {
            postData: {
                merchant: _this.merchant,
                userKey: _this._userKey,
                modelUserId: _this.modeData.modelUserId,
                itemId: _this._giftId,
                fromTS: _this._start_time,
                toTS: _this._end_time
            }
        }).trigger("reloadGrid");
    },

    // 窗口大小变化
    resize: function (width, height) {
        this._jqGrid.setGridWidth($(".x_panel").width());
    },
}
