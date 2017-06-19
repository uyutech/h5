/**
 * Created by army on 2017/6/18.
 */
 
class Tags extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <div class="tags">
      <ul>
        <li class="item"><span class="cur">主页<b/></span></li>
        <li class="placeholder"/>
        <li class="item"><span>作品<b/></span></li>
        <li class="placeholder"/>
        <li class="item"><span>留言<b/></span></li>
      </ul>
    </div>;
  }
}

export default Tags;
