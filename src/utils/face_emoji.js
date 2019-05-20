//表情对应字符
var emojiObj = {
    "\\ud83d\\ude0a": {
        "phrase": "\xF0\x9F\x98\x8A",
        "phrase_h": "\ud83d\ude0a",
        "url": "1.gif",
        "text": "微笑",
        "emoji": "😊"
    },
    "\\ud83d\\ude16": {
        "phrase": "\xF0\x9F\x98\x96",
        "phrase_h": "\ud83d\ude16",
        "url": "2.gif",
        "text": "撇嘴",
        "emoji": "😕"
    },
    "\\ud83d\\ude0d": {
        "phrase": "\xF0\x9F\x98\x8D",
        "phrase_h": "\ud83d\ude0d",
        "url": "3.gif",
        "text": "喜欢",
        "emoji": "😍"
    },
    "\\ud83d\\ude33": {
        "phrase": "\xF0\x9F\x98\xB3",
        "phrase_h": "\ud83d\ude33",
        "url": "4.gif",
        "text": "发呆",
        "emoji": "😳"
    },
    "\\ud83d\\ude2d": {
        "phrase": "\xF0\x9F\x98\xAD",
        "phrase_h": "\ud83d\ude2d",
        "url": "5.gif",
        "text": "大哭",
        "emoji": "😭"
    },
    "\\ud83d\\udc69": {
        "phrase": "\xF0\x9F\x91\xA9",
        "phrase_h": "\ud83d\udc69",
        "url": "6.gif",
        "text": "害羞",
        "emoji": "👩"
    },
    "\\ud83d\\ude20": {
        "phrase": "\xF0\x9F\x98\xA0",
        "phrase_h": "\ud83d\ude20",
        "url": "7.gif",
        "text": "闭嘴",
        "emoji": "😠"
    },
    "\\ud83d\\ude34": {
        "phrase": "\xF0\x9F\x98\xB4",
        "phrase_h": "\ud83d\ude34",
        "url": "8.gif",
        "text": "睡觉",
        "emoji": "😴"
    },
    "\\ud83d\\ude22": {
        "phrase": "\xF0\x9F\x98\xA2",
        "phrase_h": "\ud83d\ude22",
        "url": "9.gif",
        "text": "哭泣",
        "emoji": "😢"
    },
    "\\ud83d\\ude05": {
        "phrase": "\xF0\x9F\x98\x85",
        "phrase_h": "\ud83d\ude05",
        "url": "10.gif",
        "text": "尴尬",
        "emoji": "😅"
    },
    "\\ud83d\\ude21": {
        "phrase": "\xF0\x9F\x98\xA1",
        "phrase_h": "\ud83d\ude21",
        "url": "11.gif",
        "text": "发怒",
        "emoji": "😡"
    },
    "\\ud83d\\ude1d": {
        "phrase": "\xF0\x9F\x98\x9D",
        "phrase_h": "\ud83d\ude1d",
        "url": "12.gif",
        "text": "调皮",
        "emoji": "😝"
    },
    "\\ud83d\\ude01": {
        "phrase": "\xF0\x9F\x98\x81",
        "phrase_h": "\ud83d\ude01",
        "url": "13.gif",
        "text": "撕牙",
        "emoji": "😁"
    },
    "\\ud83d\\ude32": {
        "phrase": "\xF0\x9F\x98\xB2",
        "phrase_h": "\ud83d\ude32",
        "url": "14.gif",
        "text": "惊讶",
        "emoji": "😲"
    },
    "\\ud83d\\ude2b": {
        "phrase": "\xF0\x9F\x98\xAB",
        "phrase_h": "\ud83d\ude2b",
        "url": "15.gif",
        "text": "难过",
        "emoji": "😫"
    },
    "\\ud83d\\ude13": {
        "phrase": "\xF0\x9F\x98\x93",
        "phrase_h": "\ud83d\ude13",
        "url": "16.gif",
        "text": "冷汗",
        "emoji": "😓"
    },
    "\\ud83d\\ude23": {
        "phrase": "\xF0\x9F\x98\xA3",
        "phrase_h": "\ud83d\ude23",
        "url": "17.gif",
        "text": "抓狂",
        "emoji": "😣"
    },
    "\\ud83d\\ude4a": {
        "phrase": "\xF0\x9F\x99\x8A",
        "phrase_h": "\ud83d\ude4a",
        "url": "18.gif",
        "text": "呕吐",
        "emoji": "🙊"
    },
    "\\ud83d\\ude06": {
        "phrase": "\xF0\x9F\x98\x86",
        "phrase_h": "\ud83d\ude06",
        "url": "19.gif",
        "text": "偷笑",
        "emoji": "😆"
    },
    "\\ud83d\\ude09": {
        "phrase": "\xF0\x9F\x98\x89",
        "phrase_h": "\ud83d\ude09",
        "url": "20.gif",
        "text": "可爱",
        "emoji": "😉"
    },
    "\\ud83d\\ude1f": {
        "phrase": "\xF0\x9F\x98\x9F",
        "phrase_h": "\ud83d\ude1f",
        "url": "21.gif",
        "text": "白眼",
        "emoji": "🙄️"
    },
    "\\ud83d\\ude1e": {
        "phrase": "\xF0\x9F\x98\x9E",
        "phrase_h": "\ud83d\ude1e",
        "url": "22.gif",
        "text": "委屈",
        "emoji": "😞"
    },
    "\\ud83d\\ude3a": {
        "phrase": "\xF0\x9F\x98\xBA",
        "phrase_h": "\ud83d\ude3a",
        "url": "23.gif",
        "text": "饥饿",
        "emoji": "😺"
    },
    "\\ud83d\\ude2a": {
        "phrase": "\xF0\x9F\x98\xAA",
        "phrase_h": "\ud83d\ude2a",
        "url": "24.gif",
        "text": "困",
        "emoji": "😪"
    },
    "\\ud83d\\ude31": {
        "phrase": "\xF0\x9F\x98\xB1",
        "phrase_h": "\ud83d\ude31",
        "url": "25.gif",
        "text": "恐惧",
        "emoji": "😱"
    },
    "\\ud83d\\ude25": {
        "phrase": "\xF0\x9F\x98\xA5",
        "phrase_h": "\ud83d\ude25",
        "url": "26.gif",
        "text": "流汗",
        "emoji": "😥"
    },
    "\\ud83d\\ude04": {
        "phrase": "\xF0\x9F\x98\x84",
        "phrase_h": "\ud83d\ude04",
        "url": "27.gif",
        "text": "大笑",
        "emoji": "😄"
    },
    "\\ud83d\\udc64": {
        "phrase": "\xF0\x9F\x91\xA4",
        "phrase_h": "\ud83d\udc64",
        "url": "28.gif",
        "text": "大兵",
        "emoji": "👤"
    },
    "\\ud83d\\udcaa": {
        "phrase": "\xF0\x9F\x92\xAA",
        "phrase_h": "\ud83d\udcaa",
        "url": "29.gif",
        "text": "努力",
        "emoji": "💪"
    },
    "\\ud83d\\ude2e": {
        "phrase": "\xF0\x9F\x98\xAE",
        "phrase_h": "\ud83d\ude2e",
        "url": "30.gif",
        "text": "咒骂",
        "emoji": "😮"
    },
    "\\ud83e\\udd14": {
        "phrase": "\xF0\x9F\x98\xB6",
        "phrase_h": "\ud83e\udd14",
        "url": "31.gif",
        "text": "疑问",
        "emoji": "🤔"
    },
    "\\ud83e\\udd2b": {
        "phrase": "\xF0\x9F\x98\xAF",
        "phrase_h": "\ud83e\udd2b",
        "url": "32.gif",
        "text": "嘘",
        "emoji": "🤫"
    },
    "\\ud83d\\udcab": {
        "phrase": "\xF0\x9F\x92\xAB",
        "phrase_h": "\ud83d\udcab",
        "url": "33.gif",
        "text": "晕眩",
        "emoji": "💫"
    },
    "\\ud83d\\ude24": {
        "phrase": "\xF0\x9F\x98\xA4",
        "phrase_h": "\ud83d\ude24",
        "url": "34.gif",
        "text": "非常抓狂",
        "emoji": "😤"
    },
    "\\ud83d\\ude28": {
        "phrase": "\xF0\x9F\x98\xA8",
        "phrase_h": "\ud83d\ude28",
        "url": "35.gif",
        "text": "衰",
        "emoji": "😨"
    },
    "\\ud83d\\udd28": {
        "phrase": "\xF0\x9F\x94\xA8",
        "phrase_h": "\ud83d\udd28",
        "url": "36.gif",
        "text": "敲打",
        "emoji": "🔨"
    },
    "\\ud83d\\udc4b": {
        "phrase": "\xF0\x9F\x91\x8B",
        "phrase_h": "\ud83d\udc4b",
        "url": "37.gif",
        "text": "再见",
        "emoji": "👋"
    },
    "\\ud83d\\udca6": {
        "phrase": "\xF0\x9F\x92\xA6",
        "phrase_h": "\ud83d\udca6",
        "url": "38.gif",
        "text": "擦汗",
        "emoji": "💦"
    },
    "\\ud83d\\udc43": {
        "phrase": "\xF0\x9F\x91\x83",
        "phrase_h": "\ud83d\udc43",
        "url": "39.gif",
        "text": "抠鼻",
        "emoji": "👃"
    },
    "\\ud83d\\ude27": {
        "phrase": "\xF0\x9F\x98\xA7",
        "phrase_h": "\ud83d\ude27",
        "url": "40.gif",
        "text": "糗大了",
        "emoji": "😧"
    },
    "\\ud83d\\ude0f": {
        "phrase": "\xF0\x9F\x98\x8F",
        "phrase_h": "\ud83d\ude0f",
        "url": "41.gif",
        "text": "坏笑",
        "emoji": "😏"
    },
    "\\u2b05\\ufe0f": {
        "phrase": "\xE2\xAC\x85",
        "phrase_h": "\u2b05\ufe0f",
        "url": "42.gif",
        "text": "左哼哼",
        "emoji": "⬅️"
    },
    "\\u27a1\\ufe0f": {
        "phrase": "\xE2\x9E\xA1",
        "phrase_h": "\u27a1\ufe0f",
        "url": "43.gif",
        "text": "右哼哼",
        "emoji": "➡️"
    },
    "\\ud83d\\ude47": {
        "phrase": "\xF0\x9F\x99\x87",
        "phrase_h": "\ud83d\ude47",
        "url": "44.gif",
        "text": "哈切",
        "emoji": "🙇"
    },
    "\\ud83d\\ude12": {
        "phrase": "\xF0\x9F\x98\x92",
        "phrase_h": "\ud83d\ude12",
        "url": "45.gif",
        "text": "鄙视",
        "emoji": "😒"
    },
    "\\ud83d\\ude14": {
        "phrase": "\xF0\x9F\x98\x94",
        "phrase_h": "\ud83d\ude14",
        "url": "46.gif",
        "text": "委屈",
        "emoji": "😔"
    },
    "\\ud83d\\ude35": {
        "phrase": "\xF0\x9F\x98\xB5",
        "phrase_h": "\ud83d\ude35",
        "url": "47.gif",
        "text": "难过",
        "emoji": "😵"
    },
    "\\ud83d\\ude3c": {
        "phrase": "\xF0\x9F\x98\xBC",
        "phrase_h": "\ud83d\ude3c",
        "url": "48.gif",
        "text": "阴险",
        "emoji": "😼"
    },
    "\\ud83d\\ude1a": {
        "phrase": "\xF0\x9F\x98\x9A",
        "phrase_h": "\ud83d\ude1a",
        "url": "49.gif",
        "text": "亲亲",
        "emoji": "😚"
    },
    "\\ud83d\\ude40": {
        "phrase": "\xF0\x9F\x99\x80",
        "phrase_h": "\ud83d\ude40",
        "url": "50.gif",
        "text": "惊吓",
        "emoji": "🙀"
    },
    "\\ud83d\\ude1f": {
        "phrase": "\xF0\x9F\x98\x9F",
        "phrase_h": "\ud83d\ude1f",
        "url": "51.gif",
        "text": "可怜",
        "emoji": "😟"
    },
    "\\ud83d\\ude46": {
        "phrase": "\xF0\x9F\x99\x86",
        "phrase_h": "\ud83d\ude46",
        "url": "52.gif",
        "text": "拥抱",
        "emoji": "🙆"
    },
    "\\ud83c\\udf1b": {
        "phrase": "\xF0\x9F\x8C\x9B",
        "phrase_h": "\ud83c\udf1b",
        "url": "53.gif",
        "text": "月亮",
        "emoji": "🌛"
    },
    "\\ud83c\\udf1e": {
        "phrase": "\xF0\x9F\x8C\x9E",
        "phrase_h": "\ud83c\udf1e",
        "url": "54.gif",
        "text": "太阳",
        "emoji": "🌞"
    },
    "\\ud83d\\udca3": {
        "phrase": "\xF0\x9F\x92\xA3",
        "phrase_h": "\ud83d\udca3",
        "url": "55.gif",
        "text": "炸弹",
        "emoji": "💣"
    },
    "\\ud83d\\udc80": {
        "phrase": "\xF0\x9F\x92\xA3",
        "phrase_h": "\ud83d\udc80",
        "url": "56.gif",
        "text": "骷髅",
        "emoji": "💀"
    },
    "\\ud83d\\udd2a": {
        "phrase": "\xF0\x9F\x94\xAA",
        "phrase_h": "\ud83d\udd2a",
        "url": "57.gif",
        "text": "刀",
        "emoji": "🔪"
    },
    "\\ud83d\\udc37": {
        "phrase": "\xF0\x9F\x90\xB7",
        "phrase_h": "\ud83d\udc37",
        "url": "58.gif",
        "text": "猪",
        "emoji": "🐷"
    },
    "\\ud83c\\udf49": {
        "phrase": "\xF0\x9F\x8D\x89",
        "phrase_h": "\ud83c\udf49",
        "url": "59.gif",
        "text": "西瓜",
        "emoji": "🍉"
    },
    "\\u2615\\ufe0f": {
        "phrase": "\xE2\x98\x95",
        "phrase_h": "\u2615\ufe0f",
        "url": "60.gif",
        "text": "咖啡",
        "emoji": "☕️"
    },
    "\\ud83c\\udf5a": {
        "phrase": "\xF0\x9F\x8D\x9A",
        "phrase_h": "\ud83c\udf5a",
        "url": "61.gif",
        "text": "米饭",
        "emoji": "🍚"
    },
    "\\ud83d\\udc97": {
        "phrase": "\xF0\x9F\x92\x97",
        "phrase_h": "\ud83d\udc97",
        "url": "62.gif",
        "text": "爱心",
        "emoji": "💗"
    },
    "\\ud83d\\udc4d": {
        "phrase": "\xF0\x9F\x91\x8D",
        "phrase_h": "\ud83d\udc4d",
        "url": "63.gif",
        "text": "厉害",
        "emoji": "👍"
    },
    "\\ud83d\\udc4e": {
        "phrase": "\xF0\x9F\x91\x8E",
        "phrase_h": "\ud83d\udc4e",
        "url": "64.gif",
        "text": "不厉害",
        "emoji": "👎"
    },
    "\\ud83e\\udd1d": {
        "phrase": "\xF0\x9F\x91\x90",
        "phrase_h": "\ud83e\udd1d",
        "url": "65.gif",
        "text": "握手",
        "emoji": "🤝"
    },
    "\\u270c\\ufe0f": {
        "phrase": "\xE2\x9C\x8C",
        "phrase_h": "\u270c\ufe0f",
        "url": "66.gif",
        "text": "胜利",
        "emoji": "✌️"
    },
    "\\ud83d\\udc4a": {
        "phrase": "\xE2\x9C\x8A",
        "phrase_h": "\ud83d\udc4a",
        "url": "67.gif",
        "text": "抱拳",
        "emoji": "👊"
    },
    "\\ud83d\\udc49": {
        "phrase": "\xF0\x9F\x91\x89",
        "phrase_h": "\ud83d\udc49",
        "url": "68.gif",
        "text": "过来",
        "emoji": "👉"
    },
    "\\ud83d\\udc4c": {
        "phrase": "\xF0\x9F\x91\x8C",
        "phrase_h": "\ud83d\udc4c",
        "url": "69.gif",
        "text": "好的",
        "emoji": "👌"
    },
    "\\ud83d\\ude45": {
        "phrase": "\xF0\x9F\x91\x86",
        "phrase_h": "\ud83d\ude45",
        "url": "70.gif",
        "text": "错误",
        "emoji": "🙅"
    },
    "\\ud83c\\udf39": {
        "phrase": "\xF0\x9F\x8C\xB9",
        "phrase_h": "\ud83c\udf39",
        "url": "71.gif",
        "text": "花",
        "emoji": "🌹"
    },
    "\\ud83c\\udf43": {
        "phrase": "\xF0\x9F\x8D\x83",
        "phrase_h": "\ud83c\udf43",
        "url": "72.gif",
        "text": "凋谢",
        "emoji": "🍃"
    },
    "\\ud83d\\udc44": {
        "phrase": "\xF0\x9F\x91\x84",
        "phrase_h": "\ud83d\udc44",
        "url": "73.gif",
        "text": "嘴唇",
        "emoji": "👄"
    },
    "\\ud83d\\udc8f": {
        "phrase": "\xF0\x9F\x92\x8F",
        "phrase_h": "\ud83d\udc8f",
        "url": "74.gif",
        "text": "接吻",
        "emoji": "💏"
    },
    "\\ud83d\\ude18": {
        "phrase": "\xF0\x9F\x98\x98",
        "phrase_h": "\ud83d\ude18",
        "url": "75.gif",
        "text": "飞吻",
        "emoji": "😘"
    }
}
