/**
 * Created by army8735 on 2018/4/2.
 */

'use strict';

import util from '../common/util';

class Nav extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind circleId
  @bind circleName
  @bind desc
  @bind banner
  @bind cover
  setData(data) {
    let self = this;
    self.circleId = data.id;
    self.circleName = data.name;
    self.desc = data.describe;
    self.banner = data.banner;
    self.cover = data.cover;
  }
  render() {
    return <div class="mod-nav">
      <div class="profile">
        <div class="pic">
          <img src={ util.autoSsl(util.img200_200_80(this.cover || '//zhuanquan.xyz/temp/4ec79947e068b21fbef207a825cb53c0.jpg')) }/>
        </div>
        <div class="txt">
          <h1>{ this.circleName }</h1>
          <div class="rel">
            <span class="count">{ this.count || 0 }</span>
            <span class={ 'join' + (this.circleId ? '' : ' fn-hide') + (this.joined ? ' joined' : '') } onClick={ this.click }>{ this.joined ? '已经加入' : '加入圈子' }</span>
          </div>
        </div>
      </div>
      <pre class={ 'intro' + (this.desc ? '' : ' fn-hide') }>{ this.desc }</pre>
    </div>;
  }
}

export default Nav;
