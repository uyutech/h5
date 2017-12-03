/**
 * Created by army8735 on 2017/9/5.
 */

export default {
  isLyrics: function(s) {
    return /\[\d{2,}:\d{2}\.\d{2,3}]/.test(s);
  },
  parse: function(s) {
    let match = s.match(/\[\d{2,}:\d{2}\.\d{2,3}].*/g);
    return match.map(function(item) {
      let time = item.slice(1, item.indexOf(']'));
      let times = time.split(/[^\d]/g);
      let ms = times[2];
      let timestamp = parseInt(times[0]) * 60 * 1000 + parseInt(times[1]) * 1000 + (ms.length === 3 ? parseInt(ms) : parseInt(ms) * 10);
      let txt = item.slice(item.indexOf(']') + 1);
      // console.log(time, timestamp, txt);
      return {
        time,
        timestamp,
        txt,
      };
    });
  },
  getTxt: function(s) {
    return s.replace(/\[\d{2,}:\d{2}\.\d{2,3}]/g, '').replace(/\[\w+:\w+]/g, '');
  }
};
