/**
 * Created by army on 2017/6/10.
 */
 
class Nav extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind title
  @bind subTitle
  render() {
    return <div class="nav">
      <h1>{ this.title }</h1>
      <h2>{ this.subTitle || 'sdf' }</h2>
      <b class="play"/>
    </div>;
  }
}

export default Nav;
