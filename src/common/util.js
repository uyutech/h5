/**
 * Created by army on 2017/5/20.
 */

import BigNumber from 'bignumber.js';

let util = {
  isLogin: function() {
    return $.cookie('isLogin') === 'true';
  },
  isIPhone: function(){
    return navigator.appVersion.match(/iphone/gi);
  },
  goto: function(url) {
    location.href = url;
  },
  autoSsl: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return (url || '').replace(/^https?:\/\//i, '//');
  },
  img: function(url) {
    url = url || '';
    url = url.trim();
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? url.replace(/\.(\w+)-\d*_\d*_\d*/, '.$1') : url;
  },
  img1600__80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-1600__80' : url;
  },
  img1296_1296_80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-1296_1296_80' : url;
  },
  img1200__80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-1200__80' : url;
  },
  img980_980_80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-980_980_80' : url;
  },
  img750_750_80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-750_750_80' : url;
  },
  img750__80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-750__80' : url;
  },
  img720__80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-720__80' : url;
  },
  img600_600_80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-600_600_80' : url;
  },
  img600__80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-600__80' : url;
  },
  img480_480_80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-480_480_80' : url;
  },
  img375__80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-375__80' : url;
  },
  img360__80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-360__80' : url;
  },
  img336__80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-336__80' : url;
  },
  img332_332_80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-332_332_80' : url;
  },
  img288__80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-288__80' : url;
  },
  img288_288_80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-288_288_80' : url;
  },
  img250_250_80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-250_250_80' : url;
  },
  img240_240_80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-240_240_80' : url;
  },
  img220_220_80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-240_240_80' : url;
  },
  img208_208_80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-208_208_80' : url;
  },
  img200_200: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-200_200' : url;
  },
  img200_200_80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-200_200_80' : url;
  },
  img192_192: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-192_192' : url;
  },
  img172_172_80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-172_172_80' : url;
  },
  img170_170_80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-170_170_80' : url;
  },
  img160_160_80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-160_160_80' : url;
  },
  img168__80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-168__80' : url;
  },
  img150_150_80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-150_150_80' : url;
  },
  img144_: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-144_' : url;
  },
  img144_144: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-144_144' : url;
  },
  img144_144_80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-144_144_80' : url;
  },
  img132_132_80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-132_132_80' : url;
  },
  img128_128_80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-120_120_80' : url;
  },
  img120_120: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-120_120' : url;
  },
  img120_120_80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-120_120_80' : url;
  },
  img108_108_80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-108_108_80' : url;
  },
  img100_100_80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? url + '-100_100_80' : url;
  },
  img100_100: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-100_100' : url;
  },
  img96_96_80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-90_90' : url;
  },
  img90_90: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-90_90' : url;
  },
  img80_80_80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-80_80_80' : url;
  },
  img64_64_80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-64_64_80' : url;
  },
  img60_60: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-60_60' : url;
  },
  img60_60_80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-60_60_80' : url;
  },
  img__60: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-__60' : url;
  },
  img48_48_80: function(url) {
    if(!/\/\/zhuanquan\./i.test(url)) {
      return url;
    }
    return url ? util.img(url) + '-48_48_80' : url;
  },
  decode: function(str) {
    return str.replace(/&lt;/g, '<').replace(/&amp;/g, '&');
  },
  formatTime: function(time) {
    if(!time) {
      return '00:00';
    }
    let res = '';
    if(time >= 60 * 60) {
      let hour = Math.floor(time / (60 * 60));
      time -= 60 * 60 * hour;
      res += hour + ':';
    }
    if(time >= 60) {
      let minute = Math.floor(time / 60);
      time -= 60 * minute;
      if(minute < 10) {
        minute = '0' + minute;
      }
      res += minute + ':';
    }
    else {
      res += '00:';
    }
    let second = Math.floor(time);
    if(second < 10) {
      second = '0' + second;
    }
    res += second;
    return res;
  },
  formatDate: function(time) {
    time = time.replace(/-/g, '/');
    time = new Date(time);
    let now = Date.now();
    let diff = now - time;
    if(diff >= 1000 * 60 * 60 * 24 * 365) {
      return Math.floor(diff / (1000 * 60 * 60 * 24 * 365)) + '年前';
    }
    if(diff >= 1000 * 60 * 60 * 24 * 30) {
      return Math.floor(diff / (1000 * 60 * 60 * 24 * 30)) + '月前';
    }
    if(diff >= 1000 * 60 * 60 * 24) {
      return Math.floor(diff / (1000 * 60 * 60 * 24)) + '天前';
    }
    if(diff >= 1000 * 60 * 60) {
      return Math.floor(diff / (1000 * 60 * 60)) + '小时前';
    }
    if(diff >= 1000 * 60) {
      return Math.floor(diff / (1000 * 60)) + '分钟前';
    }
    return '刚刚';
  },
  abbrNum: function(n, fix) {
    if(!n) {
      return 0;
    }
    if(n >= 10000) {
      n = new BigNumber(n).div(10000).toFixed(fix || 1);
      n = n.replace(/(\.[1-9]+)0+$/, '$1');
      n = n.replace(/\.0+$/, '');
      n += 'w';
    }
    if(n >= 1000) {
      n = new BigNumber(n).div(1000).toFixed(fix || 1);
      n = n.replace(/(\.[1-9]+)0+$/, '$1');
      n = n.replace(/\.0+$/, '');
      n += 'k';
    }
    return n;
  },
  ERROR_MESSAGE: '人气大爆发，请稍后再试。',
  scrollTop: function(y) {
    $(window).scrollTop(y - 70);
  },
  openAuthor: function(data) {
    jsBridge.pushWindow(data.url || ('/author.html?authorId=' + data.authorId), {
      transparentTitle: true,
    });
  },
  openWorks: function(data, option) {
    option = option || {};
    option.title = data.title;
    option.subTitle = data.subTitle;
    jsBridge.pushWindow(data.url || ('/works.html?worksId=' + data.worksId + '&workId=' + data.workId), option);
  },
  getWorksUrl: function(worksId, worksType, workId) {
    if([11, 12].indexOf(worksType) > -1) {
      return '/image.html?worksId=' + worksId;
    }
    else if([5, 6].indexOf(worksType) > -1) {
      return '/music.html?worksId=' + worksId;
    }
    else {
      return '/works.html?worksId=' + worksId + (workId ? '&workId=' + workId : '');
    }
  },
  getWorksUrlOption: function(worksType) {
    if([11, 12].indexOf(worksType) > -1) {
      return {};
    }
    return {
      transparentTitle: true,
      optionMenuIcon1: 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAALVBMVEUAAAAAAAAAAAAAAAD+/v4AAAD5+fnk5OTq6uoAAAAwMDAAAAAAAACAgID///8waL84AAAADnRSTlMABxEL8BqUoZ0nIiITDIsBZnQAAABpSURBVEjHYxgFgxYICuKXl01xu4hPnlHs3btEAXwKTN69c8anQFDl3TsnfK4Q1nj3rskQnwlaJe6L8CpQ3Tk7CJ8VjDahoYfx+kJYSclQAG9AChsKEgxqCgHjaGyOxuZobA7K2BwFNAMAj1k2xo1Ti1oAAAAASUVORK5CYII=',
    };
  },
  uniqueList: function(list) {
    list = list || [];
    let hash = {};
    let res = [];
    list.forEach(function(item) {
      if(hash[item]) {
        return;
      }
      hash[item] = true;
      res.push(item);
    });
    return res;
  },
};

export default util;
