/**
 * Created by army8735 on 2018/2/4.
 */

'use strict';

import util from '../common/util';
import net from '../common/net';

import Column from '../works/Column.jsx';
import Fn from '../component/fn/Fn.jsx';
import WaterFall from '../component/waterfall/WaterFall.jsx';
import Author from '../works/Author.jsx';
import Text from '../works/Text.jsx';
import CommentWrap from '../works/CommentWrap.jsx';
import InputCmt from '../component/inputcmt/InputCmt.jsx';
import BotFn from '../component/botfn/BotFn.jsx';
import BotList from '../component/botlist/BotList.jsx';

let worksDetail;
let workList = [];
let labelList = [];
let take = 20;
let skip = 0;
let sortType = 0;
let tagName = '';
let loadEnd;
let loading;
let ajax;

class Image extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind worksId
  @bind curColumn = 0
  init(worksId) {
    let self = this;
    self.worksId = worksId;
    net.postJSON('/h5/works/index', { worksID: worksId }, function(res) {
      if(res.success) {
        self.setData(res.data);
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
    self.load();
  }
  load() {
    let self = this;
    ajax = net.postJSON('/h5/works/photoList', { worksID: self.worksId, skip, take, sortType, tagName }, function(res) {
      if(res.success) {
        let data = res.data;
        skip += take;
        let waterFall = self.ref.waterFall;
        waterFall.appendData(data.data);
        waterFall.message = self.loadEnd ? '已经到底了' : '';
        if(skip >= data.Size) {
          loadEnd = true;
        }
        else {
          let $window = $(window);
          let WIN_HEIGHT = $window.height();
          $window.on('scroll', function() {
            if(self.curColumn !== 0) {
              return;
            }
            let HEIGHT = $(document.body).height();
            let bool;
            bool = $window.scrollTop() + WIN_HEIGHT + 30 > HEIGHT;
            if(bool) {
              self.loadMore(waterFall);
            }
          });
        }
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  loadMore(waterFall) {
    let self = this;
    if(loading || loadEnd) {
      return;
    }
    loading = true;
    ajax = net.postJSON('/h5/works/photoList', { worksID: self.worksId, skip, take, sortType, tagName }, function(res) {
      if(res.success) {
        let data = res.data;
        skip += take;
        if(skip >= data.Size) {
          loadEnd = true;
        }
        waterFall.appendData(data.data);
        waterFall.message = self.loadEnd ? '已经到底了' : '';
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
      loading = false;
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      loading = false;
    });
  }
  setData(data) {
    worksDetail = data.worksDetail;
    workList = worksDetail.Works_Items || [];
    labelList = data.labelList;
    let commentData = data.commentData;
    jsBridge.setTitle(worksDetail.Title);
    jsBridge.setSubTitle(worksDetail.sub_Title);

    let self = this;
    let fn = self.ref.fn;
    let author = self.ref.author;
    let comment = self.ref.comment;
    let botList = self.ref.botList;

    self.setColumn(commentData);

    if(labelList.length) {
      fn.type = '全部';
      botList.curId = 0;
      botList.list = [{
        id: 0,
        name: '全部',
      }].concat(labelList.map(function(item) {
        return {
          id: item.Tag_Name,
          name: item.Tag_Name,
        };
      }));
    }

    author.list = worksDetail.GroupAuthorTypeHash;
    self.setText(workList);

    comment.worksId = self.worksId;
    comment.setData(commentData);
  }
  setColumn(commentData) {
    let self = this;
    let column = self.ref.column;
    let list = [
      {
        id: 0,
        name: '相册',
      },
      {
        id: 1,
        name: '简介',
      }
    ];
    list.push({
      id: 2,
      name: '评论 ' + (commentData.Count || ''),
    });
    self.curColumn = 0;
    column.list = list;
  }
  setText(list = []) {
    let res = [];
    list.forEach(function(item) {
      let hash = {
        4140: '文案',
        4120: '随笔',
        4210: '诗词',
        4211: '原创歌词',
        4212: '改编歌词',
        4310: '小说',
        4320: '剧本',
        4330: '散文',
        4340: '故事',
      };
      if(hash.hasOwnProperty(item.ItemType)) {
        res.push({
          title: hash[item.ItemType],
          data: item.Text,
        });
      }
    });
    this.ref.text.list = res;
  }
  changeColumn(id) {
    let self = this;
    self.curColumn = id;
  }
  selectType() {
    this.ref.botList.pop = true;
  }
  changeType(curId) {
    let self = this;
    if(ajax) {
      ajax.abort();
    }
    loading = loadEnd = false;
    skip = 0;
    self.ref.waterFall.clearData();
    for(let i = 0, len = labelList.length; i < len; i++) {
      if(labelList[i].Tag_Name === curId) {
        self.ref.fn.type = tagName = labelList[i].Tag_Name;
        self.load();
        return;
      }
    }
    self.ref.fn.type =  '全部';
    tagName = '';
    self.load();
  }
  sort(i) {
    let self = this;
    sortType = i;
    if(ajax) {
      ajax.abort();
    }
    loading = loadEnd = false;
    skip = 0;
    self.ref.waterFall.clearData();
    self.load();
  }
  comment() {
    let self = this;
    if(!self.worksId) {
      return;
    }
    jsBridge.pushWindow('/subcomment.html?type=3&id='
      + self.worksId, {
      title: '评论',
    });
  }
  share() {
    migi.eventBus.emit('SHARE', '/works/' + this.worksId);
  }
  render() {
    return <div class="image">
      <Column ref="column"
              on-change={ this.changeColumn }/>
      <div class={ 'album' + (this.curColumn === 0 ? '' : ' fn-hide') }>
        <Fn ref="fn"
            type="全部"
            on-selectType={ this.selectType }
            on-sort={ this.sort }/>
        <WaterFall ref="waterFall"/>
      </div>
      <div class={ 'intro' + (this.curColumn === 1 ? '' : ' fn-hide') }>
        <Author ref="author"/>
        <Text ref="text"/>
      </div>
      <div class={ 'comment' + (this.curColumn === 2 ? '' : ' fn-hide') }>
        <CommentWrap ref="comment"/>
      </div>
      <InputCmt ref="inputCmt"
                placeholder={ '发表评论...' }
                readOnly={ true }
                on-click={ this.comment }
                on-share={ this.share }/>
      <BotFn ref="botFn"/>
      <BotList ref="botList"
               title="分类"
               on-change={ this.changeType }/>
    </div>;
  }
}

export default Image;
