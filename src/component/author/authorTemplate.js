/**
 * Created by army8735 on 2017/8/13.
 */

export default function(authorType) {
  switch (authorType) {
    case 111:
      return {
        name: '演唱',
        labelType: 11,
      };
    case 121:
      return {
        name: '作曲',
        labelType: 12,
      };
    case 122:
      return {
        name: '编曲',
        labelType: 13,
      };
    case 411:
      return {
        name: '作词',
        labelType: 14,
      };
    case 131:
      return {
        name: '混音',
        labelType: 15,
      };
    default:
      return {
        name: authorType,
        labelType: -1
      };
  }
};
