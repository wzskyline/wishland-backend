var sgl818_suggestions = {
    contentMaeeageArr:[],
	_userName: null,
	_inquireType: null,
	_start_time: null,
    _end_time: null,
	_timeLength: 0,
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
		var maeeageArr = [];
		this._start_time =  new Date((utils.getDay(0)[0]).format()).getTime();
        this._end_time = new Date((utils.getDay(0)[1]).format()).getTime();
        this.element.find('input[name="dates"]').daterangepicker({
            autoUpdateInput: false,
            locale: {
                cancelLabel: 'Clear'
            }
        });

		this.element.find("#jqGrid").jqGrid({
			url: "./sgl818/suggestions",
			postData: {
                username: "",
                type: "",
				page: 1,
                size: 10,
                start_time:  _this._start_time,
                end_time: _this._end_time
			},
			mtype: "GET",
			styleUI : 'Bootstrap',
			datatype: "json",
			colModel: [
				{ label: '编号', name: 'id', key: true, width: 150 },
				{ label: '帐号', name: 'username', width: 200},
                { label: '类型', name: 'type', width: 100},
                { label: '内容', name: 'content', width: 300},
				{ label: '日期', name: 'created_at', width: 150, formatter: function ( value, options, row ) {
                    return utils.getTime( row.created_at )
                } },
				{ label: '操作', width: 180, align: 'center', formatter: function (value, options, row) {
                    maeeageArr.push(row);
					var html = '';
					html += '<a class="btn btn-info btn-xs" name="open_support_modal"><i class="glyphicon glyphicon-eye-open"></i> 检视 </a>';
					return html;
				} },  { label: ' ',width: 450,}
			],

			beforeRequest: function () { 
                maeeageArr = [];
				_this.element.find("[page='inquire'] .search_button").addClass("processing");
			},
			loadComplete: function () {
				// 清空数据；
				_this.contentMaeeageArr = [];
				// 存储新数据
				_this.contentMaeeageArr = maeeageArr;
				_this.element.find("[page='inquire'] .search_button").removeClass("processing");
			},
			viewrecords: true,
			height: 600,
			rowNum: 30,
			pager: "#jqGridPager"
		});

    },
	bindEvent: function () {
		var _this = this;
		// 回车查询
        this.element.find("[name='userName']").keydown(function (event) {
            if(event.keyCode == 13){
                event.preventDefault();
                _this.element.find("[page='inquire'] .search_button").trigger("click");
            }
        });
		//	按下'查詢'按鈕
		this.element.on("click", "[page='inquire'] .search_button", function (e) {
			var datesVal = _this.element.find("[name='dates']");
			// 处理日期格式错误
			if( datesVal.val() ){
                if( datesVal.val().length < _this._timeLength || datesVal.val().length > _this._timeLength ){
                    datesVal.val("");
                    _this._start_time = null;
                    _this._end_time = null;
                }
			}
			// 存储帐号
			_this._userName = _this.element.find("[name='userName']").val();
			// 存储当前所选值
			_this._inquireType = _this.element.find("[name='inquireType'] option:selected").val();
			_this.search();
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
		// 按下检视
		this.element.on("click","[name='open_support_modal']",function () {
			// 打开弹框
			_this.openModal( _this.contentMaeeageArr[$(this).index()] );
        });
		// 点击图片
		this.element.on("click","[name='showImg'] img",function (e){
        	e.preventDefault();
			$(this).parent().fancybox()
        });
		// 日期查询
        this.element.find('input[name="dates"]').on('apply.daterangepicker', function(ev, picker) {
            var startDate = picker.startDate.format('YYYY/MM/DD HH:mm:ss'),
            	endDate =  picker.endDate.format('YYYY/MM/DD HH:mm:ss');
                _this._start_time = new Date(startDate).getTime();
                _this._end_time = new Date(endDate).getTime();
            $(this).val( startDate.split(" ")[0] +" - "+ endDate.split(" ")[0] );
			_this._timeLength = $(this).val().length;
            _this.search();
        });
	},
	/**
	 * 查詢
	 */
	search: function () {
		var _this = this;
		this.element.find("#jqGrid").jqGrid('setGridParam', {postData : {
            username: _this._userName,
            type: _this._inquireType,
            start_time:  _this._start_time,
            end_time: _this._end_time
		}}).trigger("reloadGrid");
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
     * 设置弹框
     */
    openModal: function ( data ) {
		var html = '';
		var $support_modal = this.element.find(".support_modal");
        $support_modal.modal("show");
        $support_modal.find('.modal-title').html( '反馈内容' );
        if( data.picture_url ){
            html = '<a href="'+ data.picture_url +'" rel="group1" style="display: block; margin: 0 auto;max-width: 450px;margin-bottom: 20px;" name="showImg">';
			html+= '	<img src="'+ data.picture_url +'" style="width: 100%" title="点击查看原图"/>';
            html+= '</a>'
		}
        html += '<p>'+ data.content +'</p>';
        $support_modal.find(".modal-body").html( html );
    },
}
