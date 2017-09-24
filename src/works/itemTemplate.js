/**
 * Created by army8735 on 2017/8/13.
 */

export default function(workType) {
  switch (workType) {
    case 1111:
      let weight = [111, 151, 112, 113, 114, 411, 121, 122, 123, 131, 132, 133, 134, 135, 141];
      return {
        bigType: 'audio',
        authorSort: function(a, b) {
          return weight.indexOf(a.WorksAuthorType) > weight.indexOf(b.WorksAuthorType);
        }
      };
    case 2111:
      return {
        bigType: 'video',
      };
    default:
      return {

      }
  }
};
