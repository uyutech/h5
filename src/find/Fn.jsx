/**
 * Created by army8735 on 2018/1/12.
 */

'use strict';

class Fn extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.list = self.props.list;
    self.on(migi.Event.DOM, function() {
      let $body = $(document.body);
      $body.on('click', function() {
        self.showSort = false;
        self.showPop = false;
      });
    });
  }
  @bind list
  @bind text
  @bind showSort
  @bind sort = 0
  @bind showPop
  clickSort(e) {
    e.stopPropagation();
    this.showSort = true;
  }
  clickSelSort(e, vd, tvd) {
    e.stopPropagation();
    let self = this;
    self.showSort = false;
    if(tvd.props.rel === self.sort) {
      return;
    }
    self.sort = tvd.props.rel;
    self.emit('sort', self.sort);
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
      <label class={ this.list && this.list.length > 1 ? '' : ' fn-hide' }
             onClick={ this.clickPop }>
        {
          this.text || '全部'
        }
      </label>
      <span onClick={ this.clickSort }>{ this.sort === 0 ? '按时间' : '按热度' }</span>
      <ul class={ this.showSort ? '' : 'fn-hide' } onClick={ { li: this.clickSelSort } }>
        <li class={ this.sort === 0 ? 'cur' : '' } rel={ 0 }>按时间</li>
        <li class={ this.sort === 1 ? 'cur' : '' } rel={ 1 }>按热度</li>
      </ul>
      <div class={ 'pop' + (this.showPop ? ' on' : '') }>
        <div class={ 'c' + (this.showPop ? ' on' : '') }>
          <label>分类</label>
          <ul class="fn-clear" onClick={ this.clickSelPop }>
            <li class="cur">全部</li>
            {
              (this.list || []).map(function(item) {
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
