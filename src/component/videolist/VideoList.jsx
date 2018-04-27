/**
 * Created by army8735 on 2018/4/3.
 */

'use strict';

class VideoList extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.message = self.props.message;
    self.visible = self.props.visible;
    self.list = [];
    self.exist = {};
    self.on(migi.Event.DOM, function() {
      let $list = $(self.ref.list.element);
      migi.eventBus.on('PLAY_INLINE', function() {
        jsBridge.media({
          key: 'pause',
        });
        $list.find('.pic.play').removeClass('play');
        $list.find('video').each(function(i, o) {
          o.pause();
        });
      });
      $list.on('click', '.pic', function() {
        let $this = $(this);
        let video = this.querySelector('video');
        if($this.hasClass('first')) {
          $this.removeClass('first');
          let workId = parseInt($this.attr('workId'));
          let worksId = parseInt($this.attr('worksId'));
          outer:
          for(let i = 0, len = self.list.length; i < len; i++) {
            let av = self.list[i];
            if(av.id === worksId && av.work.id === workId) {
              let o = av.work;
              o.worksId = worksId;
              o.worksCover = av.cover;
              o.worksTitle = av.title;
              $util.recordPlay(o);
              $net.postJSON('/h5/work2/addViews', { id: workId });
              break outer;
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
      });
      $list.on('click', '.name', function(e) {
        e.preventDefault();
        let $this = $(this);
        let url = $this.attr('href');
        let title = $this.attr('title');
        jsBridge.pushWindow(url, {
          title,
          transparentTitle: true,
        });
      });
      $list.on('click', '.like', function() {
        let $this = $(this);
        if($this.hasClass('loading')) {
          return;
        }
        $this.addClass('loading');
        let id = parseInt($this.attr('rel'));
        for(let i = 0; i < self.list.length; i++) {
          let item = self.list[i];
          if(item.work.id === id) {
            let url = $this.hasClass('liked') ? 'unLike' : 'like';
            $net.postJSON('/h5/works2/' + url, {
              workId: id, id: item.id,
            }, function(res) {
              if(res.success) {
                let data = res.data;
                if(data.state) {
                  $this.addClass('liked');
                }
                else {
                  $this.removeClass('liked');
                }
                $this.text(data.count || '');
                self.emit('like', item);
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
            break;
          }
        }
      });
      $list.on('click', '.comment', function() {
        let $this = $(this);
        let id = parseInt($this.attr('rel'));
        if($this.text()) {
          jsBridge.pushWindow('/sub_comment.html?type=2&id=' + id, {
            title: '评论',
            optionMenu: '发布',
          });
        }
        else {
          let url = '/works.html?id=' + id + '&comment=1';
          let title = $this.attr('title');
          jsBridge.pushWindow(url, {
            title,
            transparentTitle: true,
          });
        }
      });
      $list.on('click', '.fn', function() {
        let id = parseInt($(this).attr('rel'));
        for(let i = 0, len = self.list.length; i < len; i++) {
          let item = self.list[i];
          if(item.work.id === id) {
            migi.eventBus.emit('BOT_FN', {
              canShare: true,
              canShareIn: true,
              canShareWb: true,
              canShareLink: true,
              clickShareIn: function(botFn) {
                jsBridge.pushWindow('/sub_post.html?worksId=' + item.id
                  + '&workId=' + id
                  + '&cover=' + encodeURIComponent(item.work.cover || item.cover || ''), {
                  title: '画个圈',
                  optionMenu: '发布',
                });
                botFn.cancel();
              },
              clickShareWb: function(botFn) {
                let url = window.ROOT_DOMAIN + '/works/' + item.id + '/' + id;
                let text = '【' + item.work.title;
                if(item.work.subTitle) {
                  text += ' ' + item.work.subTitle;
                }
                text += '】';
                item.work.author.forEach((item) => {
                  item.list.forEach((author) => {
                    text += author.name + ' ';
                  });
                });
                text += ' #转圈circling# ';
                text += url;
                jsBridge.shareWb({
                  text,
                }, function(res) {
                  if(res.success) {
                    jsBridge.toast("分享成功");
                  }
                  else if(res.cancel) {
                    jsBridge.toast("取消分享");
                  }
                  else {
                    jsBridge.toast("分享失败");
                  }
                });
                botFn.cancel();
              },
              clickShareLink: function(botFn) {
                let url = window.ROOT_DOMAIN + '/works/' + item.id + '/' + id;
                $util.setClipboard(url);
                botFn.cancel();
              },
            });
            break;
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
    if(!Array.isArray(data)) {
      data = [data];
    }
    let s = '';
    data.forEach(function(item) {
      if(self.exist[item.work.id]) {
        return;
      }
      self.exist[item.work.id] = true;
      self.list.push(item);
      s += self.genItem(item);
    });
    $(self.ref.list.element).html(s);
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
    data.forEach(function(item) {
      if(self.exist[item.work.id]) {
        return;
      }
      self.exist[item.work.id] = true;
      self.list.push(item);
      s += self.genItem(item);
    });
    $(self.ref.list.element).append(s);
  }
  clearData() {
    let self = this;
    self.exist = {};
    self.list = [];
    $(self.ref.list.element).html('');
  }
  genItem(item) {
    let self = this;
    let url = '/works.html?id=' + item.id + '&workId=' + item.work.id;
    let author = [];
    let hash = {};
    if(self.props.profession) {
      item.work.profession.forEach((item) => {
        author.push(item.name);
      });
    }
    else {
      item.work.author.forEach(function(item) {
        item.list.forEach(function(at) {
          if(!hash[at.id]) {
            hash[at.id] = true;
            author.push(at.name);
          }
        });
      });
    }
    return <li>
      <div class="pic first"
           worksId={ item.id }
           workId={ item.work.id }>
        <img src={ $util.img(item.work.cover, 750, 0, 80) || '/src/common/blank.png' }/>
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
        <b class={ 'like' + (item.work.isLike ? ' liked' : '') }
           rel={ item.work.id }>{ item.work.likeCount || '' }</b>
        <b class="comment"
           title={ item.title }
           rel={ item.id }>{ item.commentCount || '' }</b>
        <b class="fn"
           rel={ item.work.id }/>
      </div>
    </li>;
  }
  render() {
    return <div class={ 'cp-videolist' + (this.visible ? '' : ' fn-hide') }>
      <ol ref="list"/>
      <div class={ 'cp-message' + (this.message ? '' : ' fn-hide') }>{ this.message }</div>
    </div>;
  }
}

export default VideoList;
