/**
 * Created by army8735 on 2017/12/22.
 */

'use strict';

let currentPriority = 0;
let cacheKey = 'mallExpress';

class MallExpress extends migi.Component {
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
    $net.postJSON('/h5/mall2/express', function(res) {
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
    $net.postJSON('/h5/mall2/cancelExpress', { id }, function(res) {
      if(res.success) {
        tvd.element.classList.remove('cancel');
        tvd.element.classList.add('applied');
        tvd.element.textContent = '已申请取消';
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
    return <div class="mall-express">
      <ul class="type">
        <li><a href="/mall.html">圈商城</a></li>
        <li><a href="/mall_prize.html">新福利</a></li>
        <li>等待收货</li>
      </ul>
      <p>考虑到小伙伴们寒假的地址和开学以后的地址不相同以及春节快递停止发货。所以发货将于3月份开始，在此之间，发货功能将被锁定。具体发货时间将会在转圈微博通知，请小伙伴谅解。</p>
      <ul class="list"
          onClick={ { '.cancel': this.click } }>
        {
          (this.list || []).map(function(item) {
            if(item.state === 3) {
              return <li><span>{ item.product.name }</span><small>已收货</small></li>;
            }
            if(item.state === 2) {
              return <li><span>{ item.product.name }</span><small>已发货</small></li>;
            }
            return <li><span>{ item.product.name }</span>
              <button class="cancel"
                      rel={ item.id }>申请取消</button>
            </li>;
          })
        }
      </ul>
    </div>;
  }
}

export default MallExpress;
