/**
 * Created by army8735 on 2017/8/3.
 */

class Other extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <div class="other">
      <h5><b></b><span>其它账号登陆</span><b></b></h5>
      <ul>
        <li>
          <b class="weibo"></b>
        </li>
      </ul>
    </div>;
  }
}

export default Other;
