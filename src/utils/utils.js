var utils = {

    copyToClipBoard: function (content) {
        var $board = $('<textarea id="clipBoardInput" style="height:1px;"/>');

        $board.appendTo("body").val(content).select();
        document.execCommand("copy");
        $board.remove();
    },
    parseUrlHash: function () {
        var data = {
            url: null,
            params: {}
        };
        var hash = location.hash;
        var paramsString, pair;

        if (String.isNotEmpty(hash)) {
            hash = hash.replace("#/", "").split("?");
            data.url = hash[0];

            if (hash.length >= 2) {
                paramsString = hash[1].split("&");
                for (var i = 0; i < paramsString.length; i++) {
                    pair = paramsString[i].split("=");
                    data.params[pair[0]] = pair[1];
                }
            }
        }

        return data;
    },
    // 时间戳转年月日
    getTime: function (data) {

        var data = new Date(parseInt(data)),
            // 年
            year = data.getFullYear(),
            // 月
            month = data.getMonth() + 1,
            // 日
            day = data.getDate(),
            // 时
            hour = data.getHours(),
            // 分
            min = data.getMinutes(),
            // 秒
            second = data.getSeconds();

        var time = year + "-" + setTime(month) + "-" + setTime(day) + " " + setTime(hour) + ":" + setTime(min) + ":" + setTime(second);

        return time;

        function setTime(time) {

            return time < 10 ? "0" + time : time;
        }
    },
    //封装弹出层
    dialog: function (arr) {
        var d = dialog({
            content: arr[0],
            ok: arr[1] || function () {
                return;
            },
            cancel: arr[2] || function () {
                return;
            },
            title: arr[3] || '提示',
            okValue: arr[4] || '确定',
            cancelValue: arr[5] || '取消',
        });
        d.show();
        if (arr[6]) {
            setTimeout(function () {
                d.close().remove();
            }, a[7] || 4000);
        }
    },
    //清理弹出层
    dialogclear: function () {
        var list = dialog.list;
        for (var i in list) {
            list[i].close();
        };
    },
    // 时间撮转时分秒
    getHMS: function (time, styleS) {

        var h = parseInt(time / 1000 / 60 / 60 % 24);
        var m = parseInt(time / 1000 / 60 % 60);
        var s = parseInt(time / 1000 % 60);

        return '<time style="' + styleS + '">' + h + '</time> 小时 <time style="' + styleS + '">' + m + '</time>  分 <time style="' + styleS + '">' + s + '</time> 秒'
    },
    /**
     * 取得指定天的開始、結束時間
     *
     * @param day - 哪一天，當天0、昨天-1、前天-2
     *
     * @return {[*,*]}
     */
    getDay: function (day) {
        var d = new Date(Date.now() + day * 1000 * 60 * 60 * 24);
        return [new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0), new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59)];
    },

    // 解析ajax提交formData返回的数据
    analysisFormData: function (data) {
        var dataCopy = data;
        try {
            // 解析返回数据
            var reg = /<pre.+?>(.+)<\/pre>/g;
            data = data.match(reg);
            data = RegExp.$1; // 解决上传文件 返回值带 <pre
            data = (new Function("return " + data))();
        } catch (err) {
            data = dataCopy;
            data = (new Function("return " + data))();
        }

        return data;
    },

    // 过滤非数字与小数点
    onlyNumber: function (obj) {
        //得到第一个字符是否为负号
        var t = obj.value.charAt(0);
        //先把非数字的都替换掉，除了数字和.
        obj.value = obj.value.replace(/[^\d\.]/g, '');
        //必须保证第一个为数字而不是.
        obj.value = obj.value.replace(/^\./g, '');
        //保证只有出现一个.而没有多个.
        obj.value = obj.value.replace(/\.{2,}/g, '.');
        //保证.只出现一次，而不能出现两次以上
        obj.value = obj.value.replace('.', '$#$').replace(/\./g, '').replace(
            '$#$', '.');
    },

    // 按钮切换状态
    buttomStatus: function (data) {
        var obj = {
            element: data.element || null,
            status: data.status || false,
            text: data.text || null
        }

        if (obj.element && obj.status) {
            obj.element.addClass('disabled').text(obj.text);
        } else {
            obj.element.removeClass('disabled').text(obj.text);
        }
    },

    /**
     * 处理帐号有. 并且是否统一转小写
     */
    setUserkeyEndToLowerCase: function (userKey, status) {
        var userKey
        userKey = userKey.split(".");
        userKey = userKey.length >= 1 ? userKey[1] : userKey[0];

        if (status) {
            userKey = userKey.toLowerCase();
        };

        return userKey
    },

    // 加密帐号或者昵称
    textEncryption: function (text) {
        if (!text) {
            return
        }
        var newText = text.slice(0, 4);
        var encryption = '';
        var length = text.length - 4 <= 4 ? text.length - 4 : 4;
        for (var j = 0; j < length; j++) {
            encryption += "*"
        }
        return newText = newText + encryption;
    },

    // 过滤所有空格
    space: function (text) {
        return text.replace(global.regex.space, '');
    },

    // 字数限制
    limitWords: function (text, length) {
        return text.substr(0, length);
    },

    // 设置滚动条居底部
    setScrollTop: function (element, scroll) {

        var scrollAuto = true;
        var scrollVal, elementHeight, scrollHeight;
        scroll = scroll || element.find("ul");

        element.scroll(function () {
            scrollAuto = false;
            scrollVal = element.scrollTop();
            elementHeight = element.height();
            scrollHeight = scroll.prop("scrollHeight");
            if (scrollVal + elementHeight >= scrollHeight) {
                scrollAuto = true;
            }
        });

        function setScroll() {
            if (scrollAuto) {
                scrollHeight = scroll.prop("scrollHeight");
                element.animate({
                    scrollTop: scrollHeight
                }, 0);
            }
        }
        return setScroll;
    },

    // 导出excel
    exporExcel: function (FileName, id) {
        var excel = document.getElementById("" + id + "").innerHTML;
        // @params: FileName:导出Excel的文件名称，excel:需要导出的table
        // 如果没有table列表，只有json数据的话，将json数据拼接成table字符串模板即可
        var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
        excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
        excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
        excelFile += '; charset=UTF-8">';
        excelFile += "<head>";
        excelFile += "<!--[if gte mso 9]>";
        excelFile += "<xml>";
        excelFile += "<x:ExcelWorkbook>";
        excelFile += "<x:ExcelWorksheets>";
        excelFile += "<x:ExcelWorksheet>";
        excelFile += "<x:Name>";
        excelFile += "{worksheet}";
        excelFile += "</x:Name>";
        excelFile += "<x:WorksheetOptions>";
        excelFile += "<x:DisplayGridlines/>";
        excelFile += "</x:WorksheetOptions>";
        excelFile += "</x:ExcelWorksheet>";
        excelFile += "</x:ExcelWorksheets>";
        excelFile += "</x:ExcelWorkbook>";
        excelFile += "</xml>";
        excelFile += "<![endif]-->";
        excelFile += "</head>";
        excelFile += "<body>";
        excelFile += excel;
        excelFile += "</body>";
        excelFile += "</html>";


        var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);

        var link = document.createElement("a");
        link.href = uri;

        link.style = "visibility:hidden";
        link.download = FileName; //格式默认为.xls

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    /**
     * 初始化直播視頻
     *
     * @see
     * https://github.com/videojs/videojs-flash/issues/26
     * https://github.com/videojs/video.js/issues/2247
     * http://coderlt.coding.me/2016/02/26/videojs-readme/
     * https://docs.videojs.com/tutorial-tech_.html
     * http://vcloud.163.com/vcloud-sdk-manual/WebDemos/LivePlayer_Web/introToComponent.html
     * https://hk.saowen.com/a/ac96ab711d0164f39b87bec683f376607fdc2429f03212d464933b0f01013ec0
     * https://www.jianshu.com/p/dca80ecda570
     * https://codepen.io/togglelt/pen/YqKmzG
     * https://www.jianshu.com/p/c3955cd29868
     */
    // 视频组件
    video: function (liveId, status, config) {
        var _this = this,
            html = "",
            video = null;

        var errors = {
            '1': {
                type: 'MEDIA_ERR_ABORTED',
                headline: '温馨提示：',
                message: '视频下载已取消'
            },
            '2': {
                type: 'MEDIA_ERR_NETWORK',
                headline: '温馨提示：',
                message: '视频连接丢失，请确认您已连接到互联网'
            },
            '3': {
                type: 'MEDIA_ERR_DECODE',
                headline: '温馨提示：',
                message: '视频不良或格式无法在您的浏览器上播放'
            },
            '4': {
                type: 'MEDIA_ERR_SRC_NOT_SUPPORTED',
                headline: '温馨提示：',
                message: '此视频在此浏览器中不可用或不受支持'
            },
            '5': {
                type: 'MEDIA_ERR_ENCRYPTED',
                headline: '温馨提示：',
                message: '此视频已加密，无法观看'
            },
            'unknown': {
                type: 'MEDIA_ERR_UNKNOWN',
                headline: '温馨提示：',
                message: '遇到意料之外的问题，请稍后再回来再试一次'
            },
            '-1': {
                type: 'PLAYER_ERR_NO_SRC',
                headline: '温馨提示：',
                message: '没有加载视频',
            },
            '-2': {
                type: 'PLAYER_ERR_TIMEOUT',
                headline: '温馨提示：',
                message: '您的网络连接超时，请重新刷新页面',
            },
            'PLAYER_ERR_DOMAIN_RESTRICTED': {
                type: 'PLAYER_ERR_DOMAIN_RESTRICTED',
                message: '此视频仅限于在您当前的域上播放',
                headline: '温馨提示：'
            },
            'PLAYER_ERR_IP_RESTRICTED': {
                type: 'PLAYER_ERR_IP_RESTRICTED',
                message: '此视频仅限于您当前的IP地址',
                headline: '温馨提示：'
            },
            'PLAYER_ERR_GEO_RESTRICTED': {
                type: 'PLAYER_ERR_GEO_RESTRICTED',
                headline: '温馨提示：',
                message: '此视频仅限于在您当前的地理区域播放',
            },
            'FLASHLS_ERR_CROSS_DOMAIN': {
                type: 'FLASHLS_ERR_CROSS_DOMAIN',
                headline: '温馨提示：',
                message: '无法加载视频：拒绝跨域访问',
            }
        }
        var options = {
            techOrder: ["flash", "html5", "flvjs"],
            width: config.width,
            height: config.height,
            preload: "auto",
            autoplay: true,
            controls: true,
            lang: 'zh-cn',
            language: 'zh-cn',
            sources: function (id) {
                var sources = [];

                for (var i = 0; i < global.stream.length; i++) {
                    sources.push({
                        type: global.stream[i].type,
                        src: global.stream[i].src.replace("{id}", id)
                    });
                }
                return sources;
            }(liveId.split("@")[0]),
            flash: {
                swf: "./plugins/videojs-swf/dists/video-js.swf"
            }
        }
        //	啟動視頻
        html += '<video id="live_video" class="video-js vjs-default-skin vjs-big-play-centered">';
        html += '	<p class="vjs-no-js">浏览器不支援Javscript，请至设定开启Javascript</p>';
        html += '	<p>主播正在准备中，请耐心等候</p>'
        html += '</video>';
        config.element.html(html);
        video = videojs("live_video", options, function () {
            if (status) {
                // 初始化视频
                video.play();
                // 初始化错误插件
                video.errors();
                // 初始化错误信息
                video.errors.extend(errors);
                // 初始化加载超时时间
                video.errors.timeout(60 * 1000);
            }
        });
        //	視頻事件監聽
        // this._video.on(['loadstart', 'play', 'playing', 'firstplay', 'pause', 'ended', 'adplay', 'adplaying', 'adfirstplay', 'adpause', 'adended', 'contentplay', 'contentplaying', 'contentfirstplay', 'contentpause', 'contentended', 'contentupdate'], function(e) {
        // 	console.warn('VIDEOJS player event: ',  e.type);
        // });
        video.on('loadstart', function () {
            $(".vjs-big-play-button").hide();
        });
        video.on("pause", function () {
            video.one("play", function () {
                video.src({
                    type: video.currentType(),
                    src: video.currentSrc()
                });
            });
        });
        return video
    },

    //传入 input 类名数组 清除其值
    clear: function (arg) {
        $.each(arg, function (i, o) {
            $("." + o).val("")
        })
    },

    //获取今天第一毫秒
    todayTS: function () {
        var now = new Date();
        now.setHours(0, 0, 0, 0);
        return now.getTime();
    },

    //获取今天最后毫秒
    todayTE: function () {
        var now = new Date();
        now.setHours(24, 0, 0, 0);
        return now.getTime() - 1;
    },

    //设置页面title
    setTitle: function (title) {
        $(document).attr("title", title);
    },

    //刷新jqgird表的统一方法
    flushTable: function (element, url, data) {
        $("#" + element).jqGrid('setGridParam', {
            url: url,
            datatype: 'json',
            postData: data,
            page: $('#' + element).getGridParam('page'),
        }).trigger("reloadGrid");
    },

    /**
     *  获取本月天数
     */
    getMonthDays: function () {
        var d = new Date();
        var monthDays = new Date(d.getFullYear(), (d.getMonth() + 1), 0).getDate();
        return monthDays
    },

    /**
     *  判断是否大于一个月
     */
    isExceedMonth: function (sDate, endDate) {
        var sDate = new Date(sDate);
        var eDate = new Date(endDate);

        if (eDate.getFullYear() - sDate.getFullYear() > 1) { //先比较年
            return true;
        } else if (eDate.getMonth() - sDate.getMonth() > 1) { //再比较月
            return true;
        } else if (eDate.getMonth() - sDate.getMonth() == 1) {
            if (eDate.getDate() - sDate.getDate() >= 1) {
                return true;
            } else if (eDate.getDate() - sDate.getDate() <= 0) {
                return true
            }
        } else if (eDate.getFullYear() - sDate.getFullYear() == 1) {
            if (eDate.getMonth() + 12 - sDate.getMonth() > 1) {
                return true;
            } else if (eDate.getDate() - sDate.getDate() >= 1) {
                return true;
            }
        }
        return false;
    },

    // 中文转uncode
    encodeUnicode: function (str) {
        var res = [];
        for (var i = 0; i < str.length; i++) {
            res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
        }
        return "\\u" + res.join("\\u");
    },

    // 判断是否有中文
    isChineseChar: function (str) {
        return global.regex.chineseChar.test(str);
    },

    // 筛选emOji表情图
    filterEmoji: function (str) {
        var textIndexArr = [];
        var emoJistr, emojiUrlArr = [],
            newStr = "";
        var replaceText = str.replace(global.regex.emoJi, '&');

        // 拿到下标
        for (var i = 0, l = replaceText.length; i < l; i++) {
            if (replaceText[i] === "&") {
                textIndexArr.push(i)
            }
        }

        // 拿掉emoji表情
        for (var ij = 0, ik = textIndexArr.length; ij < ik; ij++) {
            if (ij === 0) {
                emoJistr = str.substring(textIndexArr[ij], textIndexArr[ij] + 2);
            } else {
                textIndexArr[ij] = textIndexArr[ij] + ij;
                emoJistr = str.substring(textIndexArr[ij], textIndexArr[ij] + 2)
            }

            if (emojiObj[this.encodeUnicode(emoJistr)]) {
                emoji = emojiObj[this.encodeUnicode(emoJistr)] ? emojiObj[this.encodeUnicode(emoJistr)].url : emoJistr;
                emojiUrlArr.push(emoji);
            } else {
                emojiUrlArr.push(emoJistr);
            }
        }

        // 拿到最新的字符串
        var index = -1;
        var text;
        for (var i = 0, l = replaceText.length; i < l; i++) {
            if (replaceText[i] === "&") {
                index++;
                if (emojiUrlArr[index].split(".").length >= 2) {
                    text = "<img src='../../images/emoji/" + emojiUrlArr[index] + "' />";
                } else {
                    text = emojiUrlArr[index];
                }
            } else {
                text = replaceText[i];
            }
            newStr += text;
        }
        return newStr
    },
    //判断是否是图片文件
    isImgFile: function (path) {
        var ImgObj = new Image();
        ImgObj.src = path;
        if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
            return true;
        } else {
            return false;
        }
    },
    //判断是否是图片
    isImg: function (path) {
        var arr = path.split(".")
        var tail = arr[arr.length - 1].toUpperCase()
        if (tail == 'PNG' || tail == 'JPG' || tail == 'GIF' || tail == 'ICO') {
            return true;
        } else {
            return false;
        }
    },
}
