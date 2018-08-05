/**
 * Created by army8735 on 2018/1/27.
 */

'use strict';

import AuthorList from '../component/authorlist/AuthorList.jsx';
import UserList from '../component/userlist/UserList.jsx';
import WorksList from '../component/workslist/WorksList.jsx';
import TagList from '../component/taglist/TagList.jsx';

let loading;
let ajax;
let authorOffset = 0;
let authorLoadEnd;
let userOffset = 0;
let userLoadEnd;
let worksOffset = 0;
let worksLoadEnd;
let tagOffset = 0;
let tagLoadEnd;

class Search extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.type = 2;
    self.on(migi.Event.DOM, function() {
      window.addEventListener('scroll', function() {
        self.checkMore();
      });
    });
  }
  @bind value
  @bind type
  init() {
    this.load();
  }
  submit(e) {
    e.preventDefault();
    let self = this;
    authorOffset = userOffset = worksOffset = tagOffset = 0;
    authorLoadEnd = userLoadEnd = worksLoadEnd = tagLoadEnd = loading = false;
    self.ref.authorList.clearData();
    self.ref.authorList.message = '正在加载...';
    self.ref.userList.clearData();
    self.ref.userList.message = '正在加载...';
    self.ref.worksList.clearData();
    self.ref.worksList.message = '正在加载...';
    self.ref.tagList.clearData();
    self.ref.tagList.message = '正在加载...';
    self.load();
  }
  checkMore() {
    let self = this;
    if($util.isBottom()) {
      switch (self.type) {
        case 0:
          if(!loading && !authorLoadEnd) {
            self.load();
          }
          break;
        case 1:
          if(!loading && !userLoadEnd) {
            self.load();
          }
          break;
        case 2:
          if(!loading && !worksLoadEnd) {
            self.load();
          }
          break;
        case 3:
          if(!loading && !tagLoadEnd) {
            self.load();
          }
          break;
      }
    }
  }
  load() {
    let self = this;
    let keyword = (self.value || '').trim();
    if(!keyword && self.type === 1) {
      let $message = $(self.ref.message.element);
      $message.removeClass('fn-hide empty');
      return;
    }
    if(ajax) {
      ajax.abort();
    }
    let $message = $(self.ref.message.element);
    $message.addClass('fn-hide');
    let type = this.type;
    let url = '/h5/search/author';
    let authorList = self.ref.authorList;
    let userList = self.ref.userList;
    let worksList = self.ref.worksList;
    let tagList = self.ref.tagList;
    let offset = 0;
    switch(type) {
      case 0:
        if(authorLoadEnd) {
          if(authorOffset === 0) {
            $message.removeClass('fn-hide').addClass('empty');
          }
          return;
        }
        authorList.message = '正在加载...';
        offset = authorOffset;
        break;
      case 1:
        if(userLoadEnd) {
          if(userOffset === 0) {
            $message.removeClass('fn-hide').addClass('empty');
          }
          return;
        }
        userList.message = '正在加载...';
        url = '/h5/search/user';
        offset = userOffset;
        break;
      case 2:
        if(worksLoadEnd) {
          if(worksOffset === 0) {
            $message.removeClass('fn-hide').addClass('empty');
          }
          return;
        }
        worksList.message = '正在加载...';
        url = '/h5/search/works';
        offset = worksOffset;
        break;
      case 3:
        if(tagLoadEnd) {
          if(tagOffset === 0) {
            $message.removeClass('fn-hide').addClass('empty');
          }
          return;
        }
        tagList.message = '正在加载...';
        url = '/h5/search/tag';
        offset = tagOffset;
        break;
    }

    loading = true;
    ajax = $net.postJSON(url, { keyword, offset }, function(res) {
      if(res.success) {
        let data = res.data;
        switch(type) {
          case 0:
            authorList.appendData(data.data);
            authorOffset += data.count ? data.limit : 0;
            if(data.count === 0) {
              authorList.message = '';
              $message.removeClass('fn-hide');
              $message.addClass('empty');
              authorLoadEnd = true;
            }
            else if(authorOffset >= data.count) {
              authorList.message = '已经到底了';
              authorLoadEnd = true;
            }
            break;
          case 1:
            userList.appendData(data.data);
            userOffset += data.count ? data.limit : 0;
            if(data.count === 0) {
              userList.message = '';
              $message.removeClass('fn-hide');
              $message.addClass('empty');
              userLoadEnd = true;
            }
            else if(userOffset >= data.count) {
              userList.message = '已经到底了';
              userLoadEnd = true;
            }
            break;
          case 2:
            worksList.appendData(data.data);
            worksOffset += data.count ? data.limit : 0;
            if(data.count === 0) {
              worksList.message = '';
              $message.removeClass('fn-hide');
              $message.addClass('empty');
              worksLoadEnd = true;
            }
            else if(worksOffset >= data.count) {
              worksList.message = '已经到底了';
              worksLoadEnd = true;
            }
            break;
          case 3:
            tagList.appendData(data.data);
            tagOffset += data.count ? data.limit : 0;
            if(data.count === 0) {
              userList.message = '';
              $message.removeClass('fn-hide');
              $message.addClass('empty');
              tagLoadEnd = true;
            }
            else if(tagOffset >= data.count) {
              tagList.message = '已经到底了';
              tagLoadEnd = true;
            }
            break;
        }
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
      loading = false;
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      loading = false;
    });
  }
  clickClear() {
    let self = this;
    self.value = '';
    if(ajax) {
      ajax.abort();
    }
    loading = false;
    let $message = $(self.ref.message.element);
    $message.removeClass('fn-hide empty');
    self.ref.authorList.clearData();
    self.ref.authorList.message = '';
    self.ref.userList.clearData();
    self.ref.userList.message = '';
    self.ref.worksList.clearData();
    self.ref.worksList.message = '';
    self.ref.tagList.clearData();
    self.ref.tagList.message = '';
    authorOffset = userOffset = worksOffset = tagOffset = 0;
    authorLoadEnd = userLoadEnd = worksLoadEnd = tagLoadEnd = loading = false;
    self.load();
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
        <form class="input"
              onSubmit={ this.submit }>
          <input type="text"
                 value={ this.value }
                 class="text"
                 placeholder="请输入搜索内容"
                 maxlength="20"/>
          <b class={ 'clear' + (this.value ? '' : ' fn-hide') }
             onClick={ this.clickClear }/>
        </form>
        <span class="back"
              onClick={ this.clickBack }>取消</span>
      </div>
      <ul class="type"
          onClick={ { li: this.clickType } }>
        <li class={ this.type === 2 ? 'cur' : '' }
            rel={ 2 }>作品</li>
        <li class={ this.type === 0 ? 'cur' : '' }
            rel={ 0 }>作者</li>
        <li class={ this.type === 3 ? 'cur' : '' }
            rel={ 3 }>话题</li>
        <li class={ this.type === 1 ? 'cur' : '' }
            rel={ 1 }>用户</li>
      </ul>
      <p class={ this.type === 0 ? '' : 'fn-hide' }>最新入驻</p>
      <p class={ this.type === 2 ? '' : 'fn-hide' }>最新上传</p>
      <div class="message"
           ref="message"/>
      <AuthorList ref="authorList"
                  @visible={ this.type === 0 }/>
      <UserList ref="userList"
                @visible={ this.type === 1 }/>
      <WorksList ref="worksList"
                 @visible={ this.type === 2 }/>
      <TagList ref="tagList"
               @visible={ this.type === 3 }/>
    </div>;
  }
}

export default Search;
