/**
 * Created by army on 2017/6/10.
 */
 
class Nav extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  click() {
    jsBridge.back();
  }
  render() {
    return <div class="nav">
      <b class="back" onClick={ this.click }/>
      <h1>前前前世</h1>
      <h2>《你的名字》主题曲中文版</h2>
      <b class="play"/>
    </div>;
  }
}

export default Nav;
