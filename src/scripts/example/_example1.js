var example_example1 = {
	init: function () {
		var _this = this;

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

		//	http://www.guriddo.net/demo/bootstrap/
		//	http://www.trirand.com/jqgridwiki/doku.php?id=wiki:colmodel_options
		this.element.find("#jqGrid").jqGrid({
			url: "./resources/example1_data.json",
			//	ajax查詢參數
			postData: {
				username: "test"
			},
			mtype: "GET",
			styleUI : 'Bootstrap',
			datatype: "json",
			colModel: [
				{ label: '订单编号', name: 'OrderID', key: true, width: 75 },
				{ label: '會員編號', name: 'CustomerID', width: 150 },
				{ label: '状态', width: 100, align: 'center', formatter: function (value, options, row) {
					var STATUS = ['primary', 'success', 'info', 'warning', 'danger', 'dark'];
					var status = STATUS[row.OrderID * 1 % STATUS.length];

					return '<a class="btn btn-' + status + ' btn-xs" style="width:60px;">' + status + '</a>';
				} },
				{ label: '订单日期', name: 'OrderDate', width: 150 },
				{ label: '金额', name: 'Freight', width: 150 },
				{ label:'收件人', name: 'ShipName', width: 150 },
				{ label: '操作', width: 200, align: 'center', formatter: function (value, options, row) {
					var html = '';
					html += '<a class="btn btn-primary btn-xs"><i class="fa fa-folder"></i> 检视 </a>';
					html += '<a class="btn btn-info btn-xs modify_button"><i class="fa fa-pencil"></i> 编辑 </a>';
					html += '<a class="btn btn-danger btn-xs"><i class="fa fa-trash-o"></i> 删除 </a>';
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
			height: 450,
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

		//	按下'查詢'按鈕
		this.element.on("click", "[page='inquire'] .search_button", function (e) {
			_this.search();
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
			//	初始化新增頁面
			_this.initAdd();
			//	跳轉至'新增'頁面
			_this.element.find("[page='add']").addClass("active")
				.siblings("[page]").removeClass("active");
		});

		//	按下'设定'按鈕
		this.element.on("click", "[page='inquire'] .config_button", function (e) {
			//	processing
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
			//	初始化修改頁面
			_this.initModify();
			//	跳轉至'修改'頁面
			_this.element.find("[page='modify']").addClass("active")
				.siblings("[page]").removeClass("active");
		});

		//	按下'儲存'按鈕
		this.element.on("click", "[page='add'] .save_button", function (e) {
			//	processing
			_this.element.find("[page='add'] .btn-app").addClass("processing");

			_this.add().then(function () {
				_this.element.find("[page='inquire']").addClass("active")
					.siblings("[page]").removeClass("active");
			}).finally(function () {
				_this.element.find("[page='add'] .btn-app").removeClass("processing");
			});
		});

		//	按下'返回'按鈕
		this.element.on("click", "[page='add'] .back_button", function (e) {
			_this.element.find("[page='inquire']").addClass("active")
				.siblings("[page]").removeClass("active");
		});

		//	按下'儲存'按鈕
		this.element.on("click", "[page='modify'] .save_button", function (e) {
			//	processing
			_this.element.find("[page='modify'] .btn-app").addClass("processing");

			_this.modify().then(function () {
				_this.element.find("[page='inquire']").addClass("active")
					.siblings("[page]").removeClass("active");
			}).finally(function () {
				_this.element.find("[page='modify'] .btn-app").removeClass("processing");
			});
		});

		//	按下'返回'按鈕
		this.element.on("click", "[page='modify'] .back_button", function (e) {
			_this.element.find("[page='inquire']").addClass("active")
				.siblings("[page]").removeClass("active");
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
	 * 查詢
	 */
	search: function () {
		//	TODO 查詢
		this.element.find("#jqGrid").jqGrid('setGridParam', {postData : {
			username: 'test1'
		}}).trigger("reloadGrid");
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
	add: function () {
		//	//	TODO Ajax提交修改後的內容
		return new Promise(function (resolve, reject) {
			setTimeout(function () {
				resolve();
			}, 500);
		});
	},
	/**
	 * 初始化修改頁面
	 */
	initModify: function (data) {
		//	TODO 設定所有'修改'頁面欄位的數值
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
}