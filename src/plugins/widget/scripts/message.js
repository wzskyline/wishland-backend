(function ($) {

    //系统提示
    $.messager = function (options) {
        var obj = {
            element: $("body"),
            status: options.status || 'success',
            message: options.message || '',
            determine: options.determine || function () {},
            cancel: options.cancel || function () {},
            buttonType: options.buttonType || '',
            init: function () {

                this.appendHtml();
            },
            bindEvent: function ( element ) {

                // 关闭信息窗口
                var _this = this;
                element.find("[data-dismiss='modal']").off("click").bind("click",function () {
                    _this.closeModal();
                });

                // 点击确定
                element.find("[data-name='determine']").off("click","").bind("click",function () {

                    _this.determine();
                    _this.closeModal();
                });

                // 点击取消
                element.find("[data-name='cancel']").off("click").bind("click",function () {
                    _this.cancel();
                    _this.closeModal();
                });
            },
            appendHtml: function () {

                this.closeModal();
                var html = '';
                html +='<div class="modal-backdrop fade in" id="messageBg" style="display: block;"></div>';
                html +='<div class="support_modal modal fade in" id="messageModal" role="dialog" data-name="messageModal" style="display: block;">';
                html +='	<div class="modal-dialog" style="">';
                html +='		<div class="modal-content">';
                html +='			<div class="modal-header">';
                html +='				<button type="button" class="close" data-dismiss="modal">×</button>';
                html +='				<h4 class="modal-title">温馨提示</h4>';
                html +='			</div>';
                html +='			<div class="modal-body">';
                html +='				<div class="statusBox">';
                html +=' 					<img style="width: 100px" src="../../images/message/'+ obj.status +'.png" class="animated bounceIn"/>';
                html +='				</div>';
                html +='				<p class="messagetBox">'+ obj.message +'</p>';
                html +='			</div>';
                html +=' 			<div class="modal-footer">';
                html +=' 				<button type="button" class="btn btn-primary dropdown-toggle" data-name="determine">确定</button>';

                if( obj.buttonType === 'addCancel' ){
                    html +='				<button type="button" class="btn btn-primary dropdown-toggle" data-name="cancel">取消</button>';
                }

                html +='			</div>';
                html +='		</div>';
                html +='	</div>';
                html +='</div>';

                this.element.append( html );
                this.bindEvent( $("#messageModal") );
            },
            closeModal: function () {

                $("#messageBg").remove();
                $("#messageModal").remove();
            }
        };

        obj.init()

    }
})(jQuery);
