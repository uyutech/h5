/**
 * Created by army on 2017/6/10.
 */
 
class Intro extends migi.Component {
  constructor(...data) {
    super(...data);
    this.on(migi.Event.DOM, function() {
      let $timeline = $(this.ref.timeline.element);
      let $line = $timeline.find('.line');
      let $c = $timeline.find('.c');
      let $ul = $c.find('ul');
      let width = $ul.width() + 1;
      $c.css('width', width);
      $line.css('width', width + 10);
      
      let $inspiration = $(this.ref.inspiration.element);
      $inspiration.children('li').each(function(i, item) {
        let $li = $(item);
        let $placeholder = $li.find('.placeholder');
        let $slide = $li.find('.slide');
        $placeholder.css('width', $slide.width());
      });
    });
  }
  slide(e, vd, tvd) {
    let $slide = $(tvd.element);
    let $li = $slide.closest('li');
    let $list2 = $li.find('.list2');
    let $ul = $list2.find('ul');
    if($slide.hasClass('on')) {
      $slide.removeClass('on');
      $list2.css('height', 0);
    }
    else {
      $slide.addClass('on');
      $list2.css('height', $ul.height());
    }
  }
  render() {
    return <div class="intro">
      <div class="tag">
        <ul class="fn-clear">
          <li><a href="#">王者荣耀</a></li>
          <li><a href="#">aaa</a></li>
          <li><a href="#">sdf</a></li>
          <li><a href="#">地方</a></li>
          <li><a href="#">二十多分</a></li>
          <li><a href="#">撒</a></li>
          <li class="placeholder"></li>
        </ul>
        <a href="#" class="config"></a>
      </div>
      <div class="timeline" ref="timeline">
        <b class="line"/>
        <div class="c">
          <ul>
            <li>
              <span>发布</span>
              <small>2017年1月1日</small>
            </li>
          </ul>
        </div>
      </div>
      <div class="inspiration" ref="inspiration" onClick={ { '.slide': this.slide } }>
        <h3>
          <span>创作灵感</span>
          <small class="add">添加</small>
        </h3>
        <ul class="list">
          <li>
            <div class="t">
              <div class="profile">
                <img class="pic" src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/>
                <div class="txt">
                  <div><span class="name">名字</span><small class="time">昨天 18:08</small></div>
                  <p>签名签名签名签名签名签名</p>
                </div>
              </div>
              <div class="fn">
                <span class="zan"><small>123</small></span>
              </div>
            </div>
            <div class="c">
              <pre>内容内容内容内容\n内容内容内容n内容内容内容n内容内容内容内容内容<span class="placeholder"></span></pre>
              <div class="slide"><small>12</small><span>收起</span></div>
            </div>
            <div class="list2">
              <ul>
              </ul>
            </div>
          </li>
          <li>
            <div class="t">
              <div class="profile">
                <img class="pic" src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/>
                <div class="txt">
                  <div><span class="name">名字</span><small class="time">昨天 18:08</small></div>
                  <p>签名签名签名签名签名签名</p>
                </div>
              </div>
              <div class="fn">
                <span class="zan has"><small>123</small></span>
              </div>
            </div>
            <div class="c">
              <pre>内容内容内容内容\n内容内容内容n内容内容内容n内容内容内容内容内容1234<span class="placeholder"></span></pre>
              <div class="slide"><small>12</small><span>收起</span></div>
            </div>
            <div class="list2">
              <ul>
                <li>
                  <div class="t">
                    <div class="fn">
                      <span class="zan has"><small>123</small></span>
                    </div>
                    <div class="profile">
                      <div class="txt">
                        <div><span class="name2">名字22</span><b class="arrow"/><small class="time">昨天 18:08</small><span class="name">名字</span></div>
                        <p>签名签名签名签名签名签名</p>
                      </div>
                      <img class="pic" src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/>
                    </div>
                  </div>
                  <div class="c">
                    <pre>内容内容内容内容\n内容内容内容n内容内容内容n内容内容内容内容内容123</pre>
                  </div>
                </li>
                <li>
                  <div class="t">
                    <div class="fn">
                      <span class="zan has"><small>123</small></span>
                    </div>
                    <div class="profile">
                      <div class="txt">
                        <div><span class="name2">名字22</span><b class="arrow"/><small class="time">昨天 18:08</small><span class="name">名字</span></div>
                        <p>签名签名签名签名签名签名</p>
                      </div>
                      <img class="pic" src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/>
                    </div>
                  </div>
                  <div class="c">
                    <pre>哈哈哈</pre>
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>;
  }
}

export default Intro;
