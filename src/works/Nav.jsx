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
  @bind title
  @bind subTitle
  render() {
    return <div class="nav">
      <b class="back" onClick={ this.click }/>
      <h1>{ this.title }</h1>
      <h2>{ this.subTitle }</h2>
      <b class="play"/>
    </div>;
  }
}

export default Nav;
