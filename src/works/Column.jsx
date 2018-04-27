/**
 * Created by army8735 on 2018/2/2.
 */

'use strict';

class Column extends migi.Component {
  constructor(...data) {
    super(...data);
    this.index = 0;
  }
  @bind list
  @bind index
  click(e, vd, tvd) {
    if(tvd.props.index !== this.index) {
      this.index = tvd.props.index;
      this.emit('change', tvd.props.rel);
    }
  }
  render() {
    return <ul class="mod-column"
               onClick={ { li: this.click } }>
      {
        (this.index, this.list || []).map(function(item, i) {
          return <li class={ this.index === i ? 'cur' : '' }
                     index={ i }
                     rel={ item.id }>{ item.name }</li>;
        }.bind(this))
      }
    </ul>;
  }
}

export default Column;
