/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import Nav from './Nav.jsx';
import Home from './Home.jsx';
import MAList from './MAList.jsx';
import Comments from './Comments.jsx';
import SubCmt from '../component/subcmt/SubCmt.jsx';
import WorksTypeEnum from "../works/WorksTypeEnum";

class Author extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind hasData
  @bind authorID
  @bind rid
  @bind cid
  setData(authorID, data) {
    let self = this;
    self.authorID = authorID;
    self.authorDetail = data.authorDetail;
    self.homeDetail = data.homeDetail;
    self.album = data.album;
    self.commentData = data.commentData;
    self.hotPlayList = data.hotPlayList;

    self.hasData = true;

    let subCmt = self.ref.subCmt;
    subCmt.on('click', function() {
      if(subCmt.to) {
        jsBridge.pushWindow('/subcomment.html?type=2&id='
          + self.authorID + '&cid=' + self.cid + '&rid=' + self.rid, {
          title: '评论',
        });
      }
      else {
        jsBridge.pushWindow('/subcomment.html?type=2&id=' + self.authorID, {
          title: '评论',
        });
      }
    });
  }
  clickType(e, vd ,tvd) {
    let $li = $(tvd.element);
    if($li.hasClass('cur')) {
      return;
    }
    $(vd.element).find('.cur').removeClass('cur');
    $li.addClass('cur');
    let self = this;
    let home = self.ref.home;
    let maList = self.ref.maList;
    let comments = self.ref.comments;
    home && home.hide();
    maList && maList.hide();
    comments && comments.hide();
    let rel = tvd.props.rel;
    switch(rel) {
      case 'home':
        home.show();
        break;
      case 'ma':
        if(!maList) {
          self.ref.maList = maList = migi.render(
            <MAList ref="maList" authorID={ self.authorID }
                    dataList={ self.hotPlayList }/>);
          maList.after(home.element
          );
        }
        maList && maList.show();
        break;
      case 'comments':
        self.addComment();
        comments && comments.show();
        break;
    }
  }
  addComment() {
    let self = this;
    if(self.ref.comments) {
      return;
    }
    let comments = self.ref.comments = migi.render(
      <Comments ref="comments"
                isLogin={ $.cookie('isLogin') === 'true' }
                authorID={ self.authorID }
                commentData={ self.commentData }/>
    );
    self.ref.comments.after(self.ref.home.element);

    let comment = comments.ref.comment;
    let subCmt = self.ref.subCmt;
    if(self.worksType === WorksTypeEnum.TYPE.originMusic) {
      let media = self.ref.media;
      media.on('switchTo', function(data) {
        comments.workID = data.ItemID;
      });
    }
    comment.on('chooseSubComment', function(rid, cid, name, n) {
      subCmt.to = name;
      self.rid = rid;
      self.cid = cid;
      if(!n || n === '0') {
        jsBridge.pushWindow('/subcomment.html?type=2&id='
          + self.authorID + '&cid=' + cid + '&rid=' + rid, {
          title: '评论',
        });
      }
    });
    comment.on('closeSubComment', function() {
      subCmt.to = '';
    });
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
      <SubCmt ref="subCmt"
              originTo={ self.authorDetail.AuthorName }
              subText="发送"
              tipText="-${n}"
              readOnly={ true }
              placeholder={ '给' + self.authorDetail.AuthorName + '留个言吧' }/>
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
