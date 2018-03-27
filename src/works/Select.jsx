/**
 * Created by army8735 on 2018/2/2.
 */

'use strict';

class Select extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind list
  @bind id
  click(e, vd, tvd) {
    if(tvd.props.workId === this.id) {
      return;
    }
    this.id = tvd.props.workId;
    this.emit('change', this.id);
  }
  render() {
    return <ul class={ 'mod-select' + (this.list && this.list.length > 1 ? '' : ' fn-hide') }
               onClick={ { li: this.click } }>
      {
        (this.id, this.list || []).map(function(item, i) {
          return <li class={ (this.id
            ? (item.id === this.id ? 'cur ' : '')
              : (i ? '' : 'cur '))
              + (item.class === 2 ? 'audio' : 'video') }
                     rel={ i }
                     workId={ item.id }>{ item.tips || item.typeName }</li>;
        }.bind(this))
      }
    </ul>;
  }
}

export default Select;
