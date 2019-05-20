var home = {
	init: function () {
		
	  /*var token = localStorage.getItem("token");
		console.log(token)
		if(token==null){
			window.location.href ="/";   
		}*/
    // $.ajax({
		// "url" : "./wishland/user/current_user",
		// "type" : "get",
		// headers: {
		// 	"authorization-ww": localStorage.getItem("token")
		// },
		// "dataType" : "json",		                  
		// "success" : function(data ) {  
		//     if( data.data.isAdmin != 1){
		// 		$(".username").html(data.data.name)
		// 		$("#sidebar-menu").children('.menu_section').eq(1).hide()
		// 	}
 
	// 	},
	// })
		return new Promise(function (resolve, reject) {
			resolve();
		})
	
	},
	destroy: function () {
	},
	initComponent: function () {
	},
	bindEvent: function () {
	}
}