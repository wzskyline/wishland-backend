var classification_config = {
    _levelMap: null,
    init: function( classArr ){
        classArr = classArr || [];

        this._levelMap = app._classification_config;

        if( !this._levelMap ){ return []; }
       
        return  this
    },
    /**
	 *  获取当前等级配置数据
	 */
    getMemberLevelDataStatistics: function( classArr ){
        arr = classArr || [];

        if( !arr || arr.length <= 0 ){ return [] };

        // 总数据
        var _liveMemberData = [];
        var dataObj,lotteryData;

       for( var i=0,l=arr.length; i<l; i++ ){
           dataObj = {};
           // 当前等级数据
           lotteryData = this._levelMap[arr[i].classificationId];
           // 当前等级值
           dataObj.classificationVal = arr[i].classificationVal > lotteryData.endNum? lotteryData.endNum : arr[i].classificationVal ;
           // 当前类型
           dataObj.type = arr[i].type;
           // 当前类型名字
           dataObj.name = lotteryData.name;
           // 当前等级最低值
           dataObj.startNum =  lotteryData.startNum;
           // 当前等级最高值
           dataObj.endNum = lotteryData.endNum;
           // 当前等级
           dataObj.level = lotteryData.level;
           // 下一个等级
           dataObj.nextLevel = dataObj.level+1 >= 6? 6 : dataObj.level+1;
           // 当前等级进度条
           dataObj.percentage = this.getPercent( dataObj.classificationVal,dataObj.endNum );
           // 防止超出范围
           dataObj.percentage = dataObj.percentage >= 100? 100 : dataObj.percentage;
           dataObj.percentage = dataObj.level >= 6? 100 : dataObj.percentage;
           // 当前还差值
           dataObj.distance = dataObj.endNum - dataObj.classificationVal;

           _liveMemberData.push( dataObj );
       }

       return _liveMemberData;
    },

    /**
	 *  获取当前等级
	 */
    getLevel: function( classificationId ){

        if( !classificationId ){ return {} };
        return this._levelMap[classificationId] || {};
    },
    /**
	 * 计算比例
	 */
	getPercent: function( num, total ){
		num = parseFloat(num);
		total = parseFloat(total);
		if (isNaN(num) || isNaN(total)) {
			return "0";
		}
		return total <= 0 ? 0 : (Math.round(num / total * 10000) / 100.00);
	},
}