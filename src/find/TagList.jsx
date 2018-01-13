/**
 * Created by army8735 on 2018/1/8.
 */

'use strict';

class TagList extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  click(e, vd, tvd) {
    let $li = $(tvd.element);
    if($li.hasClass('cur')) {
      return;
    }
    $(vd.element).find('.cur').removeClass('cur');
    $li.addClass('cur');
    this.emit('change', tvd.props.rel);
  }
  render() {
    return <ul class="mod-taglist" onClick={ { li: this.click } }>
      {
        (this.props.dataList || []).map(function(item, i) {
          if(!i) {
            return <li class="cur" rel={ item }>{ item.GroupName }</li>;
          }
          return <li rel={ item }>{ item.GroupName }</li>;
        })
      }
    </ul>;
  }
}

export default TagList;
