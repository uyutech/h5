/**
 * Created by army on 2017/5/18.
 */

class Step0 extends migi.Component {
  constructor(...data) {
    super(...data);
    this.isShow = this.props.isShow;
  }
  @bind isShow
  @bind isDis = true
  @bind setDis = false
  click(e, vd, tvd) {
    var $o = $(tvd.element);
    if(!$o.hasClass('cur')) {
      this.isMale = !this.isMale;
    }
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
  onc(e) {
    e.preventDefault();
  }
  offc(e) {
    e.preventDefault();
  }
  protocol(e) {
    e.preventDefault();
  }
  render() {
    return <div class={ 'step0' + (this.isShow ? '' : ' fn-hide') }>
      <div class="con">
        <img class="logo" src="src/guide/step2.jpg"/>
        <h2>原来是传说中的</h2>
        <h4>{ this.props.authorName }</h4>
        <p>欢迎来到“转圈”，热心粉丝们已经为您建立了详尽的个人主页，正恭候您的大驾！</p>
        <p>在这里，除了转圈的基本功能外（如社交、收藏作品等），您还拥有了创作者专属功能（如管理、上传您的作品、发起粉丝活动等）！</p>
        <a href="#" class="on" onClick={ this.onc }></a>
        <a href="#" class="off" onClick={ this.offc }></a>
        <div class="protocol">我已阅读并同意转圈的<a href="#" onClick={ this.protocol }>《作者协议》</a></div>
      </div>
    </div>;
  }
}

export default Step0;
