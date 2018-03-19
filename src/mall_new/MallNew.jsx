/**
 * Created by army8735 on 2017/12/22.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';

class MallNew extends migi.Component {
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
    net.postJSON('/h5/my/sendPrize', { cartID }, function(res) {
      if(res.success) {
        // self.productList.splice(idx, 1);
        location.href = '/mall_wait.html';
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
  clickAddress(e, vd) {
    e.preventDefault();
    jsBridge.pushWindow('/private.html', {
      title: '编辑收货地址'
    });
  }
  genDom() {
    return <div>
      <ul class="type">
        <li><a href="/mall.html">圈商城</a></li>
        <li><a href="/mall_new.html" class="cur">新福利</a></li>
        <li><a href="/mall_wait.html">等待收货</a></li>
      </ul>
      <div class="private"><a href="/my/private" onClick={ this.clickAddress.bind(this) }>编辑收货地址<small>(圈儿会为你保密哦)</small></a></div>
      <ul class="list" onClick={ { button: this.click } }>
        {
          (this.data || []).map(function(item, i) {
            return <li>{ item.ProductName }<button rel={ item.ID } idx={ i }>发货</button></li>;
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

export default MallNew;
