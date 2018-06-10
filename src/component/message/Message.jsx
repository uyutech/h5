/**
 * Created by army8735 on 2018/2/24.
 */

'use strict';

class Message extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.num = 0;
    function reload() {
      jsBridge.getPreference('message-time', function(res) {
        res = res || 0;
        let now = Date.now();
        if($util.isLogin() && now - res > 10000) {
          $net.postJSON('/h5/my/unreadMessageCount', function(res) {
            if(res.success) {
              self.num = res.data;
              jsBridge.setPreference('message-time', Date.now());
              jsBridge.setPreference('message-count', self.num);
            }
          });
        }
      });
    }
    self.on(migi.Event.DOM, function() {
      reload();
      jsBridge.getPreference('message-count', function(res) {
        res = res || 0;
        self.num = res;
      });
      jsBridge.on('resume', function(e) {
        jsBridge.getPreference('message-count', function(res) {
          res = res || 0;
          self.num = res;
        });
        let data = e.data;
        if(data && data.myMessage) {
          $net.postJSON('/h5/my/unreadMessageCount', function(res) {
            if(res.success) {
              self.num = res.data;
              jsBridge.setPreference('message-time', Date.now());
              jsBridge.setPreference('message-count', self.num);
            }
          });
        }
      });
      migi.eventBus.on('REFRESH_MESSAGE', function() {
        reload();
      });
    });
  }
  @bind num
  click() {
    jsBridge.pushWindow('/my_message.html', {
      title: '圈消息',
    });
  }
  render() {
    return <div class={ 'g-message' + (this.num ? '' : ' fn-hide') }
                onClick={ this.click }>
      <b>{ this.num ? (this.num > 99 ? '99+' : this.num) : '' }</b>
    </div>;
  }
}

export default Message;