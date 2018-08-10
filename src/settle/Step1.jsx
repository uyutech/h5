/**
 * Created by army8735 on 2018/8/8.
 */

'use strict';

class Step0 extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.visible = self.props.visible;
  }
  @bind visible
  @bind authorName
  @bind enable
  input() {
    let self = this;
    self.enable = self.authorName && self.authorName.length >= 2 && self.authorName.length <= 8;
  }
  next() {
    this.enable = false;
    this.emit('next', this.authorName);
  }
  render() {
    return <div class={ 'step' + (this.visible ? '' : ' fn-hide') }>
      <b class="icon"/>
      <h4>请问你的笔名是？</h4>
      <input type="text"
             class="name"
             placeholder="请输入2~8个字哦~"
             maxLength="8"
             onInput={ this.input }
             value={ this.authorName }/>
      <button class={ 'sub' + (this.enable ? '' : ' dis') }
              onClick={ this.next }>完成</button>
    </div>;
  }
}

export default Step0;
