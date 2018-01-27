/**
 * Created by army8735 on 2018/1/27.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';

let skip = 0;
let take = 10;
let loading;

class Search extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind value
  @bind authorList
  @bind tagList
  @bind userList
  @bind worksList
  submit(e) {
    e.preventDefault();
    let self = this;
    let keyword = self.value.trim();
    if(!keyword || loading) {
      return;
    }
    loading = true;
    net.postJSON('/h5/find/search', { keyword, skip, take }, function(res) {
      if(res.success) {
        let data = res.data;
        self.authorList = data.authorList.data;
        self.tagList = data.tagList.data;
        self.userList = data.userList.data;
        self.worksList = data.worksList.data;
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
    });
  }
  clickUser(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    let title = tvd.props.title;
    jsBridge.pushWindow(url, {
      title,
    });
  }
  clickWorks(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    let title = tvd.props.title;
    jsBridge.pushWindow(url, {
      title,
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
  render() {
    return <div class="search">
      <form class="input" onSubmit={ this.submit }>
        <input type="text" value={ this.value } class="text" placeholder="请输入搜索内容"/>
        <input type="submit" value="确定" class="sub"/>
      </form>
      <h3 class={ this.authorList ? '' : 'fn-hide' }>作者</h3>
      <ul class="author" onClick={ { a: this.clickAuthor } }>
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
      <h3 class={ this.userList ? '' : 'fn-hide' }>用户</h3>
      <ul class="author" onClick={ { a: this.clickUser } }>
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
      <h3 class={ this.worksList ? '' : 'fn-hide' }>作品</h3>
      <ul class="works" onClick={ { a: this.clickWorks } }>
        {
          (this.worksList || []).map(function(item) {
            let GroupAuthorTypeHash = item.GroupAuthorTypeHash || {};
            let AuthorTypeHashlist = GroupAuthorTypeHash.AuthorTypeHashlist || [];
            let author = AuthorTypeHashlist[0] || {};
            return <li class={ 't' + item.WorkType }>
              <a href={ '/works.html?worksID=' + item.WorkID } title={ item.WorkName } class="pic">
                <img src={ util.autoSsl(util.img170_170_80(item.CoverPic)) }/>
                <span>{ item.Popular }</span>
              </a>
              <a href={ '/works.html?worksID=' + item.WorkID } title={ item.WorkName } class="name">{ item.WorkName }</a>
            </li>;
          })
        }
      </ul>
      <h3 class={ this.tagList ? '' : 'fn-hide' }>标签</h3>
      <ul class="tag" onClick={ { a: this.clickTag } }>
        {
          (this.tagList || []).map(function(item) {
            return <li>
              <a href={ '/tag.html?tag=' + item.TagName } title={ item.TagName }>{ item.TagName }</a>
            </li>;
          })
        }
      </ul>
    </div>;
  }
}

export default Search;
