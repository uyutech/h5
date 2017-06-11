/**
 * Created by army on 2017/6/10.
 */
 
class Tags extends migi.Component {
  constructor(...data) {
    super(...data);
    this.on(migi.Event.DOM, function() {
      let $c = $(this.ref.c.element);
      let $ul = this.$ul = $c.find('ul');
      $c.css('width', $ul.width() + 1);
    });
  }
  click(e, vd, tvd) {
    let $li = $(tvd.element);
    if(!$li.hasClass('cur')) {
      this.$ul.find('.cur').removeClass('cur');
      $li.addClass('cur');
      this.emit('change', tvd.props.rel);
    }
  }
  getTagNum() {
    return this.$ul.find('li').length;
  }
  render() {
    return <div class="tags">
      <div class="c" ref="c">
        <ul onClick={ { li: this.click } }>
          <li class="cur" rel={ 0 }><span>简介<b/></span></li>
          <li rel={ 1 }><span>播放列表<b/></span><small>2</small></li>
          <li rel={ 2 }><span>评论<b/></span><small>23</small></li>
          <li rel={ 3 }><span>同人文<b/></span><small>2333</small></li>
          <li rel={ 4 }><span>同人图<b/></span><small>2.3w</small></li>
        </ul>
      </div>
    </div>;
  }
}

export default Tags;
