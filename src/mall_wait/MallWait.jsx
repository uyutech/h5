/**
 * Created by army8735 on 2017/12/22.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';

class MallWait extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind hasData
  setData(data) {
    let self = this;
    self.data = data;
    self.hasData = true;
  }
  click(e, vd, tvd) {
    let $button = $(tvd.element);
    if($button.hasClass('loading')) {
      return;
    }
    $button.addClass('loading');
    let cartID = tvd.props.rel;
    let idx = tvd.props.idx;
    let self = this;
    net.postJSON('/h5/my/cancelPrize', { cartID }, function(res) {
      if(res.success) {
        // self.productList.splice(idx, 1);
        location.href = '/mall_new.html';
      }
      else {
        alert(res.message || util.ERROR_MESSAGE);
      }
      $button.removeClass('loading');
    }, function(res) {
      alert(res.message || util.ERROR_MESSAGE);
      $button.removeClass('loading');
    });
  }
  genDom() {
    return <div>
      <ul class="type">
        <li><a href="/mall.html">圈商城</a></li>
        <li><a href="/mall_new.html">新福利</a></li>
        <li><a href="/mall_wait.html" class="cur">等待收货</a></li>
      </ul>
      <p>考虑到小伙伴们寒假的地址和开学以后的地址不相同以及春节快递停止发货。所以发货将于3月份开始，在此之间，发货功能将被锁定。具体发货时间将会在转圈微博通知，请小伙伴谅解。</p>
      <ul class="list" onClick={ { button: this.click } }>
        {
          (this.data || []).map(function(item, i) {
            if(item.State !== 2) {
              return <li>{ item.ProductName }<span>已发货</span></li>;
            }
            return <li>{ item.ProductName }<button rel={ item.ID } idx={ i }>取消发货</button></li>;
          })
        }
      </ul>
    </div>;
  }
  render() {
    return <div class="mall-new">
      {
        this.hasData
          ? this.genDom()
          : <div>
              <div class="fn-placeholder-tags"/>
              <div class="fn-placeholder-squares"/>
              <div class="fn-placeholder"/>
            </div>
      }
    </div>;
  }
}

export default MallWait;
