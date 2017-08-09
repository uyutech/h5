/**
 * Created by army on 2017/6/18.
 */
 
class Tags extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  click(e, vd, tvd) {
    let $ul = $(this.element).find('ul');
    let $li = $(tvd.element);
    if($li.hasClass('cur')) {
      return;
    }
    $ul.find('.cur').removeClass('cur');
    $li.addClass('cur');
    this.emit('change', $li.attr('rel'));
  }
  render() {
    return <div class="tags">
      <ul onClick={ { li: this.click } }>
        <li class="item cur" rel="0"><span>主页</span></li>
        <li class="item" rel="1"><span>作品</span></li>
        <li class="item" rel="2"><span>留言</span></li>
      </ul>
    </div>;
  }
}

export default Tags;
