/**
 * Created by army8735 on 2018/1/21.
 */

'use strict';


class InputCmt extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.value = self.props.value;
    self.placeholder = self.props.placeholder;
    self.readOnly = self.props.readOnly;
    self.on(migi.Event.DOM, function() {
      jsBridge.getCache(['my', 'useAuthor'], function([my, useAuthor]) {
        if(useAuthor) {
          self.headUrl = my.author[0].headUrl;
        }
        else {
          self.headUrl = my.user.headUrl;
        }
      });
    });
  }
  @bind headUrl
  @bind value
  @bind placeholder
  @bind readOnly
  focus() {
    this.ref.input.element.focus();
  }
  clickInput() {
    this.emit('click');
  }
  clickShare() {
    this.emit('share');
  }
  render() {
    return <form class="cp-inputcmt">
      <img src={ this.headUrl || '/src/common/head.png' }/>
      <input ref="input"
             value={ this.value }
             placeholder={ this.placeholder }
             readOnly={ this.readOnly }
             onClick={ this.clickInput }/>
      <b class="share" onClick={ this.clickShare }/>
    </form>;
  }
}

export default InputCmt;
