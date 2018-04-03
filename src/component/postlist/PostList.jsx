/**
 * Created by army8735 on 2018/4/2.
 */

'use strict';

import util from "../../common/util";

const MAX_LEN = 144;

class PostList extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.message = self.props.message;
    self.on(migi.Event.DOM, function() {
      let $list = $(this.ref.list.element);
    });
  }
  @bind message
  setData(data) {
    let self = this;
    self.exist = {};
    let html = '';
    (data || []).forEach(function(item) {
      html += self.genItem(item) || '';
    });
    $(self.ref.list.element).html(html);
  }
  appendData(data) {
    let self = this;
    let html = '';
    (data || []).forEach(function(item) {
      html += self.genItem(item) || '';
    });
    $(self.ref.list.element).append(html);
  }
  clearData() {
    let self = this;
    self.exist = {};
    $(self.ref.list.element).html('');
  }
  prependData(data) {
    let self = this;
    let html = '';
    data = data || [];
    if(!Array.isArray(data)) {
      data = [data];
    }
    (data || []).forEach(function(item) {
      html += self.genItem(item) || '';
    });
    $(self.ref.list.element).prepend(html);
  }
  genItem(item) {
    let self = this;
    let id = item.id;
    if(self.exist[id]) {
      return;
    }
    self.exist[id] = true;
    let len = item.content.length;
    let html = len > MAX_LEN ? (item.content.slice(0, MAX_LEN) + '...') : item.content;
    html = this.encode(html, item.reference);
    if(len > MAX_LEN) {
      html += '<span class="placeholder"></span><span class="more">查看全文</span>';
      let full = this.encode(item.content, item.reference) + '<span class="placeholder"></span><span class="shrink">收起全文</span>';
      html = `<p class="snap">${html}</p><p class="full">${full}</p>`;
    }
    let peopleUrl = item.isAuthor
      ? '/author.html?authorId=' + item.authorId
      : '/user.html?userId=' + item.userId;
    let url = '/post.html?postId=' + id;
    return <li class={ item.isAuthor ? 'author'  : 'user' }
               id={ 'post_' + id }>
      <div class="profile">
        <a class="pic"
           href={ peopleUrl }
           title={ item.name || item.nickname }>
          <img src={ util.autoSsl(util.img208_208_80(item.headUrl
            || '/src/common/head.png')) }/>
        </a>
        <div class="txt">
          <a class="name"
             href={ peopleUrl }
             title={ item.name || item.nickname }>{ item.name || item.nickname }</a>
          <a class="time"
             title={ item.createTime }
             href={ url }>{ util.formatDate(item.createTime)}</a>
        </div>
      </div>
      <div class="wrap">
        <div class="con" dangerouslySetInnerHTML={ html }/>
        <b class="arrow"/>
      </div>
      <ul class="btn">
        <li class="share" onClick={ this.share }><b/><span>分享</span></li>
        <li class={ 'favor' + (item.isFavor ? ' favored' : '') } onClick={ this.favor }>
          <b/><span>{ item.favorCount || '收藏' }</span>
        </li>
        <li class={ 'like' + (item.isLike ? ' has' : '') } onClick={ this.like }>
          <b/><span>{ item.likeCount || '点赞' }</span>
        </li>
        <li class="comment">
          <b/><span>{ item.commentCount || '评论' }</span>
        </li>
        { item.isOwn ? <li class="del" onClick={ this.del }><b/></li> : '' }
      </ul>
    </li>;
  }
  encode(s, reference) {
    reference = reference || [];
    let index = 0;
    return s.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/#([^#\n\s]+?)#/g, function($0, $1) {
        return `<a href="tag.html?tag=${encodeURIComponent($1)}" title="话题-${$1}">#${$1}#</a>`;
      })
      .replace(/@\/(\w+)\/(\d+)\/?(\d+)?(\s|$)/g, function($0, $1, $2, $3, $4) {
        let data = reference[index];
        index++;
        switch($1) {
          case 'works':
            let worksName = '';
            if(data) {
              worksName += '《' + data.Title;
            }
            if($3) {
              if(data) {
                let sub = ((data.Works_Items || [])[0] || {}).ItemName || '';
                if(sub) {
                  worksName += ' ' + sub;
                }
                worksName += '》';
              }
              worksName += $4;
              return `<a href="/${$1}.html?worksId=${$2}&workId=${$3}" class="link" transparentTitle="true">${worksName}</a>`;
            }
            if(data) {
              worksName += '》';
            }
            worksName += $4;
            return `<a href="/${$1}.html?worksId=${$2}" class="link" transparentTitle="true">${worksName}</a>`;
          case 'post':
            let postName = '';
            if(data) {
              postName += data.Content.length > 10 ? (data.Content.slice(0, 10) + '...') : data.Content;
            }
            postName += $4;
            return `<a href="/${$1}.html?postId=${$2}" class="link" title="画圈正文">${postName}</a>`;
          case 'author':
            let authorName = '';
            if(data) {
              authorName += data.AuthorName;
            }
            authorName += $4;
            return `<a href="/${$1}.html?authorId=${$2}" class="link" transparentTitle="true">${authorName}</a>`;
          case 'user':
            let userName = '';
            if(data) {
              userName += data.NickName;
            }
            userName += $4;
            return `<a href="/${$1}.html?userID=${$2}" class="link" transparentTitle="true">${userName}</a>`;
        }
        return $0;
      })
      .replace(/(http(?:s)?:\/\/[\w-]+\.[\w]+\S*)/gi, '<a href="$1" target="_blank">$1</a>');
  }
  render() {
    return <div class="cp-postlist">
      <ol class="list" ref="list"/>
      <div class={ 'cp-message' + (this.message ? '' : ' fn-hide') } >{ this.message }</div>
    </div>;
  }
}

export default PostList;
