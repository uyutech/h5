/**
 * Created by army8735 on 2018/4/3.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';

class List extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.visible = self.props.visible;
    self.message = self.props.message;
  }
  @bind list
  @bind message
  @bind visible
  setData(data) {
    let self = this;
    self.exist = {};

    if(data.count) {
      self.offset = self.limit = data.limit;
      let list = data.data.map(function(item) {
        return self.genItem(item);
      });
      self.list = list;
      if(data.count > self.limit) {
        window.addEventListener('scroll', function() {
          self.checkMore();
        });
      }
      else {
        self.loadEnd = true;
        self.message = '已经到底了';
      }
    }
    else {
      self.message = '暂无数据';
    }
  }
  genItem(item) {
    let self = this;
    let url = self.props.isAuthor
      ? ('/author.html?authorId=' + item.id)
      : ('/user.html?userId=' + item.id);
    return <li>
      <a href={ url }
         title={ item.name || item.nickname }>
        <img src={ util.autoSsl(util.img120_120(item.headUrl)) || '/src/common/head.png' }/>
        <span>{ item.name || item.nickname }</span>
      </a>
    </li>;
  }
  checkMore() {
    let self = this;
    if(self.loading || self.loadEnd) {
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
    self.ajax = net.postJSON(self.url, { offset: self.offset, limit: self.limit, }, function(res) {
      if(res.success) {
        let data = res.data;
        self.offset += self.limit;
        if(data.data.length) {
          data.data.forEach(function(item) {
            if(self.exist[item.id]) {
              return;
            }
            self.exist[item.id] = true;
            self.list.push(self.genItem(item));
          });
        }
        if(self.offset >= data.count) {
          self.loadEnd = true;
          postList.message = '已经到底了';
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
  click(e, vd, tvd) {
    let url = tvd.props.url;
    let title = tvd.props.title;
    if(this.props.isAuthor) {
      util.openAuthor({
        url,
        title,
      });
    }
    else {
      jsBridge.pushWindow(url, {
        title,
        transparentTitle: true,
      });
    }
  }
  render() {
    return <div class={ 'mod-list' + (this.visible ? '' : ' fn-hide') }>
      <ul class="fn-clear"
          onClick={ { li: this.click } }>{ this.list }</ul>
      <div class="cp-message">{ this.message }</div>
    </div>;
  }
}

export default List;
