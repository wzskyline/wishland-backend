var app = {
    //	左側選單
    _menu: null,
    // home页面
    _home: "#/home",
    // 香格里拉品牌
    _sgMerchant: 'sgl818',
    _classification_config: {},
    // 通讯服务
    _COMService: null,
    // 场控服务
    _liveShowModerator: null,
    // 主播服务
    _liveShowModel: null,
    init: function () {
        var _this = this;

        //	start progress
        NProgress.start();

        $("body").append(document.querySelector("#app_template").innerHTML);

        this.element = $("#app");
        this.$main = this.element.find("#wrap");
        this.$error = this.element.find("#error");
        this.$loader = this.element.find("#loader");

        return new Promise(function (resolve, reject) {
            var done = function (menu) {
                _this._menu = menu;

                $.when(
                    user.getCurrentUser()
                ).then(function (info) {

                    if (!info) {
                        $.messager({
                            status: 'error',
                            message: '获取权限失败'
                        });
                        reject("获取权限失败");
                        return
                    }

                    // 设置权限
                    _this.setPermission(info.data).then(function () {

                        // 初始化组件
                        _this.initComponent();
                        // 初始化绑定事件
                        _this.bindEvent();
                        // 初始化ajax
                        _this.initAjax();
                        // 初始化个人信息
                        _this.initUser();
                        // 获取直播用户等级配置
                        _this.getClassificationConfigs();
                        // 初始化通讯服务
                        _this.initCOMService().finally(function () {
                            // 捞取默认页面
                            _this.enter();
                            // 设置hash值
                            _this.setHash();
                        })
                        resolve();
                    }).catch(function (e) {
                        $.messager({
                            status: 'error',
                            message: e
                        });
                        reject(e)
                    })

                }).fail(function (xhr) {
                    $.messager({
                        status: 'error',
                        message: xhr.responseJSON.errorCode
                    });
                    reject("获取权限失败")
                });

            }

            $.when($.ajax({
                url: "./resources/menu.json"
            })).done(done);
        }).finally(function () {

            //	stop progress
            NProgress.done();

            //	show content
            _this.element.children(".loading_wrap").removeClass("active")
                .siblings(".body").addClass("active");

            //	remove loading
            setTimeout(function () {
                _this.element.children(".loading_wrap").remove();
            }, 400);
        });
    },
    initUser: function () {
        var name = localStorage.getItem("name");
        this.element.find(".username").html(name);
        this.element.find("img.user_picture").attr("src", user.getPicture());
    },
    initComponent: function () {
        // this.initMenu();
    },
    bindEvent: function () {
        var _this = this;
        var $SIDEBAR_MENU = this.element.find("#sidebar-menu");

        //	點擊左側選單
        $SIDEBAR_MENU.on("click", "a", function (e) {
            var $li = $(this).parent();

            if ($li.is('.active')) {
                $li.removeClass('active active-sm');
                $('ul:first', $li).slideUp(function () {
                    //setContentHeight();
                });
            } else {
                // prevent closing menu if we are on child menu
                if (!$li.parent().is('.child_menu')) {
                    $SIDEBAR_MENU.find('li').removeClass('active active-sm');
                    $SIDEBAR_MENU.find('li ul').slideUp();
                }

                $li.addClass('active').siblings().removeClass("active");

                $('ul:first', $li).slideDown(function () {
                    //setContentHeight();
                });
            }
        });

        //  頁面網址發生改變時
        $(window).off("popstate, hashchange").on("popstate, hashchange", function (e) {
            var hash = utils.parseUrlHash();

            if (String.isEmpty(hash.url)) {
                location.hash = "#/home";
                hash.url = "home";
            }

            _this.loadPage(hash.url, hash.params);
        });

        //  變換視窗大小
        $(window).off("resize").on("resize", function (event) {
            var width = document.body.clientWidth,
                height = document.body.clientHeight;

            _this._page_object && typeof _this._page_object.resize == 'function' ?
                _this._page_object.resize(width, height) : null;
        });

        this.element.on("click", ".logout", function (e) {
            app.logout();
        });
    },
    destroy: function () {
        //	unbind event
        this.element.off();
        //	remove by myself
        this.element.remove();

        this.element = null;
        this._comService = null;

        // 调用对应页面destroy
        if (this._page_object) {
            this._page_object.destroy();
        }

    },

    /**
     * 初始化ajax設定
     */
    initAjax: function () {
        $.ajaxSetup({
            headers: {
                "authorization-ww": user.getToken()
            },
            type: "GET",
            cache: false,
            error: function (jqXHR, textStatus, errorThrown) {

            }
        });
    },
    enter: function () {
        var hash = utils.parseUrlHash();

        if (String.isEmpty(hash.url)) {
            location.hash = "#/home";
            hash.url = "home"
        }

        this.loadPage(hash.url, hash.params);
    },
    initMenu: function () {
        var html = "",
            menuItem, subMenuItem;

        for (var i = 0; i < this._menu.length; i++) {
            html += '<div class="menu_section" data-name="' + this._menu[i].type + '">';
            html += '	<h3>' + this._menu[i].title + '</h3>';

            if (this._menu[i].menu.length != 0) {
                html += '<ul class="nav side-menu">';
                for (var j = 0; j < this._menu[i].menu.length; j++) {
                    menuItem = this._menu[i].menu[j];
                    //html += '<li><a><i class="' + menuItem.clazz + '"></i> ' + menuItem.text + ' ' + (menuItem.sub_menu.length != 0 ? '<span class="fa fa-chevron-down"></span>' : '') + '</a>';
                    html += '<li><a {href}><i class="{class}"></i> {text} {more}</a>'
                        .replace("{href}", 'href="' + menuItem.href + '"' ? menuItem.href : "")
                        .replace("{class}", menuItem.clazz)
                        .replace("{text}", menuItem.text)
                        .replace("{more}", menuItem.sub_menu && menuItem.sub_menu.length != 0 ? '<span class="fa fa-chevron-down"></span>' : '');

                    if (menuItem.sub_menu && menuItem.sub_menu.length != 0) {

                        html += '<ul class="nav child_menu">';
                        for (var k = 0; k < menuItem.sub_menu.length; k++) {
                            subMenuItem = menuItem.sub_menu[k];

                            html += '<li><a href="{href}" data-name="hash">{text}</a></li>'
                                .replace("{href}", subMenuItem.href)
                                .replace("{text}", subMenuItem.text);
                        }
                        html += '</ul>';
                    }
                    html += '</li>';
                }
                html += '</ul>';
            }
            html += '</div>';
        }

        this.element.find("#sidebar-menu").html(html);
    },
    loadPage: function () {
        var _this = this;
        var page = arguments[0] ? arguments[0] : "home";
        var param = arguments[1] ? arguments[1] : null;
        var template, $element, promise;

        //  執行前頁面事件的取消綁定與銷毀
        if (this._page_object && typeof this._page_object.destroy == "function") {
            this._page_object.element.off();
            this._page_object.destroy();
        }

        //  reset scrollTop
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        // 隐藏错误提示
        this.$error.removeClass("active");

        //  取得template
        template = document.querySelector("#" + page + "_template").innerHTML;
        $element = $(template);

        //  載入頁面
        this.startLoading();
        this.$main.html($element);
        ScriptManager.load('./js/_' + page + '.js?v={VERSION}', function () {
            //  儲存頁面名稱
            _this._page = page;
            //  儲存頁面物件
            _this._page_object = new Function("return " + page)();
            //  儲存頁面jquery object
            _this._page_object.element = $element;
            //  執行頁面初始化
            promise = _this._page_object.init(param);

            promise.then(function (a) {
                //  show element content
                _this._page_object.element.addClass("active");
            }).catch(function (error) {
                //  error handling
                _this.errorHandle(error);
            }).finally(function () {
                _this.stopLoading();
            });
        }, function () {
            //  set page & page_object = null
            _this._page = _this._page_object = null;
            //  error handling
            _this.errorHandle({
                message: 'javascript加载失败'
            });

            if (global.env == "dev") {
                throw "javascript載入失敗:" + "./js/_" + page + ".js?v={VERSION}";
            }
        });
    },
    errorHandle: function (error) {
        this.element.children(".loading").removeClass("active");
        this.$main.html("");
        this.$error.addClass("active").find(".message").html(error.message);
        error.callback ? setTimeout(error.callback, 100) : null;
    },
    startLoading: function () {
        this.$loader.addClass("active");
    },
    stopLoading: function () {
        this.$loader.removeClass("active");
    },
    logout: function () {
        user.logout();
        this.destroy();
        login.init();
        utils.setTitle("Wishland管理後台");
    },
    //　设置权限
    setPermission: function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _menu = _this._menu;
            var newMenu = [];
            var isAdmin = data.isAdmin != 1 ? false : true;
            var groupsMenu = data.groups.length >= 1 ? data.groups[0].children : [];
            var permissions = data.permissions;
            var newGroupsMenu = [];

            var liveMenu = [{
                    "text": "主播列表",
                    "href": "#/live_live_list"
                },
                {
                    "text": "直播会员统计",
                    "href": "#/live_member_statistics"
                },
                {
                    "text": "会员等级配置",
                    "href": "#/live_member_configuration"
                },
                {
                    "text": "礼物配置",
                    "href": "#/live_gift_configuration"
                },
                {
                    "text": "主播房间",
                    "href": "#/live_live_room"
                },
                {
                    "text": "场控管理",
                    "href": "#/live_live_control"
                },
                {
                    "text": "主播收益报表",
                    "href": "#/live_live_inquire"
                },
                {
                    "text": "刷礼物记录",
                    "href": "#/live_gift_recording"
                },
                {
                    "text": "直播状态查询",
                    "href": "#/live_live_monitor"
                },
                {
                    "text": "主播状态监控",
                    "href": "#/live_live_status_monitor"
                },
                {
                    "text": "直播公告管理",
                    "href": "#/live_announcement_management"
                }
            ]

            // 处理非管理员用户
            if (!isAdmin) {

                // 处理非管理员权限显示
                for (var i = 0, l = _menu.length; i < l; i++) {
                    if (_menu[i].type === 'admin' && !isAdmin) {
                        continue
                    }
                    newMenu.push(_menu[i]);
                }

                // 匹配当前用户配置的一级菜单功能
                var menuItme, newMenuArr = [];
                for (var i = 0, l = newMenu.length; i < l; i++) {
                    for (var j = 0, k = newMenu[i].menu.length; j < k; j++) {
                        menuItme = newMenu[i].menu[j]
                        for (var g = 0, h = groupsMenu.length; g < h; g++) {
                            if (menuItme.text === groupsMenu[g].name) {
                                newMenuArr.push(menuItme);
                            }
                        }
                    }
                }

                // 替换json 中的一级菜单
                for (var i = 0, l = newMenu.length; i < l; i++) {
                    newMenu[i].menu = newMenuArr;
                }

                // 拿到当前可以使用的二级菜单
                for (var i = 0, l = groupsMenu.length; i < l; i++) {
                    if (groupsMenu[i].name === '直播管理') {
                        newGroupsMenu = groupsMenu[i].children;
                        // 账户拥有直播管理权限
                        user._liveAdmin = true;
                    }
                }

                // 匹配二级菜单的链接 菜单名字必须对上
                var sub_menuArr = [];
                for (var i = 0, l = liveMenu.length; i < l; i++) {
                    for (var j = 0, k = newGroupsMenu.length; j < k; j++) {
                        if (liveMenu[i].text === newGroupsMenu[j].name) {
                            if (newGroupsMenu[j].name === '主播房间') {
                                // 账户拥有主播房间权限
                                user._liveRoom = true;
                            }
                            sub_menuArr.push(liveMenu[i])
                        }
                    }
                }

                // 把json中获取的直二级播菜单替换成现在的二级菜单
                for (var i = 0, l = newMenu.length; i < l; i++) {
                    for (var j = 0, k = newMenu[i].menu.length; j < k; j++) {
                        if (newMenu[i].menu[j].text === '直播管理') {
                            newMenu[i].menu[j].sub_menu = sub_menuArr
                        }
                    }
                }
            }

            _this._menu = newMenu.length >= 1 ? newMenu : _this._menu;

            // 初始化菜单
            _this.initMenu();

            // 存储权限
            var name, permissionsArr = [];
            for (var i = 0, l = permissions.length; i < l; i++) {
                name = permissions[i].name;
                permissionsArr.push(name);
            }

            user._isAdmin = isAdmin;
            user._permissionsMap = permissionsArr;
            user._permissions = permissions;

            resolve();
        })

    },

    // 设置hash
    setHash: function () {
        var hashArr = [];
        // 获取到左侧菜单栏中的hash
        var hashS = $("#sidebar-menu").find('[data-name="hash"]');
        for (var i = 0, l = hashS.length; i < l; i++) {
            hashArr.push(hashS.eq(i).attr('href'));
        }
        //  检查当前hash是否存在与左侧菜单栏中
        if (hashArr.indexOf(location.hash) === -1) {
            location.href = location.href.split('#')[0] + this._home
        }
    },
    /**
     * 获取等级配置信息
     */
    getClassificationConfigs: function () {
        var _this = this;
        $.resource({
            url: "./live/live_show/getClassificationConfigs",
            data: {
                merchant: global.merchant
            }
        }).done(function (rs) {
            if (!rs.status) {
                return
            }
            var levelArr = rs.data;
            var levelInfo;

            for (var i in levelArr) {
                for (var j = 0, k = levelArr[i].length; j < k; j++) {
                    levelInfo = levelArr[i][j];
                    _this._classification_config[levelInfo.classificationId] = levelInfo;
                }
            }
        });
    },

    /**
     * 初始化通讯系统
     */
    initCOMService: function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                // 检查是否为管理员
                if (!user.isAdmin()) {
                    // 检查当前用户是否有直播管理权限
                    if (!user.isLiveAdmin()) {
                        reject("没有直播管理权限");
                        return
                    }
                }
                // 如果是子页面就走里面，然后继承父页面的通讯方法
                if (window.opener) {
                    // 存储通讯方法
                    _this._COMService = window.opener.app._COMService;
                    // 存储场控方法
                    _this._liveShowModerator = window.opener.app._liveShowModerator;
                    // 存储主播方法
                    _this._liveShowModel = window.opener.app._liveShowModel;
                    reject();
                    return
                }
                _this._COMService = new COMService({
                    merchant: _this._sgMerchant,
                    userKey: user.getUsername(),
                    permanentAllocation: true,
                });
                _this._COMService.init().then(function (resp) {
                    // 初始化主播
                    _this.initLiveShowModel(_this._COMService).finally(function () {
                        // 初始化场控
                        _this.initLiveShowModerator(_this._COMService).finally(function () {
                            localStorage.setItem("updata", new Date().getTime())
                            resolve();
                        })
                    })

                }).catch(function () {
                    reject();
                })
            } catch (e) {
                console.error(e);
                reject();
            }
        })
    },

    /**
     * 初始化场控服务
     */
    initLiveShowModerator: function (COMService) {
        var _this = this;
        var liveShowModerator;
        return new Promise(function (resolve, reject) {

            if (!user.isAdmin()) {
                // 检查当前用户是否有场控权限
                if (!user.hasPermissions('live:control:management')) {
                    resolve("没有场控权限");
                    return
                }
            }

            try {
                liveShowModerator = new LiveShowModerator({
                    merchant: _this._sgMerchant,
                    userKey: user.getUsername()
                }, COMService);

                liveShowModerator.init().then(function (resp) {
                    // // 存储场控服务
                    _this._liveShowModerator = liveShowModerator;
                    resolve(liveShowModerator);
                }).catch(function (e) {
                    console.error("初始化场控服务失败")
                    reject('初始化场控服务失败');
                });
            } catch (e) {
                console.error(e);
                reject("初始化场控服务失败");
            }
        });
    },

    /**
     * 初始化场主播系统服务
     */
    initLiveShowModel: function (COMService) {
        var _this = this;
        var liveShowModel;
        return new Promise(function (resolve, reject) {

            try {
                // 只检查是否有主播房间权限
                if (!user.isLiveRoom()) {
                    resolve("没有主播房间权限");
                    return
                }

                $.ajax({
                    url: "/live/live_show/getModelInfo",
                    data: {
                        modelUserId: user.getUsername() + '@' + _this._sgMerchant,
                    }
                }).done(function (rs) {

                    if (rs.status) {
                        var userKey = rs.data.userKey,
                            nickName = rs.data.nickName;

                        liveShowModel = new LiveShowModel({
                            merchant: _this._sgMerchant,
                            userKey: userKey,
                        }, {
                            nickName: nickName,
                            avatar: ''
                        }, COMService);

                        liveShowModel.init().then(function (modeInfo) {
                            // 存储主播服务
                            _this._liveShowModel = liveShowModel;
                            resolve(liveShowModel);
                        }).catch(function () {
                            reject('初始化主播系统失败');
                        })
                    } else {
                        console.error("获取主播信息失败")
                        reject('获取主播信息失败');
                    }

                }).fail(function () {
                    console.error("获取主播信息失败")
                    reject('获取主播信息失败');
                })
            } catch (e) {
                console.error(e)
                reject('获取主播信息失败');
            }
        })
    }

}
