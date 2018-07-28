/**
 * Created by army8735 on 2018/7/27.
 */

'use strict';

class Step3 extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.visible = self.props.visible;
  }
  @bind visible
  @bind text
  @bind valid
  @bind finish
  input(e, vd) {
    let s = vd.element.value;
    this.valid = s.length >= 10;
  }
  next() {
    if(!this.valid || this.finish) {
      return;
    }
    this.emit('next', this.text);
    this.finish = true;
  }
  render() {
    return <div class={'step3' + (this.visible ? '' : ' fn-hide')}>
      <b class="icon"/>
      <h2>简单介绍一下你对这个作品的想法以及对小伙伴们的期待吧~</h2>
      <textarea placeholder="请至少输入10个字哦！"
                readOnly={ this.finish }
                onInput={ this.input }>{ this.text }</textarea>
      <button class={ 'sub' + (this.valid && !this.finish ? '' : ' dis') }
              onClick={ this.next }>完成</button>
    </div>;
  }
}

export default Step3;
