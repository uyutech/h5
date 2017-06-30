/**
 * Created by army on 2017/6/18.
 */
 
class Tags extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  click(e, vd, tvd) {
    let $ul = $(this.element).find('ul');
    let $span = $(tvd.element);
    if($span.hasClass('cur')) {
      return;
    }
    $ul.find('.cur').removeClass('cur');
    $span.addClass('cur');
    this.emit('change', $span.attr('rel'));
  }
  render() {
    return <div class="tags">
      <ul onClick={ { span: this.click } }>
        <li class="item"><span class="cur" rel="0">主页<b/></span></li>
        <li class="placeholder"/>
        <li class="item"><span rel="1">作品<b/></span></li>
        <li class="placeholder"/>
        <li class="item"><span rel="2">留言<b/></span></li>
      </ul>
    </div>;
  }
}

export default Tags;
