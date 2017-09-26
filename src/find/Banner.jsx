/**
 * Created by army on 2017/6/18.
 */
 
class Banner extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  click(e, vd) {
    e.preventDefault();
    jsBridge.pushWindow(vd.props.href);
  }
  render() {
    return <div class="banner">
      <a href="works.html?id=2015000000000001" onClick={ this.click }><img src="http://zhuanquan.xin/pic/e34cc1fb3102e63b507293f6e5a20515.jpg-750_"/></a>
    </div>;
  }
}

export default Banner;
