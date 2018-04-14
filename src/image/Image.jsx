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
import Comments from '../works/Comments.jsx';
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


let currentPriority = 0;
let cacheKey;

class Image extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  // @bind albumId
  @bind curColumn
  init(albumId) {
    let self = this;
    self.albumId = albumId;
    cacheKey = 'imageAlbumData_' + albumId;
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        try {
          self.setData(cache, 0);
        }
        catch(e) {}
      }
    });
    net.postJSON('/h5/imageAlbum/index', { albumId }, function(res) {
      if(res.success) {
        let data = res.data;
        self.setData(data, 1);
        window.addEventListener('scroll', function() {
          self.checkMore();
        });

        self.ref.comments.listenScroll();
        jsBridge.setPreference(cacheKey, data);
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
    self.load();
  }
  setData(data, priority) {
    if(priority < currentPriority) {
      return;
    }
    currentPriority = priority;

    let self = this;
    let waterFall = self.ref.waterFall;
    let author = self.ref.author;
    let comments = self.ref.comments;

    // 未完成保密
    if(data.info.state === 2) {
      return;
    }

    self.setColumn(data.commentList);

    waterFall.setData(data.imageList.data);

    author.list = data.author;

    comments.setData(self.albumId, data.commentList);
  }
  setColumn(commentList) {
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
      },
      {
        id: 2,
        name: '评论 ' + (commentList ? commentList.count || '' : ''),
      }
    ];
    self.curColumn = 0;
    column.list = list;
  }
  checkMore() {
    let self = this;
    if(loading || loadEnd || !self.visible) {
      return;
    }
    if(util.isBottom()) {
      self.load();
    }
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
  changeColumn(id) {
    let self = this;
    self.curColumn = id;
  }
  comment() {
    let self = this;
    jsBridge.pushWindow('/subcomment.html?type=2&id=' + self.albumId, {
      title: '评论',
      optionMenu: '发布',
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
        <WaterFall ref="waterFall"
                   message="正在加载..."
                   visible={ true }/>
      </div>
      <div class={ 'intro' + (this.curColumn === 1 ? '' : ' fn-hide') }>
        <Author ref="author"/>
      </div>
      <Comments ref="comments"
                @visible={ this.curColumn === 2 }/>
      <InputCmt ref="inputCmt"
                placeholder={ '发表评论...' }
                readOnly={ true }
                on-click={ this.comment }
                on-share={ this.share }/>
      <BotFn ref="botFn"/>
    </div>;
  }
}

export default Image;
