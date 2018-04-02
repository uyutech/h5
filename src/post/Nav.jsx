/**
 * Created by army8735 on 2018/4/2.
 */

'use strict';

import util from '../common/util';

class Nav extends migi.Component {
  constructor(...data) {
    super(...data);
    this.data = {};
  }
  @bind data
  @bind html
  setData(data) {
    let self = this;
    self.data = data;
    self.html = self.encode(data.content);
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
    return <div class="mod-nav">
      <div class={ 'profile' + (this.data.isAuthor ? ' author' : '') }>
        <a class="pic">
          <img src={ util.autoSsl(util.img128_128_80(this.data.headUrl)) || '/src/common/head.png' }/>
        </a>
        <div class="txt">
          <a class="name">{ this.data.name || this.data.nickname }</a>
          <span class="time"
                title={ this.data.createTime }>
            { this.data.createTime ? util.formatDate(this.data.createTime) : '' }
          </span>
        </div>
      </div>
      <div class="wrap">
        <div class="con" dangerouslySetInnerHTML={ this.html }/>
        <b class="arrow"/>
      </div>
      <ul class="btn">
        <li class="share" onClick={ this.share }><b/><span>分享</span></li>
        <li class={ 'favor' + (this.isFavor ? ' favored' : '') } onClick={ this.favor }>
          <b/><span>{ this.data.favorCount || '收藏' }</span>
        </li>
        <li class={ 'like' + (this.isLike ? ' has' : '') } onClick={ this.like }>
          <b/><span>{ this.data.likeCount || '点赞' }</span>
        </li>
        <li class="comment">
          <b/><span>{ this.data.commentCount || '评论' }</span>
        </li>
        { this.data.isOwn ? <li class="del" onClick={ this.del }><b/></li> : '' }
      </ul>
    </div>;
  }
}

export default Nav;
