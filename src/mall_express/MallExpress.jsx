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
    $net.postJSON('/h5/mall/express', function(res) {
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
    let elem = tvd.element;
    if(elem.classList.contains('loading') || elem.classList.contains('disabled')) {
      return;
    }
    jsBridge.confirm('取消发货并不会退回免邮次数哦~', function(res) {
      if(!res) {
        return;
      }
      let id = tvd.props.rel;
      elem.classList.add('loading');
      $net.postJSON('/h5/mall/cancelExpress', { id }, function(res) {
        if(res.success) {
          elem.classList.add('disabled');
          elem.textContent = '已申请取消';
          jsBridge.delPreference(cacheKey);
        }
        else {
          jsBridge.toast(res.message || $util.ERROR_MESSAGE);
        }
        elem.classList.remove('loading');
      }, function(res) {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
        elem.classList.remove('loading');
      });
    });
  }
  render() {
    return <div class="mall-express">
      <ul class="type">
        <li><a href="/mall.html">圈商城</a></li>
        <li><a href="/mall_prize.html">我的福利</a></li>
        <li>等待收货</li>
      </ul>
      <p>福利将在福利状态变为【已发货】后的7个工作日内发出，请圈友们在兑换之后耐心等待收货~</p>
      <ul class="list"
          onClick={ { 'button': this.click } }>
        {
          (this.list || []).map(function(item) {
            if(item.state === 3) {
              return <li><span>{ item.product.name }</span><small>已收货</small></li>;
            }
            if(item.state === 2) {
              return <li><span>{ item.product.name }</span><small>已发货</small></li>;
            }
            return <li><span>{ item.product.name }</span>
              <button rel={ item.id }>申请取消</button>
            </li>;
          })
        }
      </ul>
    </div>;
  }
}

export default MallExpress;
