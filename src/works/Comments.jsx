/**
 * Created by army on 2017/6/11.
 */
 
class Comments extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  click(e, vd, tvd) {
    let $ul = $(vd.element);
    $ul.find('li').toggleClass('cur');
    let $con = $(this.ref.con.element);
    if($ul.hasClass('alt')) {}
    else {}
    $con.toggleClass('alt')
    $ul.toggleClass('alt');
  }
  render() {
    return <div class="comments">
      <ul class="tag fn-clear" onClick={ { li: this.click } }>
        <li class="cur"><span>最热</span></li>
        <li><span>最新</span></li>
      </ul>
      <div class="con" ref="con">
        <ul class="list">
          <li>
            <div class="t">
              <div class="profile">
                <img class="pic" src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/>
                <div class="txt">
                  <div><span class="name">海妖小马甲</span><small class="time">3小时前</small></div>
                  <p>我是个马甲</p>
                </div>
              </div>
              <div class="fn">
                <span class="zan has"><small>123</small></span>
              </div>
            </div>
            <div class="c">
              <pre>前排支持<span class="placeholder"></span></pre>
              <div class="slide"><small></small><span>收起</span></div>
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
        </ul>
      </div>
    </div>;
  }
}

export default Comments;
