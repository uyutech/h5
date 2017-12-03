/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import Nav from './Nav.jsx';
import Home from './Home.jsx';

class Author extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind hasData
  @bind authorID
  setData(authorID, data) {
    let self = this;
    self.authorID = authorID;
    self.authorDetail = data.authorDetail;
    self.homeDetail = data.homeDetail;
    self.album = data.album;
    self.commentData = data.commentData;
    self.hotPlayList = data.hotPlayList;

    self.hasData = true;
  }
  genDom() {
    let self = this;
    let empty = !self.album.length
      && !self.homeDetail.Hot_Works_Items.length
      && !self.homeDetail.AuthorToAuthor.length;
    if(!self.authorDetail.ISSettled) {
      return <div></div>;
    }
    return <div>
      <Nav ref="nav"
           authorID={ self.authorID }
           authorDetail={ self.authorDetail }/>
      <ul class="type fn-clear" onClick={ { li: this.clickType } }>
        <li class="home cur" rel="home">主页</li>
        <li class="ma" rel="ma">音乐</li>
        <li class="comments" rel="comments">留言</li>
      </ul>
      <Home ref="home"
            authorID={ self.authorID }
            homeDetail={ self.homeDetail }
            album={ self.album }/>
    </div>;
  }
  render() {
    return <div class="author">
      {
        this.hasData
          ? this.genDom()
          : <div>
              <div class="fn-placeholder-pic"/>
              <div class="fn-placeholder-tags"/>
              <div class="fn-placeholder"/>
              <div class="fn-placeholder"/>
            </div>
      }
    </div>;
  }
}

export default Author;
