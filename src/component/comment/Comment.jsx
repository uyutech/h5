/**
 * Created by army8735 on 2017/8/26.
 */

const NOT_LOADED = 0;
const IS_LOADING = 1;
const HAS_LOADED = 2;
let subLoadHash = {};
let subSkipHash = {};
let $lastSlide;
let Take = 10;
let ajax;

function formatTime(time) {
  time = new Date(time);
  let now = Date.now();
  let diff = now - time;
  if(diff >= 1000 * 60 * 60 * 24 * 365) {
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365)) + '年前';
  }
  if(diff >= 1000 * 60 * 60 * 24 * 30) {
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 30)) + '月前';
  }
  if(diff >= 1000 * 60 * 60 * 24) {
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + '天前';
  }
  if(diff >= 1000 * 60 * 60) {
    return Math.floor(diff / (1000 * 60 * 60)) + '小时前';
  }
  if(diff >= 1000 * 60) {
    return Math.floor(diff / (1000 * 60)) + '分钟前';
  }
  return '刚刚';
}

class Comment extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      let $root = $(self.element);
      $root.on('click', '.zan', function() {
        let $span = $(this);
        let CommentID = $span.attr('cid');
        util.postJSON(self.props.zanUrl, { CommentID }, function(res) {
          if(res.success) {
            let data = res.data;
            if(data.State === 'likeWordsUser') {
              $span.addClass('has');
            }
            else {
              $span.removeClass('has');
            }
            $span.find('small').text(data.LikeCount);
          }
          else if(res.code === 1000) {
            migi.eventBus.emit('NEED_LOGIN');
          }
          else {
            alert(res.message || util.ERROR_MESSAGE);
          }
        });
      });
      $root.on('click', '.slide', function() {
        self.slide($(this));
      });
      $root.on('click', '.more', function() {
        let $message = $(this);
        let rid = $message.attr('rid');
        $message.removeClass('more').text('读取中...');
        ajax = util.postJSON(self.props.subUrl, { RootID: rid, Skip: subSkipHash[rid], Take }, function(res) {
          if(res.success) {
            let data = res.data;
            if(data.data.length) {
              subSkipHash[rid] = data.data[data.data.length - 1].Send_ID;
              let s = '';
              data.data.forEach(function (item) {
                s += self.genChildComment(item);
              });
              let $ul = $message.prev();
              $ul.append(s);
              if(data.data.length < Take) {
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
      $root.on('click', '.share', function(e) {
        e.preventDefault();
      });
      $root.on('click', '.remove', function() {
        let $btn = $(this);
        let cid = $btn.attr('cid');
        util.postJSON(self.props.delUrl, { CommentID: cid }, function(res) {
          if(res.success) {
            $btn.closest('li').remove();
          }
          else if(res.code === 1000) {
            migi.eventBus.emit('NEED_LOGIN');
          }
          else {
            alert(res.message || util.ERROR_MESSAGE);
          }
        });
      });
    });
  }
  @bind message
  slide($slide) {
    if(ajax) {
      ajax.abort();
    }
    let self = this;
    let $li = $slide.closest('li');
    let $list2 = $li.find('.list2');
    let $ul = $list2.find('ul');
    let $message = $list2.find('.message');
    let rid = $slide.attr('rid');
    if($lastSlide && $lastSlide[0] !== $slide[0] && $lastSlide.hasClass('on')) {
      $lastSlide.removeClass('on').closest('li').find('.list2').css('height', 0);
      $lastSlide = null;
    }
    if($slide.hasClass('on')) {
      $slide.removeClass('on');
      $list2.css('height', 0);
      self.emit('closeSubComment');
      $lastSlide = null;
      if(subLoadHash[rid] === IS_LOADING) {
        subLoadHash[rid] = NOT_LOADED;
      }
    }
    else {
      $lastSlide = $slide;
      $slide.addClass('on');
      self.emit('chooseSubComment', $slide.attr('rid'), $slide.attr('cid'), $slide.attr('name'));
      let state = subLoadHash[rid];
      if(state === HAS_LOADED || state === IS_LOADING) {
        $list2.css('height', 'auto');
      }
      else {
        $list2.css('height', 'auto');
        subLoadHash[rid] = IS_LOADING;
        ajax = util.postJSON(self.props.subUrl, { RootID: rid, Skip: -1, Take }, function(res) {
          if(res.success) {
            subLoadHash[rid] = HAS_LOADED;
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
              subSkipHash[rid] = data.data[data.data.length - 1].Send_ID;
            }
            $ul.removeClass('fn-hide');
            $list2.css('height', 'auto');
          }
          else {
            subLoadHash[rid] = NOT_LOADED;
            $message.text(res.message || util.ERROR_MESSAGE);
          }
        }, function(res) {
          subLoadHash[rid] = NOT_LOADED;
          $message.text(res.message || util.ERROR_MESSAGE);
        });
      }
    }
  }
  clearData() {
    if(ajax) {
      ajax.abort();
    }
    this.message = '';
    this.setData();
    subLoadHash = {};
    subSkipHash = {};
    $lastSlide = null;
  }
  setData(data) {
    let self = this;
    let s = '';
    (data || []).forEach(function(item) {
      s += self.genComment(item);
    });
    $(self.ref.list.element).html(s);
  }
  appendData(data) {
    let self = this;
    let s = '';
    (data || []).forEach(function(item) {
      s += self.genComment(item);
    });
    $(self.ref.list.element).append(s);
  }
  prependData(item) {
    this.genComment(item).prependTo(this.ref.list.element);
  }
  prependChild(item) {
    let li = this.genChildComment(item);
    let $comment = $('#comment_' + item.RootID);
    let $list2 = $comment.find('.list2');
    let $ul = $list2.find('ul');
    li.prependTo($ul[0]);
    $list2.css('height', $ul.height());
    let $num = $comment.find('.slide small');
    $num.text((parseInt($num.text()) || 0) + 1);
  }
  genComment(item) {
    return <li id={ 'comment_' + item.Send_ID }>
      <div class="t">
        <div class="profile fn-clear">
          <img class="pic" src={ item.Send_UserHeadUrl || '//zhuanquan.xin/img/blank.png' }/>
          <div class="txt">
            <div>
              <span class="name">{ item.Send_UserName }</span>
              <small class="time">{ formatTime(item.Send_Time) }</small>
            </div>
            <p>{ item.sign }</p>
          </div>
        </div>
        <div class="fn fn-clear">
          <span cid={ item.Send_ID } class={ 'zan' + (item.IsLike ? ' has' : '') }><small>{ item.LikeCount }</small></span>
          <a class="share" href={ '/?cid=' + item.Send_ID } target="_blank">分享</a>
          {
            item.ISOwn ? <span cid={ item.Send_ID } class="remove">删除</span> : ''
          }
        </div>
      </div>
      <div class="c">
          <pre>{ item.Send_Content }<span class="placeholder"/></pre>
        <div class="slide" cid={ item.Send_ID } rid={ item.Send_ID } name={ item.Send_UserName }>
          <small>{ item.sub_Count }</small>
          <span>收起</span></div>
      </div>
      <div class="list2">
        <ul class="fn-hide"/>
        <p class="message" cid={ item.Send_ID } rid={ item.Send_ID }>读取中...</p>
      </div>
    </li>;
  }
  genChildComment(item) {
    return <li>
      <div class="t fn-clear">
        <div class="profile fn-clear" cid={ item.Send_ID } rid={ item.RootID } name={ item.Send_UserName }>
          <img class="pic" src={ item.Send_UserHeadUrl || '//zhuanquan.xin/img/blank.png' }/>
          <div class="txt">
            <div><span class="name2 fn-hide">{ item.Send_ToUserName }</span><b class="arrow fn-hide"/><small class="time">{ formatTime(item.Send_Time) }</small><span class="name">{ item.Send_UserName }</span></div>
            <p>{ item.sign }</p>
          </div>
        </div>
        <div class="fn fn-clear">
          <span cid={ item.Send_ID } class={ 'zan' + (item.IsLike ? ' has' : '') }><small>{ item.LikeCount }</small></span>
          {
            item.ISOwn ? <span cid={ item.Send_ID } class="remove">删除</span> : ''
          }
        </div>
      </div>
      <div class="c">
        <pre cid={ item.Send_ID } rid={ item.RootID } name={ item.Send_UserName }>{ item.Send_Content }</pre>
      </div>
    </li>;
  }
  render() {
    return <div class="cp-comment">
      <ul class="list" ref="list"/>
      <p class={ 'message' + (this.message ? '' : ' fn-hide') }>{ this.message }</p>
    </div>;
  }
}

export default Comment;
