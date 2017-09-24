/**
 * Created by army8735 on 2017/9/18.
 */

import Nav from './Nav.jsx';
import Home from './Home.jsx';
import Works from './Works.jsx';
import AuthorComment from './AuthorComment.jsx';

class Author extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      let nav = self.ref.nav;
      let tags = nav.ref.tags;
      let home = self.ref.home;
      let works;
      let authorComment;
      tags.on('change', function(i) {
        home && home.hide();
        works && works.hide();
        authorComment && authorComment.hide();
        switch (i) {
          case '0':
            home.show();
            break;
          case '1':
            if(!works) {
              works = migi.render(
                <Works/>,
                self.element
              );
              works.authorID = self.authorID;
              works.load();
            }
            works.show();
            break;
          case '2':
            if(!authorComment) {
              authorComment = migi.render(
                <AuthorComment/>,
                self.element
              );
              authorComment.authorID = self.authorID;
              authorComment.load();
            }
            authorComment.show();
            break;
        }
      });
      // setTimeout(function() {
      //   tags.emit('change', '2');
      // }, 100);
    });
  }
  setID(authorID) {
    let self = this;
    self.authorID = authorID;
  }
  load() {
    let self = this;
    let nav = self.ref.nav;
    let profile = nav.ref.profile;
    let link = nav.ref.link;
    util.postJSON('api/author/GetAuthorDetails', { AuthorID: self.authorID }, function (res) {
      if(res.success) {
        let data = res.data;

        profile.headUrl = data.Head_url;
        profile.authorID = data.AuthorID;
        profile.authorName = data.AuthorName;
        profile.type = data.Authortype;
        profile.sign = data.Sign;
        profile.fansNumber = data.FansNumber;
        profile.isLike = data.IsLike;
        profile.loading = false;

        link._5SingUrl = data._5SingUrl;
        link._BilibiliUrl = data._BilibiliUrl;
        link._BaiduUrl = data._BaiduUrl;
        link._WangyiUrl = data._WangyiUrl;
        link._WeiboUrl = data._WeiboUrl;
        link.autoWidth();
      }
      else {
        alert(res.message || util.ERROR_MESSAGE);
      }
    }, function(res) {
      // alert(res.message || util.ERROR_MESSAGE);
    });
    let home = self.ref.home;
    home.load(self.authorID);
  }
  render() {
    return <div class="author">
      <Nav ref="nav"/>
      <Home ref="home"/>
    </div>;
  }
}

export default Author;
