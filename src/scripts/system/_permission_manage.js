var system_permission_manage = {
	list :[],
	tree :[],
	cur_link:[],
	setting : {
		view: {
			dblClickExpand: false,
			showLine: false,
			selectedMulti: true,
			nameIsHTML: true,
			iconIsHTML: true,
		},
		data: {
			simpleData: {
				enable:true,
				idKey: "id",
				pIdKey: "pId",
				rootPId: ""
			}
		},
		callback: {
			beforeClick: function(treeId, treeNode) { //只操作 叶子节点
			   if (treeNode.isParent) { 
				   return false;
			   } else {
				   _this.permisson_json[treeNode.dataId ] = _this. permisson_json[treeNode.dataId ] == 1?0:1
				   return   true;
			   }
			}
		}
	},
	init: function () {
		var _this = this;
		return new Promise(function (resolve, reject) {
			_this.initComponent();
			_this.initTree();
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
		$(".form-horizontal").height(777)
		$.ajaxSettings.async = false;
		$.get("./wishland/permission_groups",function(data){ 
		    _this.list = data.data
		},'json')
		this.element.find("#jqGrid").jqGrid({
			url: "./wishland/permissions",
			mtype: "GET",
			styleUI: 'Bootstrap',
			datatype: "json",
			colModel: [{
					label: '编号',
					name: 'id',
					width: 40
				},
				{
					label: '权限名称',
					name: 'name',
					width: 100,
					editable: true
				},
				{
					label: '描述',
					name: 'title',
					width: 100,
					editable: true
				},
				{
					label: '权限组',
					name: 'permissionGroupId',
					width: 100,
				 	formatter: function (value, options, row) {
						     var html =""
							 $.each(_this.list,function(i,o){
                                if(o.id == row.permissionGroupId){
									 html = o.name
								}
							 })
							 return html;
						}
					},
				{
					label: '操作',
					width: 150,
					align: 'center',
					formatter: function (value, options, row) {
						var html = '';
						html += '<a class="btn btn-success btn-xs update_button"><i class="fa fa-pencil"></i>  更新 </a>';
						html += '<a class="btn btn-info btn-xs del_button"><i class="fa fa-pencil"></i> 删除  </a>';
						return html;
					}
				}
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
			height: 560,
			rowNum: 1000,
			pager: "#jqGridPager"
		});
	},
	bindEvent: function () {
		var _this = this;
		this.element.on("click", "[page='inquire'] .add_button", function (e) {
			_this.element.find("[page='add']").addClass("active")
				.siblings("[page]").removeClass("active");
		});
	   this.element.on("click", "[page='add'] .save_button", function (e) {
		   var  datas={
				   name : _this.element.find(".permission-name").val(),
			   title : _this.element.find(".permission-title").val(),
		   }
		  if(_this.check(datas)){
			  _this.add(datas).then(function (data) {
				if(data.status){
				   $(".ret").html("")
				   $("#jqGrid").jqGrid('setGridParam', {
					   url: './wishland/permissions',
					   datatype: 'json',
					   postData: {},
					   page: $('#jqGrid').getGridParam('page'),
				   }).trigger("reloadGrid");
				   _this.element.find("[page='inquire']").addClass("active").siblings("[page]").removeClass("active");
				   /* after add    push in cur_link init z-tree  */
				   _this.initTree()
				}else{
					$(".ret").html("服务器内部错误,请稍后再试")
				}
			  }).finally(function () {
			  });
		  }else{
		  }
	   });
	   this.element.on("click", "[page='add'] .back_button", function (e) {
		   _this.element.find("[page='inquire']").addClass("active")
			   .siblings("[page]").removeClass("active");
	   });
	   this.element.on("click", "[page='inquire'] .update_button", function (e) {
		$(this).parent().click()
		var id = $("#jqGrid").jqGrid("getGridParam", "selrow");
		var rowData = $("#jqGrid").jqGrid('getRowData',id);
		$(".update-id").val(rowData.id)
		$(".update-name").val(rowData.name)
		$(".update-title").val(rowData.title)
		 $.get("./wishland/permission_groups",function(data){ 
			 $(".group-select").empty()
			$.each(data.data,function(i,o){
				if(o.id == rowData.permissionGroupId){
					$(".group-select").append('<option value="'+o.id+'" selected >'+o.name+'</option>')
				}else{
					$(".group-select").append('<option value="'+o.id+'">'+o.name+'</option>')
				}
			  })
		 },'json')
		 //return
		 _this.element.find("[page='update']").addClass("active").siblings("[page]").removeClass("active"); 
	});
		this.element.on("click", "[page='inquire'] .del_button", function (e) {
			$(this).parent().click()
			var id = $("#jqGrid").jqGrid("getGridParam", "selrow");
			$.ajax({
				"url": "../wishland/permissions/"+id,
				"type": "delete",
				"dataType": "json",
				"success": function (data) {
					 if(data.status){
						$("#jqGrid").jqGrid('setGridParam', {
							url: './wishland/permissions',
							datatype: 'json',
							postData: {},
							page: $('#jqGrid').getGridParam('page'),
						}).trigger("reloadGrid");
					  /* after del  init z-tree  */ 
						for(var index=0; index<_this.cur_link.length; index++){
							if(_this.cur_link[index].id == 'p-'+id){
								_this.cur_link.splice(index,1);
							}
						}
					    $.fn.zTree.init($("#treeDemo"), _this.setting,_this.cur_link);
					 }else{
						alert("删除失败")
					 }
				},
				"error": function (xhr, txt) {
					console.log(xhr + "," + txt);
				}
			});
		});
		this.element.on("click", "[page='update'] .save_button", function (e) {
			var  id = _this.element.find(".update-id").val();
			var  data = { name : _this.element.find(".update-name").val(),
				title : _this.element.find(".update-title").val(),
				permissionGroupId : _this.element.find(".group-select").val(),
			}
		   if(_this.updatecheck(data)){
			   _this.update(data,id).then(function (res) {
				 if(res.status){
					$(".ret").html("")
					$("#jqGrid").jqGrid('setGridParam', {
						url: './wishland/permissions',
						datatype: 'json',
						postData: {},
						page: $('#jqGrid').getGridParam('page'),
					}).trigger("reloadGrid");
					_this.element.find("[page='inquire']").addClass("active").siblings("[page]").removeClass("active");
					 /*after update update pId = g-newID  and init  z-tree*/
					  
					 for(var index=0; index<_this.cur_link.length; index++){
						if(_this.cur_link[index].name == data.title){
							_this.cur_link[index].pId = 'g-'+data.permissionGroupId
						}
					}
					 
					$.fn.zTree.init($("#treeDemo"), _this.setting,_this.cur_link);
				}else{
					 $(".update-ret").html("服务器内部错误,请稍后再试")
				 }
			   }).finally(function () {
			   });
			}
		});
		this.element.on("click", "[page='update'] .back_button", function (e) {
			_this.element.find("[page='inquire']").addClass("active")
				.siblings("[page]").removeClass("active");
		});
	},
	initTree: function(){
		var _this = this;
		_this.cur_link =[]
		$.ajaxSettings.async = false;
		$.get("./wishland/permission/list_with_group",function(data){
			 _this.tree = data
		},'json')
		$.each(_this.tree.data,function (i,o) {//all
		 	if(o.type =='permission'   ){//权限叶子节点
				_this.cur_link.push({ id:o.id, pId:o.parent, name:o.data.text,dataId:o.data.id} )
			 }else{ //非叶子节点
				_this.cur_link.push({ id:o.id, pId:o.parent, name:o.data.text,open:true} )
			 }
		})
		  $.fn.zTree.init($("#treeDemo"), _this.setting,_this. cur_link);
	},
	check: function(data){
		if(data.name.length < 1 ){
			$(".ret").html("name 名称不能为空");
			return false;
		   }
		   if(data.title.length < 1 ){
			$(".ret").html("title 描述不能为空");
			return false;
		   }
		   return true;
	 },
	 add: function (data) {
		return new Promise(function (resolve, reject) {
            $.post('../wishland/permissions',data,function(data){
              if(data.status){
				resolve(data);
			  }else{
				resolve(data);
			  }
           },'json')
		});
	},
	updatecheck: function(data){
		if(data.name.length < 1 ){
			$(".update-ret").html("name 名称不能为空");
			return false;
		   }
		   if(data.title.length < 1 ){
			$(".update-ret").html("title 描述不能为空");
			return false;
		   }
		   return true;
	 },
	 update: function (data,id) {
		return new Promise(function (resolve, reject) {
			$.ajax({
				"url": "./wishland/permissions/"+id,
 				"type": "put",
			 	"data": data,
				 "dataType": "json",
				"success": function (data) {
						resolve(data);
				},
				"error": function (xhr, txt) {
					resolve({status:false});
				}
			});
		});
	},
}