/**
 * Created by army8735 on 2017/11/30.
 */

'use strict';

let interval;

class Banner extends migi.Component {
  constructor(...data) {
    super(...data);
    this.on(migi.Event.DOM, function() {
      this.addInterval();
    });
  }
  @bind hasData
  @bind dataList = [];
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
  render() {
    return <div class="banner" onSwipeLeft={ this.left } onSwipeRight={ this.right }>
      <ul class={ 'list fn-clear' + (this.hasData ? '' : ' fn-hide') } ref="list" style={ 'width:' + this.dataList.length * 100 + '%' }>
        {
          this.dataList.map(function(item) {
            return <li><a href={ item.url } target="_blank"><img src={ item.pic }/></a></li>;
          })
        }
      </ul>
      <ul class={ 'tags' + (this.hasData ? '' : ' fn-hide') } ref="tags" onClick={ { li: this.clickTag } }>
        {
          (this.index, this.dataList).map(function(item, index) {
            return <li class={ index === this.index ? 'cur' : '' } rel={ index }>{ index + 1 }</li>;
          }.bind(this))
        }
      </ul>
      <div class={ 'fn-placeholder' + (this.hasData ? ' fn-hide' : '') }/>
    </div>;
  }
}

export default Banner;
