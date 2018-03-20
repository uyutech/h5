/**
 * Created by army8735 on 2017/11/5.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';

let loading;

class Title extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind joined
  @bind count
  @bind cover
  @bind sname
  @bind desc
  @bind id;
  click(e) {
    e.preventDefault();
    if(!util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    let self = this;
    if(loading) {
      return;
    }
    loading = true;
    net.postJSON('/h5/circle/join', { circleID: self.id, state: self.joined }, function(res) {
      if(res.success) {
        self.joined = !!res.data.ISLike;
        self.count = res.data.FansNumber;
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
  render() {
    return <div class="title">
      <div class="profile">
        <div class="pic">
          <img src={ util.autoSsl(util.img200_200_80(this.cover || '//zhuanquan.xin/img/c370ff3fa46f4273d0f73147459a43d8.png')) }/>
        </div>
        <div class="txt">
          <h1>{ this.sname }</h1>
          <div class="rel">
            <span class="count">{ this.count || 0 }</span>
            <span class={ 'join' + (this.id ? '' : ' fn-hide') + (this.joined ? ' joined' : '') } onClick={ this.click }>{ this.joined ? '已经加入' : '加入圈子' }</span>
          </div>
        </div>
      </div>
      <pre class={ 'intro' + (this.desc ? '' : ' fn-hide') }>{ this.desc }</pre>
    </div>;
  }
}

export default Title;
