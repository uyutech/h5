/**
 * Created by army8735 on 2017/12/5.
 */

'use strict';

import Letter from './Letter.jsx';
// import Message from '../component/message/Message.jsx';

let offset = 0;
let loading;
let loadEnd;
let ajax;

let currentPriority = 0;
let cacheKey = 'myMessage';

class MyMessage extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.visible = true;
    self.on(migi.Event.DOM, function() {
      migi.eventBus.on('LOGIN', function() {
        self.init();
      });
      jsBridge.on('resume', function(e) {
        if(e && e.data && e.data.myDialog) {
          let id = e.data.myDialog;
          $net.postJSON('/h5/my/unReadLetterCount', { id }, function(res) {
            if(res.success) {
              self.ref.letter.setNum(id, res.data);
            }
            else {
              jsBridge.toast(res.message || $util.ERROR_MESSAGE);
            }
          }, function(res) {
            jsBridge.toast(res.message || $util.ERROR_MESSAGE);
          });
        }
      });
    });
  }
  @bind visible
  @bind num
  init() {
    let self = this;
    if(!$util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    if(ajax) {
      ajax.abort();
    }
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        self.setData(cache, 0);
      }
    });
    ajax = $net.postJSON('/h5/my/unreadMessageCountWithRecentLetter', function(res) {
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
    self.num = data.count;
    let letter = self.ref.letter;

    letter.setData(data.letter.data);
    offset = data.letter.limit;
    if(data.letter.count === 0) {
      loadEnd = true;
      letter.message = '暂无消息';
    }
    else if(data.letter.count > 5 && offset >= data.letter.count) {
      loadEnd = true;
      letter.message = '已经到底了';
    }
    else {
      loadEnd = true;
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
    let letter = self.ref.letter;
    loading = true;
    ajax = $net.postJSON('/h5/my/recentLetter', { offset }, function(res) {
      if(res.success) {
        let data = res.data;
        letter.appendData(data.data);
        offset += data.limit;
        if(offset >= data.count) {
          loadEnd = true;
          letter.message = '已经到底了';
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
  click(e, vd, tvd) {
    e.preventDefault();
    if(!$util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    let url = tvd.props.href;
    let title = tvd.props.title;
    jsBridge.pushWindow(url, {
      title,
    });
  }
  refresh() {
    let self = this;
    if(ajax) {
      ajax.abort();
    }
    loading = true;
    ajax = $net.postJSON('/h5/my/unreadMessageCountWithRecentLetter', function(res) {
      if(res.success) {
        let data = res.data;
        jsBridge.setPreference(cacheKey, data);
        self.setData(data, 1);
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
      loading = false;
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      loading = false;
    });
    migi.eventBus.emit("REFRESH_MESSAGE");
  }
  render() {
    return <div class={ 'my-message' + (this.visible ? '' : ' fn-hide') }>
      <ul class="list"
          onClick={ { a: this.click } }>
        <li>
          <a href="/my_comment.html"
             title="圈评论">评论</a>
          <small class="num">{ this.num || '' }</small>
        </li>
      </ul>
      <Letter ref="letter"
              message={ '正在加载...' }/>
    </div>;
  }
}

export default MyMessage;
