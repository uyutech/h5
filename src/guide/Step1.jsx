/**
 * Created by army on 2017/4/18.
 */

class Step1 extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  
  render() {
    return <div class="step1">
      <img class="logo" src="step1.jpg"/>
      <h2>欢迎来到转圈</h2>
      <p class="qname">我是圈娘，请问该怎么称呼你呢？</p>
      <input type="text" class="iname"/>
      <p class="qsex">请问是汉子还是妹子呢？</p>
      <ul class="sex">
        <li class="male">汉子</li>
        <li class="female">妹子</li>
      </ul>
    </div>;
  }
};

export default Step1;
