/**
 * Created by army8735 on 2018/2/2.
 */

'use strict';

const CLASS = {
  1: 'video',
  2: 'audio',
};

class Select extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind list
  @bind id
  click(e, vd, tvd) {
    let id = tvd.props.workId;
    if(id === this.id) {
      return;
    }
    this.id = id;
    this.emit('change', id, tvd.props.kind);
  }
  render() {
    return <ul class={ 'mod-select' + (this.list && this.list.length > 1 ? '' : ' fn-hide') }
               onClick={ { li: this.click } }>
      {
        (this.id, this.list || []).map(function(item, i) {
          return <li class={ (this.id === item.id ? 'cur ' : '') + CLASS[item.kind] }
                     rel={ i }
                     kind={ item.kind }
                     workId={ item.id }>{ item.tips || item.typeName }</li>;
        }.bind(this))
      }
    </ul>;
  }
}

export default Select;
