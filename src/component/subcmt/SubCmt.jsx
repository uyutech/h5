/**
 * Created by army8735 on 2017/10/12.
 */

'use strict';

import util from '../../common/util';

class SubCmt extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.hidden = self.props.hidden;
    self.value = self.props.value || '';
    self.invalid = self.value.trim().length < 3;
    self.maxlength = self.props.maxlength;
    self.subText = self.props.subText;
    self.tipText = self.props.tipText;
    self.placeholder = self.props.placeholder;
    self.toPlaceholder = self.props.toPlaceholder;
    self.originTo = self.props.originTo;
    self.readOnly = self.props.readOnly;
  }
  @bind hidden
  @bind maxlength
  @bind placeholder
  @bind subText
  @bind tipText
  @bind value = ''
  @bind to
  @bind toPlaceholder
  @bind originTo
  @bind invalid = true
  @bind readOnly
  input(e, vd) {
    if(!util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
    }
    else {
      this.invalid = $(vd.element).val().trim().length < 3;
    }
  }
  onFocus() {
    this.emit('focus');
  }
  focus() {
    this.ref.input.element.focus();
  }
  click() {
    this.emit('click');
  }
  submit(e) {
    e.preventDefault();
    if(!this.invalid) {
      this.emit('submit', this.value);
    }
  }
  clickDel() {
    this.to = '';
    migi.eventBus.emit('subCmtDelTo');
  }
  render() {
    return <div class={ 'cp-subcmt' + (!this.hidden ? '' : ' fn-hide') }>
      <form class={ this.to || this.originTo ? ' to' : '' }
            ref="form"
            onSubmit={ this.submit }
            onClick={ this.click }>
        <label>TO: { this.to || this.originTo }</label>
        <b class={ 'del' + (this.to ? '' : ' fn-hide') }
           onClick={ this.clickDel }/>
        <input type="text"
               class="text"
               ref="input"
               placeholder={ this.to ? ('回复' + this.to + (this.toPlaceholder || '的评论')) : this.placeholder }
               onInput={ this.input } onFocus={ this.onFocus } maxlength={ this.maxlength || 2048 }
               value={ this.value }
               readonly={ this.readOnly}/>
        <input type="submit"
               class={ 'submit' + (this.invalid ? ' dis' : '') }
               value={ this.value.trim().length
                 ? this.value.trim().length < 3
                   ? this.tipText
                     ? this.tipText.replace('${n}', (3 - this.value.trim().length))
                     : '还少' + (3 - this.value.trim().length) + '个字哦'
                   : this.subText || '发布评论'
                 : this.subText || '发布评论' }/>
      </form>
    </div>;
  }
}

export default SubCmt;
