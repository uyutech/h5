/**
 * Created by army8735 on 2018/5/22.
 */

'use strict';

class Comment extends migi.Component {
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
      $list.on('click', '.time,.quote', function(e) {
        e.preventDefault();
        let $this = $(this);
        let url = $this.attr('href');
        let title = $this.attr('title');
        let transparentTitle = $this.attr('transparentTitle') === 'true';
        jsBridge.pushWindow(url, {
          title,
          transparentTitle,
        });
      });
      $list.on('click', '.reply', function() {
        $list.find('li.cur').removeClass('cur');
        let $this = $(this);
        $this.closest('li').addClass('cur');
        self.emit('reply', parseInt($this.attr('type')), parseInt($this.attr('rel')), parseInt($this.attr('pid')));
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
      s += self.genItem(item) || '';
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
      s += self.genItem(item) || '';
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
    let peopleUrl = comment.authorId
      ? '/author.html?id=' + comment.authorId
      : '/user.html?id=' + comment.userId;
    let url;
    let action;
    switch(item.type) {
      case 1:
        action = '回复作者页评论';
        url = '/author.html?id=' + item.refId;
        break;
      case 2:
        if(item.works) {
          action = '回复作品《' + item.works.title + '》评论';
        }
        else {
          action = '回复作品评论';
        }
        url = '/works.html?id=' + item.refId;
        break;
      case 3:
        action = '回复画圈页评论';
        url = '/post.html?id=' + item.refId;
        break;
      case 4:
        action = '评论画圈页';
        url = '/post.html?id=' + item.refId;
        break;
      case 5:
        if(item.works) {
          action = '评论了您参与的作品《' + item.works.title + '》';
        }
        else {
          action = '评论了您参与的作品';
        }
        url = '/works.html?id=' + item.refId;
        break;
      case 6:
        action = '给您的作者主页留言';
        url = '/author.html?id=' + item.refId;
        break;
    }
    return <li class={ (comment.authorId ? 'author' : 'user') + (item.isRead ? ' read' : '') }>
      <div class="profile">
        <a class="pic"
           href={ peopleUrl }
           title={ comment.name || comment.nickname }>
          <img src={ $util.img(comment.headUrl, 96, 96, 80) || '/src/common/head.png' }/>
        </a>
        <div class="txt">
          <a class="name"
             href={ peopleUrl }
             title={ comment.name || comment.nickname }>{ comment.name || comment.nickname }</a>
          <a class="time"
             title={ item.type !== 3 && item.type !== 4 ? '' : '画圈详情'  }
             transParentTitle={ item.type !== 3 && item.type !== 4 }
             href={ url }>{ $util.formatDate(comment.createTime) }</a>
        </div>
      </div>
      <div class="wrap">
        <div class="quote"
             title={ item.type !== 3 && item.type !== 4 ? '' : '画圈详情'  }
             transParentTitle={ item.type !== 3 && item.type !== 4 }
             href={ url }>
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
         type={ item.type }
         rel={ item.refId }
         pid={ comment.id }>回复</b>
    </li>;
  }
  render() {
    return <div class="mod-comment">
      <ol class="list"
          ref="list"/>
      <div class={ 'cp-message' + (this.message ? '' : ' fn-hide') } >{ this.message }</div>
    </div>;
  }
}

export default Comment;
