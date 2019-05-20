 var mini_game_order_summary = {
     jqGrid: null,
     parameters: {
         "merchantCode": $(".type-select option:selected").val()
     },
     init: function () {
         var _this = this;
         this.jqGrid = $("#jqGrid");
         return new Promise(function (resolve, reject) {
             _this.initComponent();
             _this.initSelect();
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
     initComponent: function () {
         var _this = this;
         this.element.find("#jqGrid").jqGrid({
             url: "./backend/orders",
             postData: {
                 size: 30,
             },
             mtype: "GET",
             styleUI: 'Bootstrap',
             datatype: "json",
             colModel: [{
                     label: '编号',
                     name: 'id',
                     key: true,
                     sortable: true,
                     sortorder: "desc",
                     width: 40
                 },
                 {
                     label: '订单编号',
                     name: 'orderNum',
                     key: true,
                     width: 130
                 },
                 {
                     label: '品牌',
                     name: 'merchantCode',
                     width: 60
                 },
                 {
                     label: 'UID',
                     name: 'customer.id',
                     width: 35
                 },
                 {
                     label: '账号',
                     name: 'customer.name',
                     width: 100
                 },
                 {
                     label: '应用',
                     name: 'merchantCode',
                     width: 60
                 },
                 {
                     label: '下注金额',
                     name: 'amount',
                     width: 90
                 },
                 {
                     label: '奖金',
                     name: 'winAmount',
                     width: 60
                 },
                 {
                     label: '开奖结果',
                     name: 'question.correctValue',
                     width: 70
                 },
                 {
                     label: '下注时间',
                     width: 150,
                     formatter: function (value, options, row) {
                         return moment(row.createdAt).format("YYYY-MM-DD HH:mm:ss");
                     }
                 },
                 {
                     label: '开奖时间',
                     width: 150,
                     formatter: function (value, options, row) {
                         if (row.status != 0) {
                             return moment(row.updatedAt).format("YYYY-MM-DD HH:mm:ss");
                         } else {
                             return " ";
                         }
                     }
                 },
                 {
                     label: '状态',
                     name: 'statusText',
                     width: 70
                 }, {
                     label: ' ',
                     width: 600,
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
         this.element.find("input[name='dates']").daterangepicker({
             autoUpdateInput: false,
             locale: {
                 cancelLabel: 'Clear'
             }
         });
     },
     bindEvent: function () {
         var _this = this;
         //	按下'查詢'按鈕
         this.element.find('input[name="dates"]').on('apply.daterangepicker', function (ev, picker) {
             var startDate = picker.startDate.format('YYYY-MM-DD HH:mm:ss'),
                 endDate = picker.endDate.format('YYYY-MM-DD HH:mm:ss');
             $(this).val(startDate + " ~ " + endDate);
         });
         this.element.on("click", "[page='inquire'] .search_button", function (e) {
             _this.search();
         });
     },
     /**
      * 获取类别  装填 表单 select
      */
     initSelect: function () {
         $.get('./backend/question_info', function (data) {
             $.each(data.data.merchants, function (i, o) {
                 if (i == 1) {
                     $(".type-select").append("<option value='" + o.code + "' selected>" + o.name + "</option>");
                 } else {
                     $(".type-select").append("<option value='" + o.code + "'>" + o.name + "</option>");
                 }
             });
         });
     },
     /**
      * 查詢
      */
     search: function () {
         var _this = this;
         _this.parameters.merchantCode = $(".type-select option:selected").val();
         var timeArr = $(".bet-time").val().split("~");
         if (String.isNotEmpty($(".bet-time").val())) {
             _this.parameters["startTime"] = new Date(timeArr[0]).getTime();
             _this.parameters["endTime"] = new Date(timeArr[1]).getTime();
         } else {
             _this.parameters["startTime"] = new Date().getTime() - 31507200;
             _this.parameters["endTime"] = new Date().getTime();
         }
         if ($(".user-select option:selected").val() == 1 && String.isNotEmpty($(".user-msg").val())) {
             _this.parameters["customerId"] = $(".user-msg").val();
         } else {
             _this.parameters["customerId"] = ''
         }
         this.element.find("#jqGrid").jqGrid('setGridParam', {
             postData: _this.parameters,
             page: 1,
         }).trigger("reloadGrid");
     },
     resize: function (width, height) {
         this.jqGrid.setGridWidth($(".x_content").width());
     },
 }
