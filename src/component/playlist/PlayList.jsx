/**
 * Created by army on 2017/7/1.
 */
 
class PlayList extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  switchType(e, vd) {
    let $ul = $(vd.element);
    $ul.toggleClass('alt');
    $ul.find('li').toggleClass('cur');
  }
  render() {
    return <div class="cp_playlist">
      <div class="bar">
        <ul class="btn fn-clear">
          <li class="all">播放全部</li>
          <li class="audio"></li>
          <li class="video"></li>
        </ul>
        <ul class="type fn-clear" onClick={ this.switchType }>
          <li class="cur"><span>最热</span></li>
          <li><span>最新</span></li>
        </ul>
      </div>
      <ul class="list">
        <li>
          <img src="http://bbs.xiguo.net/zq/zz/02.png"/>
          <div class="txt">
            <div class="name">白衣渡我</div>
            <p class="author"><span>xxxxx</span><span>xxxxx</span></p>
          </div>
          <b class="playing"/>
          <b class="video"/>
        </li>
        <li>
          <img src="http://bbs.xiguo.net/zq/zz/02.png"/>
          <div class="txt">
            <div class="name">白衣渡我</div>
            <p class="author"><span>xxxxx</span><span>xxxxx</span></p>
          </div>
          <b class="audio"/>
        </li>
        <li>
          <img src="http://bbs.xiguo.net/zq/zz/02.png"/>
          <div class="txt">
            <div class="name">白衣渡我</div>
            <p class="author"><span>xxxxx</span><span>xxxxx</span></p>
          </div>
          <b class="audio"/>
        </li>
        <li>
          <img src="http://bbs.xiguo.net/zq/zz/02.png"/>
          <div class="txt">
            <div class="name">白衣渡我</div>
            <p class="author"><span>xxxxx</span><span>xxxxx</span></p>
          </div>
          <b class="audio"/>
        </li>
      </ul>
    </div>;
  }
}

export default PlayList;
