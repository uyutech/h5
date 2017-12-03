/**
 * Created by army8735 on 2017/8/13.
 */

export default {
  workType: function(type) {
    switch (type) {
      case 1111:
        return {
          bigType: 'audio',
          name: '原创音乐',
        };
      case 1112:
        return {
          bigType: 'audio',
          name: '纯音乐',
        };
      case 1113:
        return {
          bigType: 'audio',
          name: '原创伴奏',
        };
      case 2110:
        return {
          bigType: 'video',
          name: '原创视频',
        };
      case 3120:
        return {
          bigType: 'poster',
          name: '海报',
        };
      case 4110:
        return {
          bigType: 'text',
          name: '文案',
        };
      case 4211:
        return {
          bigType: 'lyric',
          name: '原创歌词',
          display: '歌词',
        };
      default:
        return {};
    }
  },
  authorType: [
    [901, 902],
    [423,422],
    [111],
    [115, 113, 112, 114, 151],
    [151],
    [121, 122],
    [411, 421],
    [331],
    [131, 132, 134,133],
    [141],
    [211,213,212,391],
    [317,316,312, 311, 313,314,315],
    [351],
    [331, 332,333]
  ],
};
