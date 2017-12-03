/**
 * Created by army8735 on 2017/11/5.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';

class Title extends migi.Component {
  constructor(...data) {
    super(...data);
    this.joined = !!this.props.circleDetail.ISLike;
    this.count = this.props.circleDetail.FansNumber;
  }
  @bind joined
  @bind count
  @bind loading
  click(e) {
    e.preventDefault();
    if(!$CONFIG.isLogin) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    let self = this;
    if(self.loading) {
      return;
    }
    self.loading = true;
    net.postJSON('/api/circle/join', { circleID: this.props.circleDetail.TagID, state: self.joined }, function(res) {
      if(res.success) {
        self.joined = !!res.data.ISLike;
        self.count = res.data.FansNumber;
      }
      else {
        alert(res.message || util.ERROR_MESSAGE);
      }
      self.loading = false;
    }, function(res) {
      alert(res.message || util.ERROR_MESSAGE);
      self.loading = false;
    });
  }
  render() {
    return <div class="title">
      <div class="profile">
        <div class="pic">
          <img src={ util.autoSsl(util.img200_200_80(this.props.circleDetail.TagCover || '//zhuanquan.xin/img/c370ff3fa46f4273d0f73147459a43d8.png')) }/>
        </div>
        <div class="txt">
          <h1>{ this.props.circleDetail.TagName }</h1>
          <div class="rel">
            <span class="count">{ this.count || 0 }</span>
            <a href="#" class={ 'join' + (this.joined ? ' joined' : '') } onClick={ this.click }>{ this.joined ? '已经加入' : '加入圈子' }</a>
          </div>
        </div>
      </div>
      <pre class={ 'intro' + (this.props.circleDetail.Describe ? '' : ' fn-hide') }>{ this.props.circleDetail.Describe }</pre>
    </div>;
  }
}

export default Title;
