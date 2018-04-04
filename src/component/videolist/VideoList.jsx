/**
 * Created by army8735 on 2018/4/3.
 */

'use strict';

import net from '../../common/net';
import util from '../../common/util';

class VideoList extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.message = self.props.message;
    self.visible = self.props.visible;
    self.list = self.props.list;
  }
  @bind message
  @bind visible
  @bind list
  setData(data) {
    let self = this;
    self.exist = {};
    let list = [];
    (data || []).forEach(function(item) {
      if(self.exist[item.work.id]) {
        return;
      }
      self.exist[item.work.id] = true;
      list.push(self.genItem(item));
    });
    self.list = list;
  }
  appendData(data) {
    let self = this;
    (data || []).forEach(function(item) {
      if(self.exist[item.work.id]) {
        return;
      }
      self.exist[item.work.id] = true;
      self.list.push(self.genItem(item));
    });
  }
  clearData() {
    this.list = [];
  }
  genItem(item) {
    let url = '/works.html?worksId=' + item.id + '&workId=' + item.work.id;
    let author = [];
    let hash = {};
    (item.author || []).forEach(function(list) {
      list.list.forEach(function(at) {
        if(!hash[at.id]) {
          hash[at.id] = true;
          author.push(at.name);
        }
      });
    });
    return <li>
      <a class="pic"
         title={ item.title }
         href={ url }>
        <img src={ util.autoSsl(util.img750__80(item.work.cover || item.cover)) || '/src/common/blank.png' }/>
        <div class="num">
          <span class="play">{ util.abbrNum(0) }次播放</span>
        </div>
      </a>
      <a class="name"
         href={ url }
         title={ item.title }>{ item.work.title }</a>
      <div class="info">
        <p class="author">{ author.join(' ') }</p>
        <b class="like">1</b>
        <b class="comment">2</b>
        <b class="fn"/>
      </div>
    </li>;
  }
  clickPic(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    let title = tvd.props.title;
    jsBridge.pushWindow(url, {
      title,
      transparentTitle: true,
    });
  }
  render() {
    return <div class={ 'cp-videolist' + (this.visible ? '' : ' fn-hide') }>
      <ol ref="list"
          onClick={ { '.pic': this.clickPic } }>{ this.list }</ol>
      <div class={ 'cp-message' + (this.message ? '' : ' fn-hide') }>{ this.message }</div>
    </div>;
  }
}

export default VideoList;
