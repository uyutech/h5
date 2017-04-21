/**
 * Created by army on 2017/4/21.
 */


class Step2 extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <div class="step2">
      <img class="logo" src="step1.jpg"/>
      <h2>请选择你喜欢的领域</h2>
      <h4>以便我们呈现更适合你的内容</h4>
      <div class="list">
        <div class="line">
          <div class="item">
            <div class="con">
              <div class="bg"></div>
              <div class="flag"><span>广播剧</span></div>
            </div>
          </div>
          <div class="item">
            <div class="con">
              <div class="bg"></div>
              <div class="flag"><span>广播剧</span></div>
            </div>
          </div>
        </div>
        <div class="line">
          <div class="item">
            <div class="con">
              <div class="bg"></div>
              <div class="flag"><span>广播剧</span></div>
            </div>
          </div>
        </div>
      </div>
      <button class="sub">我选好啦！</button>
    </div>;
  }
}

export default Step2;
