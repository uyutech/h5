/**
 * Created by army8735 on 2018/4/2.
 */

'use strict';

import util from '../common/util';


let loading;

class Nav extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind id
  @bind name
  @bind isFollow
  @bind fansCount
  @bind desc
  @bind banner
  @bind cover
  setData(data, isFollow, fansCount) {
    let self = this;
    self.id = data.id;
    self.name = data.name;
    self.desc = data.describe;
    self.banner = data.banner;
    self.cover = data.cover;
    self.isFollow = isFollow;
    self.fansCount = fansCount;
  }
  click() {
    if(loading) {
      return;
    }
    let self = this;
    let url = self.isFollow ? '/h5/circle2/unFollow' : '/h5/circle2/follow';
    loading = true;
    $net.postJSON(url, { id: self.id }, function(res) {
      if(res.success) {
        let data = res.data;
        self.isFollow = data.state;
        self.fansCount = data.count;
        self.emit('follow', data);
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
    return <div class="mod-nav">
      <div class="profile">
        <div class="pic">
          <img src={ util.autoSsl(util.img200_200_80(this.cover
            || '//zhuanquan.xyz/temp/4ec79947e068b21fbef207a825cb53c0.jpg')) }/>
        </div>
        <div class="txt">
          <h1>{ this.name }</h1>
          <div class="rel">
            <span class="count">{ this.fansCount || 0 }</span>
            <span class={ 'follow' + (this.id ? '' : ' fn-hide') + (this.isFollow ? ' followed' : '') }
                  onClick={ this.click }>{ this.isFollow ? '已经加入' : '加入圈子' }</span>
          </div>
        </div>
      </div>
      <pre class={ 'intro' + (this.desc ? '' : ' fn-hide') }>{ this.desc }</pre>
    </div>;
  }
}

export default Nav;
