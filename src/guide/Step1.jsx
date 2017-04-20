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
      <input type="text" class="iname" placeholder="字数请超过4个" maxLength="16"/>
      <p class="qsex">请问是汉子还是妹子呢？</p>
      <ul class="sex">
        <li class="male cur"><span>汉子</span></li>
        <li class="female"><span>妹子</span></li>
      </ul>
    </div>;
  }
};

export default Step1;
