/**
 * Created by army8735 on 2018/7/27.
 */

'use strict';

class Step0 extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.visible = self.props.visible;
  }
  @bind visible
  @bind list
  click(e, vd, tvd) {
    let self = this;
    let item = self.list[tvd.props.rel];
    let id = item.id;
    jsBridge.showLoading();
    $net.postJSON('/h5/article/worksType', { id }, function(res) {
      jsBridge.hideLoading();
      if(res.success) {
        self.emit('next', res.data, item);
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
    return <div class={ 'step0' + (this.visible ? '' : ' fn-hide') }>
      <b class="icon"/>
      <h2>请问想要制作什么类型的作品呢？</h2>
      <ul class="list"
          onClick={ { li: this.click } }>
      {
        (this.list || []).map((item, i) => {
          return <li rel={ i }>{ item.name }</li>;
        })
      }
      </ul>
    </div>;
  }
}

export default Step0;
