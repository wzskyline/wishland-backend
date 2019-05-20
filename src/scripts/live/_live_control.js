var live_live_control = {
    jqGrid: null,
    history_recordingArr: [],
    history_count: 0,
    curLiveId: '',
    _merchant: 'sgl818',
    // 场控服务
    _service: null,
    // 场控事件
    _eventHandlers: {},
    // 设置滚动条
    _setTheMassesScroll: null,
    // 主播id
    _liveUserId: null,
    // 视频配置
    _videoConfig: {
        element: null,
        width: 300,
        height: 300
    },
    // 打开的页面
    _windowOpen: null,
    // 主播列表
    _modelistSelectStatus: true,
    // 等待处理信息
    _waitDealWithObj: {},
    init: function () {
        var _this = this;
        this.jqGrid = $("#jqGrid_history_recording");
        this._videoConfig.element = this.element.find("[data-name='liveBox']");

        return new Promise(function (resolve, reject) {
            var go = function () {
                if (app._liveShowModerator) {
                    _this._service = app._liveShowModerator;
                    _this.initComponent();
                    _this.bindEvent();
                    _this.switchPage('scene_control');
                    _this.onPageCommunication();

                    resolve();
                } else {
                    reject({
                        message: '获取场控服务失败'
                    });
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
        this.closeVideo();
        this.removeEventHandlers();
    },

    initComponent: function () {
        var _this = this;
        // 日期控件
        this.element.find('input[name="dates"]').daterangepicker({
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
        });

        // 检查权限 - 场面管控
        var management = user.hasPermissions("live:control:management"),
            // 检查权限 - 操作记录
            recordingView = user.hasPermissions("live:control:recording_view"),
            // 检查权限 - 历史对话记录查看
            historyDialogueRecordingView = user.hasPermissions("live:control:history_dialogue_recording_view");
        if (!management) {
            this.element.find("[data-permissions='management']").remove();
        }
        if (!recordingView) {
            this.element.find("[data-permissions='recordingView']").remove();
        }
        if (!historyDialogueRecordingView) {
            this.element.find("[data-permissions='historyDialogueRecordingView']").remove();
        }

        // 历史对话记录
        $("#jqGrid_history_recording").jqGrid({
            mtype: "GET",
            styleUI: 'Bootstrap',
            datatype: "json",
            colModel: [{
                    label: '贵宾等级',
                    name: 'classification1Id',
                    align: 'center',
                    width: 150,
                    formatter: function (value, options, row) {
                        return app._classification_config[row.classification1Id].name;
                    }
                },
                {
                    label: '贡献等级',
                    name: 'classification2Id',
                    align: 'center',
                    width: 150,
                    formatter: function (value, options, row) {
                        return app._classification_config[row.classification2Id].name;
                    }
                },
                {
                    label: '内容',
                    name: 'content',
                    align: 'center',
                    width: 200,
                    formatter: function (value, options, row) {
                        return String(row.content).replace(/"/ig, "");
                    }
                },
                {
                    label: '消息ID',
                    name: 'messageId',
                    align: 'center',
                    width: 200
                },
                {
                    label: '玩家昵称',
                    name: 'nickName',
                    align: 'center',
                    width: 100,
                },
                {
                    label: '私聊',
                    width: 151,
                    name: "private",
                    align: 'center',
                    formatter: function (value, options, row) {
                        return value == 'N' ? '否' : ' '
                    }
                },
                {
                    label: '时间',
                    width: 200,
                    name: "receivedTS",
                    align: 'center',
                    formatter: function (value, options, row) {
                        return moment(value).format("YYYY-MM-DD HH:mm:ss");
                    }
                },
                {
                    label: '玩家',
                    name: 'userKey',
                    align: 'center',
                    width: 100,
                    formatter: function (value, options, row) {
                        return '<a href="javascript:;" style="color: #0ba3f7;padding: 10px;padding-left: 0" data-name="queryMember" data-url="sgl818_member_manage" data-user_key="' + row.userKey + '">' + row.userKey + '</a>'
                    }
                },
                {
                    label: '审核状态',
                    name: "verified",
                    align: 'center',
                    formatter: function (value, options, row) {
                        var s = value == 'Y' ? '通过' : ' 待审核'
                        return s;
                    }
                }
            ],
            height: 500,
            rowNum: 30,
            shrinkToFit: false,
            jsonReader: {
                root: 'data',
                total: function () {
                    return 1;
                },
                page: function () {
                    return 1;
                },
            },
            pager: "#jqGridPager_history_recording"
        });

        // this.element.find("#jqGrid_operating_recording").jqGrid({
        // 	url: "./resources/example1_data.json",
        // 	postData: {

        // 	},
        // 	mtype: "GET",
        // 	styleUI : 'Bootstrap',
        // 	datatype: "json",
        // 	colModel: [
        // 		{ label: '编号', name: 'OrderID', key: true, width: 40 },
        // 		{ label: '动作', name: 'CustomerID', width: 150 },
        // 		{ label: '玩家账号', width: 100, align: 'center'},
        // 		{ label: '玩家昵称', name: 'OrderDate', width: 150 },
        // 		{ label: '所在主播房间', name: 'Freight', width: 150 },
        // 		{ label:'操作人员', name: 'ShipName', width: 100 },
        //         { label:'操作日期', name: 'ShipName', width: 150 },
        // 		{ label: '管理', width: 100, align: 'center', formatter: function (value, options, row) {
        // 			var html = '';
        // 			if( row.OrderID%2 === 0 ){
        //                 html += '<a class="btn btn-primary btn-xs"><i class="glyphicon glyphicon-remove-sign"></i> 解除禁言 </a>';
        //             }else{
        //                 html += '<a class="btn btn-info btn-xs modify_button"><i class="glyphicon glyphicon-ok-sign"></i> 解除黑名单 </a>';

        //             } 
        // 			return html;
        // 		} }
        // 	],
        // 	beforeRequest: function () {
        // 		_this.element.find("[page='inquire'] .search_button").addClass("processing");
        // 	},
        // 	loadComplete: function () {
        // 		_this.element.find("[page='inquire'] .search_button").removeClass("processing");
        // 	},
        // 	viewrecords: true,
        // 	height: 450,
        // 	rowNum: 30,
        // 	pager: "#jqGridPager_operating_recording"
        // });
        //  初始化tab状态
        this.element.find("[data-name='navTab']").find('li').eq(0).addClass("active");
        this._setTheMassesScroll = utils.setScrollTop(this.element.find("[data-name='message_content']"));
    },

    bindEvent: function () {
        var _this = this;

        // 按下检视
        this.element.on("click", "[name='open_support_modal']", function () {
            // 打开弹框
            _this.openModal(_this.history_recordingArr[$(this).parents('tr').index() - 1]);
        });

        // tabs切换内容
        this.element.find(".nav_tabs li").on("click", function () {
            $(this).addClass("active").siblings().removeClass("active");
            _this.switchPage($(this).attr("data-type"));
        });

        // 切换房间
        var cur = {},
            $this;
        this.element.on("click", "[data-name='roo_tabs'] li", function () {
            $this = $(this);
            $this.addClass("active").siblings().removeClass("active");
            liveData = $this.data();

            cur.url = liveData.url;
            cur.nickName = liveData.nick_name;
            cur.userKey = liveData.user_key;
            cur.userId = liveData.user_id;
            _this.curLiveId = liveData.user_id;

            _this.setLiveRoom(cur);

        });

        // 通过审核
        var $this_success;
        this.element.find("[data-name='message_content']").on("click", "[data-name='success']", function () {
            $this_success = $(this);
            $this_success.button('loading');
            _this.approveMessage($this_success.attr("data-message_id"), $this_success.parents("li"), $this_success, $this_success.attr("data-model_user_id"));
        });

        // 拒绝通过
        var $this_danger;
        this.element.find("[data-name='message_content']").on("click", "[data-name='danger']", function () {
            $this_danger = $(this);
            $this_danger.button('loading');
            _this.rejectMessage($this_danger.attr("data-message_id"), $this_danger.parents("li"), $this_danger, $this_danger.attr("data-model_user_id"));
        });

        // 禁言
        var $this_prohibited, data = {};
        this.element.find("[data-name='message_content']").on("click", "[data-name='prohibited']", function () {
            $this_prohibited = $(this);
            data.userId = $this_prohibited.attr("data-user_id");
            data.status = $this_prohibited.attr("data-status");
            data.status = data.status === 'N' ? 'YP' : 'N';
            _this.setProhibitedStatus(data, $this_prohibited);
        });

        //  删除信息
        this.element.find("[data-name='message_content']").on("click", "[data-name='delete']", function () {
            _this.deleteMessage($(this).parents("li"));
        });

        // 新开界面
        this.element.find(".open_window").on("click", function () {
            _this._windowOpen = window.open(window.location.href);
            localStorage.setItem("openWindow", true);
        });

        // 查询   区分查询表格类型
        this.element.find(".search_button").on("click", function () {
            time = $('.history_time').val()
            if (time.length > 2) {
                time = moment(time).valueOf()
            } else {
                time = utils.todayTS()
            }
            _this.flushHistoryMsg({
                modelUserId: $('.search-live').val(),
                unprocessedOnly: $(".history_type").val(),
                fromTS: time,
            })
        });

        //观众发言的两个查询筛选  类型与时间
        this.element.find(".type-select").on("change", function () {
            _this.updataHistoryPanel()
        });

        // 日期查询
        this.element.find('input[name="dates"]').on('apply.daterangepicker', function (ev, picker) {
            var startDate = picker.startDate.format('YYYY/MM/DD HH:mm:ss')
            $(this).val(startDate);
            if ($(this).parent().html().indexOf('发言') > 0) {
                _this.updataHistoryPanel()
            }
        });
    },

    /**
     * 查詢
     */
    search: function () {},

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
     * 设置弹框
     */
    openModal: function (data) {
        var $support_modal = this.element.find(".support_modal");
        $support_modal.modal("show");
        $support_modal.find('.modal-title > span').html(data.CustomerID);
        $support_modal.find(".modal-body > p").html(data.OrderDate);
    },

    /**
     * 切换界面
     */
    switchPage: function (type) {

        this.element.find(".switch-page").addClass("hide");
        this.element.find("[data-name='" + type + "']").removeClass("hide");

        if (type === "operating_recording" || type === "history_recording") {

            this.element.find(".search_button").removeClass("hide");
            this.element.find(".excle").removeClass("hide");
            this.element.find(".open_window").addClass("hide");
            this.closeVideo();
            type === "history_recording" ? this.element.find(".search_button").trigger("click") : "";

        } else {

            this.element.find(".search_button").addClass("hide");
            this.element.find(".excle").addClass("hide");
            this.element.find(".open_window").removeClass("hide");
            this.getModelList();
        }
    },

    /**
     * 获取主播列表
     */
    getModelList: function () {
        var _this = this;
        $.ajax({
            url: "/live/live_show_mgt/getModelList",
            method: 'GET',
            data: {
                merchant: _this._merchant
            }
        }).done(function (rs) {
            if (rs.status) {

                // 初始化房间信息
                _this.initLiveRoom(rs.data);

                // 设置历史对话记录-主播房间下拉框列表
                if (_this._modelistSelectStatus) {
                    _this._modelistSelectStatus = false;
                    _this.setHistoryPanelLiveList(rs.data);
                }
            }
        }).fail(function (xhr, status, err) {
            $.messager({
                status: 'error',
                message: xhr.responseJSON.errorCode
            });
        });
    },

    /**
     * 初始化主播房间
     */
    initLiveRoom: function (roomArr) {
        roomArr = roomArr || [];
        var html = '',
            index = 0,
            mainImgRefKey;

        for (var i = 0, l = roomArr.length; i < l; i++) {

            mainImgRefKey = roomArr[i].modelExtraInfo.mainImgRefKey;
            roomArr[i].url = "../images/mode/" + mainImgRefKey + ".png";

            // 创建待处理信息的数组
            this._waitDealWithObj[String(roomArr[i].userId)] = [];

            if (!roomArr[i].onShow) {
                continue
            }
            if (index === 0) {
                html += '<li class="active" data-user_id="' + roomArr[i].userId + '" data-user_key="' + roomArr[i].userKey + '" data-url="' + roomArr[i].url + '" data-nick_name="' + roomArr[i].nickName + '" >' + roomArr[i].nickName + '<i class="hide"></i></li>'
                // 设置房间信息
                this.setLiveRoom(roomArr[i]);
            } else {
                html += '<li data-user_id="' + roomArr[i].userId + '" data-user_key="' + roomArr[i].userKey + '" data-url="' + roomArr[i].url + '" data-nick_name="' + roomArr[i].nickName + '">' + roomArr[i].nickName + '<i class="hide"></i></li>'
            }
            index++;
        }

        this.element.find("[data-name='roo_tabs']").html(html);
    },

    /**
     * 设置主播信息
     */
    setLiveRoom: function (data) {

        this.element.find("[data-name='message_content'] ul").html("");
        this._liveUserId = data.userId;
        this.element.find("[data-name='live_user_img']").attr("src", data.url);
        this.element.find("[data-name='live_user_name']").text(data.nickName);
        this.element.find("[data-name='live_user_number']").text(data.userKey);

        // 初始化页面筛选状态
        this.initStatus();
        // 拿到历史对话记录
        this.updataHistoryPanel();
        // 删除场控监听事件
        this.removeEventHandlers();
        // 添加场控监听事件
        this.addEventHandlers();
        // 关闭视频
        this.closeVideo();
        // 进入当前主播房间视频
        this._video = utils.video(data.userId, true, this._videoConfig);
        utils.setTitle("场控-" + data.nickName + "的房间")
    },

    /**
     * 關閉直播視頻
     */
    closeVideo: function () {
        if (this._video != null) {
            this._video.dispose();
            this._video = null;
        }
    },

    /**
     * 添加场控事件
     */
    addEventHandlers: function () {
        var _this = this;
        this._eventHandlers = {
            onRoomMessageToVerify: _this.onRoomMessageToVerify.bind(_this)
        }
        this._service.addEventHandlers(this._eventHandlers);
    },

    /**
     * 删除场控事件
     */
    removeEventHandlers: function () {
        if (!this._service) {
            return
        }
        this._service.removeEventHandlers(this._eventHandlers)
    },

    /**
     * 对话推送
     */
    onRoomMessageToVerify: function (msg) {

        // 存入待处理信息
        this.addWaitDealWithMessage(msg);
        if (msg.modelUserId != this._liveUserId) {
            return
        }
        this.pushMessage(msg);
    },

    /**
     * 显示对话  socket 单条信息
     */
    pushMessage: function (msg) {
        var html = "";
        var time = utils.getTime(new Date().getTime()).split(" ")[1];
        var message, messageId, userId, nickName, msg_forbidden, forbiddenText, modelUserId;
        var element = this.element.find("[data-name='message_content'] ul");

        message = msg.content.message;
        messageId = msg.messageId;
        userId = msg.userId;
        nickName = msg.extraUserInfo.nickName;
        msg_forbidden = msg.msg_forbidden || 'N';
        modelUserId = msg.modelUserId;
        if (msg_forbidden != 'N') {
            forbiddenText = '已禁言'
        } else {
            forbiddenText = '禁言'
        }

        html += ' <li class="waitingForProcessing">';
        html += '     <time>' + time + '</time>';
        html += '	  <strong data-name="user_name">' + nickName + '</strong>';
        html += '	  <span data-name="prohibited" data-user_id="' + userId + '" data-status="' + msg_forbidden + '" class="' + (msg_forbidden != 'N' ? "active" : '') + '">' + forbiddenText + '</span>';
        html += '     <p>' + message + '';
        html += '		  <span class="status success hide">已通过</span>';
        html += '		  <span class="status danger hide">已拒绝</span>';
        html += '		  <button class="btn btn-success" data-name="success" data-model_user_id="' + modelUserId + '" data-message_id="' + messageId + '" data-loading-text="处理中..." type="button">通过</button>';
        html += '		  <button class="btn btn-danger" data-name="danger" data-model_user_id="' + modelUserId + '" data-message_id="' + messageId + '" data-loading-text="处理中..." type="button">拒绝</button>';
        html += '		  <button class="btn btn-warning delete hide" data-name="delete" data-message_id="' + messageId + '">删除</button>';
        html += '	  </p>';
        html += ' </li>';

        // 插入到节点
        element.append(html);
        // 设置滚动条到底部
        this._setTheMassesScroll();
        // 限定页面插入的节点
        this.setMessageaAppendDom(element);
    },

    // 设置插入到节点对信息
    setMessageaAppendDom: function (element) {
        var length = element.find("li").length;

        if (length >= 200) {
            for (var i = 199, l = length; i < l; i++) {
                element.find("li").eq(i).remove();
            }
        }
    },

    /**
     * 显示对话  从历史记录里面来的 msg 带状态 css 样式切换
     */
    pushMessages: function (msgs, modelUserId) {

        var _this = this;
        var html = "";
        this.history_count = msgs.length;
        // 因为获取的是历史对话记录，所以需要先清空数组，再重新统计
        this._waitDealWithObj[String(modelUserId)] = [];

        $.each(msgs, function (i, msg) {
            var time = moment(msg.receivedTS).format("HH:mm:ss");
            var message, messageId, userId, nickName, msg_forbidden, forbiddenText;
            message = msg.content;
            message = String(message).replace(/"/ig, "");
            messageId = msg.messageId;
            userId = msg.userId;
            nickName = msg.nickName;
            msg_forbidden = msg.msgForbidden;
            forbiddenText = msg_forbidden != 'N' ? '已禁言' : '禁言';
            html += ' <li class="waitingForProcessing">';
            html += '     <time>' + time + '</time>';
            html += '	  <strong data-name="user_name">' + nickName + '</strong>';
            html += '	  <span data-name="prohibited" data-user_id="' + userId + '" data-status="' + msg_forbidden + '" class="' + (msg_forbidden != 'N' ? "active" : '') + '">' + forbiddenText + '</span>';
            html += '     <p>' + message + '';
            if (msg.verified == 'Y') {
                html += '		  <span class="status success  ">已通过</span>';
                html += '		  <span class="status danger hide">已拒绝</span>';
                html += '		  <button class="btn btn-success hide" data-name="success" data-message_id="' + messageId + '" data-loading-text="处理中..." type="button">通过</button>';
                html += '		  <button class="btn btn-danger hide" data-name="danger" data-message_id="' + messageId + '" data-loading-text="处理中..." type="button">拒绝</button>';
                html += '		  <button class="btn btn-warning delete " data-name="delete" data-message_id="' + messageId + '">删除</button>';
            } else {
                html += '		  <span class="status success hide">已通过</span>';
                html += '		  <span class="status danger hide">已拒绝</span>';
                html += '		  <button class="btn btn-success" data-name="success"data-model_user_id="' + modelUserId + '"  data-message_id="' + messageId + '" data-loading-text="处理中..." type="button">通过</button>';
                html += '		  <button class="btn btn-danger" data-name="danger" data-model_user_id="' + modelUserId + '" data-message_id="' + messageId + '" data-loading-text="处理中..." type="button">拒绝</button>';
                html += '		  <button class="btn btn-warning delete hide" data-name="delete" data-message_id="' + messageId + '">删除</button>';
            }
            html += '	  </p>';
            html += ' </li>';

            // 加入到未处理信息中
            if (!msg.verified) {
                msg.modelUserId = modelUserId;
                _this.addWaitDealWithMessage(msg);
            }
        })
        this.element.find("[data-name='message_content'] ul").html(html);
        this._setTheMassesScroll()
    },

    /**
     * 审核拒绝
     */
    rejectMessage: function (msgId, element, button, modelUserId) {
        var messageBbj = {}
        var _this = this;
        this._service.rejectMessage(msgId).then(function (result) {

            button.button('reset')
            // 更新信息状态
            _this.updataMessageStatus("danger", element, modelUserId, msgId);

            messageBbj.status = 'danger';
            messageBbj.msgId = msgId;
            messageBbj.modelUserId = modelUserId;
            localStorage.setItem("updataMessageStatus", JSON.stringify(messageBbj));

        }).catch(function (err) {
            button.button('reset')
            $.messager({
                status: 'error',
                message: '审核失败请重试'
            });
        });
    },

    /**
     * 审核通过
     */
    approveMessage: function (msgId, element, button, modelUserId) {

        var messageBbj = {}
        var _this = this;
        this._service.approveMessage(msgId).then(function (result) {

            button.button('reset');
            // 更新信息状态
            _this.updataMessageStatus("success", element, modelUserId, msgId);

            messageBbj.status = 'success';
            messageBbj.msgId = msgId;
            messageBbj.modelUserId = modelUserId;
            localStorage.setItem("updataMessageStatus", JSON.stringify(messageBbj));

        }).catch(function (err) {
            button.button('reset');
            $.messager({
                status: 'error',
                message: '审核失败请重试'
            });
        });
    },

    /**
     * 审核通过
     */
    deleteMessage: function (element) {
        element.remove();
    },

    /**
     * 设置禁言/解除禁言状态
     */
    setProhibitedStatus: function (data, element) {
        $.ajax({
            url: "/live/live_show_mgt/updateUserMessageStatus",
            method: 'POST',
            data: {
                userId: data.userId,
                status: data.status
            }
        }).done(function (rs) {
            if (rs.status) {
                if (data.status === "N") {
                    $('[data-user_id="' + data.userId + '"]').text('禁言').attr("data-status", 'N');
                    $('[data-user_id="' + data.userId + '"]').removeClass("active");
                } else {
                    $('[data-user_id="' + data.userId + '"]').text('已禁言').attr("data-status", 'YP');
                    $('[data-user_id="' + data.userId + '"]').addClass("active");
                }
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
     * 关闭窗口
     */
    onPageCommunication: function () {
        var _this = this;
        window.addEventListener('storage', function (event) {
            if (event.key === 'token') {
                if (!event.newValue) {
                    window.close();
                }
            }
            //  主页面刷新时，当前页面也自动刷新，获取当前最新的通讯方法
            if (event.key === 'updata') {
                location.reload()
            }

            // 同步审核信息状态
            if (event.key === "updataMessageStatus") {
                _this.synchronizeMessageStatus();
            }
        });
    },

    /**
     *  设置历史对话记录-房间下拉框列表
     */
    setHistoryPanelLiveList: function (list) {
        var html = "";
        if (list.length <= 0) {
            return
        }
        for (var i = 0, l = list.length; i < l; i++) {
            html += "<option value='" + list[i].userId + "'>" + list[i].nickName + "</option>"
        }
        this.element.find("[data-name='search']").html(html);
    },

    /**
     *  更新对话框历史对话记录
     */
    updataHistoryPanel: function () {
        // 获取数据
        var _this = this;
        var time = this.element.find("[name='dates']").val();
        var data = {
            modelUserId: this._liveUserId,
            unprocessedOnly: $("[name='playerMsgType']").val(),
            fromTS: utils.todayTS()
        }

        if (time) {
            data.fromTS = new Date(time).getTime();
        }

        // 获取数据
        $.ajax({
            url: "/live/live_show_mgt/getRoomMessagesForModeration",
            method: 'GET',
            data: data
        }).done(function (rs) {

            if (rs.status) {
                _this.pushMessages(rs.data, _this._liveUserId)
            }
        }).fail(function (xhr, status, err) {
            $.messager({
                status: 'error',
                message: xhr.responseJSON.message
            });
        })
    },

    /**
     * 刷新 历史对话记录  表格
     */
    flushHistoryMsg: function (data) {
        $("#jqGrid_history_recording").jqGrid('setGridParam', {
            url: "./live/live_show_mgt/getRoomMessagesForModeration",
            postData: data,
        }).trigger("reloadGrid");
    },

    /**
     * 窗口大小
     */
    resize: function (width, height) {
        this.jqGrid.setGridWidth($(".x_content").width());
    },

    /**
     * 增加待处理信息
     */
    addWaitDealWithMessage: function (msg) {
        // 存储主播id
        var modelUserId = msg.modelUserId;
        // 取得对象下标
        var thisRoomMessage = this._waitDealWithObj[String(modelUserId)]
        // 增加待处理信息
        thisRoomMessage.push(msg);
        this.setWaitDealWithMessage(thisRoomMessage.length, modelUserId);
    },

    /**
     *  删除待处理信息
     */
    removeWaitDealWithMessage: function (modelUserId) {
        // 取得对象下标
        var thisRoomMessage = this._waitDealWithObj[String(modelUserId)];

        if (thisRoomMessage.length <= 0) {
            return
        }
        // 删除待处理信息
        thisRoomMessage.shift();
        // 设置页面信息
        this.setWaitDealWithMessage(thisRoomMessage.length, modelUserId);
    },

    /**
     *  设置待处理信息
     */
    setWaitDealWithMessage: function (MessageLength, modelUserId) {

        var element = this.element.find("[data-name='roo_tabs'] [data-user_id='" + modelUserId + "'] i");

        if (MessageLength >= 1000) {
            element.removeClass("hide").html("...");
        } else if (MessageLength >= 1) {
            element.removeClass("hide").html(MessageLength);
        } else if (MessageLength <= 0) {
            element.addClass("hide")
        }
    },

    /**
     *  初始化 【场控管理】- 筛选状态
     */
    initStatus: function () {
        this.element.find("[name='playerMsgType']").find("option").removeAttr("selected");
        this.element.find("[name='dates']").val(utils.getDay(0)[0].format())
    },

    /**
     *  更新审核状态
     */
    updataMessageStatus: function (status, element, modelUserId) {

        // 处理状态显示
        if (status === "success") {
            element.find(".success").removeClass("hide");
            element.find("[data-name='delete']").removeClass("hide");
        } else {
            element.find(".danger").addClass("active").removeClass("hide");
            element.find("[data-name='delete']").removeClass("hide");
        }

        element.find("[data-name='success']").addClass("hide");
        element.find("[data-name='danger']").addClass("hide");
        // 删除待处理信息条数
        this.removeWaitDealWithMessage(modelUserId);

    },

    /**
     *  同步分页信息状态
     */
    synchronizeMessageStatus: function () {
        var messageBbj = localStorage.getItem("updataMessageStatus");
        messageBbj = JSON.parse(messageBbj);
        var element = this.element.find("[data-name='message_content'] li").find("[data-message_id='" + messageBbj.msgId + "']").parents("li");
        if (element.length >= 1) {
            this.updataMessageStatus(messageBbj.status, element, messageBbj.modelUserId)
        }
    }
}
