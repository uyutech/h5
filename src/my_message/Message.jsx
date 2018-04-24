/**
 * Created by army8735 on 2018/4/12.
 */

'use strict';

class Message extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.message = self.props.message;
    self.exist = {};
    self.on(migi.Event.DOM, function() {
      let $list = $(self.ref.list.element);
      $list.on('click', '.pic,.name', function(e) {
        e.preventDefault();
        let $this = $(this);
        let url = $this.attr('href');
        let title = $this.attr('title');
        jsBridge.pushWindow(url, {
          title,
          transparentTitle: true,
        });
      });
      $list.on('click', '.time', function(e) {
        e.preventDefault();
        let $this = $(this);
        let url = $this.attr('href');
        let transparentTitle = $this.attr('transparentTitle') === 'true';
        jsBridge.pushWindow(url, {
          transparentTitle,
        });
      });
      $list.on('click', '.reply', function() {
        $list.find('li.cur').removeClass('cur');
        let $this = $(this);
        $this.closest('li').addClass('cur');
        let id = $this.attr('rel');
        self.emit('reply', id);
      });
    });
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
      s += self.genItem(item);
    });
    $(self.ref.list.element).html(s);
  }
  clearData() {
    let self = this;
    self.exist = {};
  }
  appendData(data) {
    let self = this;
    if(!data) {
      return;
    }
    if(!Array.isArray(data)) {
      data = [data];
    }
    let s = '';
    data.forEach((item) => {
      s += self.genItem(item);
    });
    $(self.ref.list.element).append(s);
  }
  genItem(item) {
    let self = this;
    let id = item.id;
    if(self.exist[id]) {
      return;
    }
    self.exist[id] = true;
    let comment = item.comment;
    let peopleUrl = comment.isAuthor
      ? '/author.html?id=' + comment.authorId
      : '/user.html?id=' + comment.userId;
    let url;
    let action;
    switch(item.type) {
      case 1:
        action = '回复了作者页评论';
        url = '/author.html?id=' + item.refId;
        break;
      case 2:
        action = '回复了作品页评论';
        url = '/works.html?id=' + item.refId;
        break;
      case 3:
        action = '回复了画圈页评论';
        url = '/post.html?id=' + item.refId;
        break;
      case 4:
        action = '回复了画圈';
        url = '/post.html?id=' + item.refId;
        break;
    }
    return <li class={ (comment.isAuthor ? 'author' : 'user') + (item.isRead ? ' read' : '') }>
      <div class="profile">
        <a class="pic"
           href={ peopleUrl }
           title={ comment.name || comment.nickname }>
          <img src={ $util.img(comment.headUrl, 208, 208, 80) || '/src/common/head.png' }/>
        </a>
        <div class="txt">
          <a class="name"
             href={ peopleUrl }
             title={ comment.name || comment.nickname }>{ comment.name || comment.nickname }</a>
          <a class="time"
             transParentTitle={ item.type !== 4 }
             href={ url }>{ $util.formatDate(comment.createTime)}</a>
        </div>
      </div>
      <div class="wrap">
        <div class="quote">
          <span>{ action }</span>
          {
            comment.quote
              ? <p>{ comment.quote.isDelete ? '内容已删除' : comment.quote.content }</p>
              : ''
          }
        </div>
        <div class="con">{ comment.content }</div>
      </div>
      <b class="reply"
         rel={ comment.id }>回复</b>
    </li>;
  }
  render() {
    return <div class="mod-message">
      <ol class="list"
          ref="list"/>
      <div class={ 'cp-message' + (this.message ? '' : ' fn-hide') } >{ this.message }</div>
    </div>;
  }
}

export default Message;
