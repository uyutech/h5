/**
 * Created by army on 2017/7/16.
 */
 
class Nav extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  cancel() {
    jsBridge.popWindow();
  }
  render() {
    return <div class="nav">
      <div class="form">
        <input type="text" placeholder="河图新歌《寻常》发布"/>
      </div>
      <span onClick={ this.cancel }>取消</span>
    </div>;
  }
}

export default Nav;
