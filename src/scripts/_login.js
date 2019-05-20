//	https://colorlib.com/etc/lf/Login_v15/index.html
var login = {
	init: function () {
		var _this = this;

		//	start progress
		NProgress.start();

		$("body").append(document.querySelector("#login_template").innerHTML)

		this.element = $("#login");

		return new Promise(function (resolve, rejct) {

			_this.initComponent();

			_this.bindEvent();

			resolve();
		}).finally(function () {
			NProgress.done();
		});
	},
	initComponent: function () {
		var username = localStorage.getItem("login.username");

		if(username){
			this.element.find("input[name='username']").val(username);
			this.element.find("input[name='password']").focus();
			this.element.find("input[name='remember']").prop("checked", true);
		}else{
			this.element.find("input[name='username']").focus();
		}
	},
	bindEvent: function () {
		var _this = this;

		this.element.on("click", ".login_button", function (e) {
			var data = {
				username: _this.element.find("input[name='username']").val(),
				password: _this.element.find("input[name='password']").val()
			};

			if(_this.validateLogin(data)){
				_this.login(data);
			}
		});

		this.element.on("click", ".forgot_button", function (e) {

		});

		this.element.find("input[name='password']").on("keyup", function(e){
			if(e.keyCode == KeyCode.RETURN){
				_this.element.find(".login_button").trigger("click");
			}
		});
	},
	destroy: function () {

		//	unbind event
		this.element.off();
		//	remove by myself
		this.element.remove();

		this.element = null;
	},
	validateLogin: function (data) {
		var flag = true;

		//	檢核帳號
		//		1.判斷是否空白
		if(String.isEmpty(data.username)){
			this.element.find("input[name='username']")
				.parents(".validate-input")
				.attr("data-validate", "帐号不允许空白")
				.addClass("alert-validate");
			flag = false;
		}else{
			this.element.find("input[name='username']")
				.parents(".validate-input")
				.removeClass("alert-validate");
		}

		//	檢核密碼
		//		1.判斷是否空白
		if(String.isEmpty(data.password)){
			this.element.find("input[name='password']")
				.parents(".validate-input")
				.attr("data-validate", "密码不允许空白")
				.addClass("alert-validate");
			flag = false;
		}else{
			this.element.find("input[name='password']")
				.parents(".validate-input")
				.removeClass("alert-validate");
		}

		return flag;
	},
	login: function (data) {
		var _this = this;
		    user.login(data).then(function (res) {
		   
		   if(res.success){	

			//	判斷是否記錄用戶帳號
			if(_this.element.find("input[name='remember']:checked").length == 1){
				localStorage.setItem("login.username", data.username);
			}else{
				localStorage.removeItem("login.username");
			}
			
			_this.destroy();
			app.init();

		}else{
			_this.element.find("input[name='username']")
					.parents(".validate-input")
					.attr("data-validate", "用户名可能错误")
					.addClass("alert-validate");		
			_this.element.find("input[name='password']")
					.parents(".validate-input")
					.attr("data-validate", "密码可能错误")
					.addClass("alert-validate");
			 
		}
			
		}).catch(function (rs) {});
	},
}