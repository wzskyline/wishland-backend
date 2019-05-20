 var system_permission_group_manage = {
 	init: function () {
 		var _this = this;
 		return new Promise(function (resolve, reject) {
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
 	initComponent: function () {
 		var _this = this; 
 		this.element.find(".subdiv").hide()
 		this.element.find("#jqGrid").jqGrid({
 			url: "./wishland/permission_groups",
 			postData: {
 			},
 			mtype: "GET",
 			styleUI: 'Bootstrap',
 			datatype: "json",
 			colModel: [{
 					label: '编号',
 					name: 'id',
 					key: true,
 					width: 60
 				},
 				{
 					label: '名称',
 					name: 'name',
 					width: 300,
 				},
 				{
 					label: '操作',
 					width: 150,
 					align: 'center',
 					formatter: function (value, options, row) {
 						var html = '';
 						html += '<a class="btn btn-info btn-xs modify_button"><i class="fa fa-pencil"></i> 更新  </a>';
 						html += '<a class="btn btn-success btn-xs del_button"><i class="fa fa-gg"></i> 删除  </a>';
 						return html;
 					}
 				},{
					label: ' ', 
					width: 1000,
				},
 			],
 			jsonReader: {
 				root: 'data',
 				total: function () {
 					return 1;
 				},
 				page: function () {
 					return 1;
 				},
 			},
			 width: '100%',
			 height: 650,
			 rowNum: 30,
			 autowidth: true,
			 shrinkToFit: false,
 			pager: "#jqGridPager"
 		});
 	},
 	bindEvent: function () {
 		var _this = this;
 		this.element.on("click", "[page='inquire'] .add_button", function (e) {
 			str = '  '
 			//获取  权限组列表
 			$.ajaxSettings.async = false;
 			$.get("../wishland/permission_groups", function (data) {
 				$.each(data.data, function (i, o) {
 					str += '<option value="' + o.id + '">' + o.name + '</option>'
 				})
 			}, "json")
 			$(".groups").empty()
 			$(".groups").append(str)
 			_this.element.find("[page='add']").addClass("active").siblings("[page]").removeClass("active");
 		});
 		this.element.on("click", "[page='add'] .save_button", function (e) {
 			var data = {
 				name: _this.element.find(".add-name").val(),
 				parentId: _this.element.find(".groups").val(),
 			}
 			if (_this.check(data)) {
 				_this.add(data).then(function (data) {
 					if (data.status) {
 						$(".ret").html("")
 						$("#jqGrid").jqGrid('setGridParam', {
 							url: './wishland/permission_groups',
 							datatype: 'json',
 							postData: {},
 							page: $('#jqGrid').getGridParam('page'),
 						}).trigger("reloadGrid");
 						_this.element.find("[page='inquire']").addClass("active").siblings("[page]").removeClass("active");
 					} else {
 						$(".ret").html(data.data)
 					}
 				}).finally(function () {
 				});
 			} else {
 			}
 		});
 		this.element.on("click", "[page='add'] .back_button", function (e) {
 			_this.element.find("[page='inquire']").addClass("active")
 				.siblings("[page]").removeClass("active");
 		});
 		this.element.on("click", "[page='update'] .save_button", function (e) {
 			var data = {
 				name: _this.element.find(".update-name").val(),
 			}
 			if (data.name.length > 1) {
 				$.ajax({
 					"url": "./wishland/permission_groups/" +_this.element.find(".update-id").val(),
					 "type": "PUT",
					 "data": data,
 					"dataType": "json",
 					"success": function (data) {
						if (data.status) {
							$(".ret").html("")
							$("#jqGrid").jqGrid('setGridParam', {
								url: './wishland/permission_groups',
								datatype: 'json',
								postData: {},
								page: $('#jqGrid').getGridParam('page'),
							}).trigger("reloadGrid");
							_this.element.find("[page='inquire']").addClass("active").siblings("[page]").removeClass("active");
						} else {
							$(".update-ret").html("更新失败,稍后再试")
						}
 					},
 					"error": function (xhr, txt) {
 						console.log(xhr + "," + txt);
 					}
 				});
 			} else {
 				$(".update-ret").html("名称不能为空")
 			}
 		});
 		this.element.on("click", "[page='update'] .back_button", function (e) {
 			_this.element.find("[page='inquire']").addClass("active")
 				.siblings("[page]").removeClass("active");
 		});
 		this.element.on("click", "[page='inquire'] .modify_button", function (e) {
 			$(this).parent().click()
 			var id = $("#jqGrid").jqGrid("getGridParam", "selrow");
 			var rowData = $("#jqGrid").jqGrid('getRowData', id);
 			$(".update-id").val(rowData.id)
 			$(".update-name").val(rowData.name)
 			_this.element.find("[page='update']").addClass("active").siblings("[page]").removeClass("active");
 		});
 		this.element.on("click", "[page='inquire'] .del_button", function (e) {
 			$(this).parent().click()
 			var id = $("#jqGrid").jqGrid("getGridParam", "selrow");
 			$.ajax({
 				"url": "../wishland/permission_groups/" + id,
 				"type": "delete",
 				"dataType": "json",
 				"success": function (data) {
 					if (data.status) {
 						$("#jqGrid").jqGrid('setGridParam', {
 							url: '../wishland/permission_groups',
 							datatype: 'json',
 							postData: {},
 							page: $('#jqGrid').getGridParam('page'),
 						}).trigger("reloadGrid");
 					} else {
 						alert("删除失败")
 					}
 				},
 				"error": function (xhr, txt) {
 					alert("该组下还有权限,请先修改权限再删除")
 					console.log(xhr + "," + txt);
 				}
 			});
 		});
 	},
 	check: function (data) {
 		if (data.name.length < 1) {
 			$(".ret").html("名称不能为空");
 			return false;
 		}
 		if (!data.parentId) {
 			 $(".ret").html("未选择归属");
 			 return false;
 		}
 		return true;
 	},
 	add: function (data) {
 		return new Promise(function (resolve, reject) {
 			$.post('../wishland/permission_groups', data, function (data) {
 				if (data.status) {
 					resolve(data);
 				} else {
 					resolve(data);
 				}
 			}, 'json')
 		});
 	},
 }