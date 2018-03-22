/**
 * Created by army8735 on 2018/1/27.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';

let skip = 0;
let take = 30;
let loading;
let ajax;

class Search extends migi.Component {
  constructor(...data) {
    super(...data);
    this.type = '0';
  }
  @bind value
  @bind type
  @bind authorList
  @bind tagList
  @bind userList
  @bind worksList
  change(e, vd) {
    this.type = vd.element.value;
  }
  submit(e) {
    e.preventDefault();
    this.load();
  }
  load() {
    let self = this;
    let keyword = (self.value || '').trim();
    if(!keyword || loading) {
      return;
    }
    loading = true;
    let cType = this.type;
    if(ajax) {
      ajax.abort();
    }
    let $message = $(self.ref.message.element);
    $message.addClass('fn-hide');
    ajax = net.postJSON('/h5/find/search', { keyword, type: cType, skip, take }, function(res) {
      if(res.success) {
        let data = res.data;
        let $author = $(self.ref.author.element);
        let $user = $(self.ref.user.element);
        let $works = $(self.ref.works.element);
        let $tag = $(self.ref.tag.element);
        $author.addClass('fn-hide');
        $user.addClass('fn-hide');
        $works.addClass('fn-hide');
        $tag.addClass('fn-hide');
        if(data.data.length) {
          $message.addClass('fn-hide');
        }
        else {
          $message.removeClass('fn-hide');
          $message.addClass('empty');
        }
        switch(cType) {
          case '0':
            self.authorList = data.data;
            $author.removeClass('fn-hide');
            break;
          case '1':
            self.userList = data.data;
            $user.removeClass('fn-hide');
            break;
          case '2':
            self.worksList = data.data;
            $works.removeClass('fn-hide');
            break;
          case '3':
            self.tagList = data.data;
            $tag.removeClass('fn-hide');
            break;
        }
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
      loading = false;
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      loading = false;
    });
  }
  clickAuthor(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    let title = tvd.props.title;
    util.openAuthor({
      url,
      title,
      transparentTitle: true,
    });
  }
  clickUser(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    let title = tvd.props.title;
    jsBridge.pushWindow(url, {
      title,
      transparentTitle: true,
    });
  }
  clickWorks(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    let title = tvd.props.title;
    util.openWorks({
      url,
      title,
    }, {
      transparentTitle: true,
    });
  }
  clickTag(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    let title = tvd.props.title;
    jsBridge.pushWindow(url, {
      title,
    });
  }
  clickClear() {
    let self = this;
    self.value = '';
    self.authorList = [];
    self.userList = [];
    self.worksList = [];
    self.tagList = [];
    if(ajax) {
      ajax.abort();
    }
    let $message = $(self.ref.message.element);
    $message.removeClass('fn-hide empty');
  }
  clickBack() {
    jsBridge.popWindow();
  }
  clickType(e, vd, tvd) {
    this.type = tvd.props.rel;
    this.load();
  }
  render() {
    return <div class="search">
      <div class="top">
        <form class="input" onSubmit={ this.submit }>
          <input type="text" value={ this.value } class="text" placeholder="请输入搜索内容" maxlength="20"/>
          <b class={ 'clear' + (this.value ? '' : ' fn-hide') } onClick={ this.clickClear }/>
        </form>
        <span class="back" onClick={ this.clickBack }>取消</span>
      </div>
      <ul class="type" onClick={ { li: this.clickType } }>
        <li class={ this.type === '0' ? 'cur' : '' } rel="0">作者</li>
        <li class={ this.type === '1' ? 'cur' : '' } rel="1">用户</li>
        <li class={ this.type === '2' ? 'cur' : '' } rel="2">作品</li>
        <li class={ this.type === '3' ? 'cur' : '' } rel="3">标签</li>
      </ul>
      <ul class="author fn-clear fn-hide" ref="author" onClick={ { a: this.clickAuthor } }>
        {
          (this.authorList || []).map(function(item) {
            return <li>
              <a href={ '/author.html?authorId=' + item.AuthorID } title={ item.AuthorName } class="pic">
                <img src={ util.autoSsl(util.img120_120_80(item.Headurl)) || '/src/common/head.png' }/>
              </a>
              <a href={ '/author.html?authorId=' + item.AuthorID } title={ item.AuthorName } class="name">{ item.AuthorName }</a>
              <p class="fans">{ item.FansNumber }</p>
            </li>;
          })
        }
      </ul>
      <ul class="author fn-clear fn-hide" ref="user" onClick={ { a: this.clickUser } }>
        {
          (this.userList || []).map(function(item) {
            return <li>
              <a href={ '/user.html?userID=' + item.uid } title={ item.User_Nickname } class="pic">
                <img src={ util.autoSsl(util.img120_120_80(item.Headurl)) || '/src/common/head.png' }/>
              </a>
              <a href={ '/user.html?userID=' + item.uid } title={ item.User_Nickname } class="name">{ item.User_Nickname }</a>
            </li>;
          })
        }
      </ul>
      <ul class="works fn-clear fn-hide" ref="works" onClick={ { a: this.clickWorks } }>
        {
          (this.worksList || []).map(function(item) {
            // let GroupAuthorTypeHash = item.GroupAuthorTypeHash || {};
            // let AuthorTypeHashlist = GroupAuthorTypeHash.AuthorTypeHashlist || [];
            // let author = AuthorTypeHashlist[0] || {};
            return <li class={ 't' + item.WorkType }>
              <a href={ '/works.html?worksId=' + item.WorkID } title={ item.WorkName } class="pic">
                <img src={ util.autoSsl(util.img170_170_80(item.CoverPic)) }/>
                <span>{ item.CommentCount }</span>
              </a>
              <a href={ '/works.html?worksId=' + item.WorkID } title={ item.WorkName } class="name">{ item.WorkName }</a>
            </li>;
          })
        }
      </ul>
      <ul class="tag fn-hide" ref="tag" onClick={ { a: this.clickTag } }>
        {
          (this.tagList || []).map(function(item) {
            return <li>
              <a href={ '/tag.html?tag=' + item.TagName } title={ item.TagName }>{ item.TagName }</a>
            </li>;
          })
        }
      </ul>
      <div class="message fn-hide1" ref="message"/>
    </div>;
  }
}

export default Search;
