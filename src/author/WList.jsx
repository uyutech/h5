/**
 * Created by army on 2017/6/24.
 */
 
class WList extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <div class="wlist">
      <div class="bar">
        <ul class="fn-clear">
          <li><b class="video"/>播放全部</li>
          <li><b class="audio"/></li>
          <li><b class="play"/></li>
        </ul>
      </div>
    </div>;
  }
}
export default WList;
