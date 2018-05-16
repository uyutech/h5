/**
 * Created by army8735 on 2018/4/2.
 */

'use strict';

const MAX_LEN = 144;

class PostList extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.visible = self.props.visible;
    self.message = self.props.message;
    self.exist = {};
    self.list = [];
    self.on(migi.Event.DOM, function() {
      let $list = $(this.ref.list.element);
      $list.on('click', '.profile .pic,.profile .name', function(e) {
        e.preventDefault();
        if(self.props.disabledClickPerson) {
          return;
        }
        let $this = $(this);
        let url = $this.attr('href');
        let title = $this.attr('title');
        jsBridge.pushWindow(url, {
          title,
          transparentTitle: true,
        });
      });
      $list.on('click', '.profile .time', function(e) {
        e.preventDefault();
        let $this = $(this);
        if(self.props.single) {
          jsBridge.toast($this.attr('title'));
        }
        else {
          let url = $this.attr('href');
          jsBridge.pushWindow(url, {
            title: '画圈详情',
          });
        }
      });
      $list.on('click', '.circle', function(e) {
        e.preventDefault();
        let $this = $(this);
        let url = $this.attr('href');
        let title = $this.attr('title');
        jsBridge.pushWindow(url, {
          title,
          transparentTitle: true,
        });
      });
      $list.on('click', '.fn', function() {
        let $fn = $(this);
        let id = parseInt($fn.attr('rel'));
        migi.eventBus.emit('BOT_FN', {
          canFn: true,
          canReport: true,
          canDel: $fn.attr('own') === 'true',
          clickReport: function(botFn) {
            jsBridge.confirm('确认举报吗？', function(res) {
              if(res) {
                $net.postJSON('/h5/comment/report', { id }, function(res) {
                  if(res) {
                    jsBridge.toast('举报成功');
                  }
                  else {
                    jsBridge.toast(res.message || $util.ERROR_MESSAGE);
                  }
                  botFn.cancel();
                }, function(res) {
                  jsBridge.toast(res.message || $util.ERROR_MESSAGE);
                  botFn.cancel();
                });
              }
            });
          },
          clickDel: function(botFn) {
            jsBridge.confirm('确定要删除吗？', function(res) {
              if(!res) {
                return;
              }
              $net.postJSON('/h5/comment/del', { id }, function(res) {
                if(res.success) {
                  $fn.closest('li').remove();
                  self.empty = !$(self.ref.list.element).children('li').length;
                  botFn.cancel();
                  self.emit('del', id);
                }
                else {
                  jsBridge.toast(res.message || $util.ERROR_MESSAGE);
                }
              }, function(res) {
                jsBridge.toast(res.message || $util.ERROR_MESSAGE);
              });
            });
          },
        });
      });
      $list.on('click', '.link', function(e) {
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
      $list.on('click', '.outside', function(e) {
        e.preventDefault();
        let url = $(this).attr('href');
        jsBridge.confirm('即将前往站外链接，确定吗？', function(res) {
          if(!res) {
            return;
          }
          jsBridge.openUri(url);
        });
      });
      $list.on('click', '.video .name, .audio .name', function(e) {
        e.preventDefault();
        let $this = $(this);
        let url = $this.attr('href');
        let title = $this.attr('title');
        jsBridge.pushWindow(url, {
          title,
          transparentTitle: true,
        });
      });
      $list.on('click', '.share', function() {
        let id = parseInt($(this).attr('rel'));
        migi.eventBus.emit('BOT_FN', {
          canShare: true,
          canShareLink: true,
          clickShareLink: function(botFn) {
            let url = window.ROOT_DOMAIN + '/post/' + id;
            $util.setClipboard(url);
            botFn.cancel();
          },
        });
        self.emit('clickShare');
      });
      $list.on('click', '.like', function() {
        let $this = $(this);
        if($this.hasClass('loading')) {
          return;
        }
        $this.addClass('loading');
        let id = parseInt($this.attr('rel'));
        let url = $this.hasClass('liked') ? '/h5/comment/unLike' : '/h5/comment/like';
        $net.postJSON(url, { id }, function(res) {
          if(res.success) {
            let data = res.data;
            if(data.state) {
              $this.addClass('liked');
            }
            else {
              $this.removeClass('liked');
            }
            $this.text(data.count || '点赞');
            self.emit('like', id, data);
          }
          else if(res.code === 1000) {
            migi.eventBus.emit('NEED_LOGIN');
          }
          else {
            jsBridge.toast(res.message || $util.ERROR_MESSAGE);
          }
          $this.removeClass('loading');
        }, function(res) {
          jsBridge.toast(res.message || $util.ERROR_MESSAGE);
          $this.removeClass('loading');
        });
        self.emit('clickLike');
      });
      $list.on('click', '.favor', function() {
        let $this = $(this);
        if($this.hasClass('loading')) {
          return;
        }
        $this.addClass('loading');
        let id = parseInt($this.attr('rel'));
        let url = $this.hasClass('favored') ? '/h5/comment/unFavor' : '/h5/comment/favor';
        $net.postJSON(url, { id }, function(res) {
          if(res.success) {
            let data = res.data;
            if(data.state) {
              $this.addClass('favored');
            }
            else {
              $this.removeClass('favored');
            }
            $this.text(data.count || '收藏');
            self.emit('favor', id, data);
          }
          else if(res.code === 1000) {
            migi.eventBus.emit('NEED_LOGIN');
          }
          else {
            jsBridge.toast(res.message || $util.ERROR_MESSAGE);
          }
          $this.removeClass('loading');
        }, function(res) {
          jsBridge.toast(res.message || $util.ERROR_MESSAGE);
          $this.removeClass('loading');
        });
        self.emit('clickFavor');
      });
      $list.on('click', '.comment', function() {
        let $this = $(this);
        let id = parseInt($this.attr('rel'));
        if(self.props.single) {
          jsBridge.pushWindow('/sub_comment.html?type=3&id=' + id + '&pid=' + id, {
            title: '评论',
            optionMenu: '发布',
          });
        }
        else {
          if(parseInt($this.text())) {
            jsBridge.pushWindow('/post.html?id=' + id, {
              title: '画圈详情',
            });
          }
          else {
            jsBridge.pushWindow('/sub_comment.html?type=3&id=' + id + '&pid=' + id, {
              title: '评论',
              optionMenu: '发布',
            });
          }
        }
        self.emit('clickComment');
      });
      $list.on('click', '.more, .less', function() {
        let $li = $(this).closest('li');
        $li.find('.snap, .full, .more, .less').toggleClass('fn-hide');
        self.emit('clickMore');
      });
      migi.eventBus.on('PLAY_INLINE', function() {
        $list.find('.video .pic.play,.audio .pic.play').removeClass('play');
        $list.find('video').each(function(i, o) {
          o.pause();
        });
      });
      jsBridge.on('mediaPlay', function() {
        $list.find('.video .pic.play,.audio .pic.play').removeClass('play');
        $list.find('video').each(function(i, o) {
          o.pause();
        });
      });
      $list.on('click', '.video .pic', function() {
        jsBridge.media({
          key: 'stop',
        });
        let $this = $(this);
        let workId = parseInt($this.attr('workId'));
        let worksId = parseInt($this.attr('worksId'));
        let video = this.querySelector('video');
        if($this.hasClass('first')) {
          $this.removeClass('first');
          outer:
          for(let i = 0, len = self.list.length; i < len; i++) {
            let item = self.list[i].work;
            for(let j = 0; j < item.length; j++) {
              let av = item[j];
              if(av.id === worksId && av.work.id === workId) {
                let o = av.work;
                o.worksId = worksId;
                o.worksCover = av.cover;
                o.worksTitle = av.title;
                $util.recordPlay(o);
                $net.postJSON('/h5/work/addViews', { id: workId });
                break outer;
              }
            }
          }
        }
        if($this.hasClass('play')) {
          $this.removeClass('play');
          video.pause();
        }
        else {
          migi.eventBus.emit('PLAY_INLINE');
          $this.addClass('play');
          video.play();
        }
        self.emit('clickPlay');
      });
      $list.on('click', '.audio .pic', function() {
        let $this = $(this);
        let $li = $this.closest('li');
        let workId = parseInt($this.attr('workId'));
        let worksId = parseInt($this.attr('worksId'));
        if($this.hasClass('first')) {
          $this.removeClass('first');
          outer:
          for(let i = 0, len = self.list.length; i < len; i++) {
            let item = self.list[i].work;
            for(let j = 0; j < item.length; j++) {
              let av = item[j];
              if(av.id === worksId && av.work.id === workId) {
                let o = av.work;
                o.worksId = worksId;
                o.worksCover = av.cover;
                o.worksTitle = av.title;
                $util.recordPlay(o);
                $net.postJSON('/h5/work/addViews', { id: workId });
                break outer;
              }
            }
          }
        }
        if($this.hasClass('play')) {
          $this.removeClass('play');
          jsBridge.media({
            key: 'pause',
          });
        }
        else {
          migi.eventBus.emit('PLAY_INLINE');
          if(jsBridge.ios) {
            jsBridge.media({
              key: 'play',
              value: {
                id: $this.attr('workId'),
                url: location.protocol + $util.autoSsl($this.attr('url')),
              },
            });
          }
          else {
            jsBridge.media({
              key: 'play',
              value: {
                id: $this.attr('workId'),
                url: location.protocol + $util.autoSsl($this.attr('url')),
                title: $li.find('.name').text(),
                author: $li.find('.author').text(),
                cover: $util.protocol($util.img($this.find('img').attr('src'), 80, 80, 80)),
              },
            });
          }
        }
        self.emit('clickPlay');
      });
      $list.on('click', '.image img', function() {
        let list = [];
        let $this = $(this);
        let index = parseInt($this.attr('i'));
        let $image = $this.closest('ul');
        $image.find('img').each(function(i, o) {
          list.push({
            url: $util.img(o.src),
            preview: o.src,
            width: parseInt(o.getAttribute('w')),
            height: parseInt(o.getAttribute('h')),
          });
        });
        migi.eventBus.emit('IMAGE_VIEW', list, index);
      });
      jsBridge.on('resume', function(e) {
        let data = e.data;
        if(data && data.type && data.type === 'subComment') {
          let id = data.data.rid;
          let $comment = $('#post_' + id).find('.btn .comment');
          if($comment[0]) {
            let n = parseInt($comment.text()) || 0;
            $comment.text(n + 1);
          }
        }
      });
    });
  }
  @bind message
  @bind visible
  setData(data) {
    let self = this;
    self.clearData();
    if(!data) {
      return;
    }
    let s = '';
    if(!Array.isArray(data)) {
      data = [data];
    }
    data.forEach(function(item) {
      let o = self.genItem(item);
      if(o) {
        self.list.push(item);
        s += o;
      }
    });
    $(self.ref.list.element).html(s);
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
    data.forEach(function(item) {
      let o = self.genItem(item);
      if(o) {
        self.list.push(item);
        s += o;
      }
    });
    $(self.ref.list.element).append(s);
  }
  clearData() {
    let self = this;
    self.exist = {};
    self.list = [];
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
    data.forEach(function(item) {
      let o = self.genItem(item);
      if(o) {
        self.list.unshift(item);
        s += o;
      }
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
    let html;
    if(self.props.single) {
      html = this.encode(item.content, item.refHash, item.tagCircleHash);
    }
    else {
      html = len > MAX_LEN ? (item.content.slice(0, MAX_LEN) + '...') : item.content;
      html = this.encode(html, item.refHash, item.tagCircleHash);
      if(len > MAX_LEN) {
        html += '<span class="placeholder"></span><span class="more">查看全文</span>';
        let full = this.encode(item.content, item.refHash, item.tagCircleHash) + '<span class="placeholder"></span><span class="less fn-hide">收起全文</span>';
        html = `<p class="snap">${html}</p><p class="full fn-hide">${full}</p>`;
      }
    }
    let peopleUrl = item.authorId
      ? '/author.html?id=' + item.authorId
      : '/user.html?id=' + item.userId;
    let url = '/post.html?id=' + id;
    let videoList = [];
    let audioList = [];
    let imageList = [];
    item.work.forEach((item) => {
      if(item) {
        if(item.work.kind === 1) {
          videoList.push(item);
        }
        else if(item.work.kind === 2) {
          audioList.push(item);
        }
        else if(item.work.kind === 3) {
          imageList.push(item);
        }
      }
    });
    item.media.forEach((item) => {
      switch(item.kind) {
        case 3:
          imageList.push(item);
          break;
      }
    });
    return <li id={ 'post_' + id }
               class={ item.authorId ? 'author'  : 'user' }>
      <div class="profile">
        <a class="pic"
           href={ peopleUrl }
           title={ item.name || item.nickname }>
          <img src={ $util.img(item.headUrl, 208, 208, 80) || '/src/common/head.png' }/>
        </a>
        <div class="txt">
          <a class="name"
             href={ peopleUrl }
             title={ item.name || item.nickname }>{ item.name || item.nickname }</a>
          <a class="time"
             title={ moment(item.createTime).format('YYYY-MM-DD HH:mm:ss') }
             href={ url }>{ item.typeName || $util.formatDate(item.createTime)}</a>
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
                 rel={ id }
                 own={ item.isOwn }/>
        }
      </div>
      <div class="wrap">
        <div class="con"
             dangerouslySetInnerHTML={ html }/>
        {
          imageList.length
            ? <ul class="image">
              {
                imageList.map(function(item, i) {
                  if(item.work) {
                    return <li>
                      <img src={ self.props.single
                        ? $util.img(item.work.url, 750, 0, 80)
                        : $util.img(item.work.url, 220, 220, 80)}
                           i={ i }
                           w={ item.work.width }
                           h={ item.work.height }/>
                    </li>;
                  }
                  return <li>
                    <img src={ self.props.single
                      ? $util.img(item.url, 750, 0, 80)
                      : $util.img(item.url, 220, 220, 80)}
                         i={ i }
                         w={ item.width }
                         h={ item.height }/>
                  </li>;
                })
              }
            </ul>
            : ''
        }
        {
          videoList.length
            ? <ul class="video">
              {
                videoList.map(function(item) {
                  let url = '/works.html?id=' + item.id + '&workId=' + item.work.id;
                  let author = [];
                  let hash = {};
                  item.work.author.forEach(function(item) {
                    item.list.forEach(function(at) {
                      if(!hash[at.id]) {
                        hash[at.id] = true;
                        author.push(at.name);
                      }
                    });
                  });
                  return <li>
                    <div class="pic first"
                         worksId={ item.id }
                         workId={ item.work.id }>
                      <img src={ $util.img(item.work.cover || item.cover, 750, 0, 80) || '/src/common/blank.png' }/>
                      <div class="num">
                        <span class="play">{ $util.abbrNum(item.work.views) }次播放</span>
                      </div>
                      <video poster="/src/common/blank.png"
                             src={ item.work.url }
                             preload="meta"
                             playsinline="true"
                             webkit-playsinline="true"/>
                    </div>
                    <a class="name"
                       href={ url }
                       title={ item.title }>{ item.work.title }</a>
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
          audioList.length && !videoList.length
            ? <ul class="audio">
              {
                audioList.map(function(item) {
                  let url = '/works.html?id=' + item.id + '&workId=' + item.work.id;
                  let author = [];
                  let hash = {};
                  item.work.author.forEach(function(item) {
                    item.list.forEach(function(at) {
                      if(!hash[at.id]) {
                        hash[at.id] = true;
                        author.push(at.name);
                      }
                    });
                  });
                  return <li>
                    <div class="pic first"
                         worksId={ item.id }
                         workId={ item.work.id }
                         url={ item.work.url }>
                      <img src={ $util.img(item.work.cover || item.cover, 80, 80, 80) || '/src/common/blank.png' }/>
                    </div>
                    <div class="txt">
                      <a class="name"
                         title={ item.title }
                         href={ url }>{ item.work.title }</a>
                      <p class="author">{ author.join(' ') }</p>
                    </div>
                  </li>;
                })
              }
              </ul>
            : ''
        }
      </div>
      <ul class="btn">
        <li class="share"
            rel={ id }>分享</li>
        <li class={ 'favor' + (item.isFavor ? ' favored' : '') }
            rel={ id }>{ item.favorCount || '收藏' }</li>
        <li class={ 'like' + (item.isLike ? ' liked' : '') }
            rel={ id }>{ item.likeCount || '点赞' }</li>
        <li class="comment"
            rel={ id }>{ item.replyCount || '评论' }</li>
      </ul>
    </li>;
  }
  encode(s, refHash, tagCircleHash) {
    refHash = refHash || {};
    tagCircleHash = tagCircleHash || {};
    return s.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/#([^#\n\s]+?)#/g, function($0, $1) {
        let id = tagCircleHash[$1.toLowerCase()];
        if(id) {
          return `<a class="link" href="/circle.html?id=${id}" title="${$1}圈" transparentTitle="true">#${$1}#</a>`;
        }
        return `<a class="link" href="/tag.html?tag=${encodeURIComponent($1)}" title="话题-${$1}">#${$1}#</a>`;
      })
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
            return `<a href="/${$1}.html?id=${$2}" class="link" title="画圈正文">${$0}</a>`;
        }
        return $0;
      })
      .replace(/(http(?:s)?:\/\/[\w-]+\.[\w]+\S*)/gi, '<a class="outside" href="$1" target="_blank">$1</a>');
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
