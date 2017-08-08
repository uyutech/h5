/**
 * Created by army on 2017/6/16.
 */
 
class Nav extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <div class="nav">
      <b class="play"/>
      <div class="profile">
        <div class="pic">
          <img src="http://bbs.xiguo.net/zq/zz/02.png"/>
          <b class="v"/>
        </div>
        <div class="txt">
          <div class="n">
            <h3>司夏</h3>
            <span>歌</span>
            <span>策</span>
          </div>
          <p class="intro">别名：西国の海妖</p>
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
