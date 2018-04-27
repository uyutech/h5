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
let clickShareIn;
let clickShareWb;
let clickShareLink;

class BotFn extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      migi.eventBus.on('BOT_FN', function(data) {
        self.favorText = data.favorText;
        self.favoredText = data.favoredText;
        self.delText = data.delText;
        self.blockText = data.blockText;
        self.reportText = data.reportText;
        self.canFn = data.canFn;
        self.canLike = data.canLike;
        self.canFavor = data.canFavor;
        self.canDel = data.canDel;
        self.canBlock = data.canBlock;
        self.canReport = data.canReport;
        self.canShare = data.canShare;
        self.canShareIn = data.canShareIn;
        self.canShareWb = data.canShareWb;
        self.canShareLink = data.canShareLink;
        self.isFavor = data.isFavor;
        self.isLike = data.isLike;
        clickDel = data.clickDel;
        clickFavor = data.clickFavor;
        clickLike = data.clickLike;
        clickCancel = data.clickCancel;
        clickBlock = data.clickBlock;
        clickReport = data.clickReport;
        clickShareIn = data.clickShareIn;
        clickShareWb = data.clickShareWb;
        clickShareLink = data.clickShareLink;
        self.pop = true;
      });
      $(self.element).on('click', function(e) {
        if(!$(e.target).closest('.c')[0] && !$(e.target).closest('.recommend')[0]) {
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
  @bind favoredText
  @bind favorText
  @bind delText
  @bind blockText
  @bind reportText
  @bind canFn
  @bind canLike
  @bind canFavor
  @bind canDel
  @bind canReport
  @bind canBlock
  @bind canShare
  @bind canShareIn
  @bind canShareWb
  @bind canShareLink
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
  clickShareIn() {
    if(clickShareIn) {
      clickShareIn(this);
    }
    this.cancel();
  }
  clickShareWb() {
    if(clickShareWb) {
      clickShareWb(this);
    }
    this.cancel();
  }
  clickShareLink() {
    if(clickShareLink) {
      clickShareLink(this);
    }
    this.cancel();
  }
  cancel() {
    this.pop = false;
    this.delText = this.blockText = this.reportText = null;
    clickDel = clickLike = clickFavor = clickCancel = clickReport = clickBlock = null;
  }
  render() {
    return <div class={ 'cp-botfn' + (this.pop ? ' on' : '') }>
      <div class="c">
        <ul class={ 'list share' + (this.canShare ? '' : ' fn-hide') }>
          <li class={ 'in' + (this.canShareIn ? '' : ' fn-hide') } onClick={ this.clickShareIn }><b/>分享</li>
          <li class={ 'wb' + (this.canShareWb ? '' : ' fn-hide') } onClick={ this.clickShareWb }><b/>微博</li>
          <li class={ 'link' + (this.canShareLink ? '' : ' fn-hide') } onClick={ this.clickShareLink }><b/>复制链接</li>
        </ul>
        <ul class={ 'list' + (this.canFn ? '' : ' fn-hide') }>
          <li class={ 'like' + (this.isLike ? ' liked' : '') + (this.canLike ? '' : ' fn-hide') }
              onClick={ this.clickLike }><b/>{ this.isLike ? '已点赞' : '点赞' }</li>
          <li class={ 'favor' + (this.isFavor ? ' favored' : '') + (this.canFavor ? '' : ' fn-hide') }
              onClick={ this.clickFavor }><b/>{ this.isFavor ? this.favoredText || '已收藏' : this.favorText || '收藏' }</li>
          <li class={ 'del' + (this.canDel ? '' : ' fn-hide') }
              onClick={ this.clickDel }><b/>{ this.delText || '删除' }</li>
          <li class={ 'block' + (this.canBlock ? '' : ' fn-hide') }
              onClick={ this.clickBlock }><b/>{ this.blockText || '屏蔽' }</li>
          <li class={ 'report' + (this.canReport ? '' : ' fn-hide') }
              onClick={ this.clickReport }><b/>{ this.reportText || '举报' }</li>
        </ul>
        <button class="cancel" onClick={ this.clickCancel }>取消</button>
      </div>
    </div>;
  }
}

export default BotFn;
