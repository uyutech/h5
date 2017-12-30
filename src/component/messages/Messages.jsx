/**
 * Created by army8735 on 2017/11/18.
 */

'use strict';

import net from '../../common/net';
import util from '../../common/util';

class Messages extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    if(self.props.dataList && self.props.dataList.length) {
      self.empty = false;
      let html = '';
      self.props.dataList.forEach(function(item) {
        html += self.genItem(item);
      });
      self.html = html;
    }
    else {
      self.empty = true;
    }
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
        if(!url) {
          throw new Error('messages url is null');
        }
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
      url = '/author.html?authorID=' + item.urlID;
      title = item.Send_UserName;
    }
    else if(type === 2) {
      url = '/works.html?worksID=' + item.urlID;
      title = '作品详情';
    }
    else if(type === 3 || type === 4) {
      url = '/post.html?postID=' + item.urlID;
      title = '画圈正文';
    }
    if(item.Send_UserISAuthor) {
      return <li class="author" id={ 'message_' + item.NotifyID }>
        <div class="profile fn-clear">
          <img class="pic" src={ util.autoSsl(util.img96_96_80(item.Send_UserHeadUrl || '/src/common/head.png')) }/>
          <div class="txt">
            <a href={ '/author.html?authorID=' + item.Send_UserID } class="name" title={ item.Send_UserName }>{ item.Send_UserName }</a>
            <a class="time" href={ url } title={ title }>{ util.formatDate(item.Send_Time) }</a>
          </div>
        </div>
        <div class="wrap">
          <a class="quote" href={ url } title={ title }>
            <label>{ item.Action }：</label>
            <span>{ item.Content }</span>
          </a>
          <pre class="con">{ item.Send_Content }</pre>
          <ul class="btn fn-clear">
            <li class="comment" type={ type } cid={ item.ParentID } rid={ item.RootID } name={ item.Send_UserName } tid={ item.urlID }>回复</li>
          </ul>
          <b class="arrow"/>
        </div>
      </li>;
    }
    return <li id={ 'message_' + item.NotifyID }>
      <div class="profile fn-clear">
        <img class="pic" src={ util.autoSsl(util.img96_96_80(item.Send_UserHeadUrl || '/src/common/head.png')) }/>
        <div class="txt">
          <a href={ '/user.html?userID=' + item.Send_UserID } class="name" title={ item.Send_UserName }>{ item.Send_UserName }</a>
          <a class="time" href={ url } title={ title }>{ util.formatDate(item.Send_Time) }</a>
        </div>
      </div>
      <div class="wrap">
        <a class="quote" href={ url } title={ title }>
          <label>{ item.Action }：</label>
          <span>{ item.Content }</span>
        </a>
        <pre class="con">{ item.Send_Content }</pre>
        {
          type === 0
            ? ''
            : <ul class="btn fn-clear">
              <li class="comment" type={ type } cid={ item.ParentID } rid={ item.RootID } name={ item.Send_UserName } tid={ item.urlID }>回复</li>
            </ul>
        }
        <b class="arrow"/>
      </div>
    </li>;
  }
  setData(data) {
    let self = this;
    let html = '';
    data.forEach(function(item) {
      html += self.genItem(item);
    });
    $(self.ref.list.element).html(html);
  }
  appendData(data) {
    let self = this;
    let html = '';
    data.forEach(function(item) {
      html += self.genItem(item);
    });
    $(self.ref.list.element).append(html);
  }
  appendChild(content, mid) {
    let $li = $('#' + mid);
    $li.find('.wrap').append(`<pre class="reply">我：${content}</pre>`);
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
