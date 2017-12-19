/**
 * Created by army8735 on 2017/11/24.
 */

'use strict';

import util from '../common/util';

class ImageView extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.dataList = self.props.dataList || [];
    self.isLike = self.props.isLike;
    self.on(migi.Event.DOM, function() {
      let $window = $(window);
      migi.eventBus.on('choosePic', function(dataList, i, isLike, sid) {
        self.dataList = dataList;
        self.idx = i;
        self.isLike = isLike;
        self.sid = sid;
        self.show();
        self.tops = $window.scrollTop();
      });
    });
  }
  @bind dataList = []
  @bind idx = 0
  @bind tops = 0
  @bind isLike
  @bind sid
  show() {
    $(this.element).removeClass('fn-hide');
  }
  hide() {
    $(this.element).addClass('fn-hide');
  }
  clickPrev() {
    let self = this;
    if(self.idx) {
      self.idx--;
    }
  }
  clickNext() {
    let self = this;
    if(self.idx < self.dataList.length - 1) {
      self.idx++;
    }
  }
  clickClose() {
    this.hide();
  }
  clickLike() {
    this.emit('clickLike', this.sid);
  }
  clickDownload(e, vd) {
    if(!util.isLogin()) {
      e.preventDefault();
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    let url = $(vd.element).attr('href');
    jsBridge.download({
      url,
    });
  }
  render() {
    return <div class="mod-iv fn-hide">
      <div class="c" style={ 'top:' + this.tops + 'px' }>
        <img src={ this.dataList && this.dataList[this.idx]
            ? util.autoSsl(util.img720__80(this.dataList[this.idx].FileUrl)) || '/src/common/blank.png'
            : '/src/common/blank.png' }/>
        <ul class="btn">
          <li class={ 'like' + (this.isLike ? ' has' : '') } onClick={ this.clickLike }/>
          <li class="download">
            <a href={ this.dataList && this.dataList[this.idx]
              ? this.dataList[this.idx].FileUrl
              : ''}
               onClick={ this.clickDownload }/>
          </li>
        </ul>
      </div>
      <b class="prev" onClick={ this.clickPrev }/>
      <b class="next" onClick={ this.clickNext }/>
      <b class="close" onClick={ this.clickClose }/>
    </div>;
  }
}

export default ImageView;
