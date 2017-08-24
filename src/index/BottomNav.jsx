/**
 * Created by army on 2017/5/17.
 */

class BottomNav extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  click(e, vd, tvd) {
    var $elem = $(tvd.element);
    let rel = tvd.props.rel;
    this.cur($elem, rel);
  }
  cur($elem, rel) {
    if($elem.hasClass('cur')) {
      return;
    }
    if(rel) {
      $(this.element).find('.cur').removeClass('cur');
      $elem.addClass('cur');
      this.emit('change', rel);
    }
  }
  setCurrent(i) {
    this.cur($(this.element).find(`li[rel="${i}"]`), i);
  }
  render() {
    return <div class="bottom_nav" onClick={ { li: this.click } }>
      <ul>
        <li class="follow" rel="0">
          <b class="icon"/>
          <span>关注</span>
        </li>
        <li class="zhuanquan" rel="1">
          <b class="icon"/>
          <span>转圈</span>
        </li>
        <li class="new cur">
          <b class="icon"/>
        </li>
        <li class="find" rel="2">
          <b class="icon"/>
          <span>发现</span>
        </li>
        <li class="my" rel="3">
          <b class="icon"/>
          <span>我的</span>
        </li>
      </ul>
    </div>;
  }
}

export default BottomNav;
