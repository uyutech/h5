/**
 * Created by army8735 on 2017/12/5.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import Messages from '../component/messages/Messages.jsx';
import SubCmt from '../component/subcmt/SubCmt.jsx';

let take = 10;
let skip = take;
let loading;
let loadEnd;
let ajax;

class Message extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      net.postJSON('/h5/my/message', function(res) {
        if(res.success) {
          let data = res.data;
          self.setData(data);
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      });
      jsBridge.on('refresh', function(e) {
        e.preventDefault();
        skip = 0;
        loading = loadEnd = false;
        self.ref.messages.clearData();
        self.load();
      });
    });
  }
  setData(data) {
    let self = this;
    let messages = self.ref.messages;
    messages.setData(data.data);
    loadEnd = data.Size <= take;

    let subCmt = self.ref.subCmt;
    messages.on('comment', function(mid, rid, cid, name, type, tid) {
      subCmt.readOnly = false;
      subCmt.to = name;
      self.messageID = mid;
      self.rootID = rid;
      self.parentID = cid;
      self.type = type;
      self.targetID = tid;
      subCmt.focus();
    });
    subCmt.on('submit', function(content) {
      subCmt.invalid = true;
      let rootID = self.rootID;
      let parentID = self.parentID;
      let url = '';
      if(self.type === 1) {
        url = '/h5/author/addComment';
      }
      else if(self.type === 2) {
        url = '/h5/works/addComment';
      }
      else if(self.type === 3 || self.type === 4) {
        url = '/h5/post/addComment';
      }
      net.postJSON(url, {
        parentID: parentID,
        rootID: rootID,
        worksID: self.targetID,
        authorID: self.targetID,
        postID: self.targetID,
        content,
      }, function(res) {
        if(res.success) {
          subCmt.value = '';
          messages.appendChild(content, self.messageID);
        }
        else if(res.code === 1000) {
          migi.eventBus.emit('NEED_LOGIN');
          subCmt.invalid = false;
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
          subCmt.invalid = false;
        }
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
        subCmt.invalid = false;
      });
    });

    if(loadEnd) {
      return;
    }
    let $window = $(window);
    $window.on('scroll', function() {
      self.checkMore($window);
    });
    self.read(data.data);
  }
  checkMore($window) {
    let self = this;
    if(loading || loadEnd) {
      return;
    }
    let WIN_HEIGHT = $window.height();
    let HEIGHT = $(document.body).height();
    let bool;
    bool = $window.scrollTop() + WIN_HEIGHT + 30 > HEIGHT;
    if(bool) {
      self.load();
    }
  }
  load() {
    let self = this;
    loading = true;
    self.ref.messages.message = '正在加载...';
    if(ajax) {
      ajax.abort();
    }
    ajax = net.postJSON('/h5/my/message', { skip, take }, function(res) {
      if(res.success) {
        let data = res.data;
        skip += take;
        self.ref.messages.appendData(data.data);
        self.read(data.data);
        if(skip >= data.Size) {
          loadEnd = true;
          self.ref.messages.message = '已经到底了';
        }
        else {
          self.ref.messages.message = '';
        }
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
  read(data) {
    let ids = (data || []).filter(function(item) {
      return !item.ISRead;
    }).map(function(item) {
      return item.NotifyID;
    });
    if(ids.length) {
      net.postJSON('/h5/my/readMessage', { ids }, function(res) {
        if(res.success) {
          migi.eventBus.emit('READ_MESSAGE_NUM', ids.length);
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      });
    }
  }
  render() {
    return <div class="message">
      <h4>圈消息</h4>
      <Messages ref="messages"/>
      <SubCmt ref="subCmt"
              readOnly={ true }
              placeholder="请选择留言回复"
              subText="发送"
              tipText="-${n}"/>
    </div>;
  }
}

export default Message;
