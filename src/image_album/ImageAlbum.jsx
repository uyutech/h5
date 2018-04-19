/**
 * Created by army8735 on 2018/2/4.
 */

'use strict';

import util from '../common/util';


import Column from '../works/Column.jsx';
import WaterFall from '../component/waterfall/WaterFall.jsx';
import Author from '../works/Author.jsx';
import Comments from '../works/Comments.jsx';
import InputCmt from '../component/inputcmt/InputCmt.jsx';
import BotFn from '../component/botfn/BotFn.jsx';

let offset = 0;
let loadEnd;
let loading;
let ajax;


let currentPriority = 0;
let cacheKey;

class ImageAlbum extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  // @bind id
  @bind curColumn
  init(id) {
    let self = this;
    self.id = id;
    cacheKey = 'imageAlbumData_' + id;
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        try {
          self.setData(cache, 0);
        }
        catch(e) {}
      }
    });
    $net.postJSON('/h5/imageAlbum2/index', { id }, function(res) {
      if(res.success) {
        let data = res.data;
        jsBridge.setPreference(cacheKey, data);
        self.setData(data, 1);

        window.addEventListener('scroll', function() {
          self.checkMore();
        });
        self.ref.comments.listenScroll();
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  setData(data, priority) {
    if(priority < currentPriority) {
      return;
    }
    currentPriority = priority;

    let self = this;
    self.data = data;
    let waterFall = self.ref.waterFall;
    let author = self.ref.author;
    let comments = self.ref.comments;

    // 未完成保密
    if(data.info.state === 3) {
      return;
    }

    self.setColumn(data.commentList);

    offset = data.imageList.limit;
    waterFall.setData(data.imageList.data);
    if(offset >= data.imageList.count) {
      loadEnd = true;
      waterFall.message = '已经到底了';
    }
    else {
      loadEnd = false;
      waterFall.message = '正在加载...';
    }

    author.list = data.info.author;

    comments.setData(self.id, data.commentList);
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
    if(self.curColumn === undefined) {
      self.curColumn = 0;
    }
    column.list = list;
  }
  checkMore() {
    let self = this;
    if(loading || loadEnd || self.curColumn !== 0) {
      return;
    }
    if(util.isBottom()) {
      self.load();
    }
  }
  load() {
    let self = this;
    let waterFall = self.ref.waterFall;
    loading = true;console.log(offset);
    ajax = $net.postJSON('/h5/imageAlbum2/imageList', { id: self.id, offset }, function(res) {
      if(res.success) {
        let data = res.data;
        waterFall.appendData(data.data);
        offset += data.limit;
        if(offset >= data.count) {
          loadEnd = true;
          waterFall.message = '已经到底了';
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
  like(id, data) {
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        let has;
        cache.imageList.data.forEach((item) => {
          if(item.work.id === id) {
            has = true;
            item.work.isLike = data.state;
            item.work.likeCount = data.count;
          }
        });
        if(has) {
          jsBridge.setPreference(cacheKey, cache);
        }
      }
    });
  }
  comment() {
    let self = this;
    jsBridge.pushWindow('/sub_comment.html?type=2&id=' + self.id, {
      title: '评论',
      optionMenu: '发布',
    });
  }
  share() {
    let self = this;
    migi.eventBus.emit('BOT_FN', {
      canShare: true,
      canShareWb: true,
      canShareLink: true,
      clickShareWb: function(botFn) {
        if(!self.data) {
          return;
        }
        let url = window.ROOT_DOMAIN + '/imageAlbum/' + self.id;
        let text = '【';
        if(self.data.info.title) {
          text += self.data.info.title;
        }
        if(self.data.info.subTitle) {
          if(self.data.info.subTitle) {
            text += ' ';
          }
          text += self.data.info.subTitle;
        }
        text += '】';
        if(self.data.info.author[0]) {
          self.data.info.author[0].forEach((item) => {
            item.list.forEach((author) => {
              text += author.name + ' ';
            });
          });
        }
        text += '#转圈circling# ';
        text += url;
        jsBridge.shareWb({
          text,
        }, function(res) {
          if(res.success) {
            jsBridge.toast("分享成功");
          }
          else if(res.cancel) {
            jsBridge.toast("取消分享");
          }
          else {
            jsBridge.toast("分享失败");
          }
        });
        botFn.cancel();
      },
      clickShareLink: function(botFn) {
        if(!self.data) {
          return;
        }
        let url = window.ROOT_DOMAIN + '/imageAlbum/' + self.data.id;
        util.setClipboard(url);
        botFn.cancel();
      },
    });
  }
  render() {
    return <div class="image">
      <Column ref="column"
              on-change={ this.changeColumn }/>
      <div class={ 'album' + (this.curColumn === 0 ? '' : ' fn-hide') }>
        <WaterFall ref="waterFall"
                   message="正在加载..."
                   visible={ true }
                   on-like={ this.like }/>
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

export default ImageAlbum;
