/**
 * Created by army8735 on 2017/12/22.
 */

'use strict';

let currentPriority = 0;
let cacheKey = 'mall2';
let loading;

class Mall extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind coins
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
    $net.postJSON('/h5/mall/index', function(res) {
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
    self.coins = data.user.coins;
    self.list = data.product;
  }
  split(list) {
    let res = [];
    for(let i = 0, len = list.length; i < len; i += 3) {
      let temp = list.slice(i, i + 3);
      res.push(temp);
    }
    return res;
  }
  desc(e, vd, tvd) {
    let s = tvd.props.rel;
    if(s) {
      jsBridge.toast(s);
    }
  }
  btn(e, vd, tvd) {
    if(loading || tvd.props.disabled) {
      return;
    }
    let self = this;
    let id = tvd.props.rel;
    let price = tvd.props.price;
    if(price.gt(self.coins)) {
      jsBridge.toast('现有圈币不够兑换哦~');
      return;
    }
    jsBridge.confirm(`即将消费${price.toString()}圈币兑换，确认吗？`, function(res) {
      if(res) {
        loading = true;
        $net.postJSON('/h5/mall/exchange', { id }, function(res) {
          if(res.success) {
            jsBridge.toast('兑换成功~');
            let data = res.data;
            self.coins = data.user.coins;
            let elem = tvd.element;
            elem.parentNode.querySelector('.amount strong').innerHTML = data.product.amount;
            if(data.product.amount <= 0) {
              elem.innerHTML = '暂无库存';
              elem.disabled = true;
              tvd.props.disabled = true;
            }
          }
          else {
            jsBridge.toast(res.message || $util.ERROR_MESSAGE);
          }
          loading = false;
        }, function(res) {
          jsBridge.toast(res.message || $util.ERROR_MESSAGE);
          loading = false;
        });
      }
    });
  }
  render() {
    return <div class="mall">
      <ul class="type">
        <li>圈商城</li>
        <li><a href="/mall_prize.html">我的福利</a></li>
        <li><a href="/mall_express.html">等待收货</a></li>
      </ul>
      <div class="coins">现有圈币：{ this.coins || 0 }</div>
      <ul class="prod fn-clear"
           onClick={ { 'img,.name': this.desc, '.btn': this.btn } }>
        {
          (this.list || []).map(function(item) {
            let price = new BigNumber(item.price).times(item.discount).ceil();
            if(item.discount < 1) {
              return <li class="item">
                <img src={ $util.img(item.cover, 200, 200, 80) || '//zhuanquan.xin/img/blank.png' }
                     rel={ item.describe }/>
                <span class="name"
                      rel={ item.describe }>{ item.name }</span>
                <span class="price discount">价格：{ item.price }<b class="icon"/></span>
                <span class="price">折扣价：{ price }</span>
                <span class="amount">库存：<strong>{ item.amount || 0 }</strong></span>
                {
                  item.state && item.amount > 0
                    ? <button class="btn"
                              rel={ item.id }
                              price={ price }>兑换</button>
                    : <button class="btn"
                              disabled="disabled">{ item.amount > 0 ? '即将上架' : '暂无库存'}</button>
                }
              </li>;
            }
            return <li class="item">
              <img src={ $util.img(item.cover, 200, 200, 80) || '//zhuanquan.xin/img/blank.png' }
                   rel={ item.describe }/>
              <span class="name"
                    rel={ item.describe }>{ item.name }</span>
              <span class="price">价格：{ item.price }<b class="icon"/></span>
              <span class="amount">库存：<strong>{ item.amount || 0 }</strong></span>
              {
                item.state && item.amount > 0
                  ? <button class="btn"
                            rel={ item.id }
                            price={ price }>兑换</button>
                  : <button class="btn"
                            disabled="disabled">{ item.amount > 0 ? '即将上架' : '暂无库存'}</button>
              }
            </li>;
          })
        }
      </ul>
    </div>;
  }
}

export default Mall;
