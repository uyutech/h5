/**
 * Created by army8735 on 2018/2/26.
 */

'use strict';

import util from '../common/util';


const FOLLOW_STATE = {
  '01': '未关注',
  '00': '未关注',
  '10': '已关注',
  '11': '互相关注',
};

class Nav extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      jsBridge.on('optionMenu1', function() {
        migi.eventBus.emit('BOT_FN', {
          canFn: true,
          canBlock: true,
          blockText: '加入黑名单',
          canReport: true,
          clickBlock: function(botFn) {
            if(!util.isLogin()) {
              migi.eventBus.emit('NEED_LOGIN');
              return;
            }
            let id = self.id;
            jsBridge.confirm('确认加入黑名单吗？', function(res) {
              if(!res) {
                return;
              }
              $net.postJSON('/h5/user2/black', { id }, function(res) {
                if(res.success) {
                  jsBridge.toast('加入黑名单成功');
                }
                else if(res.code === 1000) {
                  migi.eventBus.emit('NEED_LOGIN');
                }
                else {
                  jsBridge.toast(res.message || util.ERROR_MESSAGE);
                }
                botFn.cancel();
              }, function(res) {
                jsBridge.toast(res.message || util.ERROR_MESSAGE);
                botFn.cancel();
              });
            });
          },
          clickReport: function(botFn) {
            let id = self.id;
            jsBridge.confirm('确认举报吗？', function(res) {
              if(!res) {
                return;
              }
              $net.postJSON('/h5/user2/report', { id }, function(res) {
                if(res.success) {
                  jsBridge.toast('举报成功');
                }
                else {
                  jsBridge.toast(res.message || util.ERROR_MESSAGE);
                }
                botFn.cancel();
              }, function(res) {
                jsBridge.toast(res.message || util.ERROR_MESSAGE);
                botFn.cancel();
              });
            });
          },
        });
      });
    });
  }
  @bind id
  @bind nickname
  @bind headUrl
  @bind sex
  @bind sign
  @bind isFollow
  @bind followPersonCount
  @bind isFans
  @bind fansCount
  setData(data, followPersonCount, fansCount, isFollow, isFans) {
    data = data || {};
    let self = this;
    self.id = data.id;
    self.headUrl = data.headUrl;
    self.nickname = data.nickname;
    self.sex = data.sex;
    self.sign = data.sign;
    self.followPersonCount = followPersonCount;
    self.fansCount = fansCount;
    self.isFollow = isFollow;
    self.isFans = isFans;
  }
  clickFollow() {
    if(!util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    let self = this;
    if(self.isFollow) {
      jsBridge.confirm('确定取关吗？', function(res) {
        if(!res) {
          return;
        }
        self.loading = true;
        $net.postJSON('/h5/user2/unFollow', { id: self.id }, function(res) {
          if(res.success) {
            let data = res.data;
            self.isFollow = data.state;
            self.fansCount = data.count;
            self.emit('follow', data);
          }
          else if(res.code === 1000) {
            migi.eventBus.emit('NEED_LOGIN');
          }
          else {
            jsBridge.toast(res.message || util.ERROR_MESSAGE);
          }
          self.loading = false;
        }, function(res) {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
          self.loading = false;
        });
      });
    }
    else {
      self.loading = true;
      $net.postJSON('/h5/user2/follow', { id: self.id } , function(res) {
        if(res.success) {
          let data = res.data;
          self.isFollow = data.state;
          self.fansCount = data.count;
          self.emit('follow', data);
        }
        else if(res.code === 1000) {
          migi.eventBus.emit('NEED_LOGIN');
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
        self.loading = false;
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
        self.loading = false;
      });
    }
  }
  render() {
    return <div class="mod-nav">
      <div class="profile">
        <div class="pic">
          <img src={ util.img(this.headUrl, 288, 288, 80) || '/src/common/head.png' }/>
        </div>
        <div class="txt">
          <div class="n">
            <h3>{ this.nickname }</h3>
          </div>
          <p>uid: { (this.id ? this.id.toString() : '').replace(/^20180*/, '') }</p>
        </div>
        <button class={ 's' + (this.isFollow ? '1' : '0') + (this.isFans ? '1' : '0') + (this.loading ? ' loading' : '') }
                onClick={ this.clickFollow }>{ FOLLOW_STATE[(this.isFollow ? '1' : '0') + (this.isFans ? '1' : '0')] }</button>
      </div>
      <ul class="num">
        <li>关注<strong>{ this.followPersonCount || 0 }</strong></li>
        <li>粉丝<strong>{ this.fansCount || 0 }</strong></li>
      </ul>
      <div class="sign">
        <label>签名</label>
        <span>{ this.sign || '' }</span>
      </div>
    </div>;
  }
}

export default Nav;
