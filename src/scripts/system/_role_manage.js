  var system_role_manage = {
      tree: "",
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
          this.element.off();
          this.element.remove();
          this.element = null;
      },
      initComponent: function () {
          var _this = this;
          this.element.find(".subdiv").hide()
          this.element.find(".subdiv2").hide()
          this.element.find("#jqGrid").jqGrid({
              url: "./wishland/roles",
              postData: {},
              mtype: "GET",
              styleUI: 'Bootstrap',
              datatype: "json",
              colModel: [{
                      label: '编号',
                      name: 'id',
                      key: true,
                      width: 40
                  },
                  {
                      label: '用户组名称',
                      name: 'name',
                      width: 100,
                  },
                  {
                      label: '描述',
                      name: 'title',
                      width: 100,
                  },
                  {
                      label: '权限说明',
                      width: 150,
                      name: "permissions",
                      formatter: function (value, options, row) {
                          //根据 列表进行  拼接返回行
                          var str = ""
                          for (var i = 0; i < row.permissions.length; i++) {
                              str += "  " + row.permissions[i].title
                          }
                          return str;
                      }
                  },
                  {
                      label: '操作',
                      width: 150,
                      name: 'op',
                      align: 'center',
                      formatter: function (value, options, row) {
                          var html = '<select class="op"><optgroup label="">';
                          html += '<option value="change-change"><a class="btn btn-info btn-xs  "><i class="fa fa-pencil"></i>操作</a></option>';
                          html += '<option value="change-modify"><a class="btn btn-info btn-xs modify_button"><i class="fa fa-pencil"></i>编辑权限</a></option>';
                          html += '<option value="change-users"><a class="btn btn-info btn-xs modify_button"><i class="fa fa-pencil"></i>用户列表</a></option>';
                          html += '</optgroup></select>';
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
              rowNum: 30,
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
              var data = {
                  name: _this.element.find(".add-name").val(),
                  title: _this.element.find(".add-title").val(),
              }
              if (_this.check(data)) {
                  _this.add(data).then(function (data) {
                      if (data.status) {
                          $(".ret").html("")
                          $("#jqGrid").jqGrid('setGridParam', {
                              url: './wishland/roles',
                              datatype: 'json',
                              postData: {},
                              page: $('#jqGrid').getGridParam('page'),
                          }).trigger("reloadGrid");
                          _this.element.find("[page='inquire']").addClass("active").siblings("[page]").removeClass("active");
                      } else {
                          $(".ret").html(data.data)
                      }
                  }).finally(function () {});
              } else {}
          });
          this.element.on("click", "[page='add'] .back_button", function (e) {
              _this.element.find("[page='inquire']").addClass("active")
                  .siblings("[page]").removeClass("active");
          });
          this.element.on("click", "[page='inquire'] .sure_button", function (e) {
              var rid = jQuery("#jqGrid").jqGrid("getGridParam", "selrow");
              var zTree = $.fn.zTree.getZTreeObj("treeDemo");
              var all = zTree.getCheckedNodes(true)
              var permIds = all.map(function (o) {
                  if (o.id.indexOf("p") > -1) {
                      return o.id.substring(2)
                  }
              })
              var groupIds = all.map(function (o) {
                  if (o.id.indexOf("g") > -1) {
                      return o.id.substring(2)
                  }
              })
              var obj = {
                  "permIds": permIds,
                  "groupIds": groupIds
              }
              $.post('./wishland/roles/' + rid + '/update_permission', obj, function (data) {
                  if (data.status) {
                      $(".subdiv").hide()
                      $("#jqGrid").jqGrid('setGridParam', {
                          url: './wishland/roles',
                          datatype: 'json',
                          postData: {},
                          page: $('#jqGrid').getGridParam('page'),
                      }).trigger("reloadGrid");
                  } else {}
              }, 'json')
          });
          this.element.on("change", "[page='inquire'] .op", function (e) {
              $(this).parent().click()
              var ss = $(this).children('optgroup').children('option:selected').val();
              var id = $("#jqGrid").jqGrid("getGridParam", "selrow");
              var rowData = $("#jqGrid").jqGrid('getRowData', parseInt(id));
              if (ss == "change-modify") { //右侧显示权限树 z-tree

                  _this.element.find(".subdiv2").hide()
                  var id = $("#jqGrid").jqGrid("getGridParam", "selrow");
                  var setting = {
                      check: {
                          enable: true
                      },
                      view: {
                          showLine: true, //显示节点之间的连线。
                          selectedMulti: false //允许同时选中多个节点。
                      },

                      data: {
                          simpleData: {
                              enable: true, //使用简单数据模式
                              idKey: "id", //节点数据中保存唯一标识的属性名称
                              pIdKey: "pId", //节点数据中保存其父节点唯一标识的属性名称
                              rootPId: "" //用于修正根节点父节点数据 默认值：null
                          }
                      },
                      callback: {
                          onCheck: function (event, treeId, treeNode) {
                              cancelChecked(treeNode)

                              function cancelChecked(node) {
                                  if (node.isParent) { //判断是否为父节点
                                      if (node.zAsync) { //判断该节点是否异步加载过子节点（有木有展开）
                                          zTree = $.fn.zTree.getZTreeObj("treeDemo");
                                          var childs = node.children;
                                          for (var i = 0; i < childs.length; i++) {
                                              zTree.checkNode(childs[i], false, false); //取消子节点的选中
                                              cancelChecked(childs[i]);
                                          }
                                      }
                                  }
                              }
                          }
                      },
                  };
                  // 被ajax  更新
                  var cur_link = []
                  $.ajaxSettings.async = false;
                  $.get('./wishland/roles/' + id, function (data) {
                      $.each(_this.tree.data, function (i, o) { //all
                          var in_flag = false;
                          var in_flag2 = false;
                          $.each(data.data.permissions, function (i, obj) { //permissions that i have 
                              if (o.data.id == obj.id) {
                                  in_flag = true
                              }
                          })
                          $.each(data.data.groups, function (i, obj) { //groups that i have 
                              if (o.data.id == obj.id) {
                                  in_flag2 = true
                              }
                          })
                          if (o.type == 'permission' && in_flag) { //有的权限
                              cur_link.push({
                                  id: o.id,
                                  pId: o.parent,
                                  name: o.data.text,
                                  dataId: o.data.id,
                                  checked: true
                              })
                          } else if (o.type == 'permission') {
                              cur_link.push({
                                  id: o.id,
                                  pId: o.parent,
                                  name: o.data.text,
                                  dataId: o.data.id
                              })
                          } else if (in_flag2) { //有的权限组  
                              cur_link.push({
                                  id: o.id,
                                  pId: o.parent,
                                  name: o.data.text,
                                  open: true,
                                  checked: true
                              })
                          } else {
                              cur_link.push({
                                  id: o.id,
                                  pId: o.parent,
                                  name: o.data.text,
                                  open: true
                              })
                          }
                      })
                  }, 'json')
                  var tt = $.fn.zTree.init($("#treeDemo"), setting, cur_link); //用全局变量  _this.tree 来接受 不能进行二次渲染 
                  _this.element.find(".subdiv").show()
              } else if (ss == "change-users") { // 右侧显示 用户表	 
                  _this.element.find(".subdiv").hide()
                  _this.element.find("#jqGrid2").jqGrid({
                      url: "./wishland/roles/" + rowData.id + "/users",
                      postData: {},
                      mtype: "GET",
                      styleUI: 'Bootstrap',
                      datatype: "json",
                      colModel: [{
                              label: '编号',
                              name: 'id',
                              key: true,
                              width: 40
                          },
                          {
                              label: '用户',
                              name: 'name',
                              width: 100,
                          },
                          {
                              label: '品牌',
                              name: 'merchants',
                              width: 300,
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
                      width: 740,
                      height: 450,
                      rowNum: 30,
                      pager: "#jqGridPager"
                  });
                  $("#jqGrid2").jqGrid('setGridParam', {
                      url: "./wishland/roles/" + rowData.id + "/users",
                      datatype: 'json',
                      postData: {},
                      page: $('#jqGrid2').getGridParam('page'),
                      loadComplete: function () {}
                  }).trigger("reloadGrid");
                  _this.element.find(".subdiv2").show()
              }
          });
      },
      initTree: function () {
          var _this = this;
          $.ajaxSettings.async = false;
          $.get("./wishland/permission/list_with_group", function (data) {
              _this.tree = data
          }, 'json')
      },
      check: function (data) {
          if (data.name.length < 1) {
              $(".ret").html("  名称不能为空");
              return false;
          }
          if (data.title.length < 1) {
              $(".ret").html("  描述不能为空");
              return false;
          }
          return true;
      },
      add: function (data) {
          return new Promise(function (resolve, reject) {
              $.post('./wishland/roles', data, function (data) {
                  if (data.status) {
                      resolve(data);
                  } else {
                      resolve(data);
                  }
              }, 'json')
          });
      },
  }
