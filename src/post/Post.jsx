/**
 * Created by army8735 on 2017/12/4.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import Comment from '../component/comment/Comment.jsx';
import ImageView from '../component/imageview/ImageView.jsx';
import InputCmt from '../component/inputcmt/InputCmt.jsx';
import BotFn from '../component/botfn/BotFn.jsx';
import QuickVideo from '../component/quickVideo/QuickVideo.jsx';
import QuickAudio from '../component/quickaudio/QuickAudio.jsx';

let take = 30;
let skip = take;
let sortType = 0;
let myComment = 0;
let currentCount = 0;
let loading;
let loadEnd;
let ajax;
let loadingLike;
let loadingFavor;
let cId;
let rId;
let last;
let quickTempList = [];
let itemImg;

class Post extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind hasData
  @bind postId
  @bind isLike
  @bind likeCount
  @bind isFavor
  @bind favorCount
  setData(postId, data) {
    let self = this;

    self.postId = postId;
    self.postData = data.postData;
    self.replyData = data.replyData;
    self.reference = data.reference;

    loadEnd = self.replyData.Size < take;

    self.isLike = self.postData.ISLike;
    self.likeCount = self.postData.LikeCount;
    self.isFavor = self.postData.ISFavor;
    self.favorCount = self.postData.FavorCount;

    self.hasData = true;

    let $root = $(self.element);
    $root.on('click', 'a', function(e) {
      e.preventDefault();
      let $this = $(this);
      let url = $this.attr('href');
      let title = $this.attr('title');
      let transparentTitle = !!$this.attr('transparentTitle');
      jsBridge.pushWindow(url, {
        title,
        transparentTitle,
      });
    });
    $root.on('click', '.comment', function() {
      jsBridge.pushWindow('/subcomment.html?type=1&id=' + self.postId, {
        title: '评论',
        optionMenu: '发布',
      });
    });

    $root.on('click', '.imgs img', function() {
      let $li = $(this);
      let id = $li.attr('rel');
      let idx = $li.attr('idx');
      imageView.setData(itemImg, idx);
    });

    let imageView = self.ref.imageView;
    imageView.on('clickLike', function() {
      self.clickLike();
    });
    jsBridge.on('back', function(e) {
      if(!imageView.isHide()) {
        e.preventDefault();
        imageView.hide();
      }
    });
    jsBridge.on('resume', function(e) {
      let data = e.data;
      if(data && data.type && data.type === 'subComment') {
        self.ref.comment.prependData(data.data);
      }
    });

    jsBridge.setOptionMenu({
      icon1: 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAHlBMVEUAAACMvuGMvuGMvuGNveGMvuGNweOPwuuMvuKLveG52ByYAAAACXRSTlMA7+bFiGY1GfMKDs4PAAAASklEQVRIx2MYBSMZlIbjl2eTnJiAVwHzzJkGeBVwzJzZQK4JCDcQ9MUoAAInFfzyLDNnOuBVwDRzpgK5ChBWEHTkKBjNeqNgWAAAQowW2TR/xN0AAAAASUVORK5CYII=',
    });
    jsBridge.on('optionMenu1', function() {
      migi.eventBus.emit('BOT_FN', {
        canFn: true,
        canLike: true,
        canFavor: true,
        isLike: self.isLike,
        isFavor: self.isFavor,
        canBlock: true,
        canReport: true,
        canShare: true,
        canShareWb: true,
        canShareLink: true,
        clickLike: function(botFn) {
          self.like(function() {
            botFn.isLike = self.isLike;
          });
        },
        clickFavor: function(botFn) {
          self.favor(function() {
            botFn.isFavor = self.isFavor;
          });
        },
        clickBlock: function(botFn) {
          let id = self.postData.SendUserID;
          let type = self.postData.isAuthor ? 5 : 6;
          self.block(id, type, function() {
            jsBridge.toast('屏蔽成功');
            botFn.cancel();
          });
        },
        clickReport: function(botFn) {
          self.report(self.postId, function() {
            jsBridge.toast('举报成功');
            botFn.cancel();
          });
        },
        clickShareWb: function() {
          let url = window.ROOT_DOMAIN + '/post/' + self.postId;console.log(self.postData)
          let text = '';
          if(self.postData.Content) {
            text += self.postData.Content.length > 30 ? (self.postData.Content.slice(0, 30) + '...') : self.postData.Content;
          }
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
        },
        clickShareLink: function() {
          util.setClipboard(window.ROOT_DOMAIN + '/post/' + self.postId);
        },
      });
    });

    let $window = $(window);
    $window.on('scroll', function() {
      self.checkMore($window);
    });
  }
  checkMore($window) {
    let self = this;
    let WIN_HEIGHT = $window.height();
    let HEIGHT = $(document.body).height();
    let bool;
    bool = !$(self.element).hasClass('fn-hide') && $window.scrollTop() + WIN_HEIGHT + 30 > HEIGHT;
    if(!loading && !loadEnd && bool) {
      self.load();
    }
  }
  load() {
    let self = this;
    let comment = self.ref.comment;
    if(ajax) {
      ajax.abort();
    }
    loading = true;
    comment.message = '正在加载...';
    ajax = net.postJSON('/h5/post/commentList', {
      postID: self.postId,
      skip,
      take,
      sortType,
      myComment,
      currentCount
    }, function(res) {
      if(res.success) {
        let data = res.data;
        comment.appendData(data.data);
        if(skip === 0) {
          if(!data.Size) {
            comment.empty = true;
          }
          if(data.Size > 3) {
            comment.message = '已经到底了';
          }
          else {
            comment.message = '';
          }
        }
        else {
          if(skip >= data.Size) {
            comment.message = '已经到底了';
          }
          else {
            comment.message = '';
          }
        }
        skip += take;
        loadEnd = skip >= data.Size;
      }
      else {
        if(res.code === 1000) {
          migi.eventBus.emit('NEED_LOGIN');
        }
        comment.message = res.message || util.ERROR_MESSAGE;
      }
      loading = false;
    }, function(res) {
      comment.message = res.message || util.ERROR_MESSAGE;
      loading = false;
    });
  }
  switchType(e, vd) {
    let $ul = $(vd.element);
    $ul.toggleClass('alt');
    $ul.find('li').toggleClass('cur');
    let rel = $ul.find('.cur').attr('rel');
    sortType = rel;
    skip = 0;
    if(ajax) {
      ajax.abort();
    }
    loading = false;
    loadEnd = false;
    this.ref.comment.clearData(true);
    this.load();
  }
  switchType2(e, vd, tvd) {
    let $li = $(tvd.element);
    if(!$li.hasClass('cur')) {
      let $ul = $(vd.element);
      $ul.toggleClass('alt');
      $ul.find('li').toggleClass('cur');
      let rel = $ul.find('.cur').attr('rel');
      myComment = rel;
      skip = 0;
      if(ajax) {
        ajax.abort();
      }
      loading = false;
      loadEnd = false;
      this.ref.comment.clearData(true);
      this.load();
    }
  }
  clickFavor(e) {
    this.favor();
  }
  favor(cb) {
    let self = this;
    if(!util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    if(loadingFavor) {
      return;
    }
    loadingFavor = true;
    let postId = self.postId;
    let url = '/h5/post/favor';
    if(self.isFavor) {
      url = '/h5/post/unFavor';
    }
    net.postJSON(url, { postID: postId }, function(res) {
      if(res.success) {
        let data = res.data;
        self.isFavor = data.State === 'favorWork';
        self.favorCount = data.FavorCount || '收藏';
        let $li = $(self.element).find('li.favor');
        if(self.isFavor) {
          $li.addClass('has');
        }
        else {
          $li.removeClass('has');
        }
        $li.find('span').text(self.favorCount);
        cb && cb();
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
      loadingFavor = false;
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      loadingFavor = false;
    });
  }
  clickLike(e) {
    this.like();
  }
  like(cb) {
    let self = this;
    if(!util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    if(loadingLike) {
      return;
    }
    loadingLike = true;
    let postId = self.postId;
    net.postJSON('/h5/post/like', { postID: postId }, function(res) {
      if(res.success) {
        let data = res.data;
        self.isLike = data.State === 'likeWordsUser';
        self.likeCount = data.LikeCount || '点赞';
        let $li = $(self.element).find('li.like');
        if(self.isLike) {
          $li.addClass('has');
        }
        else {
          $li.removeClass('has');
        }
        $li.find('span').text(self.likeCount);
        cb && cb();
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
      loadingLike = false;
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      loadingLike = false;
    });
  }
  clickDel(e) {
    let postId = this.postId;
    jsBridge.confirm('确认删除吗？', function(res) {
      if(!res) {
        return;
      }
      net.postJSON('/h5/post/del', { postID: postId }, function(res) {
        if(res.success) {
          location.reload(true);
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      });
    });
  }
  block(id, type, cb) {
    if(!util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    jsBridge.confirm('确认屏蔽吗？', function(res) {
      if(!res) {
        return;
      }
      net.postJSON('/h5/report/index', { reportType: type, businessId: id }, function(res) {
        if(res.success) {
          cb && cb();
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      });
    });
  }
  report(id, cb) {
    jsBridge.confirm('确认举报吗？', function(res) {
      if(!res) {
        return;
      }
      net.postJSON('/h5/report/index', { reportType: 4, businessId: id }, function(res) {
        if(res.success) {
          cb && cb();
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      });
    });
  }
  share() {
    migi.eventBus.emit('SHARE', '/post/' + this.postId);
  }
  comment() {
    let self = this;
    if(!self.postId) {
      return;
    }
    jsBridge.pushWindow('/subcomment.html?type=1&id='
      + self.postId + '&cid=' + (cId || '') + '&rid=' + (rId || ''), {
      title: '评论',
      optionMenu: '发布',
    });
  }
  chooseSubComment(rid, cid, name, n) {
    let self = this;
    if(!n || n === '0') {
      jsBridge.pushWindow('/subcomment.html?type=1&id='
        + self.postId + '&cid=' + cid + '&rid=' + rid, {
        title: '评论',
        optionMenu: '发布',
      });
    }
    cId = cid;
    rId = rid;
  }
  closeSubComment() {
    cId = rId = null;
  }
  genDom() {
    let self = this;
    let postData = self.postData;
    let id = postData.ID;
    let reference = self.reference || [];
    let index = 0;
    let html = (postData.Content || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/#([^#\n\s]+?)#/g, function($0, $1) {
        return `<a href="tag.html?tag=${encodeURIComponent($1)}" title="话题-${$1}">#${$1}#</a>`;
      })
      .replace(/@\/(\w+)\/(\d+)\/?(\d+)?(\s|$)/g, function($0, $1, $2, $3, $4) {
        let data = reference[index];
        index++;
        switch($1) {
          case 'works':
            let worksName = $0.trim();
            if(data) {
              worksName += '(' + data.Title;
            }
            if($3) {
              if(data) {
                let sub = ((data.Works_Items || [])[0] || {}).ItemName || '';
                if(sub) {
                  worksName += ' ' + sub;
                }
                worksName += ')'
              }
              worksName += $4;
              return `<a href="/${$1}.html?worksId=${$2}&workId=${$3}" class="link" transparentTitle="true">${worksName}</a>`;
            }
            if(data) {
              worksName += ')';
            }
            worksName += $4;
            return `<a href="/${$1}.html?worksId=${$2}" class="link" transparentTitle="true">${worksName}</a>`;
          case 'post':
            let postName = $0.trim();
            if(data) {
              postName += '(' + (data.Content.length > 10 ? (data.Content.slice(0, 10) + '...') : data.Content) + ')';
            }
            postName += $4;
            return `<a href="/${$1}.html?postId=${$2}" class="link" title="画圈正文">${postName}</a>`;
          case 'author':
            let authorName = $0.trim();
            if(data) {
              authorName += '(' + data.AuthorName + ')';
            }
            authorName += $4;
            return `<a href="/${$1}.html?authorId=${$2}" class="link" transparentTitle="true">${authorName}</a>`;
          case 'user':
            let userName = $0.trim();
            if(data) {
              userName += '(' + data.NickName + ')';
            }
            userName += $4;
            return `<a href="/${$1}.html?userID=${$2}" class="link" transparentTitle="true">${userName}</a>`;
        }
        return $0;
      })
      .replace(/(http(?:s)?:\/\/[\w-]+\.[\w]+\S*)/gi, '<a href="$1" target="_blank">$1</a>');
    let replyData = self.replyData;
    let mediaList = postData.CommentMedia || [];
    let imgList = itemImg = mediaList.filter(function(item) {
      return item.MediaType === 0 || item.MediaType === 3; // 0为老数据图片，1视频，2音频，3图片
    });
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
    return <div>
      <div class={ 'profile fn-clear' + (postData.IsAuthor ? ' author' : '') }>
        {
          postData.IsAuthor
            ? <a class="pic"
                 href={ '/author.html?authorId=' + postData.AuthorID }
                 title={ postData.SendUserNickName }
                 transparentTitle={ true }>
              <img src={ util.autoSsl(util.img128_128_80(postData.SendUserHead_Url
                || '/src/common/head.png')) }/>
            </a>
            : <a class="pic" href={ '/user.html?userID=' + postData.SendUserID }
                 title={ postData.SendUserNickName }>
              <img src={ util.autoSsl(util.img128_128_80(postData.SendUserHead_Url
                || '/src/common/head.png')) }/>
            </a>
        }
        <div class="txt">
          <div>
            {
              postData.IsAuthor
                ? <a class="name"
                     href={ '/author.html?authorId=' + postData.AuthorID }
                     title={ postData.SendUserNickName }
                     transparentTitle={ true }>{ postData.SendUserNickName }</a>
                : <a class="name"
                     href={ '/user.html?userID=' + postData.SendUserID }
                     title={ postData.SendUserNickName }>{ postData.SendUserNickName }</a>
            }
            <small class="time">{ util.formatDate(postData.Createtime) }</small>
          </div>
        </div>
        <div class="circle">
          <ul>
            {
              (postData.Taglist || []).map(function(item) {
                if(item.CirclingList && item.CirclingList.length) {
                  return <li>
                    <a href={ '/circle.html?circleId=' + item.CirclingList[0].CirclingID }
                       title={ item.CirclingList[0].CirclingName }>{ item.CirclingList[0].CirclingName }</a>
                  </li>;
                }
                return <li><span>{ item.TagName }</span></li>;
              })
            }
          </ul>
        </div>
      </div>
      <div class="wrap">
        <div class="con" dangerouslySetInnerHTML={ html }/>
        {
          imgList.length
            ?
            <div class="imgs">
              {
                imgList.map(function(item, i) {
                  return <img src={ util.autoSsl(util.img720__80(item.FileUrl || '/src/common/blank.png')) } rel={ i }/>;
                })
              }
            </div>
            : ''
        }
        { video }
        { audio }
        <b class="arrow"/>
        <ul class="btn">
          <li class="share" onClick={ self.share.bind(self) }><b/><span>分享</span></li>
          <li class={ 'favor' + (self.isFavor ? ' has' : '') } onClick={ self.clickFavor.bind(self) }>
            <b/><span>{ self.favorCount || '收藏' }</span>
          </li>
          <li class={ 'like' + (self.isLike ? ' has' : '') } onClick={ self.clickLike.bind(self) }>
            <b/><span>{ self.likeCount || '点赞' }</span>
          </li>
          <li class="comment">
            <b/><span>{ postData.CommentCount || '评论' }</span>
          </li>
          { postData.IsOwn ? <li class="del" onClick={ self.clickDel.bind(self) }><b/></li> : '' }
        </ul>
      </div>
      <div class="box">
        <a name="comment"/>
        <h4>回复</h4>
        <div class="fn">
          <ul class="type fn-clear" onClick={ { li: self.switchType2.bind(self) } }>
            <li class="cur" rel="0">全部<small>{ replyData.Count }</small></li>
            <li rel="1">我的</li>
          </ul>
          <ul class="type2 fn-clear" onClick={ { li: self.switchType.bind(self) } }>
            <li class="cur" rel="0">最新</li>
            <li rel="1">最热</li>
          </ul>
        </div>
        <Comment ref="comment"
                 zanUrl="/h5/post/likeComment"
                 subUrl="/h5/post/subCommentList"
                 delUrl="/h5/post/delComment"
                 data={ replyData.data }
                 message={ (replyData.Size && replyData.Size > 3) ? '已经到底了' : '' }
                 on-chooseSubComment={ self.chooseSubComment.bind(self) }
                 on-closeSubComment={ self.closeSubComment.bind(self) }/>
      </div>
    </div>;
  }
  render() {
    return <div class="post">
      {
        this.hasData
          ? this.genDom()
          : <div>
              <div class="fn-placeholder-roundlet"/>
              <div class="fn-placeholder"/>
              <div class="fn-placeholder-pic"/>
            </div>
      }
      <InputCmt ref="inputCmt"
                placeholder={ '发表评论...' }
                readOnly={ true }
                on-click={ this.comment }
                on-share={ this.share }/>
      <BotFn ref="botFn"/>
      <ImageView ref="imageView"/>
    </div>;
  }
}

export default Post;
