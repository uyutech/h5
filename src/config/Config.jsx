/**
 * Created by army8735 on 2018/3/11.
 */

'use strict';

let bindName;

let cacheKey = 'bind';
let ajax;
let currentPriority = 0;

class Config extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      jsBridge.on('resume', function(e) {
        if(e.data) {
          if(e.data.bindPhone) {
            self.phone = e.data.bindPhone;
            self.init();
          }
        }
      });
    });
  }
  @bind phone
  @bind weibo
  // @bind message
  // @bind confirm
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
    ajax = $net.postJSON('/h5/passport/bindList', function(res) {
      if(res.success) {
        let data = res.data;
        self.setData(data, 1);

        jsBridge.setPreference(cacheKey, data);
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
    let accountList = data.accountList;
    let oauthList = data.oauthList;
    self.phone = self.weibo = null;
    (accountList || []).forEach((item) => {
      if(item.type === 1) {
        self.phone = item.name;
      }
    });
    (oauthList || []).forEach((item) => {
      if(item.type === 1) {
        self.weibo = item.id;
      }
    });
  }
  bindPhone() {
    let self = this;
    bindName = '手机';
    jsBridge.pushWindow('/phone.html', {
      title: '绑定手机',
    });
  }
  bindWeibo() {
    let self = this;
    bindName = '微博';
    jsBridge.loginWeibo(function(res) {
      if(res.success) {
        jsBridge.showLoading('正在绑定...');
        let openId = res.openId || res.openID;
        let token = res.token;
        $net.postJSON('/h5/passport/bindWeibo', { openId, token }, function(res) {
          if(res.success) {
            self.weibo = res.data;
            self.init();
          }
          else {
            jsBridge.toast(res.message || $util.ERROR_MESSAGE);
          }
          jsBridge.hideLoading();
        }, function(res) {
          jsBridge.toast(res.message || $util.ERROR_MESSAGE);
          jsBridge.hideLoading();
        });
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
    });
  }
  // clickMerge() {
  //   let self = this;
  //   jsBridge.confirm('合并后，会保留此账号之前的作品、发言、圈币和收藏数据~之后再以此账号登录时会直接进入当前账号哦！确定进行合并吗？', function(res) {
  //     if(!res) {
  //       return;
  //     }
  //     jsBridge.showLoading();
  //     $net.postJSON('/h5/passport/mergeOauth', {
  //       code: bindUuid,
  //       type: 1,
  //     }, function(res) {
  //       if(res.success) {
  //         jsBridge.toast('绑定成功');
  //         self.confirm = false;
  //         self.weibo = openId;
  //       }
  //       else {
  //         jsBridge.toast(res.message);
  //       }
  //       jsBridge.hideLoading();
  //     }, function(res) {
  //       jsBridge.toast(res.message || $util.ERROR_MESSAGE);
  //       jsBridge.hideLoading();
  //     });
  //   });
  // }
  // clickBind() {
  //   let self = this;
  //   jsBridge.confirm('该操作将注销之前的账号哦~', function(res) {
  //     if(!res) {
  //       return;
  //     }
  //     jsBridge.showLoading();
  //     $net.postJSON('/h5/passport/mergeOauth', {
  //       code: bindUuid,
  //       type: 2,
  //     }, function(res) {
  //       if(res.success) {
  //         jsBridge.toast('绑定成功');
  //         self.confirm = false;
  //         self.weibo = openId;
  //       }
  //       else {
  //         jsBridge.toast(res.message);
  //       }
  //       jsBridge.hideLoading();
  //     }, function(res) {
  //       jsBridge.toast(res.message || $util.ERROR_MESSAGE);
  //       jsBridge.hideLoading();
  //     });
  //   });
  // }
  // clickCancel() {
  //   this.confirm = false;
  // }
  clickPhone(e) {
    e.preventDefault();
    if(!this.phone) {
      this.bindPhone();
    }
  }
  clickWeibo(e) {
    e.preventDefault();
    if(!this.weibo) {
      this.bindWeibo();
    }
  }
  clickLink(e, vd, tvd) {
    e.preventDefault();
    jsBridge.pushWindow(tvd.props.href, {
      title: '屏蔽设置',
    });
  }
  clickOut() {
    let self = this;
    $net.postJSON('/h5/passport/loginOut', function() {
      $.cookie('isLogin', null);
      jsBridge.loginOut();
      jsBridge.delPreference(cacheKey);
      jsBridge.delPreference('myAddress');
      jsBridge.delPreference('myFavor');
      jsBridge.delPreference('myMessage');
      jsBridge.delPreference('myMessage2');
      jsBridge.delPreference('myComment');
      jsBridge.delPreference('myPost');
      jsBridge.delPreference('myRelation');
      jsBridge.delPreference('my', function() {
        jsBridge.popWindow({
          loginOut: true,
        });
      });
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
    });
  }
  render() {
    return <div class="config">
      <div class="c">
        <ul class="list">
          <li><a href="#"
                 onClick={ this.clickPhone }
                 class={ 'phone' + (this.phone ? ' has' : '') }>{ this.phone ? ('已绑手机：' + this.phone) : '绑定手机' }</a></li>
          <li><a href="#"
                 onClick={ this.clickWeibo }
                 class={ 'weibo' + (this.weibo ? ' has' : '') }>{ this.weibo ? ('已绑微博：' + this.weibo) : '绑定微博' }</a></li>
        </ul>
      </div>
      <div class="bot">
        <span class="out"
              onClick={ this.clickOut }>退出登录</span>
      </div>
      {/*<div class={ 'confirm' + (this.confirm ? '' : ' fn-hide') }>*/}
        {/*<div class="c">*/}
          {/*<p>{ this.message }</p>*/}
          {/*<strong>请问这是您之前的账号吗？</strong>*/}
          {/*<button onClick={ this.clickMerge }>是的，我想要合并两个账号</button>*/}
          {/*<button onClick={ this.clickBind }>不是的，我只要绑定就可以了</button>*/}
          {/*<button onClick={ this.clickCancel }>算了，还是维持现状吧</button>*/}
        {/*</div>*/}
      {/*</div>*/}
    </div>;
  }
}

export default Config;
