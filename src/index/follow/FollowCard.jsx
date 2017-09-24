/**
 * Created by army on 2017/6/18.
 */

import Carousel from './Carousel.jsx';
import FollowList from './FollowList.jsx';
import Dynamic from '../../component/dynamic/Dynamic.jsx';

let json = {
  "success": true,
  "message": "",
  "code": 0,
  "data": {
    "GetUserFollowTag": {
      "Size": 5,
      "data": [{"ID": 1, "Tag_Name": "青云志", "Tag_Pic": null}, {"ID": 2, "Tag_Name": "李清照", "Tag_Pic": null}, {
        "ID": 3,
        "Tag_Name": "剑三",
        "Tag_Pic": null
      }, {"ID": 4, "Tag_Name": "秦时明月", "Tag_Pic": null}, {"ID": 7, "Tag_Name": "天涯明月刀OL", "Tag_Pic": null}]
    },
    "GetUserFollowWorks": {
      "Size": 102,
      "data": [{
        "ID": 2756,
        "Tag_Name": "失落之都 古风版",
        "Tag_Pic": "http://wx2.sinaimg.cn/mw690/006g1aHXly1ffiuk2awk5j30m809gdhp.jpg"
      }, {
        "ID": 2755,
        "Tag_Name": "月见",
        "Tag_Pic": "http://wx2.sinaimg.cn/mw690/006g1aHXly1ffiuk2awk5j30m809gdhp.jpg"
      }, {
        "ID": 2754,
        "Tag_Name": "Leviria",
        "Tag_Pic": "http://wx2.sinaimg.cn/mw690/006g1aHXly1ffiuk2awk5j30m809gdhp.jpg"
      }, {
        "ID": 2753,
        "Tag_Name": "无尽长空",
        "Tag_Pic": "http://wx2.sinaimg.cn/mw690/006g1aHXly1ffiuk2awk5j30m809gdhp.jpg"
      }, {
        "ID": 2752,
        "Tag_Name": "祈愿之诗",
        "Tag_Pic": "http://wx2.sinaimg.cn/mw690/006g1aHXly1ffiuk2awk5j30m809gdhp.jpg"
      }, {
        "ID": 2751,
        "Tag_Name": "海风诗章",
        "Tag_Pic": "http://wx2.sinaimg.cn/mw690/006g1aHXly1ffiuk2awk5j30m809gdhp.jpg"
      }, {
        "ID": 2750,
        "Tag_Name": "深渊絮语",
        "Tag_Pic": "http://wx2.sinaimg.cn/mw690/006g1aHXly1ffiuk2awk5j30m809gdhp.jpg"
      }, {
        "ID": 2749,
        "Tag_Name": "潮汐赞歌",
        "Tag_Pic": "http://wx2.sinaimg.cn/mw690/006g1aHXly1ffiuk2awk5j30m809gdhp.jpg"
      }, {
        "ID": 2748,
        "Tag_Name": "无题",
        "Tag_Pic": "http://wx2.sinaimg.cn/mw690/006g1aHXly1ffiuk2awk5j30m809gdhp.jpg"
      }, {
        "ID": 2747,
        "Tag_Name": "Leviria～沉睡之星",
        "Tag_Pic": "http://wx2.sinaimg.cn/mw690/006g1aHXly1ffiuk2awk5j30m809gdhp.jpg"
      }]
    },
    "GetUserFollowAuthor": {
      "Size": 4,
      "data": [{
        "ID": 7,
        "Tag_Name": "红烧狮子头",
        "Tag_Pic": "http://wsing.bssdl.kugou.com/dc12ef0ce0b4924a7e9505be9cc218b2.jpg_180x180.jpg"
      }, {
        "ID": 1,
        "Tag_Name": "河图",
        "Tag_Pic": "http://img5.5sing.kgimg.com/force/T10qdKBXAT1RXrhCrK_180_180.jpg"
      }, {
        "ID": 2,
        "Tag_Name": "司夏",
        "Tag_Pic": "http://wsing.bssdl.kugou.com/46787a7bb70e9a0f308c5068376240d6.jpg_180_180.jpg"
      }, {"ID": 3, "Tag_Name": "喵☆酱", "Tag_Pic": null}]
    },
    "GetAuthorDynamic": {
      "Size": 4,
      "data": [{
        "AuthorID": 1,
        "AuthorHeadUrl": "http://img5.5sing.kgimg.com/force/T10qdKBXAT1RXrhCrK_180_180.jpg",
        "AuthorName": "河图",
        "DynamicContent": "发布了一条微博",
        "DynamicFrom": "weibo",
        "DynamicPic": "http://tvax1.sinaimg.cn/crop.0.0.1242.1242.180/006Rjkbvly8fh9fvke1hrj30yi0yitab.jpg",
        "DynamicUrl": "http://weibo.com/u/1750157883?refer_flag=1001030101_&is_hot=1#_rnd1502956487472",
        "SendTime": "2017/8/17 15:45:17"
      }, {
        "AuthorID": 1,
        "AuthorHeadUrl": "http://img5.5sing.kgimg.com/force/T10qdKBXAT1RXrhCrK_180_180.jpg",
        "AuthorName": "河图",
        "DynamicContent": "发布了一条微博",
        "DynamicFrom": "weibo",
        "DynamicPic": "http://tvax1.sinaimg.cn/crop.0.0.1242.1242.180/006Rjkbvly8fh9fvke1hrj30yi0yitab.jpg",
        "DynamicUrl": "http://weibo.com/u/1750157883?refer_flag=1001030101_&is_hot=1#_rnd1502956487472",
        "SendTime": "2017/8/17 15:45:17"
      }, {
        "AuthorID": 2,
        "AuthorHeadUrl": "http://wsing.bssdl.kugou.com/46787a7bb70e9a0f308c5068376240d6.jpg_180_180.jpg",
        "AuthorName": "司夏",
        "DynamicContent": "发布了一条微博",
        "DynamicFrom": "weibo",
        "DynamicPic": "http://tvax1.sinaimg.cn/crop.0.0.1242.1242.180/006Rjkbvly8fh9fvke1hrj30yi0yitab.jpg",
        "DynamicUrl": "http://weibo.com/u/1750157883?refer_flag=1001030101_&is_hot=1#_rnd1502956487472",
        "SendTime": "2017/8/17 15:45:17"
      }, {
        "AuthorID": 2,
        "AuthorHeadUrl": "http://wsing.bssdl.kugou.com/46787a7bb70e9a0f308c5068376240d6.jpg_180_180.jpg",
        "AuthorName": "司夏",
        "DynamicContent": "发布了一条微博",
        "DynamicFrom": "weibo",
        "DynamicPic": "http://tvax1.sinaimg.cn/crop.0.0.1242.1242.180/006Rjkbvly8fh9fvke1hrj30yi0yitab.jpg",
        "DynamicUrl": "http://weibo.com/u/1750157883?refer_flag=1001030101_&is_hot=1#_rnd1502956487472",
        "SendTime": "2017/8/17 15:45:17"
      }]
    }
  }
};

class FollowCard extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    this.on(migi.Event.DOM, function() {
      let data = json.data;
      self.ref.carousel.list = data.GetUserFollowWorks.data;
      self.ref.carousel.init();
      self.ref.followList.list1 = data.GetUserFollowTag.data;
      self.ref.followList.autoWidth1();
      self.ref.followList.list2 = data.GetUserFollowAuthor.data;
      self.ref.followList.autoWidth2();
      self.ref.dynamic.list = data.GetAuthorDynamic.data;
      // util.postJSON('api/follow/GetUserFollow', { TagSkip: 0, TagTake: 10, AuthorSkip: 0, AuthorTake: 10, WorksSkip: 0, WorksTake: 10, DynamicSkip: 0, DynamicTake: 10 }, function(res) {
      //   if(res.success) {
      //     let data = res.data;
      //     self.ref.carousel.list = data.GetUserFollowWorks.data;
      //     self.ref.carousel.init();
      //     self.ref.followList.list1 = data.GetUserFollowTag.data;
      //     self.ref.followList.autoWidth1();
      //     self.ref.followList.list2 = data.GetUserFollowAuthor.data;
      //     self.ref.followList.autoWidth2();
      //     self.ref.dynamic.list = data.GetAuthorDynamic.data;
      //   }
      //   else {}
      // });
    });
  }
  show() {
    $(this.element).show();
  }
  hide() {
    $(this.element).hide();
  }
  render() {
    return <div class="follow_card">
      <Carousel ref="carousel"/>
      <FollowList ref="followList"/>
      <Dynamic ref="dynamic"/>
    </div>;
  }
}

export default FollowCard;
