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

class Message extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind hasData
  setData(data) {
    let self = this;
    self.data = data;

    self.hasData = true;
    loadEnd = self.data.Size <= take;

    let messages = self.ref.messages;
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
          alert(res.message || util.ERROR_MESSAGE);
          subCmt.invalid = false;
        }
      }, function(res) {
        alert(res.message || util.ERROR_MESSAGE);
        subCmt.invalid = false;
      });
    });

    let $window = $(window);
    $window.on('scroll', function() {
      self.checkMore($window);
    });
    self.read(self.data.data);
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
    net.postJSON('/h5/my/message', { skip, take }, function(res) {
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
  genDom() {
    let self = this;
    return <div>
      <h4>圈消息</h4>
      <Messages ref="messages" dataList={ self.data.data }/>
      <SubCmt ref="subCmt" readOnly={ true } placeholder="请选择留言回复"
              subText="发送" tipText="-${n}"/>
    </div>;
  }
  render() {
    return <div class="message">
      {
        this.hasData
          ? this.genDom()
          : <div>
              <div class="fn-placeholder-tag"/>
              <div class="fn-placeholder-roundlet"/>
              <div class="fn-placeholder"/>
              <div class="fn-placeholder-roundlet"/>
              <div class="fn-placeholder"/>
            </div>
      }
    </div>;
  }
}

export default Message;
