/**
 * Created by army on 2017/4/21.
 */
 
class Step2 extends migi.Component {
  constructor(...data) {
    super(...data);
    this.isShow = this.props.isShow;
    this.list = [];
    for(let i = 0; i < 30; i++) {
      this.list.push(1);
    }
  }
  @bind isShow
  @bind setDis = false
  get list() {
    return this._list || [];
  }
  @bind
  set list(v) {
    this._list = v;
  }
  click(e, vd, tvd) {
    var $li = $(tvd.element);
    $li.toggleClass('sel');
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
    return <div class={ 'step2' + (this.isShow ? '' : ' fn-hide') }>
      <div class="con">
        <img class="logo" src="src/guide/step2.jpg"/>
        <h2>请选择你感兴趣的圈子</h2>
        <h4>以便我们呈现更适合你的内容</h4>
        <div class="list">
          <ul class="fn-clear" onClick={ { 'li': this.click } }>
            {
              this.list.map(function(item) {
                return <li>古风</li>;
              }.bind(this))
            }
          </ul>
        </div>
      </div>
      <button ref="next" class={ 'sub' + (this.setDis ? ' dis' : '') } onClick={ this.next }>我选好啦！</button>
    </div>;
  }
}

export default Step2;
