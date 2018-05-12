/**
 * Created by army8735 on 2017/12/22.
 */

'use strict';

let currentPriority = 0;
let cacheKey = 'mallPrize';

class MallPrize extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind list
  init() {
    let self = this;
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        try {
          self.setData(cache, 0);
        }
        catch(e) {}
      }
    });
    $net.postJSON('/h5/mall/prize', function(res) {
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
    if(priority < currentPriority) {
      return;
    }
    currentPriority = priority;

    let self = this;
    self.list = data;
  }
  click(e, vd, tvd) {
    if(tvd.element.classList.contains('loading')) {
      return;
    }
    tvd.element.classList.add('loading');
    let id = tvd.props.rel;
    $net.postJSON('/h5/mall/applyExpress', { id }, function(res) {
      if(res.success) {
        tvd.element.classList.remove('apply');
        tvd.element.classList.add('applied');
        tvd.element.textContent = '已申请发货';
        jsBridge.delPreference(cacheKey);
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
      tvd.element.classList.remove('loading');
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      tvd.element.classList.remove('loading');
    });
  }
  render() {
    return <div class="mall-new">
      <ul class="type">
        <li><a href="/mall.html">圈商城</a></li>
        <li>新福利</li>
        <li><a href="/mall_express.html">等待收货</a></li>
      </ul>
      <p>下次兑换&发货时间为五月中下旬，届时会发布兑换公告~请大家留意转圈&群&微博~注：本次发货不包邮需要联系运营小哥哥补邮费哦~</p>
      <ul class="list"
          onClick={ { '.apply': this.click } }>
        {
          (this.list || []).map(function(item) {
            return <li><span>{ item.product.name }</span>
              <button class="apply"
                      rel={ item.id }>申请发货</button>
            </li>;
          })
        }
      </ul>
    </div>;
  }
}

export default MallPrize;
