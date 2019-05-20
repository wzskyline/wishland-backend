var user = {
    _username: "memo",
    _permissionsMap: [],
    _permissions: null,
    _isAdmin: false,
    _current_user: null,
    _liveAdmin: false,
    _liveRoom: false,
    getUsername: function () {
        return localStorage.getItem("name");
    },
    getPicture: function () {
        return "./images/user.png";
    },
    getToken: function () {
        return localStorage.getItem("accessToken");
    },
    isAdmin: function () {
        return this._isAdmin;
    },
    isLiveAdmin: function () {
        return this._liveAdmin;
    },
    isLiveRoom: function () {
        return this._liveRoom;
    },
    hasPermissions: function (permissionsName) {
        if (this.isAdmin()) {
            return true
        }
        return this._permissionsMap.indexOf(permissionsName) != -1 ? true : false;
    },
    getPermissions: function () {
        return this._permissions || null;
    },
    init: function () {

    },
    login: function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var token = $.uuid();

            //	set token in sessionStorage
            localStorage.setItem("token", token);


            var postData = {
                name: data.username,
                password: data.password,
            };

            $.post('./wishland/user/login', postData, function (data) {
                if (data.status) {
                    localStorage.setItem("accessToken", data.data.accessToken);
                    localStorage.setItem("name", data.data.name);
                    localStorage.setItem("uid", data.data.id);
                    _this._username = data.data.name;
                    resolve({
                        success: true
                    })
                } else {
                    resolve({
                        success: false
                    })
                }
            }, 'json');
        });
    },
    logout: function () {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("name");
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("cosplay");
        localStorage.removeItem("token");
    },

    // 获取用户信息
    getCurrentUser: function () {
        var _this = this;
        return $.ajax({
            url: "./wishland/user/current_user",
            type: "get",
            headers: {
                "authorization-ww": user.getToken()
            },
            dataType: "json"
        }).done(function (rs) {
            if (rs.status) {
                var data = rs.data;
                _this._current_user = data;
            }

        }).fail(function (xhr, status, err) {

            $.messager({
                status: 'error',
                message: xhr.responseJSON.message
            });
        });
    },

    // 获取权限
    getPermission: function () {
        return this._current_user
    }
}
