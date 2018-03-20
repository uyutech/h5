/**
 * Created by army8735 on 2018/3/11.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';

let loadingUser;
let loadEndUser;
let loadingCircle;
let loadEndCircle;

class Shield extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.type = 0;
    self.on(migi.Event.DOM, function() {
      let $user = $(self.ref.userList.element);
      let $circle = $(self.ref.circleList.element);
      $user.on('click', 'button', function() {
        let $button = $(this);
        let id = $button.attr('rel');
        net.postJSON('/h5/user/unShield', { userId: id }, function(res) {
          if(res.success) {
            jsBridge.toast('解除成功');
            $button.closest('li').remove();
          }
          else {
            jsBridge.toast(res.message || util.ERROR_MESSAGE);
          }
        }, function(res) {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        });
      });
      $circle.on('click', 'button', function() {
        let $button = $(this);
        let id = $button.attr('rel');
        net.postJSON('/h5/circle/unShield', { circleID: id }, function(res) {
          if(res.success) {
            jsBridge.toast('解除成功');
            $button.closest('li').remove();
          }
          else {
            jsBridge.toast(res.message || util.ERROR_MESSAGE);
          }
        }, function(res) {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        });
      });
    });
  }
  @bind type
  @bind message
  @bind message2
  init() {
    let self = this;
    net.postJSON('/h5/my/shield', function(res) {
      if(res.success) {
        let data = res.data;
        self.addUser(data.user);
        self.addCircle(data.circle);
      }
      else {}
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  addUser(data) {
    let self = this;
    let s = '';
    (data.data || []).forEach(function(item) {
      s += self.genUser(item);
    });
    self.ref.userList.element.innerHTML += s;
  }
  genUser(data) {
    return <li>
      <a href={ '/user.html?userID=' + data.UserID } class="pic" title={ data.UserName }>
        <img src={ util.autoSsl(util.img120_120_80(data.HeadUrl) || '/src/common/head.png') }/>
      </a>
      <a href={ '/user.html?userID=' + data.UserID } class="txt" title={ data.UserName }>
        <span class="name">{ data.UserName }</span>
      </a>
      <button rel={ data.UserID }>解除屏蔽</button>
    </li>;
  }
  addCircle(data) {
    let self = this;
    let s = '';
    (data.data || []).forEach(function(item) {
      s += self.genCircle(item);
    });
    self.ref.circleList.element.innerHTML += s;
  }
  genCircle(data) {
    return <li>
      <a href={ '/circle.html?circleId=' + data.CirclingID } class="pic" title={ data.CirclingName }>
        <img src={ util.autoSsl(util.img120_120_80(data.HeadUrl) || '/src/common/head.png') }/>
      </a>
      <a href={ '/circle.html?circleId=' + data.CirclingID } class="txt" title={ data.CirclingName }>
        <span class="name">{ data.CirclingName }</span>
      </a>
      <button rel={ data.CirclingID }>解除屏蔽</button>
    </li>;
  }
  clickTag(e, vd, tvd) {
    this.type = tvd.props.rel;
  }
  render() {
    return <div class="shield">
      <ul class="tag" onClick={ { li: this.clickTag } }>
        <li class={ this.type === 0 ? 'cur' : '' } rel={ 0 }>用户</li>
        <li class={ this.type === 1 ? 'cur' : '' } rel={ 1 }>圈子</li>
      </ul>
      <div class={ 'list' + (this.type === 0 ? '' : ' fn-hide') }>
        <ul class="fn-clear" ref="userList"/>
        <div class="cp-message">{ this.message }</div>
      </div>
      <div class={ 'list' + (this.type === 1 ? '' : ' fn-hide') }>
        <ul class="fn-clear" ref="circleList"/>
        <div class="cp-message">{ this.message2 }</div>
      </div>
    </div>;
  }
}

export default Shield;
