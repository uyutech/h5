/**
 * Created by army8735 on 2018/1/27.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';

let skip = 0;
let take = 30;

class Search extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind value
  @bind authorList
  @bind tagList
  @bind userList
  @bind worksList
  show() {
    $(this.element).removeClass('fn-hide');
  }
  hide() {
    $(this.element).addClass('fn-hide');
  }
  clickOk() {
    let self = this;
    let keyword = self.value.trim();
    if(!keyword) {
      return;
    }
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
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  render() {
    return <div class="search fn-hide">
      <div class="input">
        <input type="text" value={ this.value } placeholder="请输入搜索内容"/>
        <button onClick={ this.clickOk }>确定</button>
      </div>
      <h3 class={ this.authorList && this.authorList.length ? '' : 'fn-hide' }>作者</h3>
      <ul class="author">
        {
          (this.authorList || []).map(function(item) {
            return <li>
              <a href={ '/author.html?authorId=' + item.AuthorID } title={ item.AuthorName } class="pic">
                <img src={ util.autoSsl(util.img120_120_80(item.Headurl)) || '/src/common/blank.png' }/>
              </a>
              <a href={ '/author.html?authorId=' + item.AuthorID } title={ item.AuthorName } class="name">{ item.AuthorName }</a>
              <p class="fans">{ item.FansNumber }</p>
            </li>;
          })
        }
      </ul>
      <h3 class={ this.userList && this.userList.length ? '' : 'fn-hide' }>用户</h3>
      <ul class="author">
        {
          (this.userList || []).map(function(item) {
            return <li>
              <a href={ '/author.html?authorId=' + item.AuthorID } title={ item.AuthorName } class="pic">
                <img src={ util.autoSsl(util.img120_120_80(item.Headurl)) || '/src/common/blank.png' }/>
              </a>
              <a href={ '/user.html?userID=' + item.uid } title={ item.User_Nickname } class="name">{ item.User_Nickname }</a>
            </li>;
          })
        }
      </ul>
      <h3 class={ this.worksList && this.worksList.length ? '' : 'fn-hide' }>作品</h3>
      <ul class="works">
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
      <h3 class={ this.tagList && this.tagList.length ? '' : 'fn-hide' }>标签</h3>
      <ul class="tag">
        {
          (this.tagList || []).map(function(item) {
            return <li>
              <a href={ '/tag.html?tag=' + item.TagName }>{ item.TagName }</a>
            </li>;
          })
        }
      </ul>
    </div>;
  }
}

export default Search;
