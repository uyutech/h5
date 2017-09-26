/**
 * Created by army8735 on 2017/9/19.
 */

class TopNav extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind kw
  focus() {
    this.emit('focus');
  }
  click() {
    this.submit();
  }
  submit(e) {
    e && e.preventDefault();
    let v = this.ref.input.element.value.trim();
    if(v) {
      this.emit('search', v);
    }
  }
  render() {
    return <div class="top-nav">
      <form class="form" ref="form" onSubmit={ this.submit } action="/search/">
        <input ref="input" type="text" maxlength="16" placeholder="新歌《燃尽人间色发布》" value={ this.kw } onFocus={ this.focus }/>
      </form>
      <button onClick={ this.click }>确认</button>
    </div>;
  }
}

export default TopNav;
