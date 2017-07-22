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
      <div class="item finance">
        <h4>我的财产<b class="arrow"/></h4>
        <div class="more">
          <div class="c">
            <ul class="fn-clear">
              <li>
                <div class="flower"><span>鲜花</span></div>
                <strong>10</strong>
              </li>
              <li>
                <div class="gift"><span>礼物</span></div>
                <strong>10</strong>
              </li>
              <li>
                <div class="coin"><span>圈币</span></div>
                <strong>10</strong>
              </li>
            </ul>
            <button>充值</button>
          </div>
        </div>
      </div>
      <div class="item success">
        <h4>我的成就<b class="arrow"/></h4>
        <div class="more">
          <div class="c">
            <ul>
              <li>成就名称</li>
              <li>成就名称</li>
            </ul>
            <button>成就系统</button>
          </div>
        </div>
      </div>
      <div class="item follow">
        <h4>我的关注<b class="arrow"/></h4>
        <div class="more">
          <div class="c">
            <ul>
              <li>成就名称</li>
              <li>成就名称</li>
            </ul>
            <button>成就系统</button>
          </div>
        </div>
      </div>
    </div>;
  }
}

export default Types;
