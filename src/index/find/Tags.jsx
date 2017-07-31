/**
 * Created by army on 2017/6/18.
 */
 
class Tags extends migi.Component {
  constructor(...data) {
    super(...data);
    this.on(migi.Event.DOM, function() {
      this.autoWidth();
    });
  }
  clickL1(e, vd, tvd) {
    $(tvd.element).toggleClass('on');
  }
  clickL2(e, vd, tvd) {
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
    return <div class="cp_tags">
      <div class="l1" ref="l1" onClick={ { li: this.clickL1 } }>
        <div class="c">
          <ul>
            <li><a href="#"><span>音乐</span></a></li>
            <li><a href="#"><span>广播剧</span></a></li>
            <li><a href="#"><span>视频</span></a></li>
            <li><a href="#"><span>绘画</span></a></li>
            <li><a href="#"><span>COS</span></a></li>
            <li><a href="#"><span>游戏</span></a></li>
          </ul>
        </div>
      </div>
      <div class="l2" ref="l2" onClick={ { li: this.clickL2 } }>
        <div class="c">
          <ul>
            <li><a href="#"><span>古风</span></a></li>
            <li><a href="#"><span>小清新</span></a></li>
            <li><a href="#"><span>阴阳师</span></a></li>
            <li><a href="#"><span>日漫</span></a></li>
            <li><a href="#"><span>流行</span></a></li>
            <li><a href="#"><span>剑网3</span></a></li>
          </ul>
        </div>
      </div>
    </div>;
  }
}

export default Tags;
