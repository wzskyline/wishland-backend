var system_syscount_manage = {
    init: function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.initSlect()
            _this.initComponent();
            _this.bindEvent();
            resolve();
        })
    },
    destroy: function () {},
    initComponent: function () {
        var _this = this;
        this.element.find(".subdiv").hide()
        this.element.find("#jqGrid").jqGrid({
            url: "./wishland/users",
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
                    label: '用户名',
                    name: 'name',
                    width: 70
                },
                {
                    label: '归属品牌',
                    name: 'brand',
                    width: 70
                },
                {
                    label: '订阅品牌',
                    width: 80,
                    name: 'readbrand',
                    formatter: function (value, options, row) {
                        var str = ""
                        for (var i = 0; i < row.merchants.length; i++) {
                            if (row.merchants[i] == 'sgl818') {
                                str += "  " + "香格里拉"
                            } else if (row.merchants[i] == '2kc') {
                                str += "  " + "2000彩"
                            }
                        }
                        return str;
                    }
                },
                {
                    label: '用户组',
                    width: 150,
                    name: 'roles',
                    formatter: function (value, options, row) {
                        var str = ""
                        for (var i = 0; i < row.roles.length; i++) {
                            str += "  " + row.roles[i].title
                        }
                        return str;
                    }
                },
                {
                    label: '启用状态',
                    width: 70,
                    name: 'status',
                    formatter: function (value, options, row) {
                        if (row.status == 1) {
                            return "启用中";
                        } else {
                            return "已停用";
                        }
                    }
                },
                {
                    label: '操作',
                    name: 'op',
                    width: 200,
                    align: 'center',
                    formatter: function (value, options, row) {
                        var html = '<select class="op"><optgroup label="">';
                        html += '<option value="change-changes"><a class="btn btn-info btn-xs modify_button"><i class="fa fa-pencil"></i>操作</a></option>';
                        html += '<option value="change-roles"><a class="btn btn-info btn-xs modify_button"><i class="fa fa-pencil"></i>修改用户组</a></option>';
                        html += '<option value="change-pwd"><a class="btn btn-info btn-xs modify_button"><i class="fa fa-pencil"></i>密码重置</a></option>';
                        html += '<option value="change-status"><a class="btn btn-danger btn-xs"><i class="fa fa-trash-o"></i> 修改状态</a></option>';
                        html += '<option value="change-merchant"><a class="btn btn-danger btn-xs"><i class="fa fa-trash-o"></i> 修改品牌</a></option>';
                        html += '</optgroup></select>';
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
            height: 560,
            rowNum: 30,
            pager: "#jqGridPager"
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
        //ADD PAGE
        this.element.on("click", "[page='inquire'] .add_button", function (e) {
            str = ""
            str += "<option value='sgl818' seleted>香格里拉</option>"
            str += "	<option value='2000cai' seleted>2000彩</option>"
            $('.add-brand').empty()
            $('.add-brand').append("<select   id='searchable' multiple='multiple' > </select>")
            $('#searchable').append(str)
            $('#searchable').multiselect2side({
                search: "可选项",
                labeldx: '已有项',
                moveOptions: false,
            });
            _this.element.find("[page='add']").addClass("active")
                .siblings("[page]").removeClass("active");
        });
        this.element.on("click", "[page='add'] .save_button", function (e) {
            var brands = [];
            $("#ms2side__dx option").each(function () {
                brands.push($(this).val())
            });
            var data = {
                name: _this.element.find(".add-name").val(),
                password: _this.element.find(".add-password").val(),
                merchants: brands,
            }
            if (_this.check(data)) {
                _this.add(data).then(function (data) {
                    if (data.status) {
                        $(".ret").html("")
                        $("#jqGrid").jqGrid('setGridParam', {
                            url: './wishland/users',
                            datatype: 'json',
                            postData: {},
                            page: $('#jqGrid').getGridParam('page'),
                        }).trigger("reloadGrid");
                        _this.element.find("[page='inquire']").addClass("active").siblings("[page]").removeClass("active");
                    } else {
                        $(".ret").html(data.data)
                    }
                }).finally(function () {});
            }
        });
        this.element.on("click", "[page='add'] .back_button", function (e) {
            _this.element.find("[page='inquire']").addClass("active")
                .siblings("[page]").removeClass("active");
        });
        //	按下'查詢'按鈕
        this.element.on("click", "[page='inquire'] .search_button", function (e) {
            var data = {
                name: $(".arg-name").val(),
                merchant: $(".arg-merchant").val(),
                status: $(".arg-status").val(),
                roleId: $(".arg-roleId").val(),
            }
            _this.search(data);
        });
        //	按下'汇出'按鈕
        this.element.on("click", "[page='inquire'] .exported_button", function (e) {
            //	processing
            _this.element.find("[page='inquire'] .exported_button").addClass("processing");
            _this.exported().finally(function () {
                _this.element.find("[page='inquire'] .exported_button").removeClass("processing");
            });
        });
        //	按下'新增'按鈕
        this.element.on("click", "[page='inquire'] .add_button", function (e) {
            _this.initAdd();
            _this.element.find("[page='add']").addClass("active")
                .siblings("[page]").removeClass("active");
        });
        //	按下'设定'按鈕
        this.element.on("click", "[page='inquire'] .config_button", function (e) {
            _this.element.find("[page='inquire'] .config_button").addClass("processing");
            _this.initConfig().then(function () {
                _this.element.find(".config_modal").modal("show");
            }).finally(function () {
                _this.element.find("[page='inquire'] .config_button").removeClass("processing");
            });
        });
        //	按下'说明'按鈕
        this.element.on("click", "[page='inquire'] .support_button", function () {
            _this.element.find(".support_modal").modal("show");
        });
        //	按下'修改'按鈕
        this.element.on("click", "[page='inquire'] .modify_button", function (e) {
            _this.initModify();
            _this.element.find("[page='modify']").addClass("active")
                .siblings("[page]").removeClass("active");
        });
        //	按下'返回'按鈕
        this.element.on("click", "[page='add'] .back_button", function (e) {
            _this.element.find("[page='inquire']").addClass("active")
                .siblings("[page]").removeClass("active");
        });
        //	按下'儲存'按鈕
        this.element.on("click", "[page='modify'] .save_button", function (e) {
            _this.element.find("[page='modify'] .btn-app").addClass("processing");
            _this.modify().then(function () {
                _this.element.find("[page='inquire']").addClass("active")
                    .siblings("[page]").removeClass("active");
            }).finally(function () {
                _this.element.find("[page='modify'] .btn-app").removeClass("processing");
            });
        });
        //右侧表更新按钮
        this.element.on("click", "[page='inquire'] .sure_button", function (e) {
            var arr = jQuery("#jqGrid2").jqGrid('getGridParam', 'selarrrow');
            var id = jQuery("#jqGrid").jqGrid("getGridParam", "selrow");
            var obj = {
                "roleIds": arr
            }
            $.post('./wishland/users/' + id + '/update_roles', obj, function (data) {
                if (data.status) {
                    $(".subdiv").hide()
                    $("#jqGrid").jqGrid('setGridParam', {
                        url: './wishland/users',
                        datatype: 'json',
                        postData: {},
                        page: $('#jqGrid').getGridParam('page'),
                    }).trigger("reloadGrid");
                } else {}
            }, 'json')
        });
        //	按下'返回'按鈕
        this.element.on("click", "[page='modify'] .back_button", function (e) {
            _this.element.find("[page='inquire']").addClass("active")
                .siblings("[page]").removeClass("active");
        });
        //按下 数据 行  操作 op按钮
        this.element.on("change", "[page='inquire'] .op", function (e) {
            $(this).parent().click()
            var ss = $(this).children('optgroup').children('option:selected').val();
            var id = $("#jqGrid").jqGrid("getGridParam", "selrow");
            var str = "修改 ID 为" + id + " 的信息<br>";
            var rowData = $("#jqGrid").jqGrid('getRowData', parseInt(id));
            var html = ""
            html += "<span class='rols-page-span'>用户编号:</span>" + "<span class='rols-page-span2'>" + rowData.id + "</span><br>"
            html += "<span class='rols-page-span'>用户名称:</span>" + "<span class='rols-page-span2'>" + rowData.name + "</span><br>"
            html += "<span class='rols-page-span'>归属品牌:</span>" + "<span class='rols-page-span2'>" + rowData.brand + "</span><br>"
            if (ss == "change-status") {
                var rowData = $("#jqGrid").jqGrid('getRowData')[id];
                var status = rowData.status == '启用中' ? 0 : 1;
                var data = {
                    id: id,
                    data: {
                        status: status
                    }
                }
                _this.modify(data).then(function () {
                    $("#jqGrid").jqGrid('setGridParam', {
                        url: './wishland/users',
                        datatype: 'json',
                        postData: {},
                        page: $('#jqGrid').getGridParam('page')
                    }).trigger("reloadGrid");
                })
            } else if (ss == "change-roles") {
                $(this).parent().click()
                _this.subTable()
                _this.element.find(".subdiv").show()
            } else if (ss == "change-pwd") {
                str = html
                str += "<input class='hide' style='display:none' value='pwd'><br>";
                str += "<span class='rols-page-span'>新的密码:</span><input class='new-pwd ncinput' style='border:0.5px solid #378888'/><br>";
                _this.element.find(".main").html(str)
                _this.element.find(".support_modal").modal("show");
            } else if (ss == "change-merchant") { // 弹出修改 品牌 多选
                str = html
                str += "<span class='rols-page-span'>订阅品牌:</span><select   id='changebrand' multiple='multiple' >"
                str += "<option value='sgl818' seleted>香格里拉</option>"
                str += "	<option value='2000cai' seleted>2000彩</option> </select>"
                var rowData = $("#jqGrid").jqGrid('getRowData')[id];
                _this.element.find(".main").html(str)
                $('#changebrand').multiselect2side({
                    search: "可选项",
                    labeldx: '已有项',
                    moveOptions: false
                });
                $(".main").find("select[name='ms2side__dx']").append("<option value='sgl818' seleted>香格里拉</option>")
                _this.element.find(".support_modal").modal("show");
            }
        });
        //	按下 sure 按钮
        this.element.on("click", ".sure", function (e) {
            var id = $("#jqGrid").jqGrid("getGridParam", "selrow");
            if ($('.hide').val() == 'pwd') {
                var data = {
                    id: id,
                    data: {
                        password: $('.new-pwd').val()
                    }
                }
                _this.modify_pwd(data).then(function () {
                    _this.element.find(".support_modal").modal("hide");
                    $("#jqGrid").jqGrid('setGridParam', {
                        url: './wishland/users',
                        datatype: 'json',
                        postData: {},
                        page: $('#jqGrid').getGridParam('page')
                    }).trigger("reloadGrid");
                })
            } else {
                var data = {
                    id: id,
                    data: {
                        merchants: $('.layer-select').val()
                    }
                }
                _this.modify(data).then(function () {
                    _this.element.find(".support_modal").modal("hide");
                    $("#jqGrid").jqGrid('setGridParam', {
                        url: './wishland/users',
                        datatype: 'json',
                        postData: {},
                        page: $('#jqGrid').getGridParam('page')
                    }).trigger("reloadGrid");
                })
            }
            //无论怎样 都要刷新当前表格
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
    initSlect: function () {
        $.get("./wishland/roles", function (data) {
            $.each(data.data, function (i, o) {
                $(".arg-roleId").append("<option value=" + o.id + ">" + o.title + "</option>")
            })
        }, 'json')
    },
    /**
     * 查詢
     */
    search: function (data) {
        if (data.status == '-1') {
            data.status = null
        }
        if (data.merchant == '0') {
            data.merchant = null
        }
        if (data.roleId == '0') {
            data.roleId = null
        }
        if (data.name.length < 1) {
            data.name = null; //清空上次查询
        }
        this.element.find("#jqGrid").jqGrid('setGridParam', {
            postData: data
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
    check: function (data) {
        if (data.name.length < 1) {
            $(".ret").html("名称不能为空");
            return false;
        }
        if (data.password.length < 1) {
            $(".ret").html("密码不能为空");
            return false;
        }
        if (data.merchants.length == 0) {
            $(".ret").html("未选择品牌");
            return false;
        }
        return true;
    },
    add: function (data) {
        return new Promise(function (resolve, reject) {
            $.post('./wishland/users', data, function (data) {
                if (data.status) {
                    resolve(data);
                } else {
                    resolve(data);
                }
            }, 'json')
        });
    },
    /**
     * 修改密码
     * @return {Promise}
     */
    modify_pwd: function (data) {
        return new Promise(function (resolve, reject) {
            $.post('./wishland/users/' + data.id + '/reset_password', data.data, function (data) {
                resolve(data);
            }, 'json')
        });
    },
    /**
     * 初始化修改頁面
     */
    initModify: function (data) {},
    /**
     * 修改品牌 或者状态
     */
    modify: function (data) {
        //	TODO Ajax提交修改後的內容
        return new Promise(function (resolve, reject) {
            $.ajax({
                "url": './wishland/users/' + data.id,
                "type": "put",
                "data": data.data,
                "dataType": "json",
                "success": function (data) {
                    resolve(data);
                },
                "error": function (xhr, txt) {
                    resolve({});
                }
            });
        });
    },
    /**
     * 初始化設定
     */
    initConfig: function () {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve();
            }, 500);
        });
    },
    /**
     * 更新設定
     */
    updateConfig: function () {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve();
            }, 500);
        });
    },
    /**
     * 設定訊息
     * @param type - 訊息種類，success, info, warning, danger
     * @param message - 訊息內容
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
     * 渲染右侧子表
     */
    subTable: function () {
        var id = $("#jqGrid").jqGrid("getGridParam", "selrow");
        var datas = {}
        $.get('./wishland/users/' + id, function (data) {
            datas = data;
            $("#jqGrid2").jqGrid({
                url: './wishland/roles',
                styleUI: 'Bootstrap',
                datatype: "json",
                colModel: [{
                        label: 'ID',
                        name: 'id',
                        width: 10,
                        key: true,
                    },
                    {
                        label: ' 用户组名称',
                        name: 'name',
                        width: 30,
                        editable: true
                    },
                    {
                        label: ' 用户组描述',
                        name: 'title',
                        width: 30,
                        editable: true
                    },
                ],
                multiselect: true,
                loadonce: true,
                viewrecords: true,
                width: 500,
                height: 400,
                rowNum: 10,
                pager: "#jqGridPager2",
                caption: "用户组列表",
                jsonReader: {
                    root: 'data',
                    total: function () {
                        return 1;
                    },
                    page: function () {
                        return 1;
                    },
                },
                loadComplete: function () {
                    for (var i = 0; i < datas.data.roles.length; i++) {
                        $("#jqGrid2").jqGrid('setSelection', datas.data.roles[i].id)
                    }
                }
            });
            $("#jqGrid2").jqGrid('setGridParam', {
                url: './wishland/roles',
                datatype: 'json',
                postData: {},
                page: $('#jqGrid2').getGridParam('page'),
                loadComplete: function () {
                    for (var i = 0; i < datas.data.roles.length; i++) {
                        $("#jqGrid2").jqGrid('setSelection', datas.data.roles[i].id)
                    }
                }
            }).trigger("reloadGrid");
        }, 'json')
    },
}
