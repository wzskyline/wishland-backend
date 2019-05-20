var live_live_room = {
    testData: [{
        id: 1,
        nickname: '杰克666',
        giftName: '法拉利',
        gameMoney: 2000,
        realMoney: 20000000,
        createDate: '2018-08-17 14:02:02',
        realPerson: '是'
    }, ],
    _merchant: 'sgl818',
    _userKey: '',
    setTheMassesScroll: null,
    setPrivateScroll: null,
    liveModaArr: [],
    modelUserId: null,
    _video: null,
    // 直播管理事件监听
    _liveAdminEvents: {},
    // 直播列表事件监听
    _liveListEvents: {},
    // 房间数据
    _roomData: {},
    // 主播视频id
    _modeVideoId: null,
    // 主播监听事件
    _liveEventHandlers: {},
    // 主播服务系统
    _service: null,
    // 储存当前开播状态
    _liveStatus: true,
    // 视频配置
    _videoConfig: {
        element: null,
        width: 400,
        height: 400
    },
    giftUrlObj: {
        '棒棒糖': './../images/live/gift/level1-candy.png',
        '杯子蛋糕': './../images/live/gift/level1-cake.png',
        '巧克力': './../images/live/gift/level1-chocolate.png',
        '泰迪熊': './../images/live/gift/level1-bear.png',
        '粉红玫瑰': './../images/live/gift/level1-rose.png',
        '爱心': './../images/live/gift/level5-heart.png',
        '音符': './../images/live/gift/level2-music.png',
        '高跟鞋': './../images/live/gift/level2-shoes.png',
        '咖啡': './../images/live/gift/level2-coffee.png',
        '红酒': './../images/live/gift/level2-wine.png',
        '牛排': './../images/live/gift/level2-steak.png',
        '香水': './../images/live/gift/level3-perfume.png',
        '口红': './../images/live/gift/level3-lipstick.png',
        '项链': './../images/live/gift/level3-necklace.png',
        '钻戒': './../images/live/gift/level3-Ring.png',
        '名包': './../images/live/gift/level3-bag.png',
        '跑车': './../images/live/gift/level4-car.png',
        '游艇': './../images/live/gift/level4-yacht.png',
        '别墅': './../images/live/gift/level4-villa.png',
        '火箭': './../images/live/gift/level4-rocket.png',
        '私人飞机': './../images/live/gift/level4-airplane.png',
        '赌博有来回': './../images/live/gift/level5-drink.png',
        '稳如狗': './../images/live/gift/level5-dog.png',
        '中奖了': './../images/live/gift/level5-heart.png',
        '给我砸': './../images/live/gift/level5-za.png',
        '一把梭哈': './../images/live/gift/level5-oldman.png'
    },
    _start_time: null,
    _end_time: null,
    init: function () {
        var _this = this;
        // 主播收益报表统计
        this.jqGrid = $("#jqGrid");
        // 主播收益报表详情
        this.jqGrid2 = $("#jqGrid2");
        this._videoConfig.element = this.element.find("[data-name='liveBox']");

        // 初始化查询时间
        this._start_time = utils.getDay(-30)[0].format("yyyy-MM-dd");
        this._end_time = utils.getDay(0)[1].format("yyyy-MM-dd");
        return new Promise(function (resolve, reject) {

            var go = function () {

                if (app._liveShowModel) {
                    _this._service = app._liveShowModel;
                    _this._modelUserId = _this._service.modelInfo.userId;

                    // 初始化tab类型
                    _this.initTab();
                    // 初始化组建
                    _this.initComponent();
                    // 绑定事件
                    _this.bindEvent();
                    // 获取礼物列表
                    _this.getGiftList();
                    // 刷礼物排行榜待换API
                    // _this.getModelRankBoard();
                    // 在线人数
                    _this.getTopUsersInShow(_this._modelUserId, 50);
                    resolve();
                } else {
                    reject("获取主播服务失败");
                }

            }

            if (TCGTool.getBrowser().browser == "Microsoft Internet Explorer") {
                ScriptManager.load("./plugins/videojs/dists/video-ie8.min.js", function () {
                    go();
                });
            } else {
                ScriptManager.load("./plugins/videojs/dists/video.min.js", function () {
                    go();
                });
            }

        })
    },
    destroy: function () {
        // 离开页面关闭视频
        this.closeVideo();
        // 删除主播监听事件
        this.removeEventHandlers();
        // 重制直播服务变量
        this._service = null;
        // 初始化当前开播状态
        this._liveStatus = true;
    },
    initComponent: function () {

        var _this = this;

        // 收益报表统计
        this.element.find("#jqGrid").jqGrid({
            url: "/live/live_show_mgt/getModelSummaryReport",
            postData: {
                modelUserId: _this._modelUserId,
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
                },
                {
                    label: '查看',
                    width: 200,
                    align: 'center',
                    formatter: function (value, options, row) {
                        var html = '';
                        var time = new Date(row.summaryDate).format();
                        html += '<a class="btn btn-info btn-xs view_button" data-time="' + time + '"><i class="glyphicon glyphicon-eye-open"></i> 详情 </a>';
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
            height: 550,
            footerrow: true,
            gridComplete: function () {
                var rowNum = parseInt($(this).getGridParam('records'), 10);
                if (rowNum > 0) {

                    $(".ui-jqgrid-sdiv").show();
                    var livePoints = $(this).getCol('livePoints', false, 'sum');
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
        });

        // 收益报表详情
        this.element.find("#jqGrid2").jqGrid({
            url: "./live/live_show_mgt/getLiveItemTransactions",
            postData: {
                merchant: _this._merchant,
                modelUserId: _this._modelUserId,
                page: 1,
                size: 50,
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
                root: 'data.data',
            },
            colModel: [{
                    label: '编号',
                    name: 'OrderID',
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
                        var points = row.points === 0 ? '' : row.points;
                        return points = points ? points.format() : '';
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
            // autowidth: true,
            pager: "#jqGridPager2"
        });

        // 观众发言滚动条插件
        this.setTheMassesScroll = utils.setScrollTop(this.element.find(".live_content [data-name='theMassesMessage']"));

        // 私聊发言滚动条插件
        this.setPrivateScroll = utils.setScrollTop(this.element.find("[data-name='private']"));
    },

    // 绑定事件区
    bindEvent: function () {
        var _this = this;
        var fromTS, toTS;

        //	按下'详情'按鈕
        this.element.on("click", "[page='inquire'] .view_button", function (e) {

            // 处理时间筛选
            time = new Date($(this).attr("data-time")).format("yyyy-MM-dd");
            fromTS = new Date(time + ' 00:00:00').getTime();
            toTS = new Date(time + ' 23:59:59').getTime();

            // 调用查询收益报表详情方法
            _this.DailyDetail({
                fromTS: fromTS,
                toTS: toTS,
            });

            _this.element.find("[page='view']").addClass("active").siblings("[page]").removeClass("active active_live_page");
            _this.resize();
        });

        //	按下'返回'按鈕
        this.element.on("click", "[page='view'] .back_button", function (e) {
            _this.element.find("[page='live_table']").addClass("active")
                .siblings("[page]").removeClass("active");
            _this.resize();
        });

        // 切换主播房间功能页
        this.element.on("click", "[data-name='tbas'] li", function () {
            $(this).addClass("active").siblings().removeClass("active");
            _this.switchType($(this).attr("data-name"));
        });

        // 开始/结束直播
        this.element.on("click", ".operating span", function () {

            if (!_this._service || $(this).hasClass("active") || !_this._liveStatus) {
                return
            }
            _this._liveStatus = false;

            if ($(this).attr("data-name") === 'start') {
                _this.startLive();
            } else {
                _this.stopLive();
            }
        });
    },

    // 窗口大小变化
    resize: function (width, height) {
        var jqGridW = this.jqGrid.parents(".x_panel").width(),
            jqGrid2W = this.jqGrid2.parents(".x_panel").width();

        this.jqGrid.setGridWidth(jqGridW);
        this.jqGrid2.setGridWidth(jqGrid2W);
    },

    // 初始化视频
    initVideo: function (id, status) {
        // 关闭视频
        this.closeVideo();
        // 进入当前主播房间视频
        this._video = utils.video(id, status, this._videoConfig);
    },

    // 初始化tab
    initTab: function () {
        var tabItme = this.element.find("[data-name='tbas'] li").eq(0);
        tabItme.addClass("active").siblings().removeClass("active");
        this.switchType(tabItme.attr("data-name"));
    },

    // 關閉直播視頻
    closeVideo: function () {
        if (this._video != null) {
            this._video.dispose();
            this._video = null;
        }
    },

    // 获取主播信息
    getGiftList: function () {
        var _this = this;
        this._service.getGiftList().then(function (list) {
            _this.giftsMap = {};
            for (var i = 0, il = list.length; i < il; i++) {
                var giftInfo = list[i];
                _this.giftsMap[giftInfo.itemId] = giftInfo
            }
        });
    },

    // 获取主播信息
    getModelInfo: function () {
        var _this = this;

        $.ajax({
            url: "/live/live_show/getModelInfo",
            data: {
                modelUserId: _this._modelUserId,
            }
        }).done(function (rs) {
            if (rs.status) {
                _this.setRoomeMassages(rs.data);
            } else {
                $.messager({
                    status: 'error',
                    message: '获取主播信息失败'
                });
            }

        }).fail(function () {})
    },

    // 直播管理-设置房间信息
    setRoomeMassages: function (data) {
        var modeData = {};
        // 设置开播状态
        if (data.onShow) {
            this.element.find(".operating").find("[data-name='start']").addClass("active");
            this.element.find(".operating").find("[data-name='stop']").removeClass("active");
            // 删除主播服务监听事件
            this.removeEventHandlers();
            // 添加主播监服务听事件
            this.addEventHandlers();
            // 初始化视频
            this.initVideo(data.userId, true);
        } else {
            this.element.find(".operating").find("[data-name='stop']").addClass("active");
            this.element.find(".operating").find("[data-name='start']").removeClass("active");
        }
        //  设置主播信息
        modeData.element = this.element.find(".live_content");
        modeData.nickName = data.nickName || '暂无';
        modeData.userKey = data.userKey;
        modeData.mainImgRefKey = data.modelExtraInfo.mainImgRefKey;
        // 显示主播信息
        this.showModeMessage(modeData);
        // 获取历史对话记录
        this.getRoomMessagesForPlayer();
        this._modeVideoId = data.userId;
    },

    // 添加主播监听事件
    addEventHandlers: function () {
        var _this = this;
        this._liveEventHandlers = {
            onRoomMessage: _this.onRoomMessage.bind(_this),
            onRoomPrivateMessage: _this.onRoomPrivateMessage.bind(_this),
            onRoomGift: _this.onRoomGift.bind(_this),
            onRoomEmojiMessage: _this.onRoomEmojiMessage.bind(_this),
            onBroadcastNotification: _this.onBroadcastNotification.bind(_this),
            onRoomPredefinedMessage: _this.onRoomPredefinedMessage.bind(_this),
            onRoomAnnouncement: _this.onRoomAnnouncement.bind(_this)
        }
        this._service.addEventHandlers(this._liveEventHandlers);
        // 更改开播按钮状态
        _this.element.find("[data-name='stop']").removeClass("active");
        _this.element.find("[data-name='start']").addClass("active");
    },

    // 删除主播监听事件
    removeEventHandlers: function () {
        if (this._service != null) {
            if (this._service.eventHandlersList.length <= 0) {
                return
            }
            this._service.removeEventHandlers(this._liveEventHandlers);
            // 更改停播按钮状态
            this.element.find("[data-name='start']").removeClass("active");
            this.element.find("[data-name='stop']").addClass("active");
        }
    },

    // 清除訊息
    clearMessage: function () {
        this.element.find(".alert_message .alert .close").trigger("click");
    },

    // 显示对于tab内容
    switchType: function (type) {

        var _this = this;
        this.element.find("[data-name='live_tab']").removeClass("active_live_page");
        this.element.find("." + type + "").addClass("active_live_page");
        this.closeVideo();

        if (type === 'live_content') {
            this.getModelInfo();
        } else if (type === 'live_table') {
            this.search();
            this.resize();
        }
    },

    // 显示主播信息
    showModeMessage: function (data) {
        data.element.find("[data-name='user_nickName']").text(data.nickName || '暂无');
        data.element.find("[data-name='user_number']").text(data.userKey);
        data.element.find("[data-name='user_img']").attr("src", '../images/mode/' + data.mainImgRefKey + '.png');
    },

    // 主播房间历史对话记录
    getRoomMessagesForPlayer: function () {
        var _this = this;
        $.ajax({
            url: "/live/live_show/getRoomMessagesForPlayer",
            method: 'GET',
            data: {
                modelUserId: _this._modelUserId,
                size: 50,
            }
        }).done(function (rs) {
            if (rs.status) {
                _this.dealWithRoomMessagesForPlayerData(rs.data);
            } else {
                $.messager({
                    status: 'error',
                    message: "获取主播房间历史对话记录失败"
                });
            }

        }).fail(function (xhr, status, err) {
            $.messager({
                status: 'error',
                message: xhr.responseJSON.message
            });
        })
    },

    // 处理主播房间历史对话记录数据
    dealWithRoomMessagesForPlayerData: function (data) {
        var gift, lottery, levelObj, nickName, html = "",
            time, message;

        // 倒叙数组 新的在底部，旧对在顶部；
        data = data.reverse();
        for (var i = 0, l = data.length; i < l; i++) {
            // 贡献
            gift = classification_config.init().getLevel(data[i].classification1Id).level;
            // 贵宾
            lottery = classification_config.init().getLevel(data[i].classification2Id).level;
            // 获取等级icon
            levelObj = this.setLevelShow(gift, lottery);
            // 发话时间
            time = new Date(data[i].receivedTS).format("hh:mm:ss");
            // 昵称
            nickName = data[i].nickName || data[i].userKey;
            // 发话内容
            message = data[i].content.split("]");
            message = message.length >= 2 ? message[1] : message[0];
            message = String(message).replace(/"/ig, "");
            message = this.setEmoji(message);

            html += ' <li>';
            html += '     <time>' + time + '</time>';
            html += '' + levelObj.innerHTML + '';
            html += '     <strong class="active">' + nickName + '</strong>';
            html += '     <span>' + message + '</span>';
            html += '</li>';
        }
        this.element.find(".live_content [data-name='message_list']").html(html);
        this.setTheMassesScroll()
    },

    // 主播管理-监听快捷语
    onRoomPredefinedMessage: function (accountName, extraUserInfo, msgData) {
        var gift = classification_config.init().getLevel(extraUserInfo.classification1Id).level,
            lottery = classification_config.init().getLevel(extraUserInfo.classification2Id).level;
        var userinfo = {
            nick: extraUserInfo.nickName,
            g_level: gift,
            r_level: lottery,
            c_level: 0,
            message: this.setEmoji(msgData.message)
        };
        this.pushMessage("onRoomMessage", userinfo, '');
    },

    // 主播管理-监听表情
    onRoomEmojiMessage: function (accountName, extraUserInfo, msgData) {
        console.log("-------------------------------")
        console.log(msgData.message)
        var gift = classification_config.init().getLevel(extraUserInfo.classification1Id).level,
            lottery = classification_config.init().getLevel(extraUserInfo.classification2Id).level;
        var userinfo = {
            nick: extraUserInfo.nickName,
            g_level: gift,
            r_level: lottery,
            c_level: 0,
            message: this.setEmoji(msgData.message)
        };
        this.pushMessage("onRoomMessage", userinfo, '');
    },

    // 主播管理-监听信息
    onRoomMessage: function (accountName, extraUserInfo, msgData) {
        var gift = classification_config.init().getLevel(extraUserInfo.classification1Id).level,
            lottery = classification_config.init().getLevel(extraUserInfo.classification2Id).level;
        var userinfo = {
            nick: extraUserInfo.nickName,
            g_level: gift,
            r_level: lottery,
            c_level: 0,
            message: msgData.message
        };
        this.pushMessage("onRoomMessage", userinfo, '');
    },

    // 主播管理-监听礼物
    onRoomGift: function (accountName, extraUserInfo, giftData) {
        var giftInfo = this.giftsMap[giftData.giftId];
        var _this = this;
        var gift = classification_config.init().getLevel(extraUserInfo.classification1Id).level,
            lottery = classification_config.init().getLevel(extraUserInfo.classification2Id).level;
        var userinfo = {
            nick: extraUserInfo.nickName,
            avatar: extraUserInfo.avatarKey,
            g_level: gift,
            r_level: lottery,
            c_level: 0,
            description: giftInfo.description,
            giftUrl: _this.giftUrlObj[giftInfo.code],
            giftCode: giftInfo.code,
            giftGroup: giftInfo.group,
            giftCount: giftData.count
        };
        this.pushMessage("onRoomGift", userinfo, '');
        // 更新送礼排行榜
        // this.getModelRankBoard();
    },

    // 主播管理-监听通告
    onRoomAnnouncement: function (accountName, extraUserInfo, msgData) {
        // 用户昵称与头像
        var userinfo = {
            message: '[公告]:' + msgData.message
        };
        this.pushMessage("announcement", userinfo, 'broadcast');
    },

    // 主播管理-监听广播
    onBroadcastNotification: function (evtCategory, evtType, content) {
        //  过滤非当前直播间的广播
        if (content.modelUserId != this._modeVideoId) {
            return
        }
        var extraUserInfo = content.extraUserInfo;
        var nickName = extraUserInfo.nickName || content.userKey;
        // 用户昵称与头像
        var userinfo = {
            nick: utils.textEncryption(nickName),
            avatar: extraUserInfo.avatarKey,
            accountName: content.userKey,
            userId: content.userId
        };
        var gift = classification_config.init().getLevel(extraUserInfo.classification1Id).level,
            lottery = classification_config.init().getLevel(extraUserInfo.classification2Id).level;
        // 主播开播
        if (evtCategory == 'LIVE_SHOW_PUBLIC' && evtType == 'MODEL_OPEN_SHOW') {
            userinfo.nick = extraUserInfo.nickName;
            userinfo.text = '主播';
            userinfo.message = '开播了！';
            this.pushMessage("onRoomMessage", userinfo, 'broadcast');
        }
        // 主播停播
        else if (evtCategory == 'LIVE_SHOW_PUBLIC' && evtType == 'MODEL_CLOSE_SHOW') {
            userinfo.nick = extraUserInfo.nickName;
            userinfo.text = '主播';
            userinfo.message = '停播了！';
            this.pushMessage("onRoomMessage", userinfo, 'broadcast');
            // 更改主播开播状态
            this._liveStatus = true;
            // 删除主播监听事件
            this.removeEventHandlers();
        }
        // 观众进入房间
        else if (evtCategory == 'LIVE_SHOW_PUBLIC' && evtType == 'PLAYER_JOINED_SHOW') {
            userinfo.g_level = gift;
            userinfo.r_level = lottery;
            userinfo.c_level = 0;
            userinfo.message = '进入了房间';
            this.pushMessage("onRoomMember", userinfo, 'broadcast');
        }
        // 观众离开房间
        else if (evtCategory == 'LIVE_SHOW_PUBLIC' && evtType == 'PLAYER_LEFT_SHOW') {
            userinfo.g_level = gift;
            userinfo.r_level = lottery;
            userinfo.c_level = 0;
            userinfo.message = '离开了房间';
            this.pushMessage("onRoomMessage", userinfo, 'broadcast');
        }
        this.getTopUsersInShow(this._modelUserId, 50);
    },

    // 主播管理-私聊信息
    onRoomPrivateMessage: function (accountName, extraUserInfo, msgData) {
        var messageList = this.element.find("[data-name='privateMessage']");
        var time = utils.getTime(new Date().getTime()).split(" ")[1];
        var html = '';
        html += '<li>';
        html += '   <time>' + time + '</time>';
        html += '   <strong>' + extraUserInfo.nickName + '</strong>';
        html += '   <span>' + this.setEmoji(msgData.message) + '</span>';
        html += '</li>';
        messageList.append(html);
        // 判断滚动条是否为自动
        this.setPrivateScroll();
    },

    // 发送信息
    pushMessage: function (userType, data, broadcast) {
        var messageList = this.element.find(".live_content [data-name='message_list']");
        var message, accountName;

        var time = utils.getTime(new Date().getTime()).split(" ")[1];
        var html = '',
            typeHtml = '',
            typeClass = '',
            updataLevel, levelObj, levelHtml, initLevelImg;
        var broadcastHtml = '<i class="level_logo" data-level="broadcast"></i>';

        // 拿到处理好的等级
        levelObj = this.setLevelShow(data.g_level, data.r_level, data.c_level);
        initLevelImg = levelObj.level;
        accountName = data.nick || '';

        // 观众进入房间
        if (userType === 'onRoomMember') {
            levelHtml = broadcast ? broadcastHtml + levelObj.innerHTML : levelObj.innerHTML;
            message = '进入房间';
            typeClass = 'goInit';
            if (initLevelImg) {
                typeHtml += '<div class="init_img">';
                typeHtml += '   <img src="../../images/live/level/' + initLevelImg + '.png">';
                typeHtml += '</div>';
            }
        }
        // 观众发送信息
        else if (userType === 'onRoomMessage') {
            levelHtml = broadcast ? broadcastHtml + levelObj.innerHTML : levelObj.innerHTML;
            message = data.message;
            typeClass = '';
        }
        // 礼物
        else if (userType === 'onRoomGift') {
            levelHtml = broadcast ? broadcastHtml + levelObj.innerHTML : levelObj.innerHTML;
            message = '送给你' + data.description + '  X' + data.giftCount;
            typeHtml += ' <span class="gift">';
            typeHtml += '   <img src="' + data.giftUrl + '">';
            typeHtml += '</span>';
        }
        // 唱歌
        else if (userType === 'onSong') {
            levelHtml = '<i class="level_logo" data-level="song"></i>';
            message = data.message;
        }
        // 等级升级
        else if (userType === 'onUpdate') {
            updataLevel = this.undataLevel(data.updataLevel);
            levelHtml = '<i class="level_logo" data-level="broadcast"></i>';
            message = '等级升至 <i class="level_logo" data-level="' + updataLevel + '"></i> 主播更爱你</span>';
        }
        //  发出公告
        else if (userType === 'announcement') {
            accountName = '';
            data.text = '';
            typeClass = 'announcement';
            levelHtml = broadcast ? broadcastHtml + levelObj.innerHTML : levelObj.innerHTML;
            message = data.message;
        }

        html += ' <li class="' + typeClass + '">';
        html += '     <time>' + time + '</time>';
        html += '' + levelHtml + '';
        html += '     <span class="' + (data.text ? '' : 'hide') + '">' + data.text + '</span>';
        html += '     <strong class="' + (accountName ? "active" : '') + '">' + accountName + '</strong>';
        html += '     <span>' + message + '</span>';
        html += '' + typeHtml + '';
        html += '</li>';

        messageList.append(html);
        this.setMessageaAppendDom(messageList);
        this.setTheMassesScroll()
    },

    // 唱歌
    onSong: function () {
        // var userinfo = {
        //     accountName: 'jack',
        //     g_level:1,
        //     r_level: 1,
        //     c_level:0,
        //     message: '点了一首歌，请主播MM献唱哦！'
        // };
        // this.pushMessage("onSong",userinfo);
    },

    // 玩家等级升级
    onUpdate: function () {
        // var userinfo = {
        //     accountName: 'jack',
        //     g_level: 1,
        //     r_level: 1,
        //     c_level: 0,
        //     updateText: '恭喜',
        //     updataLevel: 'r_level_6'
        // };
        // this.pushMessage("onUpdate",userinfo);
    },

    // 开始直播
    startLive: function () {
        var _this = this;
        this._service.openShow().then(function (roomInfo) {
            // 更改主播开播状态
            _this._liveStatus = true;
            // 开启视频
            _this.initVideo(_this._modeVideoId, true);
            // 添加主播监听事件
            _this.addEventHandlers();
        }).catch(function (err) {});
        this.element.find("[data-name='liveBox']").addClass("active");
    },

    // 结束直播
    stopLive: function () {
        var _this = this;
        this._service.closeShow().then(function (value) {
            // 关闭视频
            _this.closeVideo();
        }).catch(function (err) {});
        this.element.find("[data-name='liveBox']").removeClass("active");
    },

    // 设置等级显示
    setLevelShow: function (g_level, r_level, c_level) {
        var html = '',
            levelObj = {};
        var arr = [g_level, r_level, c_level];
        // 容错
        g_level = g_level || 0;
        r_level = r_level || 0;
        c_level = c_level || 0;

        if (g_level === 0 && r_level === 0 && c_level === 0) {
            levelObj.level = '';
            levelObj.innerHTML = '';
            return levelObj
        }

        // 处理入场匹配入场等级图
        if (g_level > r_level) {
            levelObj.level = 'v' + g_level + '-gold-car';
        } else if (g_level < r_level) {
            levelObj.level = 'v' + r_level + '-red-car';
        } else if (g_level == r_level) {
            levelObj.level = 'v' + g_level + '-gold-car';
        }

        // 贡献
        if (g_level !== 0) {
            html += '<i class="level_logo" data-level="v' + g_level + '_gold_car"></i>';
        }
        // 贵宾
        if (r_level !== 0) {
            html += '<i class="level_logo" data-level="v' + r_level + '_red_car"></i>';
        }
        // 未知
        if (c_level !== 0) {
            html += '<i class="level_logo" data-level="v' + c_level + '_color_car"></i>';
        }
        levelObj.innerHTML = html;
        return levelObj;
    },

    // 等级升级
    undataLevel: function (level) {
        var levelType = level.split("_");
        var upLevel;
        if (levelType[0] === 'g') {
            upLevel = 'v' + levelType[2] + '_gold_car'
        } else if (levelType[0] === 'r') {
            upLevel = 'v' + levelType[2] + '_red_car'
        } else if (levelType[0] === 'c') {
            upLevel = 'v' + levelType[2] + '_color_car'
        }
        return upLevel
    },

    // 获取热门观众列表
    getTopUsersInShow: function (modelUserId, size) {
        var _this = this;
        $.ajax({
            url: "/live/live_show/getTopUsersInShow",
            method: 'GET',
            data: {
                modelUserId: modelUserId,
                page: 1,
                size: size
            }
        }).done(function (rs) {
            if (rs.status) {
                _this.audienceList(rs.data);
            }
        }).fail(function (xhr, status, err) {
            $.messager({
                status: 'error',
                message: xhr.responseJSON.errorCode
            });
        })
    },

    // 观众列表
    audienceList: function (data) {
        var html = '';
        var levelObj;
        var dataArr = data.data;
        var totalRecords = data.totalRecords,
            amount;
        for (var i = 0, l = dataArr.length; i < l; i++) {
            levelObj = this.setLevelShow(dataArr[i].class_1_level_rank, dataArr[i].class_2_level_rank, dataArr[i].class_3_level_rank);
            amount = (dataArr[i].classification_1_val * 1).format();
            html += ' <li class="">';
            html += '' + levelObj.innerHTML + '';
            html += '    <strong>' + (utils.textEncryption(dataArr[i].nick_name || dataArr[i].merchant_user_key)) + '</strong>';
            html += '   <span>' + amount + '香币</span>';
            html += '</li>';
        }
        this.element.find("[data-name='onlineUsers']").text('在线人数：' + totalRecords);
        this.element.find("[data-name='audience_list']").html(html);
    },

    // 设置表情包
    setEmoji: function (rContent) {

        return utils.filterEmoji(rContent);
    },

    // 清除页面信息
    cleaPageMessage: function (element) {
        element.find("[data-name='message_list']").html('');
        element.find("[data-name='privateMessage']").html('');
    },

    // 日报详情 刷新
    DailyDetail: function (data) {
        $("#jqGrid2").jqGrid('setGridParam', {
            postData: data,
        }).trigger("reloadGrid");
    },

    // 查询数据统计
    search: function (subData) {
        //	TODO 查詢
        this.element.find("#jqGrid").jqGrid('setGridParam', {
            postData: {}
        }).trigger("reloadGrid");
    },

    // 设置插入到节点对信息
    setMessageaAppendDom: function (element) {
        var length = element.find("li").length;

        if (length > 150) {
            for (var i = 150, l = length; i < l; i++) {
                element.find("li").eq(i).remove();
            }
        }
    },

    // 获取排行榜数据
    getModelRankBoard: function () {
        var _this = this;

        $.ajax({
            url: "/live/live_show/getModelRankBoard",
            data: {
                modelUserId: _this._modelUserId,
                type: "GX"
            }
        }).done(function (rs) {
            if (rs.status) {
                _this.dealWithModelRankBoard(rs.data);
            } else {
                $.messager({
                    status: 'error',
                    message: '礼物排行榜失败'
                });
            }

        }).fail(function (xhr) {
            $.messager({
                status: 'error',
                message: xhr.responseJSON.message
            });
        })
    },

    // 处理刷礼排行榜数据
    dealWithModelRankBoard: function (data) {

        var data = data.rankData || [];
        var leftHtml = "",
            rightHtml = "";
        var iD = 0,
            rankValue, nickName;
        var length = data.length >= 30 ? 30 : data.length;

        for (var i = 0, l = length; i < l; i++) {
            iD++;
            rankValue = (data[i].rankValue * 1).format() + "香币";
            nickName = data[i].nickName;

            if (i % 2 === 0) {
                leftHtml += "<li><i>" + iD + "</i><strong>" + nickName + "</strong><span>" + rankValue + "</span></li>";
            } else {
                rightHtml += "<li><i>" + iD + "</i><strong>" + nickName + "</strong><span>" + rankValue + "</span></li>";
            }
        }

        this.element.find("[data-name='giftGiving']").find("[data-name='left_content']").html(leftHtml);
        this.element.find("[data-name='giftGiving']").find("[data-name='right_content']").html(rightHtml);
    }
}
