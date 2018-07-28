/**
 * Created by army8735 on 2018/7/27.
 */

'use strict';

class Step2 extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.visible = self.props.visible;
    self.valid = false;
  }
  @bind visible
  @bind list1
  @bind list2
  @bind hasMore
  @bind more
  @bind valid
  click(e, vd ,tvd) {
    let i = tvd.props.rel;
    let item = this.list1[i];
    item.selected = !item.selected;
    this.list1.splice(i, 1, item);
    this.check();
  }
  click2(e, vd ,tvd) {
    let i = tvd.props.rel;
    let item = this.list2[i];
    item.selected = !item.selected;
    this.list2.splice(i, 1, item);
    this.check();
  }
  check() {
    let valid = false;
    for(let i = 0; i < this.list1.length; i++) {
      if(this.list1[i].selected) {
        valid = true;
        break;
      }
    }
    for(let i = 0; i < this.list2.length; i++) {
      if(this.list2[i].selected) {
        valid = true;
        break;
      }
    }
    this.valid = valid;
  }
  clickMore() {
    this.more = !this.more;
  }
  next() {
    let self = this;
    if(!self.valid) {
      return;
    }
    let list1 = self.list1.filter((item) => {
      return item.selected;
    });
    let list2 = self.list2.filter((item) => {
      return item.selected;
    });
    self.emit('next', list1, list2);
  }
  render() {
    return <div class={ 'step2' + (this.visible ? '' : ' fn-hide') }>
      <b class="icon"/>
      <h2>请问想要招募到什么样的小伙伴呢？</h2>
      <ul class="list"
          onClick={ { li: this.click } }>
        {
          (this.list1 || []).map((item, i) => {
            return <li class={ item.selected ? 'on' : '' }
                       rel={ i }>{ item.name }</li>;
          })
        }
      </ul>
      <label class={ (this.hasMore ? '' : 'fn-hide') + (this.more ? ' more' : '') }
             onClick={ this.clickMore }>其它类型</label>
      <ul class={ 'list' + (this.more ? '' : ' fn-hide') }
          onClick={ { li: this.click2 } }>
        {
          (this.list2 || []).map((item, i) => {
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

export default Step2;
