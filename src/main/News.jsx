/**
 * Created by army on 2017/3/19.
 */

class News extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <div class="news_list">
      <ul class="list">
        <li>
          <div class="t">
            <img src="http://tva3.sinaimg.cn/crop.133.113.754.754.50/684ff39bgw1f6wlmiignrj20rt0rtta8.jpg"/>
            <strong>河图</strong>
            <small>2017.03.16 10:00</small>
          </div>
          <div class="c">
            <p>如果你无法简洁地表达你的想法，那只说明你还不够了解它。</p>
          </div>
        </li>
        <li>
          <div class="t">
            <img src="http://tva3.sinaimg.cn/crop.133.113.754.754.50/684ff39bgw1f6wlmiignrj20rt0rtta8.jpg"/>
            <strong>河图</strong>
            <small>2017.03.16 10:00</small>
          </div>
          <div class="c">
            <p>如果你无法简洁地表达你的想法，那只说明你还不够了解它。</p>
          </div>
        </li>
      </ul>
    </div>;
  }
}

export default News;
