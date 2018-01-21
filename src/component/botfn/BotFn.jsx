/**
 * Created by army8735 on 2018/1/14.
 */

'use strict';

let clickDel;
let clickFavor;
let clickLike;
let clickCancel;

class BotFn extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      migi.eventBus.on('BOT_FN', function(data) {
        self.canDel = data.canDel;
        self.isFavor = data.isFavor;
        self.isLike = data.isLike;
        clickDel = data.clickDel;
        clickFavor = data.clickFavor;
        clickLike = data.clickLike;
        clickCancel = data.clickCancel;
        self.pop = true;
      });
      $(self.element).on('click', function(e) {
        if(!$(e.target).closest('.c')[0]) {
          self.pop = false;
        }
      });
    });
  }
  @bind canDel;
  @bind isFavor
  @bind isLike
  @bind pop
  show() {
    $(this.element).removeClass('fn-hide');
    return this;
  }
  hide() {
    $(this.element).addClass('fn-hide');
    return this;
  }
  clickDel() {
    if(clickDel) {
      clickDel(this);
    }
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
    clickDel = clickLike = clickFavor = clickCancel = null;
  }
  render() {
    return <div class={ 'cp-botfn' + (this.pop ? ' on' : '') }>
      <div class={ 'c' + (this.pop ? ' on' : '') }>
        <ul class="list">
          <li class={ 'like' + (this.isLike ? ' liked' : '') } onClick={ this.clickLike }><b/>点赞</li>
          <li class={ 'favor' + (this.isFavor ? ' favored' : '') } onClick={ this.clickFavor }><b/>收藏</li>
          <li class={ 'del' + (this.canDel ? '' : ' fn-hide') } ref="del" onClick={ this.clickDel }><b/>删除</li>
        </ul>
        <button class="cancel" onClick={ this.clickCancel }>取消</button>
      </div>
    </div>;
  }
}

export default BotFn;
