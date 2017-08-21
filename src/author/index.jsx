/**
 * Created by army on 2017/6/16.
 */
 
import './author.html';
import './index.less';

import qs from 'anima-querystring';

import Nav from './Nav.jsx';
import Home from './Home.jsx';
import Works from './Works.jsx';
import AuthorComment from './AuthorComment.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let id = search.id;

jsBridge.ready(function() {
  let nav = migi.render(
    <Nav authorId={ id }/>,
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

  let works = migi.render(
    <Works authorId={ id }/>,
    document.body
  );
  let authorComment = migi.render(
    <AuthorComment authorId={ id }/>,
    document.body
  );
  tags.on('change', function(i) {
    home && home.hide();
    works && works.hide();
    authorComment && authorComment.hide();
    switch (i) {
      case '0':
        home.show();
        break;
      case '1':
        works.show();
        break;
      case '2':
        authorComment.show();
        break;
    }
  });
  tags.emit('change', '2');

  if(id) {
    util.postJSON('api/author/GetAuthorDetails', { AuthorID: id }, function (res) {
      if(res.success) {
        let data = res.data;

        profile.headUrl = data.Head_url;
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
        jsBridge.toast(util.ERROR_MESSAGE);
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
      else {
        jsBridge.toast(util.ERROR_MESSAGE);
      }
    });
  }
});
