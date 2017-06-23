/**
 * Created by army on 2017/6/22.
 */

class HotAuthor extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  autoWidth() {
    this.$root = $(this.element);
    this.list = this.ref.list.element;
    this.$list = $(this.list);
    let $c = this.$list.find('.c');
    $c.width('css', '9999rem');
    let $ul = $c.find('ul');
    $c.css('width', $ul.width() + 1);
  }
  render() {
    return <div class="hot_author">
      <h3>热门作者</h3>
      <div class="list" ref="list">
        <div class="c">
          <ul>
            <li>
              <div class="pic">
                <img src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/>
                <b class="ce"/>
                <b class="ge"/>
                <b class="ge"/>
              </div>
              <div class="txt">名字名字名字</div>
            </li>
            <li>
              <div class="pic">
                <img src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/>
                <b class="ce"/>
                <b class="ge"/>
                <b class="ge"/>
              </div>
              <div class="txt">名字名字名字</div>
            </li>
            <li>
              <div class="pic">
                <img src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/>
                <b class="ce"/>
                <b class="ge"/>
                <b class="ge"/>
              </div>
              <div class="txt">名字名字名字</div>
            </li>
            <li>
              <div class="pic">
                <img src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/>
                <b class="ce"/>
                <b class="ge"/>
                <b class="ge"/>
              </div>
              <div class="txt">名字名字名字</div>
            </li>
            <li>
              <div class="pic">
                <img src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/>
                <b class="ce"/>
                <b class="ge"/>
                <b class="ge"/>
              </div>
              <div class="txt">名字名字名字</div>
            </li>
            <li>
              <div class="pic">
                <img src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/>
                <b class="ce"/>
                <b class="ge"/>
                <b class="ge"/>
              </div>
              <div class="txt">名字名字名字</div>
            </li>
            <li>
              <div class="pic">
                <img src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/>
                <b class="ce"/>
                <b class="ge"/>
                <b class="ge"/>
              </div>
              <div class="txt">名字名字名字</div>
            </li>
          </ul>
        </div>
      </div>
    </div>;
  }
}

export default HotAuthor;
