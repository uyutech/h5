/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import util from '../common/util';
import Nav from './Nav.jsx';
import Home from './Home.jsx';
import MAList from './MAList.jsx';
import PicList from './PicList.jsx';
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
    self.hotPicList = data.hotPicList;

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
    let picList = self.ref.picList;
    let comments = self.ref.comments;
    home && home.hide();
    maList && maList.hide();
    picList && picList.hide();
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
                    dataList={ self.hotPlayList }/>
          );
          maList.after(self.ref.type.element);
        }
        maList.show();
        break;
      case 'pic':
        if(!picList) {
          self.ref.picList = picList = migi.render(
            <PicList ref="picList" authorID={ self.authorID }
                     dataList={ self.hotPicList }/>
          );
          picList.after(self.ref.type.element);
        }
        picList.show();
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
                isLogin={ util.isLogin() }
                authorID={ self.authorID }
                commentData={ self.commentData }/>
    );
    self.ref.comments.after(self.ref.type.element);

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
    if(!self.authorDetail.ISSettled) {
      return <div>
        <Nav ref="nav"
             authorID={ self.authorID }
             authorDetail={ self.authorDetail }/>
        <ul class="type fn-clear" ref="type">
          <li class="comments cur">留言</li>
        </ul>
        <Comments ref="comments"
                  isLogin={ util.isLogin() }
                  authorID={ self.authorID }
                  commentData={ self.commentData }/>
        <SubCmt ref="subCmt"
                originTo={ self.authorDetail.AuthorName }
                subText="发送"
                tipText="-${n}"
                readOnly={ true }
                shareUrl={ '/author/' + self.authorID }
                placeholder={ '给' + self.authorDetail.AuthorName + '留个言吧' }/>
      </div>;
    }
    let emptyHome = !self.album.length
      && !self.homeDetail.Hot_Works_Items.length
      && !self.homeDetail.AuthorToAuthor.length;
    let emptyMA = !self.hotPlayList.Size;
    let emptyPic = !self.hotPicList.Size;
    return <div>
      <Nav ref="nav"
           authorID={ self.authorID }
           authorDetail={ self.authorDetail }/>
      <ul class="type fn-clear" ref="type" onClick={ { li: this.clickType } }>
        {
          emptyHome
            ? ''
            : <li class="home cur" rel="home">主页</li>
        }
        {
          emptyMA
            ? ''
            : <li class="ma" rel="ma">音乐</li>
        }
        {
          emptyPic
            ? ''
            : <li class="pic" rel="pic">图片</li>
        }
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
              shareUrl={ '/author/' + self.authorID }
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
