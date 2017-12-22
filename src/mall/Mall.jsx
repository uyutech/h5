/**
 * Created by army8735 on 2017/12/22.
 */

'use strict';

import BigNumber from 'bignumber.js';
import util from '../common/util';

class Mall extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind hasData
  setData(data) {
    let self = this;
    self.data = data;
    self.hasData = true;
  }
  split(list) {
    let res = [];
    for(let i = 0, len = list.length; i < len; i += 3) {
      let temp = list.slice(i, i + 3);
      res.push(temp);
    }
    return res;
  }
  genDom() {
    return <div>
      <ul class="type">
        <li><a href="/mall.html" class="cur">圈商城</a></li>
        <li><a href="/mall_new.html">新福利</a></li>
        <li><a href="/mall_wait.html">等待收货</a></li>
      </ul>
      <div class="prod">
        {
          this.data.data.length
            ? this.split(this.data.data || []).map(function(list) {
              return <div class="line fn-clear">
                {
                  list.map(function(item) {
                    let price = new BigNumber(item.Price).times(item.Discount).ceil();
                    if(item.Discount < 1) {
                      return <div class="item">
                        <img src={ util.img200_200_80(item.ProductCover || '//zhuanquan.xin/img/blank.png') }/>
                        <span class="name">{ item.ProductName }</span>
                        <span class="price discount">价格：{ item.Price }<b class="icon"/></span>
                        <span class="price">折扣价：{ price }<b class="icon"/></span>
                        <button class="btn">即将上架</button>
                      </div>;
                    }
                    return <div class="item">
                      <img src={ util.img200_200_80(item.ProductCover || '//zhuanquan.xin/img/blank.png') }/>
                      <span class="name">{ item.ProductName }</span>
                      <span class="price">价格：{ item.Price }<b class="icon"/></span>
                      <button class="btn">即将上架</button>
                    </div>;
                  })
                }
              </div>;
            })
            : '这里空空的，再去转转圈吧~'
        }
      </div>
    </div>;
  }
  render() {
    return <div class="mall">
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

export default Mall;
