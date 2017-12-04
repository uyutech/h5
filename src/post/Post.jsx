/**
 * Created by army8735 on 2017/12/4.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import Comment from '../component/comment/Comment.jsx';

let take = 30;
let skip = take;
let sortType = 0;
let myComment = 0;
let currentCount = 0;
let ajax;

class Post extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind hasData
  @bind postID
  setData(postID, data) {
    let self = this;

    self.postID = postID;
    self.postData = data.postData;
    self.replyData = data.replyData;

    self.hasData = true;
  }
  genDom() {
    let self = this;
    let postData = self.postData;
    let html = (postData.Content || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/#(\S.*?)#/g, `<strong>#$1#</strong>`)
      .replace(/(http(?:s)?:\/\/[\w-]+\.[\w]+\S*)/gi, '<a href="$1" target="_blank">$1</a>');
    let replyData = self.replyData;
    return <div>
      <h2>{ postData.Title }</h2>
      <div class={ 'profile fn-clear' + (postData.IsAuthor ? ' author' : '') }>
        {
          postData.IsAuthor
            ? <a class="pic" href={ '/author/' + postData.AuthorID }>
              <img src={ util.autoSsl(util.img128_128_80(postData.SendUserHead_Url
                || '/src/common/head.png')) }/>
            </a>
            : <a class="pic" href={ '/user/' + postData.SendUserID }>
              <img src={ util.autoSsl(util.img128_128_80(postData.SendUserHead_Url
                || '/src/common/head.png')) }/>
            </a>
        }
        <div class="txt">
          <div>
            {
              postData.IsAuthor
                ? <a class="name" href={ '/author/' + postData.AuthorID }>{ postData.SendUserNickName }</a>
                : <a class="name" href={ '/user/' + postData.SendUserID }>{ postData.SendUserNickName }</a>
            }
            <small class="time">{ util.formatDate(postData.Createtime) }</small>
          </div>
        </div>
        <div class="circle">
          <ul>
            {
              (postData.Taglist || []).map(function(item) {
                return <li><a href={ '/circle/' + item.TagID }>{ item.TagName }圈</a></li>;
              })
            }
          </ul>
        </div>
      </div>
      <div class="wrap">
        <p class="con" dangerouslySetInnerHTML={ html }/>
        {
          postData.Image_Post
            ?
            <div class="imgs">
              {
                postData.Image_Post.map(function(item, i) {
                  return <img src={ util.autoSsl(util.img720__80(item.FileUrl)) } rel={ i }/>;
                })
              }
            </div>
            : ''
        }
        <b class="arrow"/>
        <ul class="btn">
          <li class="share" onClick={ this.clickShare }><b/><span>分享</span></li>
          <li class={ 'favor' + (this.isFavor ? ' has' : '') } onClick={ this.clickFavor }>
            <b/><span>{ this.favorCount || '收藏' }</span>
          </li>
          <li class={ 'like' + (this.isLike ? ' has' : '') } onClick={ this.clickLike }>
            <b/><span>{ this.likeCount || '点赞' }</span>
          </li>
          <li class="comment">
            <b/><span>{ postData.CommentCount || '评论' }</span>
          </li>
          { postData.IsOwn ? <li class="del" onClick={ this.clickDel }><b/></li> : '' }
        </ul>
      </div>
      <div class="box">
        <a name="comment"/>
        <h4>回复</h4>
        <div class="fn">
          <ul class="type fn-clear" onClick={ { li: this.switchType2 } }>
            <li class="cur" rel="0">全部<small>{ replyData.Count }</small></li>
            <li rel="1">我的</li>
          </ul>
          <ul class="type2 fn-clear" onClick={ { li: this.switchType } }>
            <li class="cur" rel="0">最新</li>
            <li rel="1">最热</li>
          </ul>
        </div>
        <Comment ref="comment"
                 zanUrl="/api/post/likeComment"
                 subUrl="/api/post/subCommentList"
                 delUrl="/api/post/delComment"
                 data={ replyData.data }
                 message={ (!replyData.Size || replyData.Size > take) ? '' : '已经到底了' }/>
      </div>
    </div>;
  }
  render() {
    return <div class="post">
      {
        this.hasData
          ? this.genDom()
          : <div>
              <div class="fn-placeholder-roundlet"/>
              <div class="fn-placeholder"/>
              <div class="fn-placeholder-pic"/>
            </div>
      }
    </div>;
  }
}

export default Post;
