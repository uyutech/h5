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
    self.exist = {};
    self.on(migi.Event.DOM, function() {
      let $list = $(this.ref.list.element);
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
      $list.on('click', '.circle', function(e) {
        e.preventDefault();
        let $this = $(this);
        let url = $this.attr('href');
        let title = $this.attr('title');
        jsBridge.pushWindow(url, {
          title,
        });
      });
      $list.on('click', '.fn', function() {
        let id = $(this).attr('rel');
        migi.eventBus.emit('BOT_FN', {
          canFn: true,
          canBlock: true,
          canReport: true,
          clickBlock: function(botFn) {
            if(!util.isLogin()) {
              migi.eventBus.emit('NEED_LOGIN');
              return;
            }
            jsBridge.confirm('确认屏蔽吗？', function(res) {
              if(!res) {
                return;
              }
              net.postJSON('/h5/comment2/block', { id }, function(res) {
                if(res.success) {
                  jsBridge.toast('屏蔽成功');
                }
                else {
                  jsBridge.toast(res.message || util.ERROR_MESSAGE);
                }
                botFn.cancel();
              }, function(res) {
                jsBridge.toast(res.message || util.ERROR_MESSAGE);
                botFn.cancel();
              });
            });
          },
          clickReport: function(botFn) {
            jsBridge.confirm('确认举报吗？', function(res) {
              if(res) {
                net.postJSON('/h5/comment2/report', { id }, function(res) {
                  if(res) {
                    jsBridge.toast('举报成功');
                  }
                  else {
                    jsBridge.toast(res.message || util.ERROR_MESSAGE);
                  }
                  botFn.cancel();
                }, function(res) {
                  jsBridge.toast(res.message || util.ERROR_MESSAGE);
                  botFn.cancel();
                });
              }
            });
          },
        });
      });
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
      $list.on('click', '.comment', function() {
        let $this = $(this);
        let commentId = parseInt($this.attr('rel'));
        self.emit('reply', commentId);
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
    if(!data) {
      return;
    }
    let s = '';
    if(!Array.isArray(data)) {
      data = [data];
    }
    data.forEach(function(item) {
      s += self.genItem(item) || '';
    });
    $(self.ref.list.element).html(s);
    self.loadRef();
  }
  appendData(data) {
    let self = this;
    if(!data) {
      return;
    }
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
    if(!data) {
      return;
    }
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
    if(!item) {
      return;
    }
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
      ? '/author.html?id=' + item.aid
      : '/user.html?id=' + item.uid;
    let url = '/post.html?id=' + id;
    let videoList = [];
    let audioList = [];
    let imageList = [];
    item.work.forEach((item) => {
      if(item.kind === 1) {
        videoList.push(item);
      }
      else if(item.kind === 2) {
        audioList.push(item);
      }
    });
    item.media.forEach((item) => {
      switch(item.kind) {
        case 3:
          imageList.push(item);
          break;
      }
    });
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
                 href={ '/circle.html?id=' + circle.id }
                 title={ circle.name + '圈' }>{ circle.name }</a>
            </li>;
          })
        }
        </ul>
        {
          self.props.single
            ? ''
            : <b class="fn"
                 rel={ id }/>
        }
      </div>
      <div class="wrap">
        <div class="con" dangerouslySetInnerHTML={ html }/>
        {
          videoList.length
            ? <ul class="video">
              {
                videoList.map(function(item) {
                  let url = '/works.html?worksId=' + item.id + '&workId=' + item.id;
                  let author = [];
                  let hash = {};
                  (item.author || []).forEach(function(list) {
                    list.list.forEach(function(at) {
                      if(!hash[at.id]) {
                        hash[at.id] = true;
                        author.push(at.name);
                      }
                    });
                  });
                  return <li>
                    <a class="pic"
                       title={ item.title }
                       href={ url }>
                      <img src={ util.img(item.cover, 750, 0, 80) || '/src/common/blank.png' }/>
                      <div class="num">
                        <span class="play">{ util.abbrNum(item.views) }次播放</span>
                      </div>
                    </a>
                    <a class="name"
                       href={ url }
                       title={ item.title }>{ item.title }</a>
                    <div class="info">
                      <p class="author">{ author.join(' ') }</p>
                    </div>
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
                  let author = [];
                  let hash = {};
                  (item.author || []).forEach(function(list) {
                    list.list.forEach(function(at) {
                      if(!hash[at.id]) {
                        hash[at.id] = true;
                        author.push(at.name);
                      }
                    });
                  });
                  return <li>
                    <a class="pic"
                       title={ item.title }
                       href={ url }>
                      <img src={ util.img(item.cover, 750, 0, 80) || '/src/common/blank.png' }/>
                    </a>
                    <div class="txt">
                      <span class="name">{ item.title }</span>
                      <p class="author">{ author.join(' ') }</p>
                    </div>
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
  encode(s) {
    return s.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/#([^#\n\s]+?)#/g, function($0, $1) {
        return `<a class="link2" href="/tag.html?tag=${encodeURIComponent($1)}" title="话题-${$1}">#${$1}#</a>`;
      })
      .replace(/@\/\w+\/\d+\/?(\d+)?(\s|$)/g, function($0) {
        return `<span class="ref">${$0}</span>`;
      })
      .replace(/(http(?:s)?:\/\/[\w-]+\.[\w]+\S*)/gi, '<a class="outside" href="$1" target="_blank">$1</a>');
  }
  loadRef() {
    let self = this;
    let elems = self.ref.list.element.querySelectorAll('span.ref');
    let worksIdList = [];
    let workIdList = [];
    let authorIdList = [];
    let userIdList = [];
    let postIdList = [];
    elems.forEach((item) => {
      let match = item.innerHTML.match(/@\/(\w+)\/(\d+)\/?(\d+)?(\s|$)/);
      if(match) {
        switch(match[1]) {
          case 'works':
            worksIdList.push(match[2]);
            break;
          case 'work':
            workIdList.push(match[2]);
            break;
          case 'author':
            authorIdList.push(match[2]);
            break;
          case 'user':
            userIdList.push(match[2]);
            break;
          case 'post':
            postIdList.push(match[2]);
            break;
        }
      }
    });
    net.postJSON('/h5/post2/refList', {
      worksIdList, workIdList, authorIdList, userIdList, postIdList
    }, function(res) {
      if(res.success) {
        let data = res.data;
        let worksHash = {};
        let workHash = {};
        let authorHash = {};
        let userHash = {};
        let postHash = {};
        (data.worksList || []).forEach((item) => {
          if(item) {
            worksHash[item.id] = item;
          }
        });
        (data.workList || []).forEach((item) => {
          if(item) {
            workHash[item.id] = item;
          }
        });
        (data.authorList || []).forEach((item) => {
          if(item) {
            authorHash[item.id] = item;
          }
        });
        (data.userList || []).forEach((item) => {
          if(item) {
            userHash[item.id] = item;
          }
        });
        (data.postList || []).forEach((item) => {
          if(item) {
            postHash[item.id] = item;
          }
        });
        elems.forEach((item) => {
          let match = item.innerHTML.match(/@\/(\w+)\/(\d+)\/?(\d+)?(\s|$)/);
          if(match) {
            let node = document.createElement('a');
            switch(match[1]) {
              case 'works':
                if(!worksHash[match[2]]) {
                  return;
                }
                node.className = 'link';
                node.textContent = '《' + worksHash[match[2]].title + '》';
                item.parentNode.replaceChild(node, item);
                break;
              case 'work':
                if(!workHash[match[2]]) {
                  return;
                }
                node.className = 'link';
                node.textContent = '《' + workHash[match[2]].title + '》';
                item.parentNode.replaceChild(node, item);
                break;
              case 'author':
                if(!authorHash[match[2]]) {
                  return;
                }
                node.className = 'link';
                node.textContent = authorHash[match[2]].name;
                item.parentNode.replaceChild(node, item);
                break;
              case 'user':
                if(!userHash[match[2]]) {
                  return;
                }
                node.className = 'link';
                node.textContent = userHash[match[2]].nickname;
                item.parentNode.replaceChild(node, item);
                break;
              case 'post':
                if(!postHash[match[2]]) {
                  return;
                }
                node.className = 'link2';
                node.textContent = '画圈正文';
                item.parentNode.replaceChild(node, item);
                break;
            }
          }
        });
      }
    });
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
