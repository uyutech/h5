/**
 * Created by army8735 on 2017/8/26.
 */

'use strict';

import net from '../../common/net';
import util from '../../common/util';

const NOT_LOADED = 0;
const IS_LOADING = 1;
const HAS_LOADED = 2;
let subLoadHash = {};
let subSkipHash = {};
let $last;
let take = 10;
let ajax;
let exist = {};

class Comment extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    let html = '';
    (self.props.data || []).forEach(function(item) {
      html += self.genComment(item) || '';
    });
    self.html = html;
    self.message = self.props.message;
    if(!self.props.data || self.props.data.length === 0) {
      self.empty = true;
    }

    self.on(migi.Event.DOM, function() {
      let $root = $(self.element);
      $root.on('click', '.like', function() {
        let $elem = $(this);
        let commentID = $elem.attr('cid');
        net.postJSON(self.props.zanUrl, { commentID }, function(res) {
          if(res.success) {
            let data = res.data;
            if(data.State === 'likeWordsUser') {
              $elem.addClass('liked');
              // $elem.text('已赞');
            }
            else {
              $elem.removeClass('liked');
              // $elem.text('点赞');
            }
            // $elem.text(data.LikeCount);
          }
          else if(res.code === 1000) {
            migi.eventBus.emit('NEED_LOGIN');
          }
          else {
            jsBridge.toast(res.message || util.ERROR_MESSAGE);
          }
        });
      });
      $root.on('click', '.slide .sub, .slide span', function() {
        self.slide($(this).closest('li'));
      });
      $root.on('click', '.list>li>.c>pre', function() {
        self.slide($(this).closest('li'));
      });
      $root.on('click', '.list2 pre, .slide2 .sub', function() {
        let $this = $(this);
        let $li = $this.closest('li');
        if($li.hasClass('on')) {
          $li.removeClass('on');
          let $slide = $last.find('.slide');
          self.emit('chooseSubComment', $slide.attr('rid'), $slide.attr('cid'), $slide.attr('name'));
        }
        else {
          $li.parent().find('.on').removeClass('on');
          $li.addClass('on');
          self.emit('chooseSubComment', $this.attr('rid'), $this.attr('cid'), $this.attr('name'));
        }
      });
      $root.on('click', '.more', function() {
        let $message = $(this);
        let rid = $message.attr('rid');
        $message.removeClass('more').text('读取中...');
        ajax = net.postJSON(self.props.subUrl, { rootID: rid, skip: subSkipHash[rid], take }, function(res) {
          if(res.success) {
            let data = res.data;
            if(data.data.length) {
              subSkipHash[rid] += data.data.length;
              let s = '';
              data.data.forEach(function (item) {
                s += self.genChildComment(item);
              });
              let $ul = $message.prev();
              $ul.append(s);
              if(data.data.length < take) {
                $message.addClass('fn-hide');
              }
              else {
                $message.addClass('more').text('点击加载更多');
              }
            }
            else {
              $message.addClass('fn-hide');
            }
          }
          else {
            $message.addClass('more').text(res.message || util.ERROR_MESSAGE);
          }
        }, function(res) {
          $message.addClass('more').text(res.message || util.ERROR_MESSAGE);
        });
      });
      $root.on('click', '.fn', function() {
        let $fn = $(this);
        let $like = $fn.closest('li').find('.like');
        let commentID = $like.attr('cid');
        migi.eventBus.emit('BOT_FN', {
          canFn: true,
          canLike: true,
          isLike: $like.hasClass('liked'),
          canDel: $fn.attr('own') === 'true',
          canBlock: true,
          canReport: true,
          clickLike: function(botFn) {
            net.postJSON(self.props.zanUrl, { commentID }, function(res) {
              if(res.success) {
                let data = res.data;
                botFn.isLike = data.State === 'likeWordsUser';
                if(data.State === 'likeWordsUser') {
                  $like.addClass('liked');
                }
                else {
                  $like.removeClass('liked');
                }
                $like.text(data.LikeCount);
              }
              else if(res.code === 1000) {
                migi.eventBus.emit('NEED_LOGIN');
              }
              else {
                jsBridge.toast(res.message || util.ERROR_MESSAGE);
              }
            });
          },
          clickBlock: function(botFn) {
            let type = $fn.attr('isAuthor') === 'true' ? 5 : 6;
            let id = $fn.attr(type === 5 ? 'authorId' : 'userId');
            self.block(id, type, function() {
              jsBridge.toast('屏蔽成功');
              botFn.cancel();
            });
          },
          clickReport: function(botFn) {
            self.report(commentID, function() {
              jsBridge.toast('举报成功');
              botFn.cancel();
            });
          },
          clickDel: function(botFn) {
            jsBridge.confirm('会删除子留言哦，确定要删除吗？', function(res) {
              if(!res) {
                return;
              }
              net.postJSON(self.props.delUrl, { commentID }, function(res) {
                if(res.success) {
                  $fn.closest('li').remove();
                  self.empty = !$(self.ref.list.element).children('li').length;
                  botFn.cancel();
                }
                else if(res.code === 1000) {
                  migi.eventBus.emit('NEED_LOGIN');
                }
                else {
                  jsBridge.toast(res.message || util.ERROR_MESSAGE);
                }
              }, function(res) {
                jsBridge.toast(res.message || util.ERROR_MESSAGE);
              });
            });
          },
        });
      });
      $root.on('click', 'li.author a', function(e) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
        let $this = $(this);
        let url = $this.attr('href');
        let title = $this.attr('title');
        util.openAuthor({
          url,
          title,
        });
      });
      $root.on('click', 'li.user a', function(e) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
        let $this = $(this);
        let url = $this.attr('href');
        let title = $this.attr('title');
        jsBridge.pushWindow(url, {
          title,
          transparentTitle: true,
        });
      });
      // TODO: del
      migi.eventBus.on('subCmtDelTo', function() {
        if($last && $last.hasClass('on')) {
          self.hideLast();
          self.emit('closeSubComment');
        }
      });
    });
  }
  @bind message
  @bind empty
  slide($li) {
    let self = this;
    if(ajax) {
      ajax.abort();
    }
    let $slide = $li.find('.slide');
    let $list2 = $li.find('.list2');
    let $ul = $list2.find('ul');
    let $message = $list2.find('.message');
    let cid = $slide.attr('cid');
    if($last && $last[0] !== $li[0] && $last.hasClass('on')) {
      self.hideLast();
    }
    if($li.hasClass('on')) {
      $li.removeClass('on');
      $li.find('li.on').removeClass('on');
      $list2.css('height', 0);
      self.emit('closeSubComment');
      $last = null;
      if(subLoadHash[cid] === IS_LOADING) {
        subLoadHash[cid] = NOT_LOADED;
      }
    }
    else {
      $last = $li;
      $li.addClass('on');
      self.emit('chooseSubComment', $slide.attr('rid'), $slide.attr('cid'), $slide.attr('name'), $slide.find('.sub').text());
      let state = subLoadHash[cid];
      if(state === HAS_LOADED || state === IS_LOADING) {
        $list2.css('height', 'auto');
      }
      else {
        $list2.css('height', 'auto');
        subLoadHash[cid] = IS_LOADING;
        ajax = net.postJSON(self.props.subUrl, { rootID: cid, skip: 0, take }, function(res) {
          if(res.success) {
            subLoadHash[cid] = HAS_LOADED;
            let s = '';
            let data = res.data;
            data.data.forEach(function(item) {
              s += self.genChildComment(item);
            });
            $ul.append(s);
            if(data.data.length >= data.Size) {
              $message.addClass('fn-hide');
            }
            else {
              $message.addClass('more').text('点击加载更多');
              subSkipHash[cid] = data.data.length;
            }
            $ul.removeClass('fn-hide');
            $list2.css('height', 'auto');
          }
          else {
            subLoadHash[cid] = NOT_LOADED;
            $message.text(res.message || util.ERROR_MESSAGE);
          }
        }, function(res) {
          subLoadHash[cid] = NOT_LOADED;
          $message.text(res.message || util.ERROR_MESSAGE);
        });
      }
    }
  }
  slideOn(cid) {
    let $slide = $(this.element).find('#comment_' + cid).find('.slide');
    if(!$slide.hasClass('on')) {
      $slide.find('.sub').click();
    }
  }
  clearData(noEmpty) {
    if(ajax) {
      ajax.abort();
    }
    exist = {};
    this.message = '';
    this.setData(null, noEmpty);
    subLoadHash = {};
    subSkipHash = {};
    $last = null;
  }
  setData(data, noEmpty) {
    let self = this;
    exist = {};
    let s = '';
    (data || []).forEach(function(item) {
      s += self.genComment(item) || '';
    });
    $(self.ref.list.element).html(s);
    self.empty = !noEmpty && !s;
  }
  appendData(data) {
    let self = this;
    let s = '';
    (data || []).forEach(function(item) {
      s += self.genComment(item) || '';
    });
    $(self.ref.list.element).append(s);
    if(self.empty) {
      if(s) {
        self.empty = false;
      }
    }
  }
  prependData(item) {
    let vd = this.genComment(item);
    if(vd) {
      vd.prependTo(this.ref.list.element);
      this.empty = false;
    }
  }
  prependChild(item) {
    let $comment = $('#comment_' + item.RootID);
    let $list2 = $comment.find('.list2');
    let $ul = $list2.find('ul');
    let state = subLoadHash[item.RootID];
    if(state === HAS_LOADED || state === IS_LOADING) {
      let li = this.genChildComment(item);
      li.prependTo($ul[0]);
    }
    if($ul.closest('li').find('.slide').hasClass('on')) {
      $list2.css('height', $ul.height());
    }
    let $num = $comment.find('.slide small.sub');
    $num.text((parseInt($num.text()) || 0) + 1);
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
  genComment(item) {
    let id = item.id;
    if(exist[id]) {
      return;
    }
    exist[id] = true;
    let url = item.isAuthor
      ? '/author.html?authorId=' + item.authorId
      : '/user.html?userId=' + item.userId;
    return <li class="user" id={ 'comment_' + id }>
      <div class="t">
        <div class="profile fn-clear">
          <a class="pic"
             href={ url }
             title={ item.isAuthor ? item.name : item.nickname }>
            <img class="pic"
                 src={ util.autoSsl(util.img60_60_80(item.headUrl
                   || '/src/common/head.png')) }/>
          </a>
          <div class="txt">
            <a class="name"
               href={ url }
               title={ item.isAuthor
                 ? item.name
                 : item.nickname }>{ item.isAuthor
              ? item.name
              : item.nickname }</a>
            <small class="time"
                   rel={ item.createTime }>{ util.formatDate(item.createTime) }</small>
          </div>
        </div>
        <b class="fn"
           own={ item.IsOwn }/>
      </div>
      <div class="c">
        {
          item.ParentContent
            ? <p class="quote">
              <label>回复@{ item.ParentSendUserNickName }：</label>
              <span>{ item.ParentContent }</span>
            </p>
            : ''
        }
        <pre>{ item.content }<span class="placeholder"/></pre>
        <div class="slide">
          <small class="like"></small>
          <small class="sub"></small>
        </div>
        <b class="arrow"/>
      </div>
    </li>;
  }
  genChildComment(item) {
    if(item.IsAuthor) {
      let authorID = item.AuthorID;
      return <li class="author" id={ 'comment_' + item.Send_ID }>
        <div class="t">
          <div class="profile fn-clear" cid={ item.Send_ID } rid={ item.RootID } title={ item.Send_AuthorName }>
            <a class="pic"
               href={ '/author.html?authorId=' + authorID }
               title={ item.Send_AuthorName }
               transparentTitle={ true }>
              <img class="pic" src={ util.autoSsl(util.img60_60_80(item.Send_AuthorHeadUrl || '/src/common/head.png')) }/>
            </a>
            <div class="txt">
              <small class="time" rel={ item.Send_Time }>{ util.formatDate(item.Send_Time) }</small>
              <a class="name"
                 href={ '/author.html?authorId=' + authorID }
                 title={ item.Send_AuthorName }
                 transparentTitle={ true }>{ item.Send_AuthorName }</a>
            </div>
          </div>
          <b class="fn" own={ item.ISOwn } isAuthor={ true } authorId={ authorID }/>
        </div>
        <div class="c">
          {
            item.Content
              ? <p class="quote">
                  <label>回复@{ item.Send_ToUserName }：</label>
                  <span>{ item.Content }</span>
                </p>
              : ''
          }
          <pre cid={ item.Send_ID } rid={ item.RootID } name={ item.Send_AuthorName }>{ item.Send_Content }</pre>
          <div class="slide2">
            <small cid={ item.Send_ID } class={ 'like' + (item.IsLike ? ' liked' : '') }>{ item.LikeCount }</small>
            <small class="sub" cid={ item.Send_ID } rid={ item.RootID } name={ item.Send_AuthorName }>回复</small>
          </div>
          <b class="arrow"/>
        </div>
      </li>;
    }
    return <li class="user" id={ 'comment_' + item.Send_ID }>
      <div class="t">
        <div class="profile fn-clear" cid={ item.Send_ID } rid={ item.RootID } name={ item.Send_UserName }>
          <a class="pic" href={ '/user.html?userID=' + item.Send_UserID } title={ item.Send_UserName }>
            <img class="pic" src={ util.autoSsl(util.img60_60_80(item.Send_UserHeadUrl || '/src/common/head.png')) }/>
          </a>
          <div class="txt">
            <small class="time" rel={ item.Send_Time }>{ util.formatDate(item.Send_Time) }</small>
            <a class="name" href={ '/user.html?userID=' + item.Send_UserID } title={ item.Send_UserName }>{ item.Send_UserName }</a>
          </div>
        </div>
        <b class="fn" own={ item.ISOwn } userId={ item.Send_UserID }/>
      </div>
      <div class="c">
        {
          item.Content
            ? <p class="quote">
              <label>回复@{ item.Send_ToUserName }：</label>
              <span>{ item.Content }</span>
            </p>
            : ''
        }
        <pre cid={ item.Send_ID } rid={ item.RootID } name={ item.Send_UserName }>{ item.Send_Content }</pre>
        <div class="slide2">
          <small cid={ item.Send_ID } class={ 'like' + (item.IsLike ? ' liked' : '') }>{ item.LikeCount }</small>
          <small class="sub" cid={ item.Send_ID } rid={ item.RootID } name={ item.Send_UserName }>回复</small>
        </div>
        <b class="arrow"/>
      </div>
    </li>;
  }
  hideLast() {
    if($last && $last.hasClass('on')) {
      $last.removeClass('on').find('.list2').css('height', 0).find('li.on').removeClass('on');
    }
    $last = null;
  }
  render() {
    return <div class="cp-comment">
      <ul class="list" ref="list" dangerouslySetInnerHTML={ this.html }/>
      <p class={ 'empty' + (this.empty ? '' : ' fn-hide') }>这儿空空的，需要你的留言噢(* ॑꒳ ॑* )</p>
      <p class={ 'message' + (this.message ? '' : ' fn-hide') }>{ this.message }</p>
    </div>;
  }
}

export default Comment;
