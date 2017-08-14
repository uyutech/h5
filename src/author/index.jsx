/**
 * Created by army on 2017/6/16.
 */
 
import './author.html';
import './index.less';

import qs from 'anima-querystring';

import Nav from './Nav.jsx';
import Home from './Home.jsx';
import Works from './Works.jsx';
import Comments from './Comments.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let id = search.id;

jsBridge.ready(function() {
  let nav = migi.render(
    <Nav/>,
    document.body
  );
  let profile = nav.ref.profile;
  let link = nav.ref.link;
  let tags = nav.ref.tags;

  let home = migi.render(
    <Home authorId={ id }/>,
    document.body
  );
  let hotWork = home.ref.hotWork;
  let hotAuthor = home.ref.hotAuthor;

  let works;
  let comments = migi.render(
    <Comments/>,
    document.body
  );
  tags.on('change', function(i) {
    home && home.hide();
    works && works.hide();
    comments && comments.hide();
    switch (i) {
      case '0':
        home.show();
        break;
      case '1':
        if(!works) {
          works = migi.render(
            <Works authorId={ id }/>,
            document.body
          );
          works.load(id);
        }
        works.show();
        break;
      case '2':
        comments.show();
        break;
    }
  });
  // tags.emit('change', '1');

  if(id) {
    util.postJSON('api/author/GetAuthorDetails', { AuthorID: id }, function (res) {
      if(res.success) {
        let data = res.data;

        profile.headUrl = data.Head_url;
        profile.authorName = data.AuthorName;
        profile.type = data.Authortype;
        profile.sign = data.Sign;
        profile.fansNumber = data.FansNumber;

        link._5SingUrl = data._5SingUrl;
        link._BilibiliUrl = data._BilibiliUrl;
        link._BaiduUrl = data._BaiduUrl;
        link._WangyiUrl = data._WangyiUrl;
        link._WeiboUrl = data._WeiboUrl;
        link.autoWidth();
      }
    });
    util.postJSON('api/author/GetAuthorHomePage', { AuthorID: id }, function (res) {
      if(res.success) {
        let data = res.data;
        hotWork.dataList = data.Hot_Works_Items;
        hotWork.autoWidth();
        hotAuthor.dataList = data.AuthorToAuthor;
        hotAuthor.autoWidth();
      }
    });
  }
});
