/**
 * Created by army on 2017/5/21.
 */
 
let screenWidth = screen.availWidth;

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
      style.innerText = `.follow_list .con .ers ul li{width:${perWidth}px}`;
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
  render() {
    return <div class="follow_list">
      <div class="ti">
        <div class="config">关注列表</div>
      </div>
      <div class="con">
        <div class="tags" ref="tags">
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
        <div class="ers" ref="ers">
          <div class="c">
            <ul class="fn-clear">
              <li><img src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/><span>揩油哥</span></li>
              <li><img src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/><span>揩油哥</span></li>
              <li><img src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/><span>揩油哥</span></li>
              <li><img src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/><span>揩油哥</span></li>
              <li><img src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/><span>揩油哥</span></li>
              <li><img src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/><span>揩油哥</span></li>
              <li><img src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/><span>揩油哥</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>;
  }
}

export default FollowList;
