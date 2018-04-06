/**
 * Created by army8735 on 2018/4/5.
 */


'use strict';

import util from '../common/util';
import net from '../common/net';
import Banner from './Banner.jsx';
import Works from './Works.jsx';
import AuthorList from './AuthorList.jsx';
import WorksList from './WorksList.jsx';
import WorksVideoList from '../component/worksvideolist/WorksVideoList.jsx';

class Item extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.visible = self.props.visible;
    self.message = self.props.message;
    self.tag = self.props.tag;
    self.kind = self.props.kind;
    self.offset = 0;
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

    self.offset = self.limit = data.list.limit;
    if(self.kind) {
      self.loadEnd = self.offset >= data.kind.count;
    }
    else {
      self.loadEnd = self.offset >= data.list.count;
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
    self.ajax = net.postJSON('/h5/find2/tag',
      { tag: self.tag, kind: self.kind, offset: self.offset, }, function(res) {
      if(res.success) {
        let data = res.data;
        let banner = data.banner;
        let list = data.list;
        let kind = data.kind;
        if(banner) {
          self.ref.banner.setData(banner);
        }
        if(list) {
          self.appendData(list.data);
        }
        if(kind) {
          switch(self.kind) {
            case 1:
              if(self.offset) {
                self.ref.videoList.appendData(kind.data);
              }
              else {
                self.ref.videoList.visible = true;
                self.ref.videoList.setData(kind.data);
              }
              break;
          }
        }
        self.limit = list.limit;
        self.offset += self.limit;
        if(self.offset >= list.count) {
          self.loadEnd = true;
          self.message = '已经到底了';
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
      <WorksVideoList ref="videoList"/>
      <div class={ 'cp-message' + (this.message ? '' : ' fn-hide') }>{ this.message }</div>
    </div>;
  }
}

export default Item;
