/**
 * Created by army on 2017/7/1.
 */

const NOT_LOADED = 0;
const IS_LOADING = 1;
const HAS_LOADED = 2;
let subLoadHash = {};

class Comment extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind list = []
  @bind message = '读取中...'
  switchType(e, vd) {
    let $ul = $(vd.element);
    $ul.toggleClass('alt');
    $ul.find('li').toggleClass('cur');
  }
  slide(e, vd, tvd) {
    let $slide = $(tvd.element);
    let $li = $slide.closest('li');
    let $list2 = $li.find('.list2');
    let $ul = $list2.find('ul');
    let $loading = $list2.find('.loading');
    let cid = tvd.props.cid;
    let rid = tvd.props.rid;
    if($slide.hasClass('on')) {
      $slide.removeClass('on');
      $list2.css('height', 0);
    }
    else {
      $slide.addClass('on');
      let state = subLoadHash[rid];
      if(state === HAS_LOADED) {
        $list2.css('height', $ul.height());
      }
      else if(state === IS_LOADING) {
        $list2.css('height', $loading.height());
      }
      else {
        $list2.css('height', $loading.height());
        subLoadHash[rid] = IS_LOADING;
        util.postJSON('api/author/GetTocomment_T_List', { ParentID: cid, RootID: cid, Skip: 0, Take: 10 }, function(res) {
          if(res.success) {
            subLoadHash[rid] = HAS_LOADED;
            let s = '';
            res.data.data.forEach(function(item) {
              s += <li>
                <div class="t">
                  <div class="fn">
                    <span cid={ item.Send_ID } class={ 'zan' + (item.IsLike ? ' has' : '') }><small>{ item.LikeCount }</small></span>
                  </div>
                  <div class="profile" cid={ item.Send_ID } rid={ item.RootID } name={ item.Send_UserName }>
                    <div class="txt">
                      <div><span class="name2">{ item.Send_ToUserName }</span><b class="arrow"/><small class="time">{ item.Send_Time }</small><span class="name">{ item.Send_UserName }</span></div>
                      <p>{ item.sign }</p>
                    </div>
                    <img class="pic" src={ item.Send_UserHeadUrl || 'src/common/blank.png' }/>
                  </div>
                </div>
                <div class="c">
                  <pre cid={ item.Send_ID } rid={ item.RootID } name={ item.Send_UserName }>{ item.Send_Content }</pre>
                </div>
              </li>;
            });
            $ul.html(s);
            $loading.addClass('fn-hide');
            $ul.removeClass('fn-hide');
            $list2.css('height', $ul.height());
          }
          else {
            subLoadHash[cid] = NOT_LOADED;
            jsBridge.toast(res.message || util.ERROR_MESSAGE);
          }
        });
      }
    }
  }
  clickZan(e, vd, tvd) {
    let $span = $(tvd.element);
    let CommentID = tvd.props.cid;
    util.postJSON('api/works/AddWorkCommentLike', { CommentID }, function(res) {
      if(res.success) {
        let data = res.data;
        if(data.State === 211) {
          $span.addClass('has');
        }
        else {
          $span.removeClass('has');
        }
        $span.find('small').text(data.LikeCount);
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    });
  }
  clickCmt(e, vd, tvd) {
    this.emit('chooseSubComment', tvd.props.rid, tvd.props.cid, tvd.props.name);
  }
  genComment(item) {
    return <li id={ 'comment_' + item.Send_ID }>
      <div class="t">
        <div class="profile" cid={ item.Send_ID } rid={ item.RootID } name={ item.Send_UserName }>
          <img class="pic" src={ item.Send_UserHeadUrl || 'src/common/blank.png' }/>
          <div class="txt">
            <div><span class="name">{ item.Send_UserName }</span>
              <small class="time">{ item.Send_Time }</small>
            </div>
            <p>{ item.sign }</p>
          </div>
        </div>
        <div class="fn">
          <span cid={ item.Send_ID } class={ 'zan' + (item.IsLike ? ' has' : '') }><small>{ item.LikeCount }</small></span>
        </div>
      </div>
      <div class="c">
          <pre cid={ item.Send_ID } rid={ item.RootID } name={ item.Send_UserName }>{ item.Send_Content }<span
            class="placeholder"/></pre>
        <div class="slide" cid={ item.Send_ID } rid={ item.RootID }>
          <small>{ item.sub_Count }</small>
          <span>收起</span></div>
      </div>
      <div class="list2">
        <p class="loading">读取中...</p>
        <ul class="fn-hide"/>
      </div>
    </li>;
  }
  addNew(item) {
    if(this.list.length) {
      let li = this.genComment(item);
      li.prependTo(this.ref.list.element);
    }
    else {
      this.list.unshift(item);
      this.message = '';
    }
  }
  addChild(item, RootID) {
    let li = <li>
      <div class="t">
        <div class="fn">
          <span cid={ item.Send_ID } class={ 'zan' + (item.IsLike ? ' has' : '') }><small>{ item.LikeCount }</small></span>
        </div>
        <div class="profile" cid={ item.Send_ID } rid={ item.RootID } name={ item.Send_UserName }>
          <div class="txt">
            <div><span class="name2">{ item.Send_ToUserName }</span><b class="arrow"/><small class="time">{ item.Send_Time }</small><span class="name">{ item.Send_UserName }</span></div>
            <p>{ item.sign }</p>
          </div>
          <img class="pic" src={ item.Send_UserHeadUrl || 'src/common/blank.png' }/>
        </div>
      </div>
      <div class="c">
        <pre cid={ item.Send_ID } rid={ item.RootID } name={ item.Send_UserName }>{ item.Send_Content }</pre>
      </div>
    </li>;
    let $list2 = $('#comment_' + RootID).find('.list2');
    let $ul = $list2.find('ul');
    li.prependTo($ul[0]);
    $list2.css('height', $ul.height());
  }
  addMore(data) {
    let self = this;
    let s = '';
    data.forEach(function(item) {
      let li = self.genComment(item);
      s += li.toString();
    });
    $(self.ref.list.element).append(s);
  }
  render() {
    return <div class="cp_comment">
      <div class="bar fn-clear">
        <ul class="type fn-clear" onClick={ this.switchType }>
          <li class="cur"><span>最热</span></li>
          <li><span>最新</span></li>
        </ul>
      </div>
      <ul class="list" ref="list" onClick={ { '.slide': this.slide, '.zan': this.clickZan, 'pre': this.clickCmt, '.profile': this.clickCmt } }>
        {
          (this.list || []).map(function(item) {
            return <li id={ 'comment_' + item.Send_ID }>
              <div class="t">
                <div class="profile" cid={ item.Send_ID } rid={ item.Send_ID } name={ item.Send_UserName }>
                  <img class="pic" src={ item.Send_UserHeadUrl || 'src/common/blank.png' }/>
                  <div class="txt">
                    <div><span class="name">{ item.Send_UserName }</span><small class="time">{ item.Send_Time }</small></div>
                    <p>{ item.sign }</p>
                  </div>
                </div>
                <div class="fn">
                  <span cid={ item.Send_ID } class={ 'zan' + (item.IsLike ? ' has' : '') }><small>{ item.LikeCount }</small></span>
                </div>
              </div>
              <div class="c">
                <pre cid={ item.Send_ID } rid={ item.Send_ID } name={ item.Send_UserName }>{ item.Send_Content }<span class="placeholder"/></pre>
                <div class="slide" cid={ item.Send_ID } rid={ item.Send_ID }><small>{ item.sub_Count }</small><span>收起</span></div>
              </div>
              <div class="list2">
                <p class="loading">读取中...</p>
                <ul class="fn-hide"/>
              </div>
            </li>;
          })
        }
      </ul>
      <p class={ 'message' + (this.message ? '' : ' fn-hide') }>{ this.message }</p>
    </div>;
  }
}

export default Comment;
