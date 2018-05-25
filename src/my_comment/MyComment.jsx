/**
 * Created by army8735 on 2018/5/22.
 */

'use strict';

import Comment from './Comment.jsx';

let offset = 0;
let loading;
let loadEnd;
let ajax;

let currentPriority = 0;
let cacheKey = 'myComment';

class MyMessage extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      jsBridge.getPreference('my', function(my) {
        if(my) {
          self.myInfo = my;
          self.isAuthor = my.author && my.author.length;
          if(self.isAuthor) {
            jsBridge.getPreference('useAuthor', function(useAuthor) {
              self.useAuthor = useAuthor;
            });
          }
        }
      });
    });
  }
  init() {
    let self = this;
    if(ajax) {
      ajax.abort();
    }
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        self.setData(cache, 0);
      }
    });
    ajax = $net.postJSON('/h5/my/commentList', function(res) {
      if(res.success) {
        let data = res.data;
        jsBridge.setPreference(cacheKey, data);
        self.setData(data, 1);

        window.addEventListener('scroll', function() {
          self.checkMore();
        });
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
    });
  }
  setData(data, priority) {
    priority = priority || 0;
    if(priority < currentPriority) {
      return;
    }
    currentPriority = priority;

    let self = this;
    let message = self.ref.message;

    message.setData(data.data);
    offset = data.limit;
    if(data.count === 0) {
      loadEnd = true;
      message.message = '暂无消息';
    }
    else if(offset >= data.count) {
      loadEnd = true;
      message.message = '已经到底了';
    }
  }
  checkMore() {
    let self = this;
    if(loading || loadEnd) {
      return;
    }
    if($util.isBottom()) {
      self.load();
    }
  }
  load() {
    let self = this;
    if(ajax) {
      ajax.abort();
    }
    let message = self.ref.message;
    loading = true;
    ajax = $net.postJSON('/h5/my/messageList', { offset }, function(res) {
      if(res.success) {
        let data = res.data;
        message.appendData(data.data);
        offset += data.limit;
        if(offset >= data.count) {
          loadEnd = true;
          message.message = '已经到底了';
        }
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
      loading = false;
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      loading = false;
    });
  }
  reply(type, id, pid) {
    if(type === 4) {
      type = 3;
    }
    jsBridge.pushWindow('/sub_comment.html?type=' + type + '&id=' + id + '&pid=' + pid, {
      title: '评论',
      optionMenu: '发布',
    });
  }
  render() {
    return <div class="my-comment">
      <h4>圈消息</h4>
      <Comment ref="message"
               message="正在加载..."
               on-reply={ this.reply }/>
    </div>;
  }
}

export default MyMessage;
