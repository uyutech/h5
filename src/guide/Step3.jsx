/**
 * Created by army on 2017/4/22.
 */

class Step3 extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind isShow = false
  @bind setDis = false
  show() {
    this.isShow = true;
  }
  hide() {
    this.isShow = false;
  }
  click(e, vd, tvd) {
    var $li = $(tvd.element);
    $li.toggleClass('sel');
  }
  click2(e, vd, tvd) {
    var $li = $(tvd.element);
    if($li.hasClass('remove')) {
      //
    }
    else if($li.hasClass('sel')) {
      $li.addClass('remove');
      setTimeout(function() {
        $li.remove();
      }, 1000);
    }
    else {
      $li.addClass('sel');
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
  render() {
    return <div class={ 'step3' + (this.isShow ? '' : ' fn-hide') }>
      <img class="logo" src="step2.jpg"/>
      <h2>这里有你喜欢的作者吗？</h2>
      <h4>没有也没关系，之后随时可以添加</h4>
      <ul class="list fn-clear" onClick={ { 'li': this.click } }>
        <li><img src="step1.jpg"/><span>河图</span></li>
        <li><img src="step1.jpg"/><span>河图</span></li>
        <li><img src="step1.jpg"/><span>河图</span></li>
        <li><img src="step1.jpg"/><span>河图</span></li>
        <li><img src="step1.jpg"/><span>河图</span></li>
        <li><img src="step1.jpg"/><span>河图</span></li>
        <li><img src="step1.jpg"/><span>河图</span></li>
        <li><img src="step1.jpg"/><span>河图</span></li>
      </ul>
      <a href="#" class="change"><span>换一换</span></a>
      <div class="choose">
        <div class="lists">
          <ul onClick={ { 'li': this.click2 } }>
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
        <button ref="next" class={ 'sub' + (this.setDis ? ' dis' : '') } onClick={ this.next }>我选好啦!</button>
      </div>
    </div>;
  }
}

export default Step3;
