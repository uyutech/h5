/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import Nav from './Nav.jsx';
import Home from './Home.jsx';
import MAList from './MAList.jsx';
import PicList from './PicList.jsx';
import Comments from './Comments.jsx';
import WorksTypeEnum from "../works/WorksTypeEnum";
import InputCmt from '../component/inputcmt/InputCmt.jsx';
import Background from '../component/background/Background.jsx';

class Author extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind authorId
  @bind type
  @bind rid
  @bind cid
  load(authorId) {
    let self = this;
    self.authorId = authorId;
    self.ref.nav.authorId = authorId;
    net.postJSON('/h5/author/index', { authorID: authorId }, function(res) {
      if(res.success) {
        self.setData(res.data);
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  setData(data) {
    let self = this;
    self.hotPlayList = data.hotPlayList;
    self.album = data.album;
    self.hotPicList = data.hotPicList;
    self.commentData = data.commentData;
    self.ref.nav.setData(data.authorDetail, 1);

    if(!data.authorDetail.ISSettled) {
      self.type = [
        {
          cn: 'comments',
          name: '留言',
        }
      ];
    }
    else {
      let emptyHome = !data.album.length
        && !data.homeDetail.Hot_Works_Items.length
        && !data.homeDetail.AuthorToAuthor.length;
      let emptyAudio = !data.hotPlayList.Size;
      let emptyPic = !data.hotPicList.Size;
      let type = [];
      if(!emptyHome) {
        type.push({
          cn: 'home',
          name: '主页',
        });
      }
      if(!emptyAudio) {
        type.push({
          cn: 'ma',
          name: '音乐',
        });
      }
      if(!emptyPic) {
        type.push({
          cn: 'pic',
          name: '图片',
        });
      }
      type.push({
        cn: 'comments',
        name: '留言',
      });
      self.type = type;
    }
    switch(self.type[0].cn) {
      case 'home':
        self.ref.home = <Home ref="home"
                              homeDetail={ data.homeDetail }
                              album={ data.album }/>;
        self.ref.home.show();
        self.ref.home.after(self.ref.type.element);
        break;
      case 'ma':
        self.ref.maList = <MAList ref="maList"
                                  authorId={ self.authorId }
                                  dataList={ data.hotPlayList }/>;
        self.ref.maList.show();
        self.ref.maList.after(self.ref.type.element);
        break;
      case 'pic':
        self.ref.picList = <PicList ref="picList"
                                    authorId={ self.authorId }
                                    dataList={ data.hotPicList }/>;
        self.ref.picList.show();
        self.ref.picList.after(self.ref.type.element);
        break;
      case 'comments':
        self.addComment(self.commentData);
        break;
    }

    let inputCmt = self.ref.inputCmt;
    inputCmt.on('click', function() {
      if(self.cid) {
        jsBridge.pushWindow('/subcomment.html?type=2&id='
          + self.authorId + '&cid=' + self.cid + '&rid=' + self.rid, {
          title: '评论',
        });
      }
      else {
        jsBridge.pushWindow('/subcomment.html?type=2&id=' + self.authorId, {
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
          self.ref.maList = maList = <MAList ref="maList"
                                             authorId={ self.authorId }
                                             dataList={ self.hotPlayList }/>;
          maList.after(self.ref.type.element);
        }
        maList.show();
        break;
      case 'pic':
        if(!picList) {
          self.ref.picList = picList = <PicList ref="picList"
                                                authorId={ self.authorId }
                                                dataList={ self.hotPicList }/>;
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
                authorId={ self.authorId }
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
      self.rid = rid;
      self.cid = cid;
      if(!n || n === '0') {
        jsBridge.pushWindow('/subcomment.html?type=2&id='
          + self.authorId + '&cid=' + cid + '&rid=' + rid, {
          title: '评论',
        });
      }
    });
    comment.on('closeSubComment', function() {
      subCmt.to = '';
      self.rid = self.cid = null;
    });
  }
  render() {
    return <div class="author">
      <Background ref="background" topRight={ true }/>
      <Nav ref="nav"/>
      <ul class="type" ref="type" onClick={ { li: this.clickType } }>
        {
          (this.type || []).map(function(item, i) {
            return <li class={ item.cn + (i ? '' : ' cur') } rel={ item.cn }>{ item.name }</li>;
          })
        }
      </ul>
      <InputCmt ref="inputCmt" placeholder={ '发表评论...' } readOnly={ true }/>
    </div>;
  }
}

export default Author;
