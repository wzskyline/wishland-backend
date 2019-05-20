var live_live_status_monitor = {
    // 房间数据
    _roomData: {},
    // 视频方法
    _video: null,
    // 视频配置
    _videoConfig: {
        element: null,
        width: 400,
        height: 300
    },
    init: function () {
        var _this = this;
        this._videoConfig.element = this.element.find("[data-name='video']");
        return new Promise(function (resolve, reject) {

            var go = function () {
                // _this.initComponent();

                // _this.bindEvent();

                // _this.getModelList();
                resolve();
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
    },
    initComponent: function () {
        var _this = this;

    },
    bindEvent: function () {
        var _this = this;

        // 切换房间
        var $thisRoom, _roomData, thisData;
        this.element.find("[data-name='roo_tabs']").on("click", 'li', function () {
            $thisRoom = $(this);

            if ($thisRoom.hasClass("active")) {
                return
            };
            _roomData = {};
            $thisRoom.addClass("active").siblings().removeClass("active");

            thisData = $thisRoom.data();
            _roomData.userId = thisData.user_id;
            _roomData.nickName = thisData.nick_name;
            _roomData.userKey = thisData.user_key;
            _roomData.mainImgRefKey = thisData.main_img_ref_key;
            // 显示当前主播信息
            _this.showModeMessage(_roomData);
        })
    },

    // 获取主播列表
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
                _this.showRoomList(rs.data);
            }
        }).fail(function (xhr, status, err) {
            $.messager({
                status: 'error',
                message: xhr.responseJSON.errorCode
            });
        });

    },

    // 显示主播房间
    showRoomList: function (data) {

        var _this = this;
        var index = -1;
        var html = '',
            newDataArr = [];
        var modeData = {};
        for (var i = 0, l = data.length; i < l; i++) {

            if (data[i].onShow) {
                index++;
                newDataArr.push(data[i]);
                html += ' <li class="' + (index === 0 ? 'active' : '') + '" data-main_img_ref_key="' + data[i].modelExtraInfo.mainImgRefKey + '"  data-user_key="' + data[i].userKey + '" data-nick_name="' + data[i].nickName + '" data-user_id="' + data[i].userId + '">' + data[i].nickName + '</li>'
            }
        }

        if (newDataArr.length <= 0) {
            return
        }

        // 储存新数据
        modeData.userId = this._roomData.userId = newDataArr[0].userId;
        modeData.nickName = this._roomData.nickName = newDataArr[0].nickName;
        modeData.userKey = this._roomData.userKey = newDataArr[0].userKey;
        modeData.mainImgRefKey = newDataArr[0].modelExtraInfo.mainImgRefKey;

        // 生成节点
        this.element.find("[data-name='roo_tabs']").html(html);
        // 显示当前主播信息
        this.showModeMessage(modeData);
    },

    // 显示当前主播信息
    showModeMessage: function (data) {

        this.element.find("[data-name='user_nickName']").text(data.nickName || '暂无');
        this.element.find("[data-name='user_number']").text(data.userKey);
        this.element.find("[data-name='user_img']").attr("src", '../images/mode/' + data.mainImgRefKey + '.png');

        this.closeVideo();
        // 进入当前主播房间视频
        this._video = utils.video(data.userId, true, this._videoConfig);
    },

    // 关闭视频
    closeVideo: function () {
        if (this._video != null) {
            this._video.dispose();
            this._video = null;
        }
    },
}
