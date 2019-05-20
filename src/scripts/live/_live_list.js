var live_live_list = {
    liveType: 'list',
    _jqGrid: null,
    _merchant: 'sgl818',
    _modifyUserId: null,
    _modifyUserKey: null,
    _ModificationText: null,

    init: function () {
        var _this = this;
        this._jqGrid = this.element.find("#jqGrid_list");

        return new Promise(function (resolve, reject) {
            _this.initComponent();
            _this.bindEvent();
            _this.switchliveType();
            resolve();
        })
    },

    destroy: function () {},

    initComponent: function () {
        var _this = this;
        // 检查权限
        var permissionsAdd = user.hasPermissions("live:model:list_add");
        var permissionsTimeView = user.hasPermissions("live:model:time_view");
        // 新增主播功能
        if (!permissionsAdd) {
            this.element.find("[data-permissions='list_add']").remove();
        }
        // 查看直播时间功能
        if (!permissionsTimeView) {
            this.element.find("[data-permissions='time_view']").remove();
        }

        this.element.find("#jqGrid_list").jqGrid({
            url: "/live/live_show_mgt/getModelList",
            postData: {
                merchant: _this.merchant
            },
            mtype: "GET",
            styleUI: 'Bootstrap',
            datatype: "json",
            jsonReader: {
                repeatitems: false,
                root: function (obj) {
                    if (obj.status) {
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
                    align: 'center',
                    name: 'OrderID',
                    key: true,
                    width: 60,
                    formatter: function (value, options, row) {
                        return options.rowId
                    }
                },
                {
                    label: '账号',
                    align: 'center',
                    name: 'userKey',
                    width: 150
                },
                {
                    label: '昵称',
                    align: 'center',
                    name: 'nickName',
                    width: 100
                },
                {
                    label: '头像',
                    align: 'center',
                    name: 'avatarKey',
                    width: 150,
                    formatter: function (value, options, row) {
                        return '<img src="../images/mode/' + row.modelExtraInfo.mainImgRefKey + '.png" style="widows: 80px;height: 80px;">';
                    }
                },
                {
                    label: '个性签名',
                    align: 'center',
                    name: '',
                    width: 150
                },
                {
                    label: '上次直播时间',
                    align: 'center',
                    name: '',
                    width: 150
                },
                {
                    label: '操作',
                    width: 200,
                    align: 'center',
                    formatter: function (value, options, row) {
                        var html = '';
                        html += '<a class="btn btn-info btn-xs modify_button" data-user_id="' + row.userId + '" data-user_key="' + row.userKey + '"><i class="fa fa-pencil"></i> 编辑</a>';
                        html += '<a class="btn btn-primary btn-xs " data-user_id="' + row.userId + '" data-user_key="' + row.userKey + '" data-name="enable"><i class="glyphicon glyphicon-ok"></i> 启用</a>';
                        html += '<a class="btn btn-danger btn-xs" data-user_id="' + row.userId + '" data-user_key="' + row.userKey + '" data-name="prohibited"><i class="glyphicon glyphicon-remove"></i> 禁用</a>';
                        //  检查用户是否有修改权限
                        return user.hasPermissions("live:model:list_modify") ? html : '';
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
            height: 500,
            rowNum: 30,
            autowidth: true,
            pager: "#jqGridPager_list"
        });
    },

    bindEvent: function () {
        var _this = this;
        //	按下'查詢'按鈕
        this.element.on("click", "[page='inquire'] .search_button", function (e) {
            _this._merchant = _this.element.find("[name='merchant'] option:selected").val();
            _this.search();
        });
        //	按下'新增'按鈕
        this.element.on("click", "[page='inquire'] .add_button", function (e) {
            _this.initAdd();
            _this.element.find("[page='add']").addClass("active")
                .siblings("[page]").removeClass("active");
        });
        //	按下'编辑'按鈕
        this.element.on("click", "[page='inquire'] .modify_button", function (e) {
            _this.modify($(this).data().user_id);
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
        // 切换直播类型
        this.element.find("[data-name='live_type']").on("click", "li", function () {
            $(this).addClass("active").siblings().removeClass("active");
            _this.switchliveType($(this).attr("data-type"));
        });
        // 显示选择上传图片
        $('#file').bind("change", function () {
            var file = this.files[0];
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (e) {
                _this.element.find("[data-name='img']").attr("src", this.result);
            }
            _this.uploadImg('file');

        });
        // 限制身高输入格式
        this.element.find("[data-name='height']").on("input", function () {
            utils.onlyNumber(this)
        })
        // 限制体重输入格式
        this.element.find("[data-name='width']").on("input", function () {
            utils.onlyNumber(this)
        })
        // 提交创建主播
        var submitData, verificationResult;
        var $add_form = this.element.find("[data-name='add_form']");
        this.element.find("[data-name='add_form'] [data-name='submit']").on("click", function () {
            // 获取注册主播的数据
            submitData = {};
            submitData.merchant = _this._merchant;
            submitData.userKey = $add_form.find("[data-name='userKey']").val();
            submitData.password = $add_form.find("[data-name='password']").val();
            submitData.nickName = $add_form.find("[data-name='nickName']").val();
            submitData.introText = $add_form.find("[data-name='introText']").val();
            submitData.height = $add_form.find("[data-name='height']").val();
            submitData.weight = $add_form.find("[data-name='width']").val();
            submitData.size = $add_form.find("[data-name='size']").val();
            submitData.TCG_mode_id = $add_form.find("[data-name='TCG_mode_id']").val();
            // 获取验证结果
            verificationResult = _this.verification(submitData)
            if (verificationResult.verification) {
                _this.registerModel(submitData, $(this));
            } else {
                $.messager({
                    status: 'error',
                    message: verificationResult.message
                });
            }
        });
        // 提交修改主播信息
        var $modify_form = this.element.find("[data-name='modify_form']")
        this.element.find("[data-name='modify_form'] [data-name='submit']").on("click", function () {
            // 获取出生日期
            var year = $modify_form.find("[name='year'] option:selected").val();
            var month = $modify_form.find("[name='month'] option:selected").val();
            var day = $modify_form.find("[name='day'] option:selected").val();
            var dob = new Date(year + "-" + month + "-" + day + " 00:00:00").getTime();
            var data = {
                modelUserId: _this._modifyUserId,
                status: null,
                modelRefKey: $modify_form.find("[data-name='TCG_mode_id']").val() || '',
                modelExtraInfo: {
                    mainImgHeader: _this._modifyUserKey,
                    dob: dob,
                    introText: $modify_form.find("[data-name='introText']").val() || '',
                    height: $modify_form.find("[data-name='height']").val() || '',
                    weight: $modify_form.find("[data-name='width']").val() || '',
                    size: $modify_form.find("[data-name='size']").val() || '',
                    starSign: $modify_form.find("[data-name='starSign']").val() || '',
                    interests: $modify_form.find("[data-name='interests']").val() || '',
                    location: $modify_form.find("[data-name='location']").val() || '',
                }
            }
            _this._ModificationText = "修改";
            _this.modifyMode(data)
        });
        // 点击启用
        this.element.on("click", "[data-name='enable']", function () {
            var data = {
                modelUserId: $(this).data().user_id,
                status: 'A',
                modelRefKey: null,
                modelExtraInfo: null
            }
            _this._ModificationText = '启用';
            _this.modifyMode(data)
        });
        // 点击禁用
        this.element.on("click", "[data-name='prohibited']", function () {
            var data = {
                modelUserId: $(this).data().user_id,
                status: 'I',
                modelRefKey: null,
                modelExtraInfo: null
            }
            _this._ModificationText = '禁用';
            _this.modifyMode(data)
        });
        // 修改主播信息-主播简介
        var modifyTextareaVal
        this.element.find("[data-name='modify_form'] [data-name='introText']").on("input", function () {
            modifyTextareaVal = utils.limitWords($(this).val(), 65)
            $(this).val(modifyTextareaVal)
        })
        //   增加主播信息-主播简介
        var addTextareaVal
        this.element.find("[data-name='add_form'] [data-name='introText']").on("input", function () {
            addTextareaVal = utils.limitWords($(this).val(), 65)
            $(this).val(addTextareaVal)
        })
    },

    /**
     * 查詢
     */
    search: function () {
        // 主播列表
        if (this.liveType === "list") {
            this.element.find("#jqGrid_list").jqGrid('setGridParam', {
                postData: {}
            }).trigger("reloadGrid");
        }
        // 主播时间
        else if (this.liveType === "time") {
            this.element.find("#jqGrid_time").jqGrid('setGridParam', {
                postData: {}
            }).trigger("reloadGrid");
        }
    },

    /**
     * 初始化新增頁面
     */
    initAdd: function () {},

    /**
     * 新增
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
        var time = utils.getTime(data.modelExtraInfo.dob).split(" ")[0].split("-");
        var $modify_form = this.element.find("[data-name='modify_form']");
        var year = time.length >= 1 ? time[0] * 1 : new Date().getFullYear();
        month = time.length >= 2 ? time[1] * 1 : 1;
        day = time.length >= 3 ? time[2] * 1 : 1;
        // 设置主播帐号ID
        this._modifyUserId = data.userId;
        this._modifyUserKey = data.userKey;
        // 初始化日期插件
        $("#birthday_container").birthday();
        // 设置主播帐号
        $modify_form.find("[data-name='userKey']").val(data.userKey);
        //  TCG主播id
        $modify_form.find("[data-name='TCG_mode_id']").val(data.modelRefKey);
        // 主播说明
        $modify_form.find("[data-name='introText']").val(data.modelExtraInfo.introText);
        //  主播身高
        $modify_form.find("[data-name='height']").val(data.modelExtraInfo.height);
        //  主播体重
        $modify_form.find("[data-name='width']").val(data.modelExtraInfo.weight);
        //  主播三围
        $modify_form.find("[data-name='size']").val(data.modelExtraInfo.size);
        //  星座
        $modify_form.find("[data-name='starSign']").val(data.modelExtraInfo.starSign);
        //  兴趣爱好
        $modify_form.find("[data-name='interests']").val(data.modelExtraInfo.interests);
        //  所在地
        $modify_form.find("[data-name='location']").val(data.modelExtraInfo.location);
        //  年
        $modify_form.find("[name='year'] option[value='" + year + "']").attr("selected", true);
        //  月
        $modify_form.find("[name='month'] option[value='" + month + "']").attr("selected", true);
        //  日
        $modify_form.find("[name='day'] option[value='" + day + "']").attr("selected", true);
    },

    /**
     * 修改
     */
    modify: function (modelUserId) {
        var _this = this;
        $.ajax({
            url: "/live/live_show/getModelInfo",
            data: {
                modelUserId: modelUserId,
            }
        }).done(function (rs) {
            if (rs.status) {
                _this.initModify(rs.data);
            }
        });
    },

    /**
     * 初始化設定
     */
    initConfig: function () {
        return new Promise(function (resolve, reject) {
            resolve();
        });
    },

    /**
     * 更新設定
     */
    updateConfig: function () {
        return new Promise(function (resolve, reject) {
            resolve();
        });
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
     * 上传图片
     */
    uploadImg: function (id) {
        return new Promise(function (resolve, reject) {
            $.ajaxSettings.async = false;
            var imgPath = "";
            $.ajaxFileUpload({
                url: './sgl818/upload',
                secureuri: false,
                fileElementId: id,
                processData: false,
                contentType: false,
                dataType: 'application/json',
                success: function (data, status) {
                    var dataCopy = data;
                    try {
                        // 解析返回数据
                        var reg = /<pre.+?>(.+)<\/pre>/g;
                        data = data.match(reg);
                        data = RegExp.$1; // 解决上传文件 返回值带 <pre
                        data = (new Function("return " + data))();
                    } catch (err) {
                        data = dataCopy;
                        data = (new Function("return " + data))();
                    }
                },
                error: function (data, status, e) {
                    console.log(e)
                }
            });
        });
    },

    // 切换主播类型
    switchliveType: function (liveType) {
        // 切换类型
        this.liveType = liveType || 'list';
        // 主播列表
        if (this.liveType === 'list') {
            this.element.find("[data-name='jqGrid_list']").show();
            this.element.find("[data-name='jqGrid_time']").hide();
        }
        // 直播时间
        else if (this.liveType === 'time') {
            this.element.find("[data-name='jqGrid_list']").hide();
            this.element.find("[data-name='jqGrid_time']").show();
        }
    },

    // 验证创建主播信息
    verification: function (data) {
        var obj = {
            verification: true,
            message: ''
        }
        if (data.userKey === '') {
            obj.verification = false;
            obj.message = '请输入主播帐号'
            return obj
        }
        if (data.password === '') {
            obj.verification = false;
            obj.message = '请输入密码'
            return obj
        }

        if (data.TCG_mode_id === '') {
            obj.verification = false;
            obj.message = '请输入TCG主播ID'
            return obj
        }
        if (data.nickName === '') {
            obj.verification = false;
            obj.message = '请输入昵称'
            return obj
        }
        if (data.size != '') {
            if (data.size.split(' ').length <= 1) {
                obj.verification = false;
                obj.message = '三围请以空格分开填写'
                return obj
            }
        }
        return obj;
    },

    // 注册主播帐号
    registerModel: function (data, submit) {
        var _this = this;
        var userKey = data.userKey.split(".");
        userKey = userKey.length >= 2 ? userKey[1] : userKey[0];
        var extraInfo = {
            mainImgHeader: userKey + '的直播房间',
            mainImgRefKey: userKey,
            introText: data.introText,
            dob: new Date().getTime(),
            height: data.height,
            weight: data.weight,
            size: data.size,
        }
        submit.addClass("disabled btn-primary").text('提交中...');
        $.ajax({
            url: "/live/live_show_mgt/registerModel",
            method: 'POST',
            headers: {
                'authorization-ww': user.getToken(),
            },
            data: {
                merchant: data.merchant,
                userKey: data.userKey,
                password: data.password,
                nickName: data.nickName,
                modelRefKey: data.TCG_mode_id,
                modelExtraInfo: JSON.stringify(extraInfo),
            }
        }).done(function (rs) {
            if (rs.status) {
                $.messager({
                    status: 'success',
                    message: '恭喜您注册成功',
                    determine: function () {
                        _this.clearRegistrationMessage('add');
                    }
                });
                submit.removeClass("disabled").text('提交');
            } else {
                $.messager({
                    status: 'error',
                    message: '注册失败，请检查填写是否正确！'
                });
                submit.removeClass("disabled").text('提交');
            }
        }).fail(function (xhr, status, err) {
            $.messager({
                status: 'error',
                message: xhr.responseJSON.errorCode
            });
            submit.removeClass("disabled").text('提交');
        })
    },

    // 清除注册信息
    clearRegistrationMessage: function (element) {
        var $add_form = this.element.find("[data-name='add_form']");
        $add_form.find("[data-name='userKey']").val('');
        $add_form.find("[data-name='password']").val('');
        $add_form.find("[data-name='nickName']").val('');
        $add_form.find("[data-name='introText']").val('');
        $add_form.find("[data-name='height']").val('');
        $add_form.find("[data-name='weight']").val('');
        $add_form.find("[data-name='size']").val('');
        $add_form.find("[data-name='TCG_mode_id']").val('');
        this.element.find("[page='" + element + "'] .back_button").trigger("click");
    },

    // 修改主播信息
    modifyMode: function (data) {
        var _this = this;
        // 容错和默认处理
        var modelExtraInfo = data.modelExtraInfo;
        var status = data.status,
            modelRefKey = data.modelRefKey
        modelUserId = data.modelUserId;
        if (modelExtraInfo) {
            // 处理默认数据
            var userKey = modelExtraInfo.mainImgHeader ? utils.setUserkeyEndToLowerCase(modelExtraInfo.mainImgHeader, true) : "",
                introText = modelExtraInfo.introText || '',
                height = modelExtraInfo.height || "",
                weight = modelExtraInfo.weight || "",
                size = modelExtraInfo.size || "",
                dob = modelExtraInfo.dob,
                starSign = modelExtraInfo.starSign || "",
                interests = modelExtraInfo.interests || "",
                location = modelExtraInfo.location || "";
            // 合并 extraInfo 信息
            var extraInfo = {
                mainImgHeader: userKey + "的直播房间" || '',
                mainImgRefKey: userKey,
                introText: introText,
                dob: dob,
                height: height,
                weight: weight,
                size: size,
                starSign: starSign,
                interests: interests,
                location: location
            }
        }
        // 设置按钮切换数据
        var buttonData = {
            element: this.element.find("[data-name='modify_form'] [data-name='submit']"),
            status: true,
            text: '提交中...'
        }
        // 切换按钮状态
        utils.buttomStatus(buttonData);
        $.ajax({
            url: "/live/live_show_mgt/updateModel",
            method: 'POST',
            headers: {
                'authorization-ww': user.getToken(),
            },
            data: {
                modelUserId: modelUserId,
                status: status || null,
                modelRefKey: modelRefKey || null,
                modelExtraInfo: JSON.stringify(extraInfo) || null
            }
        }).always(function () {
            // 修改按钮状态
            buttonData.status = false;
            buttonData.text = '提交';
            utils.buttomStatus(buttonData);
        }).done(function (rs) {
            if (rs.status) {
                $.messager({
                    message: _this._ModificationText + '成功',
                    determine: function () {
                        _this.clearRegistrationMessage('modify');
                    }
                });
            } else {
                $.messager({
                    status: 'error',
                    message: _this._ModificationText + '失败'
                });
            }
        }).fail(function (xhr, status, err) {
            $.messager({
                status: 'error',
                message: xhr.responseJSON.errorCode
            });
        })
    },

    // 窗口大小变化
    resize: function (width, height) {
        this._jqGrid.setGridWidth($(".x_panel").width());
    },
}
