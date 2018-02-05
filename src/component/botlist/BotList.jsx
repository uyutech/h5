/**
 * Created by army8735 on 2018/2/4.
 */

'use strict';

class BotList extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.title = self.props.title;
  }
  @bind pop
  @bind title
  @bind list
  @bind curId
  click(e) {
    this.pop = false;
  }
  select(e, vd, tvd) {
    e.stopPropagation();
    if(tvd.props.rel === this.curId) {
      this.pop = false;
      return;
    }
    this.curId = tvd.props.rel;
    this.emit('change', this.curId);
    this.pop = false;
  }
  render() {
    return <div class={ 'cp-botlist' + (this.pop ? ' on' : '') }onClick={ this.click }>
      <dl class="fn-clear" onClick={ { dd: this.select } }>
        <dt>{ this.title }</dt>
        {
          (this.curId, this.list || []).map(function(item) {
            return <dd class={ this.curId === item.id ? 'cur' : '' }
                       rel={ item.id }>{ item.name }</dd>;
          }.bind(this))
        }
      </dl>
    </div>;
  }
}

export default BotList;
