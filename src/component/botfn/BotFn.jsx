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
let clickRecommend;
let clickUnRecommend;
let clickClean;

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
        self.recommendText = data.recommendText;
        self.unRecommendText = data.unRecommendText;
        self.cleanText = data.cleanText;
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
        self.canRecommend = data.canRecommend;
        self.canUnRecommend = data.canUnRecommend;
        self.canClean = data.canClean;
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
        clickRecommend = data.clickRecommend;
        clickUnRecommend = data.clickUnRecommend;
        clickClean = data.clickClean;
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
  @bind recommendText
  @bind unRecommendText
  @bind cleanText
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
  @bind canRecommend
  @bind canUnRecommend
  @bind canClean
  @bind isFavor
  @bind isLike
  @bind pop
  @bind showRecommend
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
  clickRecommend() {
    this.showRecommend = true;
  }
  clickRecommend2(e, vd, tvd) {
    clickRecommend(this, tvd.props.rel);
  }
  clickUnRecommend() {
    clickUnRecommend(this);
  }
  clickClean() {
    clickClean(this);
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
          <li class={ 'recommend' + (this.canRecommend ? '' : ' fn-hide') }
              onClick={ this.clickRecommend }><b/>{ this.recommendText || '推荐' }</li>
          <li class={ 'un-recommend' + (this.canUnRecommend ? '' : ' fn-hide') }
              onClick={ this.clickUnRecommend }><b/>{ this.unRecommendText || '取消推荐' }</li>
          <li class={ 'clean' + (this.canClean ? '' : ' fn-hide') }
              onClick={ this.clickClean }><b/>{ this.cleanText || '清理' }</li>
        </ul>
        <button class="cancel" onClick={ this.clickCancel }>取消</button>
      </div>
      <div class={ 'recommend' + (this.pop && this.showRecommend ? '' : ' fn-hide') }
      onClick={ { span: this.clickRecommend2 } }>
        <span rel={ 3 }>精选</span>
        <span rel={ 5 }>公告</span>
        <span rel={ 6 }>活动</span>
        <span rel={ 7 }>专题</span>
        <span rel={ 8 }>长评</span>
      </div>
    </div>;
  }
}

export default BotFn;
