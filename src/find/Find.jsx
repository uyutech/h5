/**
 * Created by army8735 on 2017/11/28.
 */


'use strict';

import Nav from './Nav.jsx';
import Item from './Item.jsx';

let scrollY = 0;

let ajax;

let currentPriority = 0;
let cacheKey = 'find';

let hash = {};
let first = {};

class Find extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self._visible = self.props.visible;
    self.on(migi.Event.DOM, function() {
      self.init();
    });
  }
  @bind list
  get visible() {
    return this._visible;
  }
  @bind
  set visible(v) {
    this._visible = v;
    $util.scrollY(scrollY);
  }
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
    ajax = $net.postJSON('/h5/find2/index', function(res) {
      if(res.success) {
        let data = res.data;
        self.setData(data, 1);
        jsBridge.setPreference(cacheKey, data);
        window.addEventListener('scroll', function() {
          if(self.visible) {
            for(let i = 0; i < self.ref.item.length; i++) {
              if(self.ref.item[i].visible) {
                self.ref.item[i].checkMore();
              }
            }
            scrollY = $util.scrollY();
          }
        });
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
    self.tag = data.tag[0].id;
    first[self.tag] = true;

    self.ref.nav.setData(data.tag);
    self.list = data.tag;
    self.ref.item[0].setData(data);
  }
  change(tag) {
    let self = this;
    for(let i = 0; i < self.list.length; i++) {
      if(self.list[i].id === tag) {
        self.ref.item[i].visible = true;
        if(!first[tag]) {
          first[tag] = true;
          self.ref.item[i].load();
        }
      }
      else {
        self.ref.item[i].visible = false;
      }
    }
  }
  render() {
    return <div class={ 'find' + (this.visible ? '' : ' fn-hide') }>
      <Nav ref="nav"
           on-change={ this.change }/>
      <div class={ 'cp-message' + (this.list ? ' fn-hide' : '')}>正在加载...</div>
      {
        (this.list || []).map((item, i) => {
          let cache = hash[item.id];
          if(!cache) {
            cache = hash[item.id]
              = <Item ref="item"
                      tag={ item.id }
                      kind={ item.kind }
                      message={ '正在加载...' }
                      visible={ !i }/>;
          }
          return cache;
        })
      }
    </div>;
  }
}

export default Find;
