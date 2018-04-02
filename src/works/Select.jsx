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
  @bind comboId
  click(e, vd, tvd) {
    let comboId = tvd.props.workId + '_' + tvd.props.kind;
    if(comboId === this.comboId) {
      return;
    }
    this.comboId = comboId;
    this.emit('change', tvd.props.workId, tvd.props.kind);
  }
  render() {
    return <ul class={ 'mod-select' + (this.list && this.list.length > 1 ? '' : ' fn-hide') }
               onClick={ { li: this.click } }>
      {
        (this.comboId, this.list || []).map(function(item, i) {
          return <li class={ (this.comboId === (item.id + '_' + item.kind) ? 'cur ' : '') + CLASS[item.kind] }
                     rel={ i }
                     kind={ item.kind }
                     workId={ item.id }>{ item.tips || item.typeName }</li>;
        }.bind(this))
      }
    </ul>;
  }
}

export default Select;
