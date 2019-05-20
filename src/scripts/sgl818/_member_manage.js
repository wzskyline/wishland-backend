var sgl818_member_manage = {
    userKey: null,
	init: function ( params ) {
		var _this = this;
        this.userKey = params.userKey;
		return new Promise(function (resolve, reject) {
			_this.initComponent();
			_this.bindEvent();
			resolve();
		})
	},
	destroy: function () {
	},
	initComponent: function () {
		var _this = this;
		// 日期控件
        this.element.find('input[name="dates"]').daterangepicker({
            autoUpdateInput: false,
            locale: {
                cancelLabel: 'Clear'
            }
        });
		this.element.find("#jqGrid").jqGrid({
			url: "/sgl818/customers",
			postData: {
                page: 1,
                size: 30
			},
			mtype: "GET",
			styleUI : 'Bootstrap',
			datatype: "json",
			colModel: [
				{ label: '编号', name: 'OrderID', key: true, width: 60, formatter: function (value, options, row) {
                   return options.rowId;
                } },
				{ label: '品牌', name: 'CustomerID', width: 150 },
				{ label: '帐号', name: 'username', width: 120, align: 'center'},
				{ label: '昵称', name: 'OrderDate', width: 150 },
				{ label: '账户余额', name: 'Freight', width: 150 },
				{ label:'提款人姓名', name: 'ShipName', width: 150 },
				{ label:'注册时间', name: 'ShipName', width: 190 },
				{ label:'注册IP', name: 'ShipName', width: 190 },
				{ label:'注册设备', name: 'ShipName', width: 90 },
				{ label:'状态', name: 'ShipName', width:150 },
				{ label: '操作', width: 200, align: 'center', formatter: function (value, options, row) {
					var html = '';
					html += '<a class="btn btn-primary btn-xs"><i class="fa fa-folder"></i> 上下分 </a>';
					html += '<a class="btn btn-info btn-xs modify_button"><i class="fa fa-pencil"></i> 锁定 </a>';
					return html;
				} }
			],
			beforeRequest: function () {
				_this.element.find("[page='inquire'] .search_button").addClass("processing");
			},
			loadComplete: function () {
				_this.element.find("[page='inquire'] .search_button").removeClass("processing");
			},
			viewrecords: true,
            jsonReader: {
                repeatitems: false,
                records: function (obj) {
                	var rowArr = [];
                	var data = obj.rows;
					var obj;
                	for( var i=0,l=data.length; i<l; i++ ){
                        obj = {};
                        obj = data[i].info;
                        obj.username = data[i].username;
                        rowArr.push( obj );
					}
					return rowArr;
                }
            },
			height: 600,
			rowNum: 30,
			pager: "#jqGridPager"
		});
	},
	bindEvent: function () {
		var _this = this;
		// 查詢
		this.element.on("click", "[page='inquire'] .search_button", function (e) {
			_this.search();
		});
		// 新增
		this.element.on("click", "[page='inquire'] .add_button", function (e) {
			_this.initAdd();
			_this.element.find("[page='add']").addClass("active")
				.siblings("[page]").removeClass("active");
		});
		// 设定
		this.element.on("click", "[page='inquire'] .config_button", function (e) {
			_this.element.find("[page='inquire'] .config_button").addClass("processing");
			_this.initConfig().then(function () {
				_this.element.find(".config_modal").modal("show");
			}).finally(function () {
				_this.element.find("[page='inquire'] .config_button").removeClass("processing");
			});
		});
		// 说明
		this.element.on("click", "[page='inquire'] .support_button", function () {
			_this.element.find(".support_modal").modal("show");
		});

		// 修改
		this.element.on("click", "[page='inquire'] .modify_button", function (e) {
			_this.initModify();
			_this.element.find("[page='modify']").addClass("active")
				.siblings("[page]").removeClass("active");
		});
		// 儲存
		this.element.on("click", "[page='add'] .save_button", function (e) {
			_this.element.find("[page='add'] .btn-app").addClass("processing");
			_this.add().then(function () {
				_this.element.find("[page='inquire']").addClass("active")
					.siblings("[page]").removeClass("active");
			}).finally(function () {
				_this.element.find("[page='add'] .btn-app").removeClass("processing");
			});
		});

		// 返回
		this.element.on("click", "[page='add'] .back_button", function (e) {
			_this.element.find("[page='inquire']").addClass("active")
				.siblings("[page]").removeClass("active");
		});
		// 儲存
		this.element.on("click", "[page='modify'] .save_button", function (e) {
			_this.element.find("[page='modify'] .btn-app").addClass("processing");
			_this.modify().then(function () {
				_this.element.find("[page='inquire']").addClass("active")
					.siblings("[page]").removeClass("active");
			}).finally(function () {
				_this.element.find("[page='modify'] .btn-app").removeClass("processing");
			});
		});
		// 返回
		this.element.on("click", "[page='modify'] .back_button", function (e) {
			_this.element.find("[page='inquire']").addClass("active")
				.siblings("[page]").removeClass("active");
		});
	},
	/**
	 * 查詢
	 */
	search: function () {
		this.element.find("#jqGrid").jqGrid('setGridParam', {postData : {
		}}).trigger("reloadGrid");
	},
	/**
	 * 初始化新增頁面
	 */
	initAdd: function () {
	},
	/**
	 * 新增
	 * @return {Promise}
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
	},
	/**
	 * 修改
	 */
	modify: function () {
		return new Promise(function (resolve, reject) {
			resolve();
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
}