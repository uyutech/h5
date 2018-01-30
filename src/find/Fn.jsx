/**
 * Created by army8735 on 2018/1/12.
 */

'use strict';

class Fn extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.dataList = self.props.dataList;
    self.on(migi.Event.DOM, function() {
      let $body = $(document.body);
      $body.on('click', function() {
        self.showSort = false;
        self.showPop = false;
      });
    });
  }
  @bind dataList
  @bind text
  @bind showSort
  @bind sortText
  @bind showPop
  clickSort(e) {
    e.stopPropagation();
    this.showSort = true;
  }
  clickSelSort(e, vd, tvd) {
    e.stopPropagation();
    let self = this;
    self.showSort = false;
    let $li = $(tvd.element);
    if($li.hasClass('cur')) {
      return;
    }
    $(vd.element).find('.cur').removeClass('cur');
    $li.addClass('cur');
    self.sortText = tvd.children[0];
    self.emit('sort', tvd.props.rel);
  }
  clickPop(e, vd, tvd) {
    e.stopPropagation();
    let self = this;
    self.showPop = true;
    self.showSort = false;
  }
  clickSelPop(e, vd, tvd) {
    e.stopPropagation();
    let self = this;
    self.showPop = false;
    let $li = $(tvd.element);
    if($li.hasClass('cur')) {
      return;
    }
    $(vd.element).find('.cur').removeClass('cur');
    $li.addClass('cur');
    self.text = tvd.children[0];
    self.emit('type', tvd.props.rel);
  }
  render() {
    return <div class="mod-fn">
      <label class={ this.dataList && this.dataList.length > 1 ? '' : ' fn-hide' }
             onClick={ this.clickPop }>
        {
          this.text || '全部'
        }
      </label>
      <span onClick={ this.clickSort }>{ this.sortText || '按时间' }</span>
      <ul class={ this.showSort ? '' : 'fn-hide' } onClick={ { li: this.clickSelSort } }>
        <li class="cur" rel="">按时间</li>
        <li rel="1">按热度</li>
      </ul>
      <div class={ 'pop' + (this.showPop ? ' on' : '') }>
        <div class={ 'c' + (this.showPop ? ' on' : '') }>
          <label>分类</label>
          <ul class="fn-clear" onClick={ this.clickSelPop }>
            <li class="cur">全部</li>
            {
              (this.dataList || []).map(function(item, i) {
                return <li rel={ item.ItemsTypeID }>{ item.ItemsTypeName }</li>;
              })
            }
          </ul>
        </div>
      </div>
    </div>;
  }
}

export default Fn;
