/**
 * Created by army on 2017/6/11.
 */
 
class MediaSwitch extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  init(data) {
    for(let i = 0, len = data.length; i < len; i++) {
      let item = data[i];
      <li class={ item.name.toLowerCase() + (i == 0 ? ' cur' : '') } ref={ i }/>.appendTo(this.element);
    }
  }
  click(e, vd, tvd) {
    let $ul = $(vd.element);
    let $li = $(tvd.element);
    if(!$li.hasClass('cur') && !$li.hasClass('placeholder')) {
      $ul.find('.cur').removeClass('cur');
      $li.addClass('cur');
      this.emit('change', tvd.props.ref);
    }
  }
  render() {
    return <ul class="switch" onClick={ { li: this.click } }>
    </ul>;
  }
}

export default MediaSwitch;
