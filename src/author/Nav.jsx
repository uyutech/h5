/**
 * Created by army on 2017/6/16.
 */
 
class Nav extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  back() {
    jsBridge.back();
  }
  render() {
    return <div class="nav">
      <b class="back" onClick={ this.back }/>
      <b class="play"/>
      <div class="profile">
        <div class="pic">
          <img src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/>
          <b class="v"/>
        </div>
        <div class="txt">
          <div class="n">
            <h3>司夏</h3>
            <span>策</span>
            <span>歌</span>
          </div>
          <p class="intro">别名：揩油哥</p>
          <div class="o">
            <div class="fans">
              <strong>6.6w</strong>
              <span>粉丝</span>
            </div>
            <div class="hot">
              <div class="line">
                <b class="progress"/>
                <b class="point"/>
              </div>
              <span>热度</span>
            </div>
            <a href="#" class="follow">应援</a>
          </div>
        </div>
      </div>
    </div>;
  }
}

export default Nav;
