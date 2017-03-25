/**
 * Created by army on 2017/3/19.
 */

class BottomNav extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  click(e, vd, tvd) {
    var $elem = $(tvd.element);
    if($elem.hasClass('cur')) {
      return;
    }
    let rel = tvd.props.rel;
    $(this.element).find('.cur').removeClass('cur');
    $elem.addClass('cur');
    this.emit('change', rel);
  }
  render() {
    return <div class="bottom_nav" onClick={ { li: this.click } }>
      <ul>
        <li class="follow cur" rel="0">
          <b></b>
          <span>关注</span>
        </li>
        <li class="zhuanquan" rel="1">
          <b></b>
          <span>转圈</span>
        </li>
        <li class="find" rel="2">
          <b></b>
          <span>发现</span>
        </li>
        <li class="my" rel="3">
          <b></b>
          <span>我的</span>
        </li>
      </ul>
    </div>;
  }
}

export default BottomNav;
