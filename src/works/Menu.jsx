/**
 * Created by army on 2017/6/11.
 */
 
class Menu extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind num = 2
  @bind vis
  len(i) {
    this.num = i || 2;
  }
  pos(x, y) {
    $(this.element).css({
      left: x,
      top: y,
    });
  }
  show() {
    this.vis = true;
    let $ul = $(this.element).find('ul');
    setTimeout(function() {
      $ul.addClass('show');
    }, 50);
  }
  hide() {
    this.vis = false;
    let $ul = $(this.element).find('ul');
    $ul.removeClass('show');
  }
  render() {
    return <div class={ 'menu' + (this.vis ? '' : ' fn-hide') }>
      <ul class={ 's' + this.num }>
        <li><span>取消</span></li>
        <li><span>关注</span></li>
        <li><span>主页</span></li>
        <li><span>喜欢</span></li>
      </ul>
    </div>;
  }
}

export default Menu;
