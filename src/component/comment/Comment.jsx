/**
 * Created by army8735 on 2017/8/26.
 */

'use strict';

import net from '../../common/net';
import util from '../../common/util';

let subLoadHash = {};
let subSkipHash = {};
let $last;
let ajax;
let exist = {};

class Comment extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.empty = self.props.empty;
    self.message = self.props.message;

    self.on(migi.Event.DOM, function() {
      let $root = $(self.element);
      $root.on('click', '.like', function() {
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
            $this.text(data.count || '');
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
        jsBridge.pushWindow(url, {
          title,
          transparentTitle: true,
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
    });
  }
  @bind message
  @bind empty
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
  setData(data) {
    let self = this;
    exist = {};
    let s = '';
    (data || []).forEach(function(item) {
      s += self.genComment(item) || '';
    });
    $(self.ref.list.element).html(s);
    self.empty = !s;
  }
  appendData(data) {
    let self = this;
    let s = '';
    if(!Array.isArray(data)) {
      data = [data];
    }
    (data || []).forEach(function(item) {
      s += self.genComment(item) || '';
    });
    $(self.ref.list.element).append(s);
    if(s) {
      self.empty = false;
    }
  }
  prependData(item) {
    let self = this;
    let s = '';
    if(!Array.isArray(data)) {
      data = [data];
    }
    (data || []).forEach(function(item) {
      s += self.genComment(item) || '';
    });
    $(self.ref.list.element).prepend(s);
    if(s) {
      self.empty = false;
    }
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
      ? '/author.html?authorId=' + item.aid
      : '/user.html?userId=' + item.uid;
    return <li class={ item.isAuthor ? 'author'  : 'user' }>
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
          item.quote
            ? <div class="quote">
              <span>回复@{ item.quote.isAuthor ? item.quote.name : item.quote.nickname }：</span>
              <p>{ item.quote.content }</p>
            </div>
            : ''
        }
        <pre>{ item.content }<span class="placeholder"/></pre>
        <div class="slide">
          <small class={ 'like' + (item.isLike ? ' liked' : '') }
                 rel={ item.id }>{ item.likeCount || '' }</small>
          <small class="sub"/>
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
