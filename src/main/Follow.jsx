class Follow extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <div class="follows">
      <h3>特别关注</h3>
      <a href="#" class="more">关注列表</a>
      <ul class="list">
        <li>
          <a href="#">
            <img src="http://tva3.sinaimg.cn/crop.133.113.754.754.50/684ff39bgw1f6wlmiignrj20rt0rtta8.jpg"/>
            <span>名字</span>
          </a>
        </li>
        <li>
          <a href="#">
            <img src="http://tva3.sinaimg.cn/crop.133.113.754.754.50/684ff39bgw1f6wlmiignrj20rt0rtta8.jpg"/>
            <span>名字</span>
          </a>
        </li>
        <li>
          <a href="#">
            <img src="http://tva3.sinaimg.cn/crop.133.113.754.754.50/684ff39bgw1f6wlmiignrj20rt0rtta8.jpg"/>
            <span>名字</span>
          </a>
        </li>
      </ul>
    </div>;
  }
}

export default Follow;
