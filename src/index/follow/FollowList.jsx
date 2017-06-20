/**
 * Created by army on 2017/5/21.
 */

let isStart;
let isMove;
let startX;
let startY;

class FollowList extends migi.Component {
  constructor(...data) {
    super(...data);
    this.on(migi.Event.DOM, function() {
      let ers = this.ref.ers;
      let $ers = $(ers.element);
      let $ersC = $ers.find('.c');
      let $ersUl = $ersC.find('ul');
      let perWidth = Math.round($ers.width() / 4.5);
      let style = document.createElement('style');
      style.innerText = `.follow_list .ers ul li{width:${perWidth}px}`;
      document.head.appendChild(style);
      $ersC.css('width', $ersUl.width() + 1);
      
      let tags = this.ref.tags;
      let $tags = $(tags.element);
      let $tagsC = $tags.find('.c');
      let $tagsUl = $tagsC.find('ul');
      $tagsC.css('width', $tagsUl.width() + 1);
      
      let $ersLi = $ersUl.find('li');
      let $ersImg = $ersLi.find('img');
      let dx = ($ersLi.width() - $ersImg.width()) >> 1;
      $tagsC.css('padding-left', dx + 'px');
    });
  }
  start(e) {
    if(e.touches.length != 1) {
      isStart = false;
    }
    else {
      isStart = true;
      startX = e.touches[0].pageX;
      startY = e.touches[0].pageY;
      jsBridge.swipeRefresh(false);
    }
  }
  move(e) {
  }
  end() {
    jsBridge.swipeRefresh(true);
  }
  authorClick(e, vd, tvd) {
    e.preventDefault();
    let href = tvd.props.href;
    jsBridge.pushWindow(href);
  }
  render() {
    return <div class="follow_list">
      <h3><span>关注列表</span></h3>
      <div class="tags" ref="tags" onTouchStart={ this.start } onTouchMove={ this.move } onTouchEnd={ this.end } onTouchCancel={ this.end }>
        <div class="c">
          <ul>
            <li>古风</li>
            <li>古风123</li>
            <li>古风sd</li>
            <li>古风</li>
            <li>古风asdasdfs</li>
            <li>古风</li>
            <li>古风a</li>
          </ul>
        </div>
      </div>
      <div class="ers" ref="ers" onTouchStart={ this.start } onTouchMove={ this.move } onTouchEnd={ this.end } onTouchCancel={ this.end }>
        <div class="c">
          <ul onClick={ { a: this.authorClick } }>
            <li>
              <a href="author.html?id=1">
                <div class="pic">
                  <img src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/>
                  <b/>
                </div>
                <span>揩油哥</span><b/>
              </a>
            </li>
            <li>
              <a href="author.html?id=1">
                <div class="pic">
                  <img src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/>
                  <b/>
                </div>
                <span>揩油哥</span><b/>
              </a>
            </li>
            <li>
              <a href="author.html?id=1">
                <div class="pic">
                  <img src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/>
                </div>
                <span>揩油哥</span><b/>
              </a>
            </li>
            <li>
              <a href="author.html?id=1">
                <div class="pic">
                  <img src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/>
                </div>
                <span>揩油哥</span><b/>
              </a>
            </li>
            <li>
              <a href="author.html?id=1">
                <div class="pic">
                  <img src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/>
                </div>
                <span>揩油哥</span><b/>
              </a>
            </li>
            <li>
              <a href="author.html?id=1">
                <div class="pic">
                  <img src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/>
                </div>
                <span>揩油哥</span><b/>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>;
  }
}

export default FollowList;
