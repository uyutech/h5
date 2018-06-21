/**
 * Created by army8735 on 2018/5/25.
 */

'use strict';

let timeout;

class Dialog extends migi.Component {
  constructor(...data) {
    super(...data);
    this.exist = {};
  }
  @bind message
  setData(data) {
    let self = this;
    self.clearData();
    if(!data) {
      return;
    }
    if(!Array.isArray(data)) {
      data = [data];
    }
    let s = '';
    data.forEach((item) => {
      s += self.genItem(item) || '';
    });
    $(self.ref.list.element).html(s);
  }
  appendData(data) {
    let self = this;
    self.clearData();
    if(!data) {
      return;
    }
    if(!Array.isArray(data)) {
      data = [data];
    }
    let s = '';
    data.forEach((item) => {
      s += self.genItem(item) || '';
    });
    $(self.ref.list.element).append(s);
  }
  clearData() {
    let self = this;
    self.exist = {};
  }
  genItem(item) {
    let self = this;
    let id = item.id;
    if(self.exist[id]) {
      return;
    }
    self.exist[id] = true;
    let url = '/user.html?id=' + item.userId;
    let userInfo = item.isOwn ? item.userInfo : item.targetInfo;
    return <li class={ (item.isOwn ? 'own' : '') + (item.isRead ? ' read' : '') }
               rel={ item.id }>
      <div class="profile">
        <a class="pic"
           href={ url }
           title={ userInfo.nickname }>
          <img class="pic"
               src={ $util.img(userInfo.headUrl, 60, 60, 80) || '/src/common/head.png' }/>
        </a>
        <div class="txt">
          <a class="name"
             href={ url }
             title={ userInfo.nickname }>{ userInfo.nickname }</a>
          <small class="time"
                 rel={ item.createTime }>{ $util.formatDate(item.createTime) }</small>
          <small class="state">{ item.isOwn ? '' : (item.isRead ? '已读' : '未读') }</small>
        </div>
      </div>
      <div class="wrap">
        <pre>{ item.content }</pre>
      </div>
    </li>;
  }
  checkRead() {
    if(timeout) {
      clearTimeout(timeout);
    }
    let self = this;
    timeout = setTimeout(function() {
      let lis = self.ref.list.element.querySelectorAll('li');
      let height = document.documentElement.clientHeight;
      let list = [];
      for(let i = 0; i < lis.length; i++) {
        let item = lis[i];
        if(item.classList.contains('read')) {
          continue;
        }
        let rect = item.getBoundingClientRect();
        if(rect.top >= 0 && rect.top <= height) {
          list.push(item);
          for(let j = i + 1; j < lis.length; j++) {
            let item = lis[j];
            let rect = item.getBoundingClientRect();
            if(rect.top >= 0 && rect.top <= height) {
              list.push(item);
            }
            else {
              break;
            }
          }
          break;
        }
      }
      if(list.length) {
        let idList = list.map((item) => {
          return item.getAttribute('rel');
        });
        $net.postJSON('/h5/my/readLetter', { idList }, function(res) {
          if(res.success) {
            list.forEach((item) => {
              item.classList.add('read');
              item.querySelector('.state').textContent = '已读';
            });
          }
          else {
            jsBridge.toast(res.message || $util.ERROR_MESSAGE);
          }
        }, function(res) {
          jsBridge.toast(res.message || $util.ERROR_MESSAGE);
        });
      }
    }, 200);
  }
  render() {
    return <div class="mod-dialog">
      <ol class="list"
          ref="list"/>
      <div class={ 'cp-message' + (this.message ? '' : ' fn-hide') } >{ this.message }</div>
    </div>;
  }
}

export default Dialog;
