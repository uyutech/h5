/**
 * Created by army8735 on 2017/11/13.
 */

'use strict';

import net from '../../common/net';
import util from '../../common/util';
import ImageView from '../imageview/ImageView.jsx';
// import QuickVideo from '../quickVideo/QuickVideo.jsx';
// import QuickAudio from '../quickaudio/QuickAudio.jsx';

let exist = {};
let itemImg = {};
let last;
let quickTempList = [];

class HotPost extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.message = self.props.message;
    if(self.props.visible !== undefined) {
      self.visible = self.props.visible;
    }
    if(self.props.dataList && self.props.dataList.length) {
      let html = '';
      self.props.dataList.forEach(function(item) {
        html += self.genItem(item);
      });
      self.html = html;
      quickTempList.forEach(function(cp) {
        cp.emit(migi.Event.DOM);
      });
      quickTempList = [];
    }
    self.on(migi.Event.DOM, function() {
      let $list = $(this.ref.list.element);
      $list.on('click', '.wrap .con .snap', function() {
        $(this).closest('li').addClass('expand');
      });
      $list.on('click', '.wrap .con .shrink', function() {
        let $li = $(this).closest('li');
        $li.removeClass('expand');
        $li[0].scrollIntoView(true);
      });
      $list.on('click', '.imgs2 img', function() {
        let $this = $(this);
        let index = $this.attr('rel');
        let urls = [];
        $this.parent().find('img').each(function(i, img) {
          urls.push({ FileUrl: $(img).attr('src') });
        });
        let $like = $this.closest('li').find('li.like');
        let id = $this.closest('div').attr('rel');
        migi.eventBus.emit('choosePic', urls, index, $like.hasClass('has'), id);
      });
      $list.on('click', '.favor', function() {
        if(!util.isLogin()) {
          migi.eventBus.emit('NEED_LOGIN');
          return;
        }
        let $li = $(this);
        if($li.hasClass('loading')) {
          return;
        }
        $li.addClass('loading');
        let postID = $li.attr('rel');
        let url = '/h5/post/favor';
        if($li.hasClass('has')) {
          url = '/h5/post/unFavor';
        }
        net.postJSON(url, { postID }, function(res) {
          if(res.success) {
            let data = res.data;
            if(data.State === 'favorWork') {
              $li.addClass('has');
            }
            else {
              $li.removeClass('has');
            }
            $li.find('span').text(data.FavorCount || '收藏');
          }
          else {
            jsBridge.toast(res.message || util.ERROR_MESSAGE);
          }
          $li.removeClass('loading');
        }, function(res) {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
          $li.removeClass('loading');
        });
      });
      $list.on('click', '.share', function() {
        let postID = $(this).attr('rel');
        migi.eventBus.emit('SHARE', '/post/' + postID);
      });
      $list.on('click', '.like', function() {
        let $li = $(this);
        if($li.hasClass('loading')) {
          return;
        }
        $li.addClass('loading');
        let postID = $li.attr('rel');
        self.like(postID);
      });
      $list.on('click', '.comment', function() {
        let $this = $(this);
        let id = $this.attr('rel');
        let count = $this.attr('count');
        let url = count === '0' ? `/subcomment.html?type=1&id=${id}` : `/post.html?postId=${id}`;
        let title = count === '0' ? '回复画圈' : '画圈正文';
        jsBridge.pushWindow(url, {
          title,
        });
      });
      $list.on('click', '.del', function() {
        let postID = $(this).attr('rel');
        let $li = $(this).closest('.btn').closest('li');
        jsBridge.confirm('确认删除吗？', function(res) {
          if(!res) {
            return;
          }
          net.postJSON('/h5/post/del', { postID }, function(res) {
            if(res.success) {
              $li.remove();
            }
            else {
              jsBridge.toast(res.message || util.ERROR_MESSAGE);
            }
          }, function(res) {
            jsBridge.toast(res.message || util.ERROR_MESSAGE);
          });
        });
      });
      $list.on('click', '.profile .pic, .profile .name', function(e) {
        e.preventDefault();
        let $this = $(this);
        let title = $this.attr('title');
        let url = $this.attr('href');
        jsBridge.pushWindow(url, {
          title,
          transparentTitle: true,
        });
      });
      $list.on('click', '.time, .profile .circle a', function(e) {
        e.preventDefault();
        let $this = $(this);
        let title = $this.attr('title');
        let url = $this.attr('href');
        jsBridge.pushWindow(url, {
          title,
        });
      });
      $list.on('click', '.con a', function(e) {
        e.preventDefault();
        let $this = $(this);
        let title = $this.attr('title');
        let url = $this.attr('href');
        let transparentTitle = $this.attr('transparentTitle') || 'false';
        jsBridge.pushWindow(url, {
          title,
          transparentTitle,
        });
      });
      $list.on('click', '.fn', function() {
        let canRecommend = $.cookie('userType') === '3' || $.cookie('userType') === '4';
        let $b = $(this);
        let own = $b.attr('isOwn') === 'true';
        let id = $b.attr('rel');
        let recommend = parseInt($b.attr('recommend')) || 0;
        let canClean =  $.cookie('userType') === '3' || $.cookie('userType') === '4';
        migi.eventBus.emit('BOT_FN', {
          canFn: true,
          canReport: true,
          canRecommend: canRecommend && recommend >= 3,
          canUnRecommend: canRecommend && recommend < 3,
          canDel: own,
          canClean,
          clickRecommend: function(botFn, n) {
            jsBridge.showLoading();
            net.postJSON('/h5/post/recommend', { postId: id, value: n }, function(res) {
              jsBridge.hideLoading();
              if(res.success) {
                botFn.cancel();
              }
              else {
                jsBridge.toast(res.message || util.ERROR_MESSAGE);
              }
            }, function(res) {
              jsBridge.hideLoading();
              jsBridge.toast(res.message || util.ERROR_MESSAGE);
            });
          },
          clickUnRecommend: function(botFn) {
            jsBridge.showLoading();
            net.postJSON('/h5/post/unRecommend', { postId: id }, function(res) {
              jsBridge.hideLoading();
              if(res.success) {
                botFn.cancel();
              }
              else {
                jsBridge.toast(res.message || util.ERROR_MESSAGE);
              }
            }, function(res) {
              jsBridge.hideLoading();
              jsBridge.toast(res.message || util.ERROR_MESSAGE);
            });
          },
          clickReport: function(botFn) {
            jsBridge.toast('举报成功');
            botFn.cancel();
          },
          clickDel: function(botFn) {
            jsBridge.confirm('确认删除吗？', function(res) {
              if(!res) {
                return;
              }
              jsBridge.showLoading();
              net.postJSON('/h5/post/del', { postID: id }, function(res) {
                jsBridge.hideLoading();
                if(res.success) {
                  botFn.cancel();
                  $b.closest('li').remove();
                }
                else {
                  jsBridge.toast(res.message || util.ERROR_MESSAGE);
                }
              }, function(res) {
                jsBridge.hideLoading();
                jsBridge.toast(res.message || util.ERROR_MESSAGE);
              });
            });
          },
          clickClean: function(botFn) {
            jsBridge.showLoading();
            net.postJSON('/h5/post/clean', { postID: id }, function(res) {
              jsBridge.hideLoading();
              if(res.success) {
                botFn.cancel();
                $b.closest('li').remove();
              }
              else {
                jsBridge.toast(res.message || util.ERROR_MESSAGE);
              }
            }, function(res) {
              jsBridge.hideLoading();
              jsBridge.toast(res.message || util.ERROR_MESSAGE);
            });
          }
        });
      });

      let imageView = self.ref.imageView;
      $list.on('click', '.imgs li', function() {
        let $li = $(this);
        let id = $li.attr('rel');
        let idx = $li.attr('idx');
        imageView.setData(itemImg[id], idx);
      });
    });
  }
  @bind message
  @bind visible = true
  show() {
    this.visible = true;
  }
  hide() {
    this.visible = false;
  }
  like(postID, cb) {
    let $li = $('#post_' + postID).find('.like');
    net.postJSON('/h5/post/like', { postID }, function(res) {
      if(res.success) {
        let data = res.data;
        if(data.ISLike || data.State === 'likeWordsUser') {
          $li.addClass('has');
        }
        else {
          $li.removeClass('has');
        }
        $li.find('span').text(data.LikeCount || '点赞');
        if(cb) {
          cb(data);
        }
      }
      else if(res.code === 1000) {
        migi.eventBus.emit('NEED_LOGIN');
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
      $li.removeClass('loading');
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      $li.removeClass('loading');
    });
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
  genItem(item) {
    let id = item.ID;
    if(exist[id]) {
      return;
    }
    exist[id] = true;
    let len = item.Content.length;
    let maxLen = 144;
    let html = len > maxLen ? (item.Content.slice(0, maxLen) + '...') : item.Content;
    html = this.encode(html, item.reference);
    if(len > maxLen) {
      html += '<span class="placeholder"></span><span class="more">查看全文</span>';
      let full = this.encode(item.Content, item.reference) + '<span class="placeholder"></span><span class="shrink">收起全文</span>';
      html = `<p class="snap">${html}</p><p class="full">${full}</p>`;
    }
    let url = '/post.html?postId=' + id;
    let peopleUrl = item.IsAuthor
      ? ('/author.html?authorId=' + item.AuthorID)
      : ('/user.html?userID=' + item.SendUserID);
    let mediaList = item.CommentMedia || [];
    let imgList = mediaList.filter(function(item) {
      return item.MediaType === 0 || item.MediaType === 3; // 0为老数据图片，1视频，2音频，3图片
    });
    imgList.forEach(function(item) {
      item.preview = util.autoSsl(util.img208_208_80(item.FileUrl || '/src/common/blank.png'));
    });
    itemImg[id] = imgList;
    let imgGt9 = imgList.length > 9;
    let audioList = mediaList.filter(function(item) {
      return item.MediaType === 2;
    });
    let videoList = mediaList.filter(function(item) {
      return item.MediaType === 1;
    });
    let video = videoList.length
      ? <QuickVideo name={ videoList[0].ItemsName }
                    cover={ videoList[0].ItemsCoverPic }
                    playCount={ videoList[0].PlayCount }
                    url={ videoList[0].FileUrl }/>
      : '';
    let audio = audioList.length && !videoList.length
      ? <QuickAudio name={ audioList[0].ItemsName }
                    cover={ audioList[0].ItemsCoverPic }
                    author={ ((audioList[0].GroupAuthorTypeHash || {}).AuthorTypeHashlist || [])[0] }
                    url={ audioList[0].FileUrl }/>
      : '';
    if(video) {
      quickTempList.push(video);
      video.on('play', function() {
        if(last && last !== video) {
          last.pause();
        }
        last = video;
      });
    }
    if(audio) {
      quickTempList.push(audio);
      audio.on('play', function() {
        if(last && last !== audio) {
          last.pause();
        }
        last = audio;
      });
    }
    return <li class={ item.IsAuthor ? 'author' : 'user' } id={ 'post_' + id }>
      <div class="profile fn-clear">
        <a class="pic" href={ peopleUrl } title={ item.SendUserNickName }>
          <img src={ util.autoSsl(util.img208_208_80(item.SendUserHead_Url
            || '/src/common/head.png')) }/>
        </a>
        <div class="txt">
          <a class="name" href={ peopleUrl } title={ item.SendUserNickName }>{ item.SendUserNickName }</a>
          <a class="time" href={ url } title="画圈正文">{  {
            1: '作者动态',
            2: '作品发布',
            3: '精选',
            4: '精选',
            5: '公告',
            6: '活动',
            7: '专题',
            8: '长评',
          }[item.Recommend] || util.formatDate(item.Createtime) }</a>
        </div>
        <ul class="circle">
        {
          (item.Taglist || []).map(function(item) {
            if(item.CirclingList) {
              if(item.CirclingList.length) {
                return <li>
                  <a href={ '/circle.html?circleId=' + item.CirclingList[0].CirclingID }
                     title={ item.CirclingList[0].CirclingName + '圈' }>{ item.CirclingList[0].CirclingName }</a></li>;
              }
              return <li><span>{ item.TagName }</span></li>;
            }
            return <li><a href={ '/circle.html?circleId=' + item.TagID }
                          title={ item.TagName + '圈' }>{ item.TagName }</a></li>;
          })
        }
        </ul>
      </div>
      <div class="wrap">
        <div class="con" dangerouslySetInnerHTML={ html }/>
        {
          imgList.length
            ? <ul class="imgs fn-clear">
              {
                imgList.slice(0, 9).map(function(item, i) {
                  let cn = '';
                  if(item.Width !== 0 && item.Height !== 0 && item.Width < 86 && item.Height < 86) {
                    cn = 'no-scale';
                  }
                  if(i === 8 && imgGt9) {
                    return <li class={ 'all ' + cn }
                               rel={ id }
                               idx={ i }
                               style={ 'background-image:url('
                               + util.autoSsl(util.img208_208_80(item.FileUrl || '/src/common/blank.png')) + ')' }>
                      <img src={ util.autoSsl(util.img208_208_80(item.FileUrl || '/src/common/blank.png')) }/>
                      <a href={ url } title="画圈正文">查看全部</a>
                    </li>;
                  }
                  return <li class={ cn }
                             rel={ id }
                             idx={ i }
                             style={ 'background-image:url('
                             + util.autoSsl(util.img208_208_80(item.FileUrl || '/src/common/blank.png')) + ')' }>
                    <img src={ util.autoSsl(util.img208_208_80(item.FileUrl || '/src/common/blank.png')) }/>
                  </li>;
                })
              }
              </ul>
            : ''
        }
        { video }
        { audio }
        <b class="arrow"/>
      </div>
      <ul class="btn">
        <li class="share"
            rel={ id }>
          <b/><span>分享</span>
        </li>
        <li class={ 'favor' + (item.ISFavor ? ' has' : '') }
            rel={ id }>
          <b/><span>{ item.FavorCount || '收藏' }</span>
        </li>
        <li class={ 'like' + (item.ISLike ? ' has' : '') }
            rel={ id }>
          <b/><span>{ item.LikeCount || '点赞' }
          </span>
        </li>
        <li class="comment"
            rel={ id }
            count={ item.CommentCount }>
          <b/><span>{ item.CommentCount || '评论' }</span>
        </li>
      </ul>
      <b class="fn"
         isOwn={ item.IsOwn }
         recommend={ item.Recommend }
         rel={ id }/>
    </li>;
  }
  setData(data) {
    let self = this;
    let html = '';
    exist = {};
    (data || []).forEach(function(item) {
      html += self.genItem(item) || '';
    });
    $(self.ref.list.element).html(html);
    quickTempList.forEach(function(cp) {
      cp.emit(migi.Event.DOM);
    });
    quickTempList = [];
  }
  appendData(data) {
    let self = this;
    let html = '';
    (data || []).forEach(function(item) {
      html += self.genItem(item) || '';
    });
    $(self.ref.list.element).append(html);
    quickTempList.forEach(function(cp) {
      cp.emit(migi.Event.DOM);
    });
    quickTempList = [];
  }
  clearData() {
    let self = this;
    exist = {};
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
    quickTempList.forEach(function(cp) {
      cp.emit(migi.Event.DOM);
    });
    quickTempList = [];
  }
  pauseLast() {
    if(last) {
      last.pause();
    }
  }
  render() {
    return <div class={ 'cp-hotpost' + (this.visible ? '' : ' fn-hide') }>
      <ol class="list" ref="list" dangerouslySetInnerHTML={ this.html }/>
      <div class={ 'cp-message' + (this.message ? '' : ' fn-hide') } >{ this.message }</div>
      <ImageView ref="imageView"/>
    </div>;
  }
}

export default HotPost;