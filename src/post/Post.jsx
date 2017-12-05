/**
 * Created by army8735 on 2017/12/4.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import Comment from '../component/comment/Comment.jsx';
import ImageView from './ImageView.jsx';
import SubCmt from '../component/subcmt/SubCmt.jsx';

let take = 30;
let skip = take;
let sortType = 0;
let myComment = 0;
let currentCount = 0;
let loading;
let loadEnd;
let ajax;

class Post extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind hasData
  @bind postID
  @bind isLike
  @bind likeCount
  @bind isFavor
  @bind favorCount
  setData(postID, data) {
    let self = this;

    self.postID = postID;
    self.postData = data.postData;
    self.replyData = data.replyData;

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
      jsBridge.pushWindow(url, {
        title,
      });
    });
    $root.on('click', '.comment', function() {
      jsBridge.pushWindow('/subcomment.html?type=1?id=' + self.postID, {
        title: '评论',
      });
    });
    let subCmt = self.ref.subCmt;
    subCmt.on('click', function() {
      if(subCmt.to) {
        jsBridge.pushWindow('/subcomment.html?type=1&id='
          + self.postID + '&cid=' + self.cid + '&rid=' + self.rid, {
          title: '评论',
        });
      }
      else {
        jsBridge.pushWindow('/subcomment.html?type=1&id=' + self.postID, {
          title: '评论',
        });
      }
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
      postID: self.postID,
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
  clickFavor(e, vd) {
    if(!util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    let $li = $(vd.element);
    if($li.hasClass('loading')) {
      return;
    }
    $li.addClass('loading');
    let self = this;
    let postID = self.postID;
    let url = '/h5/post/favor';
    if(self.isFavor) {
      url = '/h5/post/unFavor';
    }
    net.postJSON(url, { postID }, function(res) {
      if(res.success) {
        let data = res.data;
        self.isFavor = data.State === 'favorWork';
        self.favorCount = data.FavorCount || '收藏';
        $li.toggleClass('has');
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
  }
  clickShare() {
    migi.eventBus.emit('SHARE', '/post/' + this.postID);
  }
  clickLike(e, vd) {
    if(!util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    let $li = $(vd.element);
    if($li.hasClass('loading')) {
      return;
    }
    $li.addClass('loading');
    let self = this;
    let postID = self.postID;
    net.postJSON('/h5/post/like', { postID }, function(res) {
      if(res.success) {
        let data = res.data;
        self.isLike = self.ref.imageView.isLike = data.ISLike;
        self.likeCount = data.LikeCount || '点赞';
        $li.toggleClass('has');
        $li.find('span').text(data.FavorCount || '点赞');
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
  clickDel(e, vd) {
    if(jsBridge.confirm('确认删除吗？')) {
      let postID = this.postID;
      net.postJSON('/h5/post/del', { postID }, function(res) {
        if(res.success) {
          location.reload(true);
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      });
    }
  }
  genDom() {
    let self = this;
    let postData = self.postData;
    let html = (postData.Content || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/#(\S.*?)#/g, `<strong>#$1#</strong>`)
      .replace(/(http(?:s)?:\/\/[\w-]+\.[\w]+\S*)/gi, '<a href="$1" target="_blank">$1</a>');
    let replyData = self.replyData;
    return <div>
      <h2>{ postData.Title }</h2>
      <div class={ 'profile fn-clear' + (postData.IsAuthor ? ' author' : '') }>
        {
          postData.IsAuthor
            ? <a class="pic" href={ '/author.html?authorID=' + postData.AuthorID }
                 title={ postData.SendUserNickName }>
              <img src={ util.autoSsl(util.img128_128_80(postData.SendUserHead_Url
                || '/src/common/head.png')) }/>
            </a>
            : <a class="pic" href={ '/user.html?authorID=' + postData.SendUserID }
                 title={ postData.SendUserNickName }>
              <img src={ util.autoSsl(util.img128_128_80(postData.SendUserHead_Url
                || '/src/common/head.png')) }/>
            </a>
        }
        <div class="txt">
          <div>
            {
              postData.IsAuthor
                ? <a class="name" href={ '/author.html?authorID=' + postData.AuthorID }
                     title={ postData.SendUserNickName }>{ postData.SendUserNickName }</a>
                : <a class="name" href={ '/user.html?authorID=' + postData.SendUserID }
                     title={ postData.SendUserNickName }>{ postData.SendUserNickName }</a>
            }
            <small class="time">{ util.formatDate(postData.Createtime) }</small>
          </div>
        </div>
        <div class="circle">
          <ul>
            {
              (postData.Taglist || []).map(function(item) {
                return <li><a href={ '/circle.html?circleID=' + item.TagID }
                              title={ item.TagName }>{ item.TagName }圈</a></li>;
              })
            }
          </ul>
        </div>
      </div>
      <div class="wrap">
        <p class="con" dangerouslySetInnerHTML={ html }/>
        {
          postData.Image_Post
            ?
            <div class="imgs">
              {
                postData.Image_Post.map(function(item, i) {
                  return <img src={ util.autoSsl(util.img720__80(item.FileUrl)) } rel={ i }/>;
                })
              }
            </div>
            : ''
        }
        <b class="arrow"/>
        <ul class="btn">
          <li class="share" onClick={ self.clickShare.bind(self) }><b/><span>分享</span></li>
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
                 message={ (replyData.Size && replyData.Size > 3) ? '已经到底了' : '' }/>
      </div>
      <SubCmt ref="subCmt"
              tipText="-${n}"
              subText="回复"
              readOnly={ true }
              originTo={ postData.SendUserNickName }
              placeholder="交流一下吧~"/>
      <ImageView ref="imageView" dataList={ postData.Image_Post } isLike={ self.isLike }/>
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
    </div>;
  }
}

export default Post;
