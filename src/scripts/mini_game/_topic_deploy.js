var mini_game_topic_deploy = {
    jqGrid: null,
    topic: 0,
    parameters: {
        "size": 11
    },
    types: [''],
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
    typeInfo: function () {
        return new Promise(function (resolve, reject) {
            $.get("./backend/question_info", function (data) {
                var data = data.data;
                resolve(data);
            }, 'json');
        });
    },
    initComponent: function () {
        var _this = this;
        this.element.find(".answer-b").focus(function () {
            if (String.isEmpty($(".answer-a").val())) {
                $(".answer-b").blur();
            }
        });
        this.element.find(".answer-c").focus(function () {
            if (String.isEmpty($(".answer-b").val())) {
                $(".answer-c").blur();
            }
        });
        this.element.find(".answer-d").focus(function () {
            if (String.isEmpty($(".answer-c").val())) {
                $(".answer-d").blur();
            }
        });
        this.element.find(".edit-answer-b").focus(function () {
            if (String.isEmpty($(".edit-answer-a").val())) {
                $(".edit-answer-b").blur();
            }
        });
        this.element.find(".edit-answer-c").focus(function () {
            if (String.isEmpty($(".edit-answer-b").val())) {
                $(".edit-answer-c").blur();
            }
        });
        this.element.find(".edit-answer-d").focus(function () {
            if (String.isEmpty($(".edit-answer-c").val())) {
                $(".edit-answer-d").blur();
            }
        });
        this.element.find('.start-time').daterangepicker({
                singleDatePicker: true,
                showDropdowns: true,
                autoUpdateInput: false,
                timePicker12Hour: false,
                timePickerIncrement: 10,
                timePicker: true,
                "locale": {
                    format: 'YYYY-MM-DD HH:mm:ss',
                    applyLabel: "应用",
                    cancelLabel: "取消",
                    resetLabel: "重置",
                    daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                    monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十 一月", "十二月"]
                }
            },
            function (start, end, label) {
                $('.start-time').val(start.format('YYYY-MM-DD HH:mm:SS'));
            }).on('apply.daterangepicker', function (ev, picker) {
            timestr = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate() + " " + "00:00:00";
            if (new Date(timestr).getTime() == new Date(picker.startDate).getTime()) {
                $('.start-time').val(moment().format("YYYY-MM-DD HH:mm:ss"));
            }
        });
        this.element.find('.end-time').daterangepicker({
                singleDatePicker: true,
                showDropdowns: true,
                autoUpdateInput: false,
                timePicker12Hour: false,
                timePickerIncrement: 10,
                timePicker: true,
                "locale": {
                    format: 'YYYY-MM-DD HH:mm:ss',
                    applyLabel: "应用",
                    cancelLabel: "取消",
                    resetLabel: "重置",
                    daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                    monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十 一月", "十二月"]
                }
            },
            function (start, end, label) {
                $('.end-time').val(end.format('YYYY-MM-DD HH:mm:SS'));
            }).on('apply.daterangepicker', function (ev, picker) {
            timestr = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate() + " " + "00:00:00";
            if (new Date(timestr).getTime() == new Date(picker.startDate).getTime()) {
                $('.end-time').val(moment().format("YYYY-MM-DD HH:mm:ss"));
            }
        });
        this.element.find('.edit-start-time').daterangepicker({
                singleDatePicker: true,
                showDropdowns: true,
                autoUpdateInput: false,
                timePicker12Hour: false,
                timePickerIncrement: 10,
                timePicker: true,
                "locale": {
                    format: 'YYYY-MM-DD HH:mm:ss',
                    applyLabel: "应用",
                    cancelLabel: "取消",
                    resetLabel: "重置",
                    daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                    monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十 一月", "十二月"]
                }
            },
            function (start, end, label) {
                $('.edit-start-time').val(start.format('YYYY-MM-DD HH:mm:SS'));
            }).on('apply.daterangepicker', function (ev, picker) {
            timestr = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate() + " " + "00:00:00";
            if (new Date(timestr).getTime() == new Date(picker.startDate).getTime()) {
                $('.edit-start-time').val(moment().format("YYYY-MM-DD HH:mm:ss"));
            }
        });
        this.element.find('.edit-end-time').daterangepicker({
                singleDatePicker: true,
                showDropdowns: true,
                autoUpdateInput: false,
                timePicker12Hour: false,
                timePickerIncrement: 10,
                timePicker: true,
                "locale": {
                    format: 'YYYY-MM-DD HH:mm:ss',
                    applyLabel: "应用",
                    cancelLabel: "取消",
                    resetLabel: "重置",
                    daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                    monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十 一月", "十二月"]
                }
            },
            function (start, end, label) {
                $('.edit-end-time').val(end.format('YYYY-MM-DD HH:mm:SS'));
            }).on('apply.daterangepicker', function (ev, picker) {
            timestr = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate() + " " + "00:00:00";
            if (new Date(timestr).getTime() == new Date(picker.startDate).getTime()) {
                $('.edit-end-time').val(moment().format("YYYY-MM-DD HH:mm:ss"));
            }
        });
        this.typeInfo().then(function (value) {
            $.each(value.categories, function (i, o) {
                _this.types.push(o.name);
            });
            _this.element.find("#jqGrid").jqGrid({
                url: "./backend/questions",
                postData: {
                    page: 1,
                    size: 30,
                },
                mtype: "GET",
                styleUI: 'Bootstrap',
                datatype: "json",
                colModel: [{
                        label: '编号',
                        name: 'id',
                        key: true,
                        width: 50
                    },
                    {
                        label: '题目类型',
                        width: 80,
                        formatter: function (value, options, row) {
                            var status = _this.types[row.categoryId];
                            return status;
                        }
                    },
                    {
                        label: '题目图',
                        name: 'picture',
                        width: 140
                    },
                    {
                        label: '描述',
                        name: 'title',
                        width: 150
                    },
                    {
                        label: '答案',
                        width: 70,
                        formatter: function (value, options, row) {
                            var html = '';
                            $.each(row.answers, function (index, answer) {
                                html += answer.value + ":" + answer.title + "<br>"
                            });
                            return html;
                        }
                    },
                    {
                        label: '开始时间',
                        width: 140,
                        formatter: function (value, options, row) {
                            return moment(row.startTime).format("YYYY-MM-DD HH:mm:ss");
                        }
                    },
                    {
                        label: '截止时间',
                        width: 140,
                        formatter: function (value, options, row) {
                            return moment(row.endTime).format("YYYY-MM-DD HH:mm:ss");
                        }
                    },
                    {
                        label: '题目来源',
                        width: 60,
                        formatter: function (value, options, row) {
                            var html = ''
                            html += row.questionSource > 0 ? '脚本' : '人工';
                            return html;
                        }
                    },
                    {
                        label: '添加题目时间',
                        width: 140,
                        formatter: function (value, options, row) {
                            return moment(row.createdAt).format("YYYY-MM-DD HH:mm:ss");
                        }
                    },
                    {
                        label: '状态',
                        name: 'statusText',
                        width: 60
                    },
                    {
                        label: '下注总人数',
                        name: 'orderCount',
                        width: 100
                    },
                    {
                        label: '单选项下注人数',
                        width: 100,
                        formatter: function (value, options, row) {
                            var html = '';
                            $.each(row.answers, function (index, answer) {
                                html += answer.value + ":" + answer.betCount + "<br>"
                            });
                            return html;
                        }
                    },
                    {
                        label: '操作',
                        name: 'op',
                        width: 100,
                        align: 'center',
                        formatter: function (value, options, row) {
                            var html = '';
                            /*
                               "0": "正常",
                               "1": "进行中",
                               "2": "已截止",
                               "3": "待派奖",
                               "4": "已派奖",
                               "5": "待审核",
                               "6": "已废弃",
                               "7": "撤单中",
                               "8": "撤单完成"
                            */
                            switch (row.status) {
                                case 0:
                                    html += '<a class="btn btn-primary btn-xs edit_button"><i class="fa fa-pencil"></i>编辑 </a>';
                                    html += '<a class="btn btn-info btn-xs modify_button3"><i class="fa fa-pencil"></i> 废弃 </a>';
                                    break;
                                case 1:
                                    html += '<a class="btn btn-waring btn-xs modify_button2"><i class="fa fa-pencil"></i> 撤单 </a>';
                                    html += '<a class="btn btn-danger btn-xs modify_button1"><i class="fa fa-pencil"></i> 提前结束 </a>';
                                    html += '<a class="btn btn-primary btn-xs edit_button"><i class="fa fa-pencil"></i>编辑 </a>';
                                    break;
                                case 2:
                                    html += '<a class="btn btn-waring btn-xs modify_button2"><i class="fa fa-pencil"></i> 撤单 </a>';
                                    html += '<a class="btn btn-success btn-xs modify_button"><i class="fa fa-pencil"></i> 开奖 </a>';
                                    break;
                            }
                            return html;
                        }
                    },
                    {
                        label: '备注',
                        name: 'remark',
                        width: 60
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
                height: 660,
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
        // 新增加题目 复选框的渲染
        this.element.find("input:checkbox[name='checkbox']").iCheck();
        this.element.find('.all').on('ifUnchecked', function (event) {
            $('.item').iCheck('uncheck')
        });
        this.element.find('.all').on('ifChecked', function (event) {
            $('.item').iCheck('check')
        });
        this.element.find('.item').on('ifUnchecked', function (event) {
            $(this).parents(".icheckbox_flat-green").removeClass("checked")
            $('.all').iCheck('uncheck')
        });
        this.element.find('.item').on('ifChecked', function (event) {
            $(this).parents(".icheckbox_flat-green").addClass("checked")
        });
        this.element.find('.item').on('ifChecked', function (event) {
            var flag = true;
            $(this).parents('.checkbox').find('.item').each(function () {
                flag = flag && $(this).is(':checked');
            })
            if (flag) {
                $('.all').iCheck('check')
            }
        });
        // 编辑题目 复选框的渲染 不共用上面的渲染  item 全部选择后 上面全选不会被全选   
        //	按下'新增'按鈕
        this.element.on("click", "[page='inquire'] .add_button", function (e) {
            //	初始化新增頁面
            _this.initAdd();
            //	跳轉至'新增'頁面
            _this.element.find("[page='add']").addClass("active")
                .siblings("[page]").removeClass("active");
        });
        //	按下'提前结束'按鈕  
        this.element.on("click", "[page='inquire'] .modify_button1", function (e) {
            app.startLoading();
            _this.getLineNumber();
            if (_this.topic > 0) {
                url = "./backend/questions/";
                url += _this.topic;
                url += "/terminate";
                postData = {
                    "questionId": _this.topic
                }
                $.post(url, postData, function (data) {
                    if (data.status) {
                        _this.parameters.page = $('#jqGrid').getGridParam('page');
                        _this.element.find("#jqGrid").jqGrid('setGridParam', {
                            postData: _this.parameters
                        }).trigger("reloadGrid");
                    }
                }, 'json');
            }
            _this.topic = 0;
            app.stopLoading();
        });
        //	按下'撤单 '按鈕  
        this.element.on("click", "[page='inquire'] .modify_button2", function (e) {
            app.startLoading();
            _this.getLineNumber();
            if (_this.topic > 0) {
                url = "./backend/questions/";
                url += _this.topic;
                url += "/cancel";
                postData = {
                    "questionId": _this.topic
                }
                $.post(url, postData, function (data) {
                    if (data.status) {
                        _this.parameters.page = $('#jqGrid').getGridParam('page');
                        _this.element.find("#jqGrid").jqGrid('setGridParam', {
                            postData: _this.parameters
                        }).trigger("reloadGrid");
                    }
                }, 'json');
            }
            _this.topic = 0;
            app.stopLoading();
        });
        //	按下'废弃'按鈕   
        this.element.on("click", "[page='inquire'] .modify_button3", function (e) {
            app.startLoading();
            _this.getLineNumber();
            if (_this.topic > 0) {
                url = "./backend/questions/";
                url += _this.topic;
                url += "/abandon";
                postData = {
                    "questionId": _this.topic
                }
                $.post(url, postData, function (data) {
                    if (data.status) {
                        _this.parameters.page = $('#jqGrid').getGridParam('page');
                        _this.element.find("#jqGrid").jqGrid('setGridParam', {
                            postData: _this.parameters
                        }).trigger("reloadGrid");
                    }
                }, 'json');
            }
            _this.topic = 0;
            app.stopLoading();
        });
        //	按下'编辑'按鈕  编辑页面   
        this.element.on("click", "[page='inquire'] .edit_button", function (e) {
            _this.getLineNumber();
            if (_this.topic > 0) {
                _this.initModify(_this.topic);
                _this.element.find("[page='edit']").addClass("active").siblings("[page]").removeClass("active");
            }
        });
        //开奖按钮 开奖界面设置
        this.element.on("click", "[page='inquire'] .modify_button", function (e) {
            _this.getLineNumber();
            if (_this.topic > 0) {
                _this.initPrize(_this.topic);
                _this.element.find("[page='modify']").addClass("active").siblings("[page]").removeClass("active");
            }
        });
        //	按下 新增 页面的 '儲存'按鈕
        this.element.on("click", "[page='add'] .save_button", function (e) {
            img = $(".img").val()
            img_id = img.substring(img.indexOf("."));
            if (img_id != ".bmp" && img_id != ".png" && img_id != ".gif" && img_id != ".jpg" && img_id != ".jpeg") {
                $(".img-tips").html("不是指定图片格式,重新选择");
                $(".img").val("")
                return;
            } else {
                $(".img-tips").html("");
            }
            if (String.isEmpty($(".title").val())) {
                $(".title-tips").html("题目暂缺描述");
                return;
            } else {
                $(".title-tips").html("");
            }
            if (String.isEmpty($(".answer-b").val())) {
                $(".answer-tips").html("  至少需要两个选项的描述");
                return;
            } else {
                $(".answer-tips").html("");
            }
            if (String.isEmpty($(".start-time").val()) || String.isEmpty($(".end-time").val())) {
                $(".time-tips").html("需要有时间值");
                return;
            } else {
                $(".time-tips").html("");
            }
            if (new Date($(".start-time").val()).getTime() > new Date($(".end-time").val()).getTime()) {
                $(".time-tips").html("截止时间 小于 开始时间 ");
                $(".end-time").val("");
                return;
            } else {
                $(".time-tips").html("");
            }
            if (new Date().getTime() > new Date($(".end-time").val()).getTime()) {
                $(".time-tips").html("截止时间 小于 当前 ");
                $(".end-time").val("");
                return;
            } else {
                $(".time-tips").html("");
            }
            var count = 0;
            _this.element.find(".add-checkbox").find('.item').each(function () {
                if ($(this).is(':checked')) {
                    count++;
                }
            })
            if (count == 0) {
                $(".time-tips").html("平台至少需要一个");
                return;
            } else {
                $(".time-tips").html("");
            }
            // 防止特殊操作   填完后面删除前面   只要 数组不连续即不可以提交 
            var answer = [];
            $(".add-answer-area").find('input[name="add-answer"]').each(function () {
                if (String.isEmpty($(this).val())) {
                    answer.push(0)
                } else {
                    answer.push(1)
                }
            })
            answer.push(0)
            answer = answer.join("")
            if (answer.indexOf('0') < answer.lastIndexOf('1')) {
                $(".answer-tips").html("  答案不连续");
                return;
            } else {
                $(".answer-tips").html("");
            }
            _this.element.find("[page='add'] .btn-app").addClass("processing");
            $.ajaxSettings.async = false;
            _this.uploadImg('img').then(function (value) {
                console.log(value)
                var sendData = {
                    "categoryId": 0,
                    "questionSource": 0,
                    "picture": value,
                    "title": $(".title").val(),
                    "startTime": new Date().getTime(),
                    "endTime": new Date().getTime() + 24 * 60 * 60 * 1000 * 3,
                    "answers": [],
                    "merchantMappings": [{
                        "merchantCode": "sgl818"
                    }]
                }
                sendData.categoryId = $(".type-select option:selected").val();
                sendData.startTime = new Date($(".start-time").val()).getTime();
                sendData.endTime = new Date($(".end-time").val()).getTime();
                if (String.isNotEmpty($(".answer-a").val())) {
                    var answer = {
                        "title": $(".answer-a").val(),
                        "value": "A"
                    }
                    sendData.answers.push(answer);
                }
                if (String.isNotEmpty($(".answer-b").val())) {
                    var answer = {
                        "title": $(".answer-b").val(),
                        "value": "B"
                    }
                    sendData.answers.push(answer);
                }
                if (String.isNotEmpty($(".answer-c").val())) {
                    var answer = {
                        "title": $(".answer-c").val(),
                        "value": "C"
                    }
                    sendData.answers.push(answer);
                }
                if (String.isNotEmpty($(".answer-d").val())) {
                    var answer = {
                        "title": $(".answer-d").val(),
                        "value": "D"
                    }
                    sendData.answers.push(answer);
                }
                $('.item').each(function () {
                    if ($(this).is(':checked')) {
                        var tmp = {
                            "merchantCode": "sgl818"
                        }
                        tmp.merchantCode = $(this).val()
                        sendData.merchantMappings.push(tmp)
                    } //if-checked
                }) //each 
                app.startLoading();
                _this.add(sendData).then(function (value) {
                    if (value.status) {
                        _this.parameters.page = 1;
                        _this.element.find("#jqGrid").jqGrid('setGridParam', {
                            postData: _this.parameters
                        }).trigger("reloadGrid");
                        _this.element.find("[page='inquire']").addClass("active")
                            .siblings("[page]").removeClass("active");
                    } else {
                        $(".add-return-tips").html(" 服务器内部 出现错误或者超时 ,请稍后再试 ");
                    }
                }).finally(function () {
                    _this.element.find("[page='add'] .btn-app").removeClass("processing");
                });
                app.stopLoading();
            }, function (value) {
                return;
            }); // upliad img  				
        });
        //	按下 编辑 页面的 '儲存'按鈕 
        this.element.on("click", "[page='edit'] .save_button", function (e) {
            if (String.isEmpty($(".edit-title").val())) {
                $(".edit-title").val("需要有描述")
                return;
            } else {
                $(".edit-title-tips").html("");
            }
            if (String.isEmpty($(".edit-answer-b").val())) {
                $(".edit-answer-tips").html("至少需要两个选项的描述");
                return;
            } else {
                $(".edit-answer-tips").html("");
            }
            // 防止特殊操作   填完后面删除前面   只要 数组不连续即不可以提交 
            var answer = [];
            $(".add-answer-area").find('input[name="edit-answer"]').each(function () {
                if (String.isEmpty($(this).val())) {
                    answer.push(0)
                } else {
                    answer.push(1)
                }
            })
            answer.push(0)
            answer = answer.join("")
            if (answer.indexOf('0') < answer.lastIndexOf('1')) {
                $(".edit-answer-tips").html("答案不连续");
                return;
            } else {
                $(".edit-answer-tips").html("");
            }
            if (String.isEmpty($(".edit-start-time").val()) || String.isEmpty($(".edit-end-time").val())) {
                $(".edit-time-tips").html("需要有时间值");
                return;
            } else {
                $(".edit-time-tips").html("");
            }
            if (new Date($(".edit-start-time").val()).getTime() > new Date($(".edit-end-time").val()).getTime()) {
                $(".edit-time-tips").html("截止时间 小于 开始时间");
                $(".edit-end-time").val("");
                return;
            } else {
                $(".edit-time-tips").html("");
            }
            if (new Date().getTime() > new Date($(".edit-end-time").val()).getTime()) {
                $(".edit-time-tips").html("截止时间 小于 当前");
                $(".edit-end-time").val("");
                return;
            } else {
                $(".edit-time-tips").html("");
            }
            var count = 0;
            _this.element.find(".edit-checkbox").find('.item').each(function () {
                if ($(this).is(':checked')) {
                    count++;
                }
            })
            if (count == 0) {
                $(".edit-checkbox-tips").html("平台至少需要一个");
                return;
            } else {
                $(".edit-checkbox-tips").html("");
            }
            _this.element.find("[page='edit'] .btn-app").addClass("processing");
            var sendData = {
                "categoryId": 0,
                "questionSource": 0,
                "title": $(".edit-title").val(),
                "startTime": new Date().getTime(),
                "endTime": new Date().getTime() + 24 * 60 * 60 * 1000 * 3,
                "answers": [],
                "merchantMappings": [{
                    "merchantCode": "sgl818"
                }]
            }
            sendData.categoryId = $(".edit-type-select option:selected").val()
            sendData.startTime = new Date($(".edit-start-time").val()).getTime()
            sendData.endTime = new Date($(".edit-end-time").val()).getTime()
            if (String.isNotEmpty($(".edit-answer-a").val())) {
                var answer = {
                    "title": $(".edit-answer-a").val(),
                    "value": "A"
                }
                sendData.answers.push(answer);
            }
            if (String.isNotEmpty($(".edit-answer-b").val())) {
                var answer = {
                    "title": $(".edit-answer-b").val(),
                    "value": "B"
                }
                sendData.answers.push(answer);
            }
            if (String.isNotEmpty($(".edit-answer-c").val())) {
                var answer = {
                    "title": $(".edit-answer-c").val(),
                    "value": "C"
                }
                sendData.answers.push(answer);
            }
            if (String.isNotEmpty($(".edit-answer-d").val())) {
                var answer = {
                    "title": $(".edit-answer-d").val(),
                    "value": "D"
                }
                sendData.answers.push(answer);
            }
            $('.item').each(function () {
                if ($(this).is(':checked')) {
                    var tmp = {
                        "merchantCode": "sgl818"
                    }
                    tmp.merchantCode = $(this).val()
                    sendData.merchantMappings.push(tmp)
                } //if-checked
            }) //each  
            img = $(".edit-img").val();
            if (String.isEmpty(img)) {
                //不更新图片直接提交
                app.startLoading();
                _this.editPut(_this.topic, sendData).then(function (value) {
                    if (value.status) {
                        _this.parameters.page = $('#jqGrid').getGridParam('page');
                        _this.element.find("#jqGrid").jqGrid('setGridParam', {
                            postData: _this.parameters
                        }).trigger("reloadGrid");
                        _this.element.find("[page='inquire']").addClass("active").siblings("[page]").removeClass("active");
                    } else {
                        $(".edit-return-tips").html(" 服务器内部 出现错误或者超时 ,请稍后再试 ");
                    }
                }).finally(function () {
                    _this.element.find("[page='edit'] .btn-app").removeClass("processing");
                });
                app.stopLoading();
            } else {
                //不更新图片  验证-上传图片-更改字段  再提交
                img_id = img.substring(img.indexOf("."));
                if (img_id != ".bmp" && img_id != ".png" && img_id != ".gif" && img_id != ".jpg" && img_id != ".jpeg") {
                    $(".edit-img-tips").html("不是指定图片格式,重新选择");
                    $(".edit-img").val("")
                    return;
                } else {
                    $(".edit-img-tips").html("");
                    _this.uploadImg('edit-img').then(function (value) {
                        sendData["picture"] = value;
                        app.startLoading();
                        _this.editPut(_this.topic, sendData).then(function (value) {
                            if (value.status) {
                                _this.parameters.page = $('#jqGrid').getGridParam('page');
                                _this.element.find("#jqGrid").jqGrid('setGridParam', {
                                    postData: _this.parameters
                                }).trigger("reloadGrid");
                                _this.element.find("[page='inquire']").addClass("active")
                                    .siblings("[page]").removeClass("active");
                            } else {
                                $(".edit-return-tips").html(" 服务器内部 出现错误或者超时 ,请稍后再试 ");
                            }
                        }).finally(function () {
                            _this.element.find("[page='edit'] .btn-app").removeClass("processing");
                        });
                        app.stopLoading();
                    }, function (value) {
                        return;
                    });
                } //else-end
            } //if-else-end
        });
        //	按下 新建页面的 '返回'按鈕
        this.element.on("click", "[page='add'] .back_button", function (e) {
            _this.element.find("[page='inquire']").addClass("active")
                .siblings("[page]").removeClass("active");
        });
        //	按下 编辑页面的 '返回'按鈕
        this.element.on("click", "[page='edit'] .back_button", function (e) {
            _this.element.find("[page='inquire']").addClass("active").siblings("[page]").removeClass("active");
        });
        //	按下'儲存'按鈕  执行开奖
        this.element.on("click", "[page='modify'] .save_button", function (e) {
            _this.Prize();
        });
        //	按下'返回'按鈕
        this.element.on("click", "[page='modify'] .back_button", function (e) {
            _this.element.find("[page='inquire']").addClass("active").siblings("[page]").removeClass("active");
        });
        this.element.on("click", "[page='add'] .btn-group>.btn", function (e) {
            var $this = $(this);
            $this.addClass("active " + $this.data("toggleClass"))
                .removeClass($this.data("togglePassiveClass"))
                .siblings(".btn")
                .addClass($this.data("togglePassiveClass"))
                .removeClass("active " + $this.data("toggleClass"))
        });
    },
    /**
     * 上传图片
     */
    uploadImg: function (id) {
        return new Promise(function (resolve, reject) {
            $.ajaxSettings.async = false;
            var imgPath = "";
            $.ajaxFileUpload({
                url: './api/upload',
                secureuri: false,
                fileElementId: id,
                processData: false,
                contentType: false,
                dataType: 'application/json',
                //dataType: 'json',
                success: function (data, status) {
                    console.log(data)
                    imgPath = data.substring(data.indexOf('url":"'))
                    imgPath = imgPath.substring(0, imgPath.indexOf('"}}'))
                    imgPath = imgPath.substring(6)
                    console.log(imgPath)
                    resolve(imgPath);
                }
            });
        });
    },
    /**
     * 获取类别  装填 表单 select and check
     *  因为异步 改成 this.typeInfo().then(function(value) {}) 将出现  复选框失效果
     */
    initSelect: function () {
        $.ajaxSettings.async = false;
        $.get('./backend/question_info', function (data) {
            console.log(data)
            $.each(data.data.categories, function (i, o) {
                if (i == 1) {
                    $(".type-select").append("<option value='" + o.id + "' selected>" + o.name + "</option>");
                } else {
                    $(".type-select").append("<option value='" + o.id + "'>" + o.name + "</option>");
                }
                $(".edit-type-select").append("<option value='" + o.id + "'>" + o.name + "</option>");
            });
            $.each(data.data.merchants, function (i, o) {
                var html = '<label><div class="icheckbox_flat-green" style="position: relative;">'
                html += '<input type="checkbox" name="checkbox" value="' + o.code + '" class="flat item" style="position: absolute; opacity: 0;">';
                html += ' <ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div>';
                html += o.name + '</label>'
                $(".add-checkbox").append(html);
                $(".edit-checkbox").append(html);
            });
        }, 'json');
    },
    /**
     * 提交 编辑题目后的数据
     */
    editPut: function (topic, sendData) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            $.ajax({
                "url": "./backend/questions/" + topic,
                "type": "put",
                "data": JSON.stringify(sendData),
                "contentType": 'application/json',
                "dataType": "json",
                "success": function (data) {
                    resolve(data);
                },
                "error": function (xhr, txt) {
                    console.log(xhr + "," + txt);
                }
            });
            _this.topic = 0;
        });
    },
    /**
     * 查詢
     */
    search: function () {
        //	TODO 查詢
        this.element.find("#jqGrid").jqGrid('setGridParam', {
            postData: {
                username: 'test1'
            },
            page: 1,
        }).trigger("reloadGrid");
    },
    /**
     * 匯出
     */
    exported: function () {
        //	TODO 導出*.csv
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve();
            }, 500);
        });
    },
    /**
     * 初始化新增頁面
     */
    initAdd: function () {
        //	TODO 清除所有'新增'頁面欄位的數值
    },
    /**
     * 新增
     * @return {Promise}
     */
    add: function (sendData) {
        return new Promise(function (resolve, reject) {
            console.log(sendData)
            $.ajax({
                "url": "./backend/questions",
                "type": "POST",
                "data": JSON.stringify(sendData),
                "contentType": 'application/json',
                "dataType": "json",
                "success": function (data) {
                    resolve(data);
                },
                "error": function (xhr, txt) {
                    console.log(xhr + "," + txt);
                }
            });
        });
    },
    /**
     * 初始化开奖頁面
     */
    initPrize: function (id) {
        var _this = this;
        $.get('./backend/questions/' + id, function (data) {
            data = data.data;
            var type = _this.types[data.categoryId];
            $(".type-msg").html(type)
            $(".title-msg").html(data.title)
            $(".answers-area").empty();
            $.each(data.answers, function (i, o) {
                html = ' <label><input type="radio" value="' + o.value + '"name="radio[]" class="flat"/> ' + o.value + ':' + o.title + ' </label>'
                $(".answers-area").append(html);
            })
            $(".end-time-msg").html(moment(parseInt(data.endTime)).format("YYYY-MM-DD HH:mm:ss"));
        }, 'json');
    },
    /**
     * 开奖执行函数
     */
    Prize: function () {
        var _this = this;
        url = "./backend/questions/";
        url += _this.topic;
        url += "/man_draw";
        answer = $('.answers-area input[name="radio[]"]:checked ').val();
        if (String.isEmpty(answer)) {
            $(".prize-return-tips").html("未选择答案");
        } else {
            $(".prize-return-tips").html("");
            postData = {
                "correctValue": answer,
                "remark": $(".mark-msg").val()
            }
            app.startLoading();
            $.ajax({
                "url": url,
                "type": "post",
                "data": JSON.stringify(postData),
                "contentType": 'application/json',
                "dataType": "json",
                "success": function (data) {
                    if (data.status) {
                        _this.parameters.page = $('#jqGrid').getGridParam('page');
                        _this.element.find("#jqGrid").jqGrid('setGridParam', {
                            postData: _this.parameters
                        }).trigger("reloadGrid");
                        _this.element.find("[page='modify'] .btn-app").addClass("processing");
                        _this.modify().then(function () {
                            _this.element.find("[page='inquire']").addClass("active")
                                .siblings("[page]").removeClass("active");
                        }).finally(function () {
                            _this.element.find("[page='modify'] .btn-app").removeClass("processing");
                        });
                    } else {
                        $(".prize-return-tips").html(data.message);
                    }
                    $(".prize-return-tips").html(data.message);
                },
                "error": function (xhr, txt) {
                    console.log(xhr + "," + txt);
                }
            });
            _this.topic = 0;
            app.stopLoading();
        }
    },
    /**
     * 初始化修改頁面
     */
    initModify: function (id) {
        var _this = this;
        items = ["edit-title", "edit-answer-c", "edit-answer-d", 'edit-return-tips']
        $.each(items, function (i, o) {
            $("." + o).val("")
        })
        spanItems = ['edit-return-tips']
        $.each(spanItems, function (i, o) {
            $("." + o).html("")
        })
        $.get('./backend/questions/' + id, function (data) {
            rowData = data.data
            $(".edit-type-select").children("option").each(function () {
                var temp_value = $(this).val();
                if (temp_value == rowData.categoryId) {
                    $(this).attr("selected", "selected");
                }
            });
            // 填装 答案
            $.each(rowData.answers, function (i, o) {
                if (o.value == 'A') {
                    $('.edit-answer-a').val(o.title)
                } else if (o.value == 'B') {
                    $('.edit-answer-b').val(o.title)
                } else if (o.value == 'C') {
                    $('.edit-answer-c').val(o.title)
                } else {
                    $('.edit-answer-d').val(o.title)
                }
            })
            $(".edit-title").val(rowData.title)
            $(".edit-start-time").val(moment(parseInt(rowData.startTime)).format("YYYY-MM-DD HH:mm:ss"))
            $(".edit-end-time").val(moment(parseInt(rowData.endTime)).format("YYYY-MM-DD HH:mm:ss"))
            // 填装 复选框
            $.each(rowData.merchantMappings, function (i, o) {
                $('.item').each(function () {
                    if ($(this).val() == o.merchantCode) {
                        $(this).iCheck('check')
                    }
                });
            });
        }, 'json');
    },
    /**
     * 修改
     */
    modify: function () {
        //	TODO Ajax提交修改後的內容
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve();
            }, 500);
        });
    },
    /**
     *  获取当前操作的行
     */
    getLineNumber: function () {
        var id = $('#jqGrid').jqGrid('getGridParam', 'selrow');
        var rowData = $('#jqGrid').jqGrid('getRowData', id);
        if (rowData.length >= 0) {} else {
            _this.topic = rowData.id
        }
    },
    resize: function (width, height) {
        this.jqGrid.setGridWidth($(".x_content").width());
    },
}
