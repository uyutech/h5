/**
 * Created by army8735 on 2018/2/4.
 */

'use strict';

class Fn extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.type = self.props.type;
    self.sort = self.props.sort || 0;
    self.on(migi.Event.DOM, function() {
      $(document.body).on('click', function() {
        self.showSort = false;
      });
    });
  }
  @bind type
  @bind showSort
  @bind sort
  clickType() {
    this.emit('selectType');
  }
  clickSort(e) {
    e.stopPropagation();
    this.showSort = !this.showSort;
  }
  clickSortType(e, vd, tvd) {
    if(tvd.props.rel === this.sort) {
      return;
    }
    this.sort = tvd.props.rel;
    this.showSort = false;
    this.emit('sort', this.sort);
  }
  render() {
    return <div class="cp-fn">
      <label class={ this.type ? '' : ' fn-hide' }
             onClick={ this.clickType }>
        {
          this.type
        }
      </label>
      <span onClick={ this.clickSort }>{ this.sort ? '按热度' : '按时间' }</span>
      <ul class={ this.showSort ? '' : 'fn-hide' } onClick={ { li: this.clickSortType } }>
        <li class={ this.sort === 0 ? 'cur' : '' } rel={ 0 }>按时间</li>
        <li class={ this.sort === 1 ? 'cur' : '' } rel={ 1 }>按热度</li>
      </ul>
    </div>;
  }
}

export default Fn;
