/**
 * @class Number
 */
;(function(global, factory){

    if(typeof exports === 'object' && typeof module != 'undefined'){
        module.exports = factory();
    }else if(typeof define === 'function' && define.amd){
        define(factory);
    }else{
        global.Number = factory();
    }
})(this, (function(){
    'use strict';

    /**
     * 數字格式化
     *
     * @method
     *
     * @param {Number} [n=0] - 小數點位數，預設0
     * @param {Number} [x=3] - 分位數，預設使用千分位
     *
     * @return {String}
     *
     * @example
     * var a = 123456.78;
     *
     * a.format();      // 123,456
     * a.format(1);     // 123,456.7
     * a.format(2);     // 123,456.78
     * a.format(0, 4);  // 12,3456
     */
    Number.prototype.format = function(n, x) {
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
        return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
    }

    /**
     * 數字前補上固定長度的字串
     *
     * @method
     *
     * @param {Number} w - 顯示的字串長度
     * @param {Number} c - 數字不足時，補足長度的前綴
     *
     * @returns {String}
     *
     * @example
     * var a = 123;
     *
     * a.pad(10, 0);    // 0000000123
     * a.pad(5, '#');   // ##123
     */
    Number.prototype.pad = function(w, c){
        var n = this + '';
        c = c || '0';
        return n.length >= w ? n : new Array(w - n.length +1).join(c) + n;
    }

    if(!Number.isFinite){
        /**
         * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite
         */
        Number.isFinite = function(value) {
            return typeof value === 'number' && isFinite(value);
        }
    }

    if(!Number.isNaN){
        /**
         * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN
         */
        Number.isNaN = function(value) {
            return typeof value === 'number' && isNaN(value);
        }
    }

    if(!Number.isInteger){
        /**
         * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
         */
        Number.isInteger = function(value) {
           return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
        }
    }

    return Number;
}));