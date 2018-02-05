/**
 * Created by army8735 on 2018/2/2.
 */

'use strict';

class Select extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind list
  @bind workId
  click(e, vd, tvd) {
    if(tvd.props.workId === this.workId) {
      return;
    }
    this.workId = tvd.props.workId;
    this.emit('change', this.workId);
  }
  render() {
    return <ul class={ 'mod-select' + (this.list && this.list.length > 1 ? '' : ' fn-hide') }
               onClick={ { li: this.click } }>
      {
        (this.workId, this.list || []).map(function(item, i) {
          let category = 0;
          let s;
          if(item.ItemType.toString().charAt(0) === '2') {
            s = '视频';
            category = 1;
          }
          else {
            s = {
              1112: '音乐',
              1122: '音乐',
              1123: '音乐',
              1131: '伴奏',
              1132: '伴奏',
              1210: '朗诵',
              1220: '广播剧',
              1230: '有声小说',
            }[item.ItemType] || '歌曲';
          }
          return <li class={ (this.workId
            ? (item.ItemID === this.workId ? 'cur ' : '')
            : (i ? '' : 'cur '))
            + (category === 0 ? 'audio' : 'video') }
                     rel={ i }
                     workId={ item.ItemID }>{ item.Tips || s }</li>;
        }.bind(this))
      }
    </ul>;
  }
}

export default Select;
