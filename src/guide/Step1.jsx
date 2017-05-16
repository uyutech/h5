/**
 * Created by army on 2017/4/18.
 */

class Step1 extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind isShow = false
  @bind isMale = true
  @bind isDis = true
  @bind setDis = false
  @bind v = ''
  click(e, vd, tvd) {
    var $o = $(tvd.element);
    if(!$o.hasClass('cur')) {
      this.isMale = !this.isMale;
    }
  }
  input(e, vd) {
    this.isDis = $(vd.element).val().length < 4;
  }
  next(e, vd) {
    var $vd = $(vd.element);
    if(!$vd.hasClass('dis')) {
      this.setDis = true;
      this.emit('next');
    }
  }
  enable() {
    this.setDis = false;
  }
  show() {
    this.isShow = true;
  }
  hide() {
    this.isShow = false;
  }
  render() {
    return <div class={ 'step1' + (this.isShow ? '' : ' fn-hide') }>
      <div class="con">
        <img class="logo" src="step1.jpg"/>
        <h2>欢迎来到转圈</h2>
        <h4>我是圈娘，请问该怎么称呼你呢？</h4>
        <input type="text" class="iname" placeholder="字数请超过4个" maxLength="16" onInput={ this.input } value={ this.v }/>
        <p class="error"></p>
        <p class="qsex">请问是汉子还是妹子呢？</p>
        <ul class="sex" onClick={{ li: this.click }}>
          <li class={ 'male' + (this.isMale ? ' cur' : '') }><span>汉子</span></li>
          <li class={ 'female' + (this.isMale ? '' : ' cur') }><span>妹子</span></li>
        </ul>
      </div>
      <button ref="next" class={ 'sub' + ((this.isDis || this.setDis) ? ' dis' : '') } onClick={ this.next }>就叫这个！</button>
    </div>;
  }
}

export default Step1;
