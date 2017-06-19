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
      <h1>标题标题</h1>
      <h2>副标题</h2>
      <b class="play"/>
    </div>;
  }
}

export default Nav;
