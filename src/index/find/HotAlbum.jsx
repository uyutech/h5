/**
 * Created by army on 2017/6/21.
 */

let isStart;
let startX;

class HotAlbum extends migi.Component {
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
  start(e) {
    if(e.touches.length != 1) {
      isStart = false;
    }
    else {
      isStart = true;
      startX = e.touches[0].pageX;
      this.$list.addClass('no_trans');
      this.$list.removeAttr('style');
      jsBridge.swipeRefresh(false);
    }
  }
  move(e) {
    if(isStart) {
      let x = e.touches[0].pageX;
      if(x > startX) {
        let left = this.list.scrollLeft;
        if(left == 0) {
          e.preventDefault();
          let diff = x - startX;
          this.$list.css('transform', `translate3d(${diff}px,0,0)`);
          this.$list.css('-webkit-transform', `translate3d(${diff}px,0,0)`);
        }
      }
    }
  }
  end(e) {
    this.$list.removeClass('no_trans');
    this.$list.removeAttr('style');
    jsBridge.swipeRefresh(true);
  }
  render() {
    return <div class="hot_album" onTouchStart={ this.start } onTouchMove={ this.move } onTouchEnd={ this.end } onTouchCancel={ this.end }>
      <h3>热门专辑</h3>
      <div class="list" ref="list">
        <div class="c">
          <ul>
            <li>
              <div class="pic">
                <div class="bg3"/>
                <div class="bg2"/>
                <div class="bg"/>
                <div class="mask"/>
                <div class="num"><b class="audio"/>66w</div>
                <div class="ath">作者/作者</div>
              </div>
              <p class="txt">名字</p>
            </li>
            <li>
              <div class="pic">
                <div class="bg3"/>
                <div class="bg2"/>
                <div class="bg"/>
                <img src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/>
                <div class="mask"/>
                <div class="num"><b class="video"/>66w</div>
                <div class="ath">作者/作者</div>
              </div>
              <p class="txt">名字</p>
            </li>
            <li>
              <div class="pic">
                <div class="bg3"/>
                <div class="bg2"/>
                <div class="bg"/>
                <img src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/>
                <div class="mask"/>
                <div class="num"><b class="video"/>66w</div>
                <div class="ath">作者/作者</div>
              </div>
              <p class="txt">名字</p>
            </li>
            <li>
              <div class="pic">
                <div class="bg3"/>
                <div class="bg2"/>
                <div class="bg"/>
                <img src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/>
                <div class="mask"/>
                <div class="num"><b class="video"/>66w</div>
                <div class="ath">作者/作者</div>
              </div>
              <p class="txt">名字</p>
            </li>
            <li>
              <div class="pic">
                <div class="bg3"/>
                <div class="bg2"/>
                <div class="bg"/>
                <img src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/>
                <div class="mask"/>
                <div class="num"><b class="video"/>66w</div>
                <div class="ath">作者/作者</div>
              </div>
              <p class="txt">名字</p>
            </li>
            <li>
              <div class="pic">
                <div class="bg3"/>
                <div class="bg2"/>
                <div class="bg"/>
                <img src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/>
                <div class="mask"/>
                <div class="num"><b class="video"/>66w</div>
                <div class="ath">作者/作者</div>
              </div>
              <p class="txt">名字</p>
            </li>
          </ul>
        </div>
      </div>
    </div>;
  }
}

export default HotAlbum;
