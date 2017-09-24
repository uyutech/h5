/**
 * Created by army8735 on 2017/8/13.
 */

export default function(authorType) {
  switch (authorType) {
    case 111:
      return {
        name: '演唱',
        abbr: '唱',
        css: 'chang',
        labelType: 11,
      };
    case 121:
      return {
        name: '作曲',
        abbr: '曲',
        css: 'qu',
        labelType: 12,
      };
    case 122:
      return {
        name: '编曲',
        abbr: '曲',
        css: 'qu',
        labelType: 13,
      };
    case 411:
      return {
        name: '作词',
        abbr: '文',
        css: 'wen',
        labelType: 14,
      };
    case 131:
      return {
        name: '混音',
        abbr: '混',
        css: 'hun',
        labelType: 15,
      };
    default:
      return {
        name: authorType,
        abbr: authorType,
        css: authorType,
        labelType: -1
      };
  }
};
