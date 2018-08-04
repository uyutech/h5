/**
 * Created by army8735 on 2017/12/22.
 */

'use strict';

let currentPriority = 0;
let cacheKey = 'mallPrize';

class MallPrize extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      jsBridge.on('resume', function(e) {
        let data = e.data;
        if(data && data.defaultAddress) {
          self.address = data.defaultAddress;
        }
      });
    });
  }
  @bind list
  @bind address
  @bind freePost
  @bind loading
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
    self.list = data.prize;
    self.address = data.address;
    self.freePost = data.freePost;
  }
  click(e, vd, tvd) {
    let self = this;
    let id = tvd.props.value;
    self.list.forEach((item) => {
      if(item.id === id) {
        item.checked = !item.checked;
      }
    });
  }
  clickAddress() {
    jsBridge.pushWindow('/my_address.html');
  }
  sub() {
    let self = this;
    if(!self.freePost || !self.address || self.loading) {
      return;
    }
    let ids = [];
    self.list.forEach((item) => {
      if(item.checked) {
        ids.push(item.id);
      }
    });
    if(!ids.length) {
      jsBridge.toast('请先选择发货物品~');
      return;
    }
    jsBridge.confirm('请仔细确认发货地址，申请消耗的免邮次数不能回退~', function(res) {
      if(!res) {
        return;
      }
      self.loading = true;
      $net.postJSON('/h5/mall/applyExpressList', { ids, addressId: self.address.id }, function(res) {
        if(res.success) {
          jsBridge.delPreference(cacheKey);
          location.replace('/mall_express.html');
        }
        else {
          jsBridge.toast(res.message || $util.ERROR_MESSAGE);
        }
        self.loading = false;
      }, function(res) {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
        self.loading = false;
      });
    });
  }
  render() {
    return <div class="mall-new">
      <ul class="type">
        <li><a href="/mall.html">圈商城</a></li>
        <li>我的福利</li>
        <li><a href="/mall_express.html">等待收货</a></li>
      </ul>
      <ul class="list"onClick={ { input: this.click } }>
        {
          (this.list || []).map(function(item) {
            return <li>
              <label>{ item.product.name }
                <input type="checkbox" value={ item.id }/>
              </label>
            </li>;
          })
        }
      </ul>
      <div class={ 'address' + (this.address ? '' : ' fn-hide') }
           onClick={ this.clickAddress }>
        <h4>默认发货地址（点击去地址管理修改）</h4>
        <label>收件人：</label>
        <span>{ this.address && this.address.name }</span>
        <br/>
        <label>联系手机：</label>
        <span>{ this.address && this.address.phone }</span>
        <br/>
        <label>收货地址：</label>
        <span>{ this.address && this.address.address }</span>
      </div>
      <div class="free">
        <p>获取免邮机会后才可选择发货哦~<br/><strong>免邮次数 * { this.freePost || 0 }</strong></p>
        <p class="intro" onClick={ function() {
          jsBridge.pushWindow('/post.html?id=498119', {
            title: '免邮说明',
          });
        } }>如何获取免邮？</p>
      </div>
      <button disabled={ !this.freePost || !this.address || this.loading }
              onClick={ this.sub }>申请发货</button>
    </div>;
  }
}

export default MallPrize;
