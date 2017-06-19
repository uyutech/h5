/**
 * Created by army on 2017/6/11.
 */
 
class Nav extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <div class="nav">
      <div class="form">
        <input type="text" placeholder="河图新歌发布"/>
      </div>
      <b class="comment"/>
      <b class="play"/>
    </div>;
  }
}

export default Nav;
