/**
 * Created by army8735 on 2018/1/8.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';

class VideoList extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.message = self.props.message;
    self.dataList = self.props.dataList;
  }
  @bind message
  show() {
    $(this.element).removeClass('fn-hide');
  }
  hide() {
    $(this.element).addClass('fn-hide');
  }
  appendData(data) {
    let s = '';
    (data || []).forEach(function(item) {
      s += this.genItem(item) || '';
    }.bind(this));
    $(this.ref.list.element).append(s);
  }
  genItem(item) {
    let works = item.Works_Items_Works[0];
    let url = '/works.html?worksID=' + works.WorksID + '&workID=' + item.ItemID;
    let author = item.GroupAuthorTypeHash.AuthorTypeHashlist[0] || {};
    return <li>
      <a href={ url } title={ item.ItemName } class="pic">
        <img src={ util.autoSsl(util.img750__80(works.WorksCoverPic || '/src/common/blank.png')) }/>
      </a>
      <div class="txt">
        <a href={ url } title={ item.ItemName } class="name">{ item.ItemName }</a>
        <div class="info">
          <div class="author">
            {
              (author.AuthorInfo || []).map(function(item) {
                return <a href={ '/author.html?authorID=' + item.AuthorID }>
                  <img src={ util.autoSsl(util.img48_48_80(item.Head_url || '/src/common/blank.png')) }/>
                  <span>{ item.AuthorName }</span>
                </a>;
              })
            }
          </div>
          <b class="like">{ item.LikeHis }</b>
          <b class="comment">456</b>
        </div>
      </div>
    </li>;
  }
  clearData() {
    $(this.ref.list.element).html('');
  }
  render() {
    return <div class="mod-videolist">
      <ul ref="list">
        {
          (this.dataList || []).map(function(item) {
            return this.genItem(item);
          }.bind(this))
        }
      </ul>
      <div class={ 'cp-message' + (this.message ? '' : ' fn-hide') }>{ this.message }</div>
    </div>;
  }
}

export default VideoList;
