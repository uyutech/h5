/**
 * Created by army8735 on 2018/8/10.
 */

'use strict';

class Step2 extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.visible = self.props.visible;
    self.enable = true;
  }
  @bind visible
  @bind list
  @bind enable
  next() {
    this.enable = false;
    this.emit('next');
  }
  render() {
    return <div class={ 'step' + (this.visible ? '' : ' fn-hide') }>
      <b class="icon"/>
      <pre>{ '恭喜你获得了转圈作者身份，并点亮了' + (this.list || []).join('、') + '技能点~\n' +
      '你可以去右下角“我的”中进入你的主页进行相关编辑操作！\n' +
      '也欢迎登录网页端上传你的作品，增加相应的技能点！' }</pre>
      <button class={ 'sub' + (this.enable ? '' : ' dis') }
              onClick={ this.next }>去约稿</button>
    </div>
  }
}

export default Step2;
