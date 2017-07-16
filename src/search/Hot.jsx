/**
 * Created by army on 2017/7/16.
 */
 
class Hot extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <div class="hot">
      <div class="ti">搜索历史</div>
      <ul class="list">
        <li>
          <span>1</span>
          <strong>关键字</strong>
          <small>· 作者</small>
        </li>
        <li>
          <span>2</span>
          <strong>关键字</strong>
          <small>· 作者</small>
        </li>
        <li>
          <span>3</span>
          <strong>关键字</strong>
          <small>· 作者</small>
        </li>
        <li>
          <span>4</span>
          <strong>关键字</strong>
          <small>· 作者</small>
        </li>
      </ul>
    </div>;
  }
}

export default Hot;
