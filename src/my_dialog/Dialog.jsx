/**
 * Created by army8735 on 2018/5/25.
 */

'use strict';

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
    return <li class={ item.isOwn ? 'own' : '' }>
      <div class="t">
        <div class="profile fn-clear">
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
      </div>
      <div class="wrap">
        <pre>{ item.content }</pre>
      </div>
    </li>;
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
