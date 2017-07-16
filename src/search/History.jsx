/**
 * Created by army on 2017/7/16.
 */
 
class History extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <div class="history">
      <div class="ti">
        <span>搜索历史</span>
        <a href="#">清除</a>
      </div>
      <ul class="list fn-clear">
        <li>河图</li>
        <li>河图</li>
        <li>河图</li>
        <li>河图</li>
        <li>河图</li>
      </ul>
    </div>;
  }
}

export default History;
