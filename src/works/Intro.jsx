/**
 * Created by army on 2017/6/10.
 */
 
class Intro extends migi.Component {
  constructor(...data) {
    super(...data);
    this.on(migi.Event.DOM, function() {
      this.autoWidth();
    });
  }
  autoWidth() {
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
  show() {
    $(this.element).show();
  }
  hide() {
    $(this.element).hide();
  }
  @bind tags = []
  render() {
    return <div class="intro">
      <div class="tag">
        <ul class="fn-clear">
          {
            this.tags.map(function(item) {
              if(item.blank) {
                return <li class="blank"><a href="#">...</a></li>
              }
              return <li><a href={ `#${item.Tag_ID}` }>{ item.Tag_Name }</a></li>;
            })
          }
        </ul>
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
                <img class="pic" src="http://bbs.xiguo.net/zq/zz/02.png"/>
                <div class="txt">
                  <div><span class="name">司夏</span><small class="time">昨天 18:08</small></div>
                  <p>努力战胜拖延症</p>
                </div>
              </div>
              <div class="fn">
                <span class="zan"><small>56</small></span>
              </div>
            </div>
            <div class="c">
              <pre>非常开心可以和沈行之合作！<span class="placeholder"></span></pre>
              <div class="slide"><small></small><span>收起</span></div>
            </div>
            <div class="list2">
              <ul>
              </ul>
            </div>
          </li>
          <li>
            <div class="t">
              <div class="profile">
                <img class="pic" src="http://bbs.xiguo.net/zq/zz/01.jpg"/>
                <div class="txt">
                  <div><span class="name">沈行之</span><small class="time">昨天 12:08</small></div>
                  <p>沈不行</p>
                </div>
              </div>
              <div class="fn">
                <span class="zan has"><small>33</small></span>
              </div>
            </div>
            <div class="c">
              <pre>特别特别荣幸可以写这首歌，强烈推荐大家去看这部动画，真的特别好看！<span class="placeholder"></span></pre>
              <div class="slide"><small>2</small><span>收起</span></div>
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
                        <div><span class="name2">沈行之</span><b class="arrow"/><small class="time">1小时前</small><span class="name">海妖小马甲</span></div>
                        <p>我是个马甲</p>
                      </div>
                      <img class="pic" src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/>
                    </div>
                  </div>
                  <div class="c">
                    <pre>阿沈你好</pre>
                  </div>
                </li>
                <li>
                  <div class="t">
                    <div class="fn">
                      <span class="zan has"><small>123</small></span>
                    </div>
                    <div class="profile">
                      <div class="txt">
                        <div><span class="name2">海妖小马甲</span><b class="arrow"/><small class="time">3分钟前</small><span class="name">阿侎</span></div>
                        <p>army8735</p>
                      </div>
                      <img class="pic" src="http://tva4.sinaimg.cn/crop.7.1.129.129.180/64319a89gw1f62p9lp7hyj203w03wq2x.jpg"/>
                    </div>
                  </div>
                  <div class="c">
                    <pre>捕捉一只海妖</pre>
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
