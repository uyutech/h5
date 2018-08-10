/**
 * Created by army8735 on 2018/5/25.
 */

'use strict';

let timeout;

class Dialog extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.list = [];
    self.exist = {};
    self.on(migi.Event.DOM, function() {
      // let $list = $(this.ref.list.element);
      // $list.on('click', '.link', function(e) {
      //   e.preventDefault();
      //   let $this = $(this);
      //   let url = $this.attr('href');
      //   let title = $this.attr('title');
      //   let transparentTitle = $this.attr('transparentTitle') === 'true';
      //   jsBridge.pushWindow(url, {
      //     title,
      //     transparentTitle,
      //   });
      // });
      // $list.on('click', '.outside', function(e) {
      //   e.preventDefault();
      //   let url = $(this).attr('href');
      //   jsBridge.confirm('即将前往站外链接，确定吗？', function(res) {
      //     if(!res) {
      //       return;
      //     }
      //     jsBridge.openUri(url);
      //   });
      // });
    });
  }
  @bind message
  @bind list
  setData(data) {
    let self = this;
    if(!data) {
      return;
    }
    if(!Array.isArray(data)) {
      data = [data];
    }
    data.reverse();
    let l = [];
    data.forEach((item) => {
      let o = self.genItem(item);
      if(o) {
        l.push(o);
      }
    });
    self.list = l;
    self.ref.placeholder.element.scrollIntoView({
      block: 'end',
    });
  }
  prependData(data) {
    let self = this;
    if(!data) {
      return;
    }
    if(!Array.isArray(data)) {
      data = [data];
    }
    data.reverse();
    let l = [];
    data.forEach((item) => {
      let o = self.genItem(item);
      if(o) {
        l.push(o);
      }
    });
    self.list.splice(0, 0, ...l);
  }
  appendData(data) {
    let self = this;
    if(!data) {
      return;
    }
    if(!Array.isArray(data)) {
      data = [data];
    }
    let l = [];
    data.forEach((item) => {
      let o = self.genItem(item);
      if(o) {
        l.push(o);
      }
    });
    self.list.push(...l);
    self.ref.placeholder.element.scrollIntoView({
      block: 'end',
    });
  }
  clearData() {
    let self = this;
    self.list = [];
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
        </div>
      </div>
      <div class="wrap">
        <div class="con"
             dangerouslySetInnerHTML={ self.encode(item.content, item.refHash) }/>
      </div>
    </li>;
  }
  encode(s, refHash) {
    refHash = refHash || {};
    return s.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/@\/(\w+)\/(\d+)\/?(\d+)?(?:\s|$)/g, function($0, $1, $2, $3) {
        let data = refHash[$2];
        if(!data && $1 !== 'post') {
          return $0;
        }
        switch($1) {
          case 'works':
            let url = `/${$1}.html?id=${$2}`;
            if($3) {
              url += '&workId=' + $3;
            }
            return `<a href="${url}" class="link" transparentTitle="true" title="${data.title}">《${data.title}》</a>`;
          case 'author':
            return `<a href="/${$1}.html?id=${$2}" class="link" transparentTitle="true" title="${data.name}">${data.name}</a>`;
          case 'user':
            return `<a href="/${$1}.html?id=${$2}" class="link" transparentTitle="true" title="${data.nickname}">${data.nickname}</a>`;
          case 'post':
            return `<a href="/${$1}.html?id=${$2}" class="link" title="画圈正文">查看正文</a>`;
        }
        return $0;
      })
      .replace(/(http(?:s)?:\/\/[\w-]+\.[\w]+\S*)/gi, '<a class="outside" href="$1" target="_blank">$1</a>');
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
        let rect = item.getBoundingClientRect();
        if(rect.top >= 0 && rect.top <= height) {
          if(!item.classList.contains('read')) {
            list.push(item);
          }
          for(let j = i + 1; j < lis.length; j++) {
            let item = lis[j];
            let rect = item.getBoundingClientRect();
            if(rect.top >= 0 && rect.top <= height) {
              if(!item.classList.contains('read')) {
                list.push(item);
              }
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
      <div class={ 'cp-message' + (this.message ? '' : ' fn-hide') } >{ this.message }</div>
      <ol class="list"
          ref="list">{ this.list }</ol>
      <div class="placeholder" ref="placeholder"/>
    </div>;
  }
}

export default Dialog;
