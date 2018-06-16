/**
 * Created by army on 2017/5/17.
 */

let rel = 0;

class BotNav extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
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
  click(e, vd, tvd) {
    if(tvd.props.class === 'post') {
      jsBridge.pushWindow('/sub_post.html', {
        title: '画圈',
        showOptionMenu: 'true',
        optionMenu: '发布',
      });
      return;
    }
    let $elem = $(tvd.element);
    if($elem.hasClass('cur')) {
      return;
    }
    $(vd.element).find('.cur').removeClass('cur');
    $elem.addClass('cur');
    rel = tvd.props.rel;
    this.emit('change', rel);
  }
  render() {
    return <ul class="bot-nav"
               onClick={ { li: this.click } }>
      <li class="circling cur" rel={ 1 }>
        <b class="icon"/>
        <span>首页</span>
      </li>
      <li class="message" rel={ 2 }>
        <b class="icon"/>
        <span>消息</span>
        <small class="num">{ this.num || '' }</small>
      </li>
      <li class="post">
        <b class="icon"/>
        <span>画圈</span>
      </li>
      <li class="my" rel={ 3 }>
        <b class="icon"/>
        <span>我的</span>
      </li>
    </ul>;
  }
}

export default BotNav;
