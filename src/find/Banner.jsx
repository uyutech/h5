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
      <a href="works.html?id=2015000000000001" onClick={ this.click }><img src="http://zhuanquan.xyz/pic/47d15679d3e6883acacdbcd85f2ebe85.jpg"/></a>
    </div>;
  }
}

export default Banner;
