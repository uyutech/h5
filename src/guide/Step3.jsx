/**
 * Created by army on 2017/4/22.
 */

class Step3 extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <div class="step3">
      <img class="logo" src="step1.jpg"/>
      <h2>这里有你喜欢的东西吗？</h2>
      <h4>没有也没关系，之后随时可以添加</h4>
      <ul class="list fn-clear">
        <li><img src="step1.jpg"/><span>河图</span></li>
        <li><img src="step1.jpg"/><span>河图</span></li>
        <li><img src="step1.jpg"/><span>河图</span></li>
        <li><img src="step1.jpg"/><span>河图</span></li>
        <li><img src="step1.jpg"/><span>河图</span></li>
        <li><img src="step1.jpg"/><span>河图</span></li>
        <li><img src="step1.jpg"/><span>河图</span></li>
        <li><img src="step1.jpg"/><span>河图</span></li>
      </ul>
      <a href="#" class="change">换一换</a>
      <div class="choose">
        <div class="lists">
          <ul>
            <li><img src="step1.jpg"/></li>
            <li><img src="step1.jpg"/></li>
            <li><img src="step1.jpg"/></li>
            <li><img src="step1.jpg"/></li>
            <li><img src="step1.jpg"/></li>
            <li><img src="step1.jpg"/></li>
            <li><img src="step1.jpg"/></li>
            <li><img src="step1.jpg"/></li>
            <li><img src="step1.jpg"/></li>
            <li><img src="step1.jpg"/></li>
            <li><img src="step1.jpg"/></li>
            <li><img src="step1.jpg"/></li>
          </ul>
        </div>
        <button>我选好啦!</button>
      </div>
    </div>;
  }
}

export default Step3;
