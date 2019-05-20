var game_playing_history = {
    brands: {},
    masters: {},
    jqGrid: null,
    init: function () {
        var _this = this;
        this.jqGrid = $("#jqGrid");
        return new Promise(function (resolve, reject) {
            _this.initSelect() ;
            _this.initComponent();
            _this.bindEvent();
            resolve();
        })
    },
    destroy: function () {
        this.element.off();
        this.element.remove();
        this.element = null;
    },
    initComponent: function () {
        var _this = this;
        this.element.find("#jqGrid").jqGrid({
            url: "./playing/summarys",
            postData: {},
            mtype: "GET",
            styleUI: 'Bootstrap',
            datatype: "json",
            colModel: [{
                    label: '编号',
                    name: 'id',
                    align: 'center',
                    key: true,
                    width: 70
                },
                {
                    label: '带打师',
                    name: 'master',
                    align: 'center',
                    width: 100,
                    formatter: function (value, options, row) {
                        return row.master.name;
                    }
                },
                {
                    label: '日期',
                    name: 'summary_date',
                    align: 'center',
                    width: 100,
                    formatter: function (value, options, row) {
                        return moment(value).format('YYYY-MM-DD');
                    }
                },

                {
                    label: '所在平台',
                    name: 'brand',
                    align: 'center',
                    width: 100,
                    formatter: function (value, options, row) {
                        return _this.brands[value] ? _this.brands[value] : '--';
                    }
                },
                {
                    label: '老板数',
                    width: 120,
                    name: "users",
                    align: 'center',

                },
                {
                    label: '统计庄',
                    name: 'summary1',
                    align: 'center',
                    width: 100,
                },
                {
                    label: '统计闲',
                    name: 'summary2',
                    align: 'center',
                    width: 100,
                },
                {
                    label: '统计和',
                    name: 'summary3',
                    align: 'center',
                    width: 100,
                },
                {
                    label: '胜率',
                    name: 'success_rate',
                    align: 'center',
                    width: 100,
                    formatter: function (value, options, row) {
                        var number = value * 100
                        number = number.toFixed(2)
                        return number + "%";
                    }
                },
                {
                    label: '操作',
                    name: 'op',
                    align: 'center',
                    width: 207,
                    align: 'center',
                    formatter: function (value, options, row) {
                        var html = ' ';
                        html += ' <a class="bgbtn btn btn-success btn-xs del_history_button"><i class="fa fa-gg"></i>删除</a> ';
                        html += ' <a class="bgbtn btn btn-info btn-xs fix_history_button"><i class="fa fa-pencil"></i>修改</a> ';
                        return html;
                    }
                },
                 
                {
                    label: ' ',
                    width: 450,

                }

            ],
            width: '100%',
            height: 580,
            rowNum: 30,
            autowidth: true,
            shrinkToFit: false,
            pager: "#jqGridPager"
        });
        $('.day-time').daterangepicker({
            "timePicker": true,
            "timePicker24Hour": true,
            "linkedCalendars": false,
            "autoUpdateInput": false,
            "locale": {
                format: 'YYYY-MM-DD',
                separator: ' ~ ',
                applyLabel: "应用",
                cancelLabel: "取消",
                resetLabel: "重置",
            }
        }, function (start, end, label) {
            if (!this.startDate) {
                this.element.val('');
            } else {
                this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
            }
        });
        this.element.find('.timestr').daterangepicker({
            startDate:moment(),
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
            this.element.val(this.startDate.format(this.locale.format));
        }).on('apply.daterangepicker', function (ev, picker) {
            this.element.val(this.startDate.format(this.locale.format));
    });
          
    },
    bindEvent: function () {
        var _this = this;
        //  查询 按钮
        this.element.on("click", "[page='inquire'] .search_button", function (e) {
            _this.search()
        });
        this.element.on("click", "[page='inquire'] .del_history_button", function (e) {
            $(this).parent().click()
            var id = $("#jqGrid").jqGrid("getGridParam", "selrow");
            utils.dialog(["确定删除此记录", function () {
                _this.delete(id)
            }, null])
        });
         // 新增 操作的三个按钮
         this.element.on("click", "[page='inquire'] .add_button", function (e) {
            utils.clear(['add-user-name', 'add-user-pwd', 'add-user-nickname', 'add-user-ico'])
            _this.element.find("[page='add']").addClass("active").siblings("[page]").removeClass("active");
        });
        this.element.on("click", "[page='add'] .back_button", function (e) {
            _this.element.find("[page='inquire']").addClass("active")
                .siblings("[page]").removeClass("active");
        });
        this.element.on("click", "[page='add'] .save_button", function (e) {
            var obj = {
                mid: $(".add-history-master").val(),
                brand: $(".add-history-brand").val(),
                users: $(".add-history-users").val(),
                summary1: $(".add-history-summary1").val(),
                summary2: $(".add-history-summary2").val(),
                summary3: $(".add-history-summary3").val(),
                success_rate: $(".add-history-success_rate").val(),
                summary_date: $(".add-master-timestr").val(),
                created_at: $(".add-master-timestr").val(),
            }
 
            if (_this.check(obj)) {
                _this.add(obj).then(function (data) {
                    if (data.status) {
                        
                        _this.flush({});
                        _this.element.find("[page='inquire']").addClass("active").siblings("[page]").removeClass("active");
                    } else {
                        $.messager({
                            status: 'error',
                            message: "新添失败"
                        });
                    }
                })
            }
        });

         //	 修改操作的三个按钮
         this.element.on("click", "[page='inquire'] .fix_history_button", function (e) {
            $(this).parent().click() 
            var id = $("#jqGrid").jqGrid("getGridParam", "selrow");
            var rowData = $("#jqGrid").jqGrid('getRowData', id);
            
            $(".update-history-id").val(rowData.id)
             
          
        for(var i in _this.masters  ){  
            if(_this.masters[i] == rowData.master) $(".update-history-master").val()
        }
        
            $(".update-history-timestr").val(rowData.summary_date)
            for(var i in _this.brands  ){ 
                if(_this.brands[i] == rowData.brand) $(".update-history-brand").val(i)
            }
            
            $(".update-history-users").val(rowData.users)
            $(".update-history-summary1").val(rowData.summary1)
            $(".update-history-summary2").val(rowData.summary2)
            $(".update-history-summary3").val(rowData.summary3)

            $(".update-history-success_rate").val(parseFloat(rowData.success_rate)*0.01)
            _this.element.find("[page='update']").addClass("active").siblings("[page]").removeClass("active");
        });

        this.element.on("click", "[page='update'] .back_button", function (e) {
            _this.element.find("[page='inquire']").addClass("active").siblings("[page]").removeClass("active");
        });

        this.element.on("click", "[page='update'] .save_button", function (e) {
            var data = {
                mid: $(".update-history-master").val(),
                brand: $(".update-history-brand").val(),
                users: $(".update-history-users").val(),
                summary1: $(".update-history-summary1").val(),
                summary2: $(".update-history-summary2").val(),
                summary3: $(".update-history-summary3").val(),
                success_rate: $(".update-history-success_rate").val(),
                summary_date: $(".update-master-timestr").val(),
                created_at: $(".update-master-timestr").val(),
            }
            _this.update($(".update-history-id").val(),data)
        });
    },
    /*
     * 共用代码 刷新表格 缩短代码篇幅
     */
    flush: function (data, page) {
        $("#jqGrid").jqGrid('setGridParam', {
            url: './playing/summarys',
            datatype: 'json',
            postData: data,
            page: page ? page : $('#jqGrid').getGridParam('page'),
        }).trigger("reloadGrid");
    },
    search: function () {
        var data = {
            name: $(".search-history-master").val(),
            start: $(".day-time").val().split("~")[0],
            end: $(".day-time").val().split("~")[1],
            brand: $(".search-history-brand").val(),
        }

        this.flush(data, 1)
    },
    delete: function (id) {
        var _this = this;
        $.ajax({
            "url": "./playing/summary/" + id,
            "type": "delete",
            "dataType": "json",
            "success": function (ret) {
                if (ret.status) {
                    _this.flush({});
                    $("[page='inquire']").addClass("active").siblings("[page]").removeClass("active");
                } else {
                    alert(ret.message)
                }
            },
            "error": function (xhr, txt) {}
        });
    },
    initSelect: function () {
        var brands = [];
        var _this = this; 
        $.ajaxSettings.async = false
        $.get("./playing/system/brand", function (data) {
            brands = data
            $(".search-history-brand").append("<option value='all' selected>所有</option>");
            $.each(brands, function (i, o) {
                _this.brands[o.key] = o.value
                $(".search-history-brand").append("<option value='" + o.key + "'>" + o.value + "</option>");
                $(".add-history-brand").append("<option value='" + o.key + "'>" + o.value + "</option>");
                $(".update-history-brand").append("<option value='" + o.key + "'>" + o.value + "</option>");
            });
        }, 'json')
         
            $.get("./playing/masters?page=1&rows=100", function (data) {
                brands = data.rows 
                
                $.each(brands, function (i, o) {
                    _this.masters[o.id] = o.name 
                    $(".add-history-master").append("<option value='" + o.id + "'>" + o.name + "</option>");
                    $(".update-history-master").append("<option value='" + o.id + "'>" + o.name + "</option>");
                }); 
            }, 'json')
            
       
        
    },
    check: function (data) {
        if (data.summary_date.length == 0) {
            $(".add-history-ret").html("请选择日期");
            return false;
        }
         
        if (!/^[1-9]\d*$/.test( data.users)) {
            $(".add-history-ret").html("老板数需要正值")
            return false;
        }  

        if (!/^[1-9]\d*$/.test( data.summary1)) {
            $(".add-history-ret").html("统计庄需要正值")
            return false;
        }  
        if (!/^[1-9]\d*$/.test( data.summary2)) {
            $(".add-history-ret").html("统计闲需要正值")
            return false;
        }  
        if (!/^[1-9]\d*$/.test( data.summary3)) {
            $(".add-history-ret").html("统计和需要正值")
            return false;
        }  
        
        if (!/^[0]{1}([.]([0-9]){1,})?$/.test( data.success_rate)) {
            $(".add-history-ret").html("胜率需要(0，1)内小数")
            return false;
        }  
        
       
        return true;
    },
    update_check: function (data) {
        if (data.summary_date.length == 0) {
            $(".update-history-ret").html("请选择日期");
            return false;
        }
         
        if (!/^[1-9]\d*$/.test( data.users)) {
            $(".update-history-ret").html("老板数需要正值")
            return false;
        }  

        if (!/^[1-9]\d*$/.test( data.summary1)) {
            $(".update-history-ret").html("统计庄需要正值")
            return false;
        }  
        if (!/^[1-9]\d*$/.test( data.summary2)) {
            $(".update-history-ret").html("统计闲需要正值")
            return false;
        }  
        if (!/^[1-9]\d*$/.test( data.summary3)) {
            $(".update-history-ret").html("统计和需要正值")
            return false;
        }  
        
        if (!/^[0]{1}([.]([0-9]){1,})?$/.test( data.success_rate)) {
            $(".update-history-ret").html("胜率需要(0，1)内小数")
            return false;
        }  
        
       
        return true;
    },
    add: function (data) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                "url": "./playing/summary",
                "type": "post",
                "data": data,
                "dataType": "json",
                "success": function (data) {
                    resolve(data);
                },
                "error": function (xhr, txt) {
                    resolve(xhr.responseJSON);
                }
            });



        });
    },
    update: function (id,data) {
        var _this = this;
        $.ajax({
            "url": "./playing/summary/" + id,
            "type": "put",
            "data": data,
            "dataType": "json",
            "success": function (ret) {
                if (ret.status) {
                    _this.flush({});
                    $("[page='inquire']").addClass("active").siblings("[page]").removeClass("active");
                    $(".update-history-ret").html("")
                } else {
                    $(".update-history-ret").html(ret.message)
                }
            },
            "error": function (xhr, txt) {
                $(".update-master-ret").html(txt)
            }
        });
    },
    resize: function (width, height) {
        this.jqGrid.setGridWidth($(".x_content").width());
    },
}
