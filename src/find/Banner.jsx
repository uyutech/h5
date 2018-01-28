/**
 * Created by army8735 on 2017/11/30.
 */

'use strict';

import net from "../common/net";
import util from "../common/util";

let interval;

class Banner extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.dataList = self.props.dataList || [];
    self.on(migi.Event.DOM, function() {
      self.addInterval();
    });
  }
  @bind dataList;
  @bind index = 0;
  clickTag(e, vd, tvd) {
    this.index = tvd.props.rel;
    this.setOffset(Math.floor(this.index * $(window).width()));
    this.addInterval();
  }
  setOffset(x) {
    let $list = $(this.ref.list.element);
    $list.css('-moz-transform', 'translateX(-' + x + 'px)');
    $list.css('-webkit-transform', 'translateX(-' + x + 'px)');
    $list.css('transform', 'translateX(-' + x + 'px)');
  }
  addInterval() {
    if(interval) {
      clearInterval(interval);
    }
    let self = this;
    interval = setInterval(function() {
      self.index++;
      if(self.index >= self.dataList.length) {
        self.index = 0;
      }
      self.setOffset(self.index * $(window).width());
    }, 5000);
  }
  left() {
    this.index++;
    if(this.index >= this.dataList.length) {
      this.index = this.dataList.length - 1;
    }
    this.setOffset(Math.floor(this.index * $(window).width()));
    this.addInterval();
  }
  right() {
    this.index--;
    if(this.index < 0) {
      this.index = 0;
    }
    this.setOffset(Math.floor(this.index * $(window).width()));
    this.addInterval();
  }
  click(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    let title = tvd.props.title;
    if(!url) {
      throw new Error('banner url is null');
    }
    jsBridge.pushWindow(url, {
      title,
    });
  }
  render() {
    return <div class="mod-banner" onSwipeLeft={ this.left } onSwipeRight={ this.right } onClick={ { a: this.click } }>
      <ul class="list fn-clear" ref="list" style={ 'width:' + Math.max(1, this.dataList.length) * 100 + '%' }>
        {
          this.dataList.map(function(item) {
            let url = '';
            switch(item.urltype) {
              case 1:
                url = '/works.html?worksID=' + item.urlid;
                break;
              case 2:
                url = '/post.html?postID=' + item.urlid;
                break;
              case 3:
                url = '/author.html?authorId=' + item.urlid;
                break;
              case 4:
                url = '/user.html?userID=' + item.urlid;
                break;
            }
            return <li><a href={ url } target="_blank" title={ item.Describe }><img src={ util.autoSsl(util.img750__80(item.coverpic)) || '/src/common/blank.png' }/></a></li>;
          })
        }
      </ul>
      <ul class="tags" ref="tags" onClick={ { li: this.clickTag } }>
        {
          (this.index, this.dataList).map(function(item, index) {
            return <li class={ index === this.index ? 'cur' : '' } rel={ index }>{ index + 1 }</li>;
          }.bind(this))
        }
      </ul>
    </div>;
  }
}

export default Banner;
