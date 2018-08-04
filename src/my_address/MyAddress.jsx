/**
 * Created by army8735 on 2017/12/11.
 */

'use strict';

let ajax;
let currentPriority = 0;
let cacheKey = 'myAddress';
let loading;
let loading2;

class MyAddress extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      let $root = $(self.element);
      $root.on('click', '.name', function() {
        let $this = $(this);
        let $prev = $this.prev();
        let id = $this.attr('rel');
        let name = $prev.text();
        jsBridge.prompt($prev.text(), function(res) {
          if(res.success) {
            let value = res.value.trim();
            if(value && value !== name) {
              $net.postJSON('/h5/my/updateAddressName', { id, value }, function(res) {
                if(res.success) {
                  $prev.text(value);
                }
                else {
                  jsBridge.toast(res.message || $util.ERROR_MESSAGE);
                }
              }, function(res) {
                jsBridge.toast(res.message || $util.ERROR_MESSAGE);
              });
            }
          }
        });
      });
      $root.on('click', '.phone', function() {
        let $this = $(this);
        let $prev = $this.prev();
        let id = $this.attr('rel');
        let phone = $prev.text();
        jsBridge.prompt($prev.text(), function(res) {
          if(res.success) {
            let value = res.value.trim();
            if(!/^1\d{10}$/.test(value)) {
              jsBridge.toast('手机号不合法~');
              return;
            }
            if(value && value !== phone) {
              $net.postJSON('/h5/my/updateAddressPhone', { id, value }, function(res) {
                if(res.success) {
                  $prev.text(value);
                }
                else {
                  jsBridge.toast(res.message || $util.ERROR_MESSAGE);
                }
              }, function(res) {
                jsBridge.toast(res.message || $util.ERROR_MESSAGE);
              });
            }
          }
        });
      });
      $root.on('click', '.address', function() {
        let $this = $(this);
        let $prev = $this.prev();
        let id = $this.attr('rel');
        let address = $prev.text();
        jsBridge.prompt($prev.text(), function(res) {
          if(res.success) {
            let value = res.value.trim();
            if(value && value !== address) {
              $net.postJSON('/h5/my/updateAddress', { id, value }, function(res) {
                if(res.success) {
                  $prev.text(value);
                }
                else {
                  jsBridge.toast(res.message || $util.ERROR_MESSAGE);
                }
              }, function(res) {
                jsBridge.toast(res.message || $util.ERROR_MESSAGE);
              });
            }
          }
        });
      });
      $root.on('click', 'button', function() {
        if(loading2) {
          return;
        }
        let $this = $(this);
        if($this.hasClass('disabled')) {
          return;
        }
        loading2 = true;
        let id = parseInt($this.attr('rel'));
        $net.postJSON('/h5/my/setDefaultAddress', { id }, function(res) {
          if(res.success) {
            $root.find('button').removeClass('disabled').text('设为默认');
            $this.addClass('disabled').text('默认地址');
            self.list.forEach((item) => {
              item.isDefault = item.id === id;
            });
            jsBridge.setPreference(cacheKey, self.list);
          }
          else {
            jsBridge.toast(res.message || $util.ERROR_MESSAGE);
          }
          loading2 = false;
        }, function(res) {
          jsBridge.toast(res.message || $util.ERROR_MESSAGE);
          loading2 = false;
        });
      });
      jsBridge.on('back', function(e) {
        let o;
        self.list.forEach((item) => {
          if(item.isDefault) {
            o = item;
          }
        });
        if(o) {
          e.preventDefault();
          jsBridge.popWindow({
            defaultAddress: o,
          });
        }
      });
    });
  }
  @bind list
  @bind message
  init() {
    let self = this;
    if(ajax) {
      ajax.abort();
    }
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        try {
          self.setData(cache, 0);
        }
        catch(e) {}
      }
    });
    ajax = $net.postJSON('/h5/my/address', function(res) {
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
    priority = priority || 0;
    if(priority < currentPriority) {
      return;
    }
    currentPriority = priority;

    let self = this;
    self.list = data;
    self.message = self.list && self.list.length ? '' : '暂无收货地址';
  }
  add() {
    if(this.list.length >= 10) {
      jsBridge.toast('收货地址最多只能有10个！');
      return;
    }
    if(loading) {
      return;
    }
    let self = this;
    jsBridge.prompt({
      message: '请输入收件人名称',
    }, function(res) {
      if(res.success) {
        let name = res.value.trim();
        if(!name) {
          jsBridge.toast('名称不能为空');
          return;
        }
        jsBridge.prompt({
          message: '请输入联系手机',
        }, function(res) {
          if(res.success) {
            let phone = res.value.trim();
            if(!phone) {
              jsBridge.toast('手机不能为空');
              return;
            }
            jsBridge.prompt({
              message: '请输入收货地址',
            }, function(res) {
              if(res.success) {
                let address = res.value.trim();
                if(!address) {
                  jsBridge.toast('地址不能为空');
                  return;
                }
                loading = true;
                $net.postJSON('/h5/my/addAddress', { name, phone, address }, function(res) {
                  if(res.success) {
                    self.list.push({
                      name,
                      phone,
                      address,
                    });
                    self.message = '';
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
        });
      }
    });
  }
  render() {
    return <div class="private">
      <ul>
      {
        (this.list || []).map((item) => {
          return <li>
            <label>收件人：</label>
            <span>{ item.name }</span>
            <b class="name" rel={ item.id }/>
            <br/>
            <label>联系手机：</label>
            <span>{ item.phone }</span>
            <b class="phone" rel={ item.id }/>
            <br/>
            <label>收货地址：</label>
            <span>{ item.address }</span>
            <b class="address" rel={ item.id }/>
            <button class={ item.isDefault ? 'disabled' : '' }
                    rel={ item.id }>{ item.isDefault ? '默认地址' : '设为默认' }</button>
          </li>;
        })
      }
      </ul>
      <div class="add"
           onClick={ this.add }>添加收货地址</div>
      <div class="cp-message">{ this.message }</div>
    </div>;
  }
}

export default MyAddress;
