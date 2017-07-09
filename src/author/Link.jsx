/**
 * Created by army on 2017/6/18.
 */
 
class Link extends migi.Component {
  constructor(...data) {
    super(...data);
    this.on(migi.Event.DOM, function() {
      let $root = $(this.element);
      let $c = $root.find('.c');
      let $ul = $c.find('ul');
      $c.css('width', $ul.width() + 1);
    });
  }
  render() {
    return <div class="link">
      <div class="c">
        <ul>
          <li><a href="#"><span>5sing</span></a></li>
          <li><a href="#" class="bili"><span>b站</span></a></li>
          <li><a href="#" class="baidu"><span>百度</span></a></li>
          <li><a href="#" class="wangyi"><span>网易</span></a></li>
        </ul>
      </div>
    </div>;
  }
}

export default Link;
