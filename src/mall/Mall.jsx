/**
 * Created by army8735 on 2017/12/22.
 */

'use strict';

import BigNumber from 'bignumber.js';
import util from '../common/util';
import net from '../common/net';

let currentPriority = 0;
let cacheKey;

class Mall extends migi.Component {
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
    net.postJSON('/h5/mall2/index', function(res) {
      if(res.success) {
        let data = res.data;
        self.setData(data, 1);
        jsBridge.setPreference(cacheKey, data);
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
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
  split(list) {
    let res = [];
    for(let i = 0, len = list.length; i < len; i += 3) {
      let temp = list.slice(i, i + 3);
      res.push(temp);
    }
    return res;
  }
  render() {
    return <div class="mall">
      <ul class="type">
        <li>圈商城</li>
        <li><a href="/mall_prize.html">新福利</a></li>
        <li><a href="/mall_express.html">等待收货</a></li>
      </ul>
      <div class="prod">
      {
        this.split(this.list || []).map(function(list) {
          return <div class="line fn-clear">
            {
              list.map(function(item) {
                let price = new BigNumber(item.price).times(item.discount).ceil();
                if(item.discount < 1) {
                  return <div class="item">
                    <img src={ util.img(item.cover, 200, 200, 80) || '//zhuanquan.xin/img/blank.png' }/>
                    <span class="name">{ item.name }</span>
                    <span class="price discount">价格：{ item.price }<b class="icon"/></span>
                    <span class="price">折扣价：{ price }<b class="icon"/></span>
                    <button class="btn">即将上架</button>
                  </div>;
                }
                return <div class="item">
                  <img src={ util.img(item.cover, 200, 200, 80) || '//zhuanquan.xin/img/blank.png' }/>
                  <span class="name">{ item.name }</span>
                  <span class="price">价格：{ item.price }<b class="icon"/></span>
                  <button class="btn">即将上架</button>
                </div>;
              })
            }
          </div>;
        })
      }
      </div>
    </div>;
  }
}

export default Mall;
