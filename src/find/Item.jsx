/**
 * Created by army8735 on 2018/4/5.
 */


'use strict';

import util from '../common/util';
import Banner from './Banner.jsx';
import Works from './Works.jsx';
import AuthorList from './AuthorList.jsx';
import WorksList from './WorksList.jsx';
import net from "../common/net";

class Item extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.visible = self.props.visible;
    self.message = self.props.message;
  }
  @bind visible
  @bind message
  setData(data) {
    let self = this;
    self.cache = [];
    self.ref.banner.setData(data.banner);

    // TODO: 未知domDiff的bug，先用innerHtml
    let s = '';
    data.list.data.forEach(function(item) {
      s += self.genItem(item);
    });
    $(self.ref.con.element).html(s);
    self.message = '';

    if(self.listener) {
      window.removeEventListener('scroll', self.listener);
    }
    self.offset = self.limit = data.list.limit;
    if(data.list.count > self.limit) {
      self.listener = function() {
        self.checkMore();
      };
      window.addEventListener('scroll', self.listener);
    }
  }
  appendData(data) {
    let self = this;
    let s = '';
    data.forEach(function(item) {
      s += self.genItem(item);
    });
    $(self.ref.con.element).append(s);
  }
  genItem(item) {
    switch(item.type) {
      case 1:
        return <Works data={item}/>;
      case 4:
        return <AuthorList data={item}/>;
      case 5:
        return <WorksList data={item}/>;
    }
  }
  checkMore() {
    let self = this;
    if(self.loading || self.loadEnd || !self.visible) {
      return;
    }
    if(util.isBottom()) {
      self.load();
    }
  }
  load() {
    let self = this;
    if(self.ajax) {
      self.ajax.abort();
    }
    self.loading = true;
    self.message = '正在加载...';
    self.ajax = net.postJSON('/h5/find2/tag',
      { tag: self.props.tag, offset: self.offset, limit: self.limit, }, function(res) {
      if(res.success) {
        let data = res.data;
        self.offset += self.limit;
        if(data.data.length) {
          self.appendData(data.data);
        }
        if(self.offset >= data.count) {
          self.loadEnd = true;
          self.message = '已经到底了';
        }
        else {
          self.message = '';
        }
      }
      else {
        if(res.code === 1000) {
          migi.eventBus.emit('NEED_LOGIN');
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
      }
      self.loading = false;
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      self.loading = false;
    });
  }
  render() {
    return <div class={ 'mod-item' + (this.visible ? '' : ' fn-hide') }>
      <Banner ref="banner"/>
      <div ref="con"/>
      <div class={ 'cp-message' + (this.message ? '' : ' fn-hide') }>{ this.message }</div>
    </div>;
  }
}

export default Item;
