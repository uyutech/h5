/**
 * Created by army on 2017/6/10.
 */
 
class Nav extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <div class="nav">
      <b class="back"/>
      <h1>标题标题</h1>
      <h2>副标题</h2>
      <b class="play"/>
    </div>;
  }
}

export default Nav;
