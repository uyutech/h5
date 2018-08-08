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
  @bind list
  @bind enable
  click(e, vd, tvd) {
    let i = tvd.props.rel;
    let item = this.list[i];
    item.checked = !item.checked;
    this.list.splice(i, 1, item);
    if(item.checked) {
      this.enable = true;
    }
    else {
      for(let i = 0; i < this.list.length; i++) {
        if(this.list.checked) {
          this.enable = true;
          return;
        }
      }
      this.enable = false;
    }
  }
  next() {
    let list = [];
    this.list.forEach((item) => {
      if(item.checked) {
        list.push(item);
      }
    });
    this.emit('next', list);
  }
  render() {
    return <div class={ 'step0' + (this.visible ? '' : ' fn-hide') }>
      <b class="icon"/>
      <p>欢迎使用转圈约稿功能~在发布第一个约稿之前，请简单介绍一下自己吧！</p>
      <p>请问你希望点亮下列哪一种技能点呢？不论是已经具备的技能，还是想要学习、尝试的技能都可以哦！</p>
      <ul class="list"
          onClick={ { li: this.click } }>
      {
        (this.list || []).map((item, i) => {
          return <li class={ item.checked ? 'checked' : '' }
                     rel={ i }>{ item.name }</li>;
        })
      }
      </ul>
      <button class={ 'sub' + (this.enable ? '' : ' dis') }
              onClick={ this.next }>下一步</button>
    </div>
  }
}

export default Step0;
