/**
 * Created by army on 2017/7/16.
 */
 
class Types extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  click(e, vd, tvd) {
    let $item = $(tvd.element).parent();
    let $more = $item.find('.more');
    if($item.hasClass('show')) {
      $more.css('height', 0);
    }
    else {
      let $c = $item.find('.c');
      $more.css('height', $c.height());
    }
    $item.toggleClass('show');
  }
  render() {
    return <div class="types" onClick={ { '.item>h4': this.click } }>
      <div class="item follow">
        <h4>我的关注<b class="arrow"/></h4>
        <div class="more">
          <div class="c">
            <ul>
            </ul>
            <button>关注系统</button>
          </div>
        </div>
      </div>
      <div class="item favor">
        <h4>我的收藏<b class="arrow"/></h4>
        <div class="more">
          <div class="c">
            <ul>
            </ul>
            <button>收藏系统</button>
          </div>
        </div>
      </div>
    </div>;
  }
}

export default Types;
