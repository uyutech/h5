/**
 * Created by army8735 on 2018/4/2.
 */

'use strict';

import util from '../../common/util';
import net from '../../common/net';

const MAX_LEN = 144;

class PostList extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.visible = self.props.visible;
    self.message = self.props.message;
    self.on(migi.Event.DOM, function() {
      let $list = $(this.ref.list.element);
      $list.on('click', '.like', function() {
        let $this = $(this);
        let commentId = parseInt($this.attr('rel'));
        let isLike = $this.hasClass('liked');
        let url = isLike ? '/h5/comment2/unLike' : '/h5/comment2/like';
        net.postJSON(url, { commentId }, function(res) {
          if(res.success) {
            let data = res.data;
            if(data.state) {
              $this.addClass('liked');
            }
            else {
              $this.removeClass('liked');
            }
            $this.text(data.count || '点赞');
            self.emit('like', commentId, data);
          }
          else if(res.code === 1000) {
            migi.eventBus.emit('NEED_LOGIN');
          }
          else {
            jsBridge.toast(res.message || util.ERROR_MESSAGE);
          }
        });
      });
      $list.on('click', '.favor', function() {
        let $this = $(this);
        let commentId = parseInt($this.attr('rel'));
        let isFavor = $this.hasClass('favored');
        let url = isFavor ? '/h5/comment2/unFavor' : '/h5/comment2/favor';
        net.postJSON(url, { commentId }, function(res) {
          if(res.success) {
            let data = res.data;
            if(data.state) {
              $this.addClass('favored');
            }
            else {
              $this.removeClass('favored');
            }
            $this.text(data.count || '收藏');
            self.emit('favor', commentId, data);
          }
          else if(res.code === 1000) {
            migi.eventBus.emit('NEED_LOGIN');
          }
          else {
            jsBridge.toast(res.message || util.ERROR_MESSAGE);
          }
        });
      });
      $list.on('click', '.time', function(e) {
        e.preventDefault();
        let url = $(this).attr('href');
        jsBridge.pushWindow(url, {
          title: '画圈详情',
        });
      });
      $list.on('click', '.more, .less', function() {
        let $li = $(this).closest('li');
        $li.find('.snap, .full, .more, .less').toggleClass('fn-hide');
      });
    });
  }
  @bind message
  @bind visible
  setData(data) {
    let self = this;
    self.exist = {};
    let s = '';
    if(!Array.isArray(data)) {
      data = [data];
    }
    (data || []).forEach(function(item) {
      s += self.genItem(item) || '';
    });
    $(self.ref.list.element).html(s);
  }
  appendData(data) {
    let self = this;
    let s = '';
    if(!Array.isArray(data)) {
      data = [data];
    }
    (data || []).forEach(function(item) {
      s += self.genItem(item) || '';
    });
    $(self.ref.list.element).append(s);
  }
  clearData() {
    let self = this;
    self.exist = {};
    $(self.ref.list.element).html('');
  }
  prependData(data) {
    let self = this;
    let s = '';
    if(!Array.isArray(data)) {
      data = [data];
    }
    (data || []).forEach(function(item) {
      s += self.genItem(item) || '';
    });
    $(self.ref.list.element).prepend(s);
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
      let full = this.encode(item.content, item.reference) + '<span class="placeholder"></span><span class="less fn-hide">收起全文</span>';
      html = `<p class="snap">${html}</p><p class="full fn-hide">${full}</p>`;
    }
    let peopleUrl = item.isAuthor
      ? '/author.html?authorId=' + item.authorId
      : '/user.html?userId=' + item.userId;
    let url = '/post.html?postId=' + id;
    let videoList = [];
    let audioList = [];
    let imageList = [];
    if(item.media && item.media.length) {
      item.media.forEach(function(item) {
        switch(item.kind) {
          case 0:
            imageList.push(item);
            break;
          case 1:
            videoList.push(item);
            break;
          case 2:
            audioList.push(item);
            break;
        }
      });
    }
    return <li class={ item.isAuthor ? 'author'  : 'user' }>
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
        <ul class="circle">
        {
          (item.circle || []).map(function(circle) {
            return <li>
              <a class="circle"
                 href={ '/circle.html?circleId=' + circle.id }>{ circle.name }</a>
            </li>;
          })
        }
        </ul>
      </div>
      <div class="wrap">
        <div class="con" dangerouslySetInnerHTML={ html }/>
        {
          item.media && item.media.length
            ? <div class="media">
              {
                videoList.length
                  ? <ul class="video">
                    {
                      videoList.map(function(item) {
                        return <li>
                          <b class="play"/>
                        </li>;
                      })
                    }
                    </ul>
                  : ''
              }
              {
                audioList.length
                  ? <ul class="audio">
                    {
                      audioList.map(function(item) {
                        return <li>
                          <b class="play"/>
                        </li>;
                      })
                    }
                    </ul>
                  : ''
              }
              {
                imageList.length
                  ? <ul class="image">
                    {
                      imageList.map(function(item) {
                        return <li>
                          <img src={ self.props.single
                            ? util.img(item.url, 750, 0, 80)
                            : util.img(item.url, 200, 200, 80)}/>
                        </li>;
                      })
                    }
                    </ul>
                  : ''
              }
              </div>
            : ''
        }
      </div>
      <ul class="btn">
        <li class="share">分享</li>
        <li class={ 'favor' + (item.isFavor ? ' favored' : '') }
            rel={ id }>{ item.favorCount || '收藏' }</li>
        <li class={ 'like' + (item.isLike ? ' liked' : '') }
            rel={ id }>{ item.likeCount || '点赞' }</li>
        <li class="comment"
            rel={ id }>{ item.replyCount || '评论' }</li>
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
    return <div class={ 'cp-postlist' + (this.visible ? '' : ' fn-hide') }>
      <ol class="list"
          ref="list"/>
      <div class={ 'cp-message' + (this.message ? '' : ' fn-hide') } >{ this.message }</div>
    </div>;
  }
}

export default PostList;
