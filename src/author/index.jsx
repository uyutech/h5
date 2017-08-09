/**
 * Created by army on 2017/6/16.
 */
 
import './author.html';
import './index.less';

import qs from 'anima-querystring';

import Nav from './Nav.jsx';
import Link from './Link.jsx';
import Tags from './Tags.jsx';
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
    <Home/>,
    document.body
  );
  let hotwork = home.ref.hotwork;

  let works = migi.render(
    <Works/>,
    document.body
  );
  let comments = migi.render(
    <Comments/>,
    document.body
  );
  tags.on('change', function(i) {
    home.hide();
    works.hide();
    comments.hide();
    switch (i) {
      case '0':
        home.show();
        break;
      case '1':
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
        profile.sign = data.Sign;
        profile.fansNumber = data.FansNumber;

        link.autoWidth();
      }
    });
    util.postJSON('api/author/GetAuthorHomePage', { AuthorID: id }, function (res) {
      if(res.success) {
        let data = res.data;
        console.log(data);
        hotwork.dataList = data.Hot_Works_Music;
        hotwork.autoWidth();
      }
    });
  }
});
