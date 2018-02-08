/**
 * Created by army8735 on 2018/1/14.
 */

'use strict';

let clickDel;
let clickFavor;
let clickLike;
let clickCancel;
let clickBlock;
let clickReport;

class BotFn extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      migi.eventBus.on('BOT_FN', function(data) {
        self.delText = data.delText;
        self.canLike = data.canLike;
        self.canFavor = data.canFavor;
        self.canDel = data.canDel;
        self.canBlock = data.canBlock;
        self.canReport = data.canReport;
        self.isFavor = data.isFavor;
        self.isLike = data.isLike;
        clickDel = data.clickDel;
        clickFavor = data.clickFavor;
        clickLike = data.clickLike;
        clickCancel = data.clickCancel;
        clickBlock = data.clickBlock;
        clickReport = data.clickReport;
        self.pop = true;
      });
      $(self.element).on('click', function(e) {
        if(!$(e.target).closest('.c')[0]) {
          self.clickCancel();
        }
      });
      jsBridge.on('back', function(e) {
        if(self.pop) {
          e.preventDefault();
          self.cancel();
        }
      });
    });
  }
  @bind delText
  @bind canLike
  @bind canFavor
  @bind canDel
  @bind canReport
  @bind canBlock
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
  clickBlock() {
    if(clickBlock) {
      clickBlock(this);
    }
  }
  clickReport() {
    if(clickReport) {
      clickReport(this);
    }
  }
  clickCancel() {
    if(clickCancel) {
      clickCancel(this);
    }
    this.cancel();
  }
  cancel() {
    this.pop = false;
    clickDel = clickLike = clickFavor = clickCancel = clickReport = clickBlock = null;
  }
  render() {
    return <div class={ 'cp-botfn' + (this.pop ? ' on' : '') }>
      <div class={ 'c' + (this.pop ? ' on' : '') }>
        <ul class="list">
          <li class={ 'like' + (this.isLike ? ' liked' : '') + (this.canLike ? '' : ' fn-hide') }
              onClick={ this.clickLike }><b/>{ this.isLike ? '已点赞' : '点赞' }</li>
          <li class={ 'favor' + (this.isFavor ? ' favored' : '') + (this.canFavor ? '' : ' fn-hide') }
              onClick={ this.clickFavor }><b/>{ this.isFavor ? '已收藏' : '收藏' }</li>
          <li class={ 'del' + (this.canDel ? '' : ' fn-hide') }
              onClick={ this.clickDel }><b/>{ this.delText || '删除' }</li>
          <li class={ 'block' + (this.canBlock ? '' : ' fn-hide') }
              onClick={ this.clickBlock }><b/>{ '屏蔽' }</li>
          <li class={ 'report' + (this.canReport ? '' : ' fn-hide') }
              onClick={ this.clickReport }><b/>{ '举报' }</li>
        </ul>
        <button class="cancel" onClick={ this.clickCancel }>取消</button>
      </div>
    </div>;
  }
}

export default BotFn;
