/**
 * Created by army8735 on 2018/3/31.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';

class VideoList extends migi.Component {
  constructor(...data) {
    super(...data);
    this.visible = this.props.visible;
    this.list = [];
  }
  @bind visible
  @bind list
  @bind message
  setData(data) {
    this.list = data;
  }
  appendData(data) {
    this.list = this.list.concat(data);
  }
  genItem(item) {
    let self = this;
    let url = '/works.html?worksId=' + item.id;
    return <li>
      <a class="pic"
         href={ url }
         title={ item.title }>
        <img src={ util.autoSsl(util.img750__80(item.cover || '/src/common/blank.png')) }/>
        <div class="num">
          <span class="play-times">{ util.abbrNum(item.PlayHis) }次播放</span>
        </div>
      </a>
      <div class="txt">
        <a href={ url }
           title={ item.title }
           class="name">{ item.workTitle }</a>
        <div class="info">
          <span>{ item.profession ? item.profession.kindName : '' }</span>
          <b class={ 'like' + (item.ISLike ? ' liked' : '') } workID={ item.ItemID }>{ item.LikeHis }</b>
          <b class="comment">{ item.CommentCount }</b>
          <b class="fn"/>
        </div>
      </div>
    </li>;
  }
  render() {
    return <div class={ 'mod-videolist' + (this.visible ? '' : ' fn-hide') }>
      <ul ref="list"
          onClick={ { '.pic': this.clickPic,
            '.video': this.clickVideo,
            '.name': this.clickName,
            '.like': this.clickLike,
            '.fn': this.clickFn,
            '.author a': this.clickAuthor } }>
        {
          (this.list || []).map(function(item) {
            return this.genItem(item);
          }.bind(this))
        }
      </ul>
      <div class={ 'cp-message' + (this.message ? '' : ' fn-hide') }>{ this.message }</div>
    </div>;
  }
}

export default VideoList;
