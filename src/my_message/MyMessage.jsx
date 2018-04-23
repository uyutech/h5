/**
 * Created by army8735 on 2017/12/5.
 */

'use strict';

import Message from './Message.jsx';
import SubCmt from '../component/subcmt/SubCmt.jsx';

let offset = 0;
let loading;
let loadEnd;
let ajax;

let currentPriority = 0;
let cacheKey = 'message';

class MyMessage extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      jsBridge.getCache(['my', 'useAuthor'], (data, useAuthor) => {
        if(data) {
          self.myInfo = data;
          self.isAuthor = data.author && data.author.length;
          self.useAuthor = useAuthor;
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
    ajax = $net.postJSON('/h5/my2/messageList', function(res) {
      if(res.success) {
        let data = res.data;
        self.setData(data, 1);
        jsBridge.setPreference(cacheKey, data);

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
    // jsBridge.on('refresh', function(e) {
    //   e.preventDefault();
    //   skip = 0;
    //   loading = loadEnd = false;
    //   self.ref.messages.clearData();
    //   self.load();
    // });
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
    ajax = $net.postJSON('/h5/my2/messageList', { offset }, function(res) {
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
  reply(id) {
    let self = this;
    let subCmt = self.ref.subCmt;
    subCmt.readOnly = false;
    subCmt.focus();
    self.cid = id;
  }
  submit(content) {
    let self = this;
    let subCmt = self.ref.subCmt;
    subCmt.invalid = true;
    jsBridge.showLoading();
    let authorId;
    if(self.useAuthor && self.myInfo && self.myInfo.author && self.myInfo.author.length) {
      authorId = self.myInfo.author[0].id;
    }
    $net.postJSON('/h5/comment2/sub', {
      content,
      id: self.cid,
      authorId,
    }, function(res) {
      jsBridge.hideLoading();
      if(res.success) {
        jsBridge.toast('回复成功');
        subCmt.value = '';
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.hideLoading();
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
    });
  }
  render() {
    return <div class="my-message">
      <h4>圈消息</h4>
      <Message ref="message"
               message="正在加载..."
               on-reply={ this.reply }/>
      <SubCmt ref="subCmt"
              readOnly={ true }
              placeholder="请选择留言回复"
              subText="发送"
              tipText="-${n}"
              on-submit={ this.submit }/>
    </div>;
  }
}

export default MyMessage;
