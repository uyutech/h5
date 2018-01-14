/**
 * Created by army8735 on 2018/1/14.
 */

'use strict';

let clickFavor;
let clickLike;
let clickCancel;

class BotFn extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      migi.eventBus.on('BOT_FN', function(data) {
        self.isFavor = data.isFavor;
        self.isLike = data.isLike;
        self.isOwn = data.isOwn;
        clickFavor = data.clickFavor;
        clickLike = data.clickLike;
        clickCancel = data.clickCancel;
        self.pop = true;
      })
    });
  }
  @bind isFavor
  @bind isLike
  @bind isOwn
  @bind pop
  show() {
    $(this.element).removeClass('fn-hide');
    return this;
  }
  hide() {
    $(this.element).addClass('fn-hide');
    return this;
  }
  clickFavor() {
    if(clickFavor) {
      clickFavor(this);
    }
  }
  clickLike() {
    if(clickLike) {
      clickLike(this);
    }
  }
  clickCancel() {
    if(clickCancel) {
      clickCancel(this);
    }
    this.pop = false;
    clickLike = clickFavor = clickCancel = null;
  }
  render() {
    return <div class={ 'cp-botfn' + (this.pop ? ' on' : '') }>
      <div class={ 'c' + (this.pop ? ' on' : '') }>
        <ul class="list">
          <li class={ 'del' + (this.isOwn ? '' : ' fn-hide') } ref="del"><b/>删除</li>
          <li class={ 'favor' + (this.isFavor ? ' favored' : '') } onClick={ this.clickFavor }><b/>收藏</li>
          <li class={ 'like' + (this.isLike ? ' liked' : '') } onClick={ this.clickLike }><b/>点赞</li>
        </ul>
        <button class="cancel" onClick={ this.clickCancel }>取消</button>
      </div>
    </div>;
  }
}

export default BotFn;
