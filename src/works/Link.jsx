/**
 * Created by army on 2017/6/12.
 */
 
class Link extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <div class="link">
      <ul>
        <li class="5sing"><a href="https://www.baidu.com">5sing</a></li>
        <li class="baidu"><a href="https://www.baidu.com">百度</a></li>
        <li class="wangyi"><a href="https://www.baidu.com">网易云</a></li>
        <li class="bili"><a href="https://www.baidu.com">bilibili</a></li>
        <li class="bili"><a href="https://www.baidu.com">bilibili</a></li>
        <li class="bili"><a href="https://www.baidu.com">bilibili</a></li>
      </ul>
    </div>;
  }
}

export default Link;
