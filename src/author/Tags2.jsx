/**
 * Created by army on 2017/6/24.
 */

class Tags2 extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  clickL1(e, vd, tvd) {
    e.preventDefault();
    $(tvd.element).toggleClass('on');
  }
  clickL2(e, vd, tvd) {
    e.preventDefault();
    $(tvd.element).toggleClass('on');
  }
  autoWidth() {
    let $li = $(this.ref.l1.element);
    let $c = $li.find('.c');
    $c.css('width', '9999rem');
    let $ul = $c.find('ul');
    $c.css('width', $ul.width() + 1);
    $li = $(this.ref.l2.element);
    $c = $li.find('.c');
    $c.css('width', '9999rem');
    $ul = $c.find('ul');
    $c.css('width', $ul.width() + 1);
  }
  render() {
    return <div class="tags">
      <div class="l1" ref="l1" onClick={ { li: this.clickL1 } }>
        <div class="c">
          <ul>
            <li><a href="#"><span>音乐</span></a></li>
            <li class="on"><a href="#"><span>视频</span></a></li>
            <li class="on"><a href="#"><span>文词</span></a></li>
            <li><a href="#"><span>测试</span></a></li>
            <li><a href="#"><span>aga</span></a></li>
            <li class="on"><a href="#"><span>水电费</span></a></li>
          </ul>
        </div>
      </div>
      <div class="l2" ref="l2" onClick={ { li: this.clickL2 } }>
        <div class="c">
          <ul>
            <li><a href="#"><span>阴阳师</span></a></li>
            <li class="on"><a href="#"><span>阴阳师</span></a></li>
          </ul>
        </div>
      </div>
    </div>;
  }
}

export default Tags2;
