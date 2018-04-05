/**
 * Created by army8735 on 2017/11/28.
 */


'use strict';

import net from '../common/net';
import util from '../common/util';
import Nav from './Nav.jsx';
import Item from './Item.jsx';

let visible;
let scrollY = 0;
let last;
let hasLoad;
let ajax;
let lastId;

let currentPriority = 0;
let cacheKey = 'find';
let hash = {};

class Find extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      self.init();
    });
  }
  @bind list
  show() {
    $(this.element).removeClass('fn-hide');
    $(window).scrollTop(scrollY);
    visible = true;
  }
  hide() {
    $(this.element).addClass('fn-hide');
    visible = false;
  }
  init() {
    let self = this;
    if(ajax) {
      ajax.abort();
    }
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        self.setData(cache, 0);
      }
    });
    ajax = net.postJSON('/h5/find2/index', function(res) {
      if(res.success) {
        let data = res.data;
        self.setData(data, 1);

        jsBridge.setPreference(cacheKey, data);
        return;
        hasLoad = true;
        self.setData(data, 1);
        if(lastId && lastId > 1) {
          if(Array.isArray(self.ref.itemList)) {
            last = self.ref.itemList[lastId - 2].show();
          }
          else {
            last = self.ref.itemList.show();
          }
        }
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  refresh() {
    if(visible) {
      if(hasLoad) {
        last.reload();
      }
      else {
        this.init();
      }
    }
  }
  setData(data, priority) {
    priority = priority || 0;
    if(priority < currentPriority) {
      return;
    }
    currentPriority = priority;

    let self = this;
    self.tag = data.tag[0].id;

    self.ref.nav.setData(data.tag);
    self.list = data.tag;
    self.ref.item[0].setData(data);
  }
  change(tag) {
    let self = this;
    for(let i = 0; i < self.list.length; i++) {
      if(self.list[i].id === tag) {
        self.ref.item[i].visible = true;
      }
      else {
        self.ref.item[i].visible = false;
      }
    }
  }
  render() {
    return <div class="find">
      <Nav ref="nav"
           on-change={ this.change }/>
      {
        (this.list || []).map((item, i) => {
          let cache = hash[item.id];
          if(!cache) {
            cache = hash[item.id]
              = <Item ref="item"
                      tag={ item.id }
                      visible={ !i }/>;
          }
          return cache;
        })
      }
    </div>;
  }
}

export default Find;
