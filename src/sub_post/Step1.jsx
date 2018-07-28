/**
 * Created by army8735 on 2018/7/27.
 */

'use strict';

class Step0 extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.visible = self.props.visible;
    self.valid = false;
  }
  @bind visible
  @bind list
  @bind valid
  click(e, vd ,tvd) {
    let i = tvd.props.rel;
    let item = this.list[i];
    item.selected = !item.selected;
    this.list.splice(i, 1, item);
    let valid = false;
    for(let i = 0; i < this.list.length; i++) {
      if(this.list[i].selected) {
        valid = true;
        break;
      }
    }
    this.valid = valid;
  }
  next() {
    let self = this;
    if(!self.valid) {
      return;
    }
    let idList = self.list.filter((item) => {
      return item.selected;
    }).map((item) => {
      return item.id;
    });
    jsBridge.showLoading();
    $net.postJSON('/h5/article/profession', { idList }, function(res) {
      jsBridge.hideLoading();
      if(res.success) {
        self.emit('next', res.data);
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.hideLoading();
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
    });
  }
  render() {
    return <div class={ 'step1' + (this.visible ? '' : ' fn-hide') }>
      <b class="icon"/>
      <h2>请问你需要制作以下哪些内容呢？<br/>（可多选哦！）</h2>
      <ul class="list"
          onClick={ { li: this.click } }>
        {
          (this.list || []).map((item, i) => {
            return <li class={ item.selected ? 'on' : '' }
                       rel={ i }>{ item.name }</li>;
          })
        }
      </ul>
      <button class={ 'sub' + (this.valid ? '' : ' dis') }
              onClick={ this.next }>下一步</button>
    </div>;
  }
}

export default Step0;
