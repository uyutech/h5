/**
 * Created by army8735 on 2018/1/21.
 */

'use strict';

import util from '../../common/util';

class InputCmt extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.hidden = self.props.hidden;
    self.value = self.props.value;
    self.placeholder = self.props.placeholder;
    self.readOnly = self.props.readOnly;
    self.on(migi.Event.DOM, function() {
      jsBridge.getPreference('loginInfo', function(loginInfo) {
        if(loginInfo && loginInfo.userInfo) {
          self.head = loginInfo.userInfo.Head_Url;
        }
      });
    });
  }
  @bind hidden
  @bind head
  @bind value
  @bind placeholder
  @bind readOnly
  show() {
    this.hidden = false;
  }
  hide() {
    this.hidden = true;
  }
  clickInput() {
    this.emit('click');
  }
  clickShare() {
    this.emit('share');
  }
  render() {
    return <div class={ 'cp-inputcmt' + (this.hidden ? ' fn-hide' : '') }>
      <img src={ this.head || '/src/common/head.png' }/>
      <input value={ this.value }
             placeholder={ this.placeholder }
             readOnly={ this.readOnly }
             onClick={ this.clickInput }/>
      <b class="share" onClick={ this.clickShare }/>
    </div>;
  }
}

export default InputCmt;
