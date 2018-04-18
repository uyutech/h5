/**
 * Created by army8735 on 2017/8/26.
 */

'use strict';

import net from '../../common/net';
import util from '../../common/util';

let $last;
let exist = {};

const MAX_LEN = 144;

class Comment extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.empty = self.props.empty;
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
      $list.on('click', '.sub', function() {
        let $this = $(this);
        let id = $this.attr('rel');
        self.emit('reply', id);
      });
      $list.on('click', '.fn', function() {
        let $fn = $(this);
        let id = parseInt($fn.attr('rel'));
        migi.eventBus.emit('BOT_FN', {
          canFn: true,
          canDel: $fn.attr('own') === 'true',
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
              if(!res) {
                return;
              }
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
      $list.on('click', 'li.author a', function(e) {
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
      $list.on('click', 'li.user a', function(e) {
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
      $list.on('click', '.more, .less', function() {
        let $li = $(this).closest('li');
        $li.find('.snap, .full').toggleClass('fn-hide');
      });
    });
  }
  @bind message
  @bind empty
  setData(data) {
    let self = this;
    exist = {};
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
    self.empty = !s;
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
      s += self.genItem(item) || '';
    });
    $(self.ref.list.element).append(s);
    if(s) {
      self.empty = false;
    }
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
      s += self.genItem(item) || '';
    });
    $(self.ref.list.element).prepend(s);
    if(s) {
      self.empty = false;
    }
  }
  clearData() {
    let self = this;
    exist = {};
    $(self.ref.list.element).html('');
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
  genItem(item) {
    let id = item.id;
    if(exist[id]) {
      return;
    }
    exist[id] = true;
    let url = item.isAuthor
      ? '/author.html?id=' + item.aid
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
           rel={ id }
           own={ item.IsOwn }/>
      </div>
      <div class="wrap">
        {
          item.quote
            ? <div class="quote">
                <span>回复@{ item.quote.isAuthor ? item.quote.name : item.quote.nickname }：</span>
                <p>{ item.quote.content }</p>
              </div>
            : ''
        }
        {
          item.content.length > MAX_LEN
            ? <pre class="snap">
                { item.content.slice(0, MAX_LEN) + '...' }
                <span class="more">查看全文</span>
              </pre>
            : ''
        }
        {
          item.content.length > MAX_LEN
            ? <pre class="full fn-hide">
                { item.content }
                <span class="less">收起全文</span>
              </pre>
            : <pre class="full">
                { item.content }
                <span class="placeholder"/>
              </pre>
        }
        <div class="slide">
          <small class={ 'like' + (item.isLike ? ' liked' : '') }
                 rel={ item.id }>{ item.likeCount || '' }</small>
          <small class="sub"
                 rel={ item.id }/>
        </div>
      </div>
    </li>;
  }
  render() {
    return <div class="cp-comment">
      <ul class="list"
          ref="list"
          dangerouslySetInnerHTML={ this.html }/>
      <p class={ 'empty' + (this.empty ? '' : ' fn-hide') }>这儿空空的，需要你的留言噢(* ॑꒳ ॑* )</p>
      <p class={ 'message' + (this.message ? '' : ' fn-hide') }>{ this.message }</p>
    </div>;
  }
}

export default Comment;
