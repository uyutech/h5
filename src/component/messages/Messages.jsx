/**
 * Created by army8735 on 2017/11/18.
 */

'use strict';

class Messages extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.empty = self.props.empty;
    self.on(migi.Event.DOM, function() {
      let $list = $(self.ref.list.element);
      $list.on('click', '.comment', function() {
        let $comment = $(this);
        let $li = $comment.closest('ul').closest('li');
        $list.children('li.cur').removeClass('cur');
        $li.addClass('cur');
        self.emit('comment', $li.attr('id'), $comment.attr('rid'), $comment.attr('cid'), $comment.attr('name'), parseInt($comment.attr('type')), $comment.attr('tid'));
      });
      $list.on('click', 'a', function(e) {
        e.preventDefault();
        let $this = $(this);
        let url = $this.attr('href');
        if(url.charAt(0) === '#') {
          return;
        }
        let title = $this.attr('title');
        jsBridge.pushWindow(url, {
          title,
        });
      });
    });
  }
  @bind message
  @bind empty
  genItem(item) {
    let type = item.TargetType;
    let url = '#';
    let title = '';
    if(type === 1) {
      url = '/author.html?id=' + item.urlID;
      title = item.Send_UserName;
    }
    else if(type === 2) {
      url = '/works.html?id=' + item.urlID;
      title = '作品详情';
    }
    else if(type === 3 || type === 4) {
      url = '/post.html?id=' + item.urlID;
      title = '画圈正文';
    }
    let link = item.Send_UserISAuthor
      ? ('/author.html?id=' + item.Send_UserID)
      : ('/user.html?id=' + item.Send_UserID);
    return <li class={ item.Send_UserISAuthor ? 'author' : '' }
               id={ 'message_' + item.NotifyID }>
      <div class="profile fn-clear">
        <img class="pic"
             src={ $util.img(item.Send_UserHeadUrl, 96, 96, 80) || '/src/common/head.png' }/>
        <div class="txt">
          <a href={ link }
             class="name"
             title={ item.Send_UserName }>{ item.Send_UserName }</a>
          <a class="time"
             href={ url }
             title={ title }>{ $util.formatDate(item.Send_Time) }</a>
        </div>
      </div>
      <div class="wrap">
        <a class="quote"
           href={ url }
           title={ title }>
          <label>{ item.Action }：</label>
          <span>{ this.props.ellipsis && item.Content && item.Content.length > 50 ? (item.Content.slice(0, 50) + '...') : item.Content }</span>
        </a>
        <pre class="con">{ item.Send_Content }</pre>
        <ul class="btn fn-clear">
          <li class="comment"
              type={ type }
              cid={ item.ParentID }
              rid={ item.RootID }
              name={ item.Send_UserName }
              tid={ item.urlID }>回复</li>
        </ul>
        <b class="arrow"/>
      </div>
    </li>;
  }
  setData(data) {
    let self = this;
    let html = '';
    (data || []).forEach(function(item) {
      html += self.genItem(item);
    });
    $(self.ref.list.element).html(html);
  }
  appendData(data) {
    let self = this;
    let html = '';
    (data || []).forEach(function(item) {
      html += self.genItem(item);
    });
    $(self.ref.list.element).append(html);
  }
  appendChild(content, mid) {
    let $li = $('#' + mid);
    $li.find('.wrap').append(`<pre class="reply">我：${content}</pre>`);
  }
  clearData() {
    let self = this;
    $(self.ref.list.element).html('');
  }
  render() {
    return <div class="cp-messages">
      <ol class={ 'list' + (this.empty ? ' fn-hide' : '') } ref="list" dangerouslySetInnerHTML={ this.html }/>
      <div class={ 'empty' + (this.empty ? '' : ' fn-hide') }>还没有人回复你哦~</div>
      <div class={ 'cp-message' + (this.message ? '' : ' fn-hide') }>{ this.message }</div>
    </div>;
  }
}

export default Messages;
