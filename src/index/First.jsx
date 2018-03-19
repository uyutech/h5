/**
 * Created by army8735 on 2018/3/18.
 */

'use strict';

class First extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind index = 0;
  right() {
    if(this.index) {
      this.index--;
    }
    this.update();
  }
  left() {
    if(this.index < 3) {
      this.index++;
    }
    this.update();
  }
  update() {
    let list = this.ref.list.element;
    list.style.transform = `translate3d(-${this.index * 25}%, 0, 0)`;
  }
  clickBtn() {
    let self = this;
    self.ref.c.element.classList.add('fn-hide');
    self.ref.first.element.classList.add('hide');
    self.ref.arrow.element.classList.add('show');
    setTimeout(function() {
      self.ref.arrow.element.classList.remove('show');
      setTimeout(function() {
        self.clean();
      }, 300);
    }, 2000);
  }
  click() {
    this.clickBtn();
  }
  render() {
    return <div class="first"
                ref="first">
      <div class="c"
           ref="c"
           onSwipeLeft={ this.left }
           onSwipeRight={ this.right }>
        <ul class="list"
            ref="list"
            onClick={ this.click }>
          <li>
            <h3>发现</h3>
            <p>精准推送，你最喜欢的内容</p>
            <b class="i1"/>
          </li>
          <li>
            <h3>转圈</h3>
            <p>圈友交流，分享你的生活</p>
            <b class="i2"/>
          </li>
          <li>
            <h3>关注</h3>
            <p>无需蹲点，你关注的都在这</p>
            <b class="i3"/>
          </li>
          <li>
            <b class="i4"/>
            <span class="btn"
                  onClick={ this.clickBtn }>开启转圈之旅</span>
          </li>
        </ul>
        <ul class="tag"
            onClick={ { li: this.clickTag } }>
          <li class={ this.index === 0 ? 'cur' : '' }/>
          <li class={ this.index === 1 ? 'cur' : '' }/>
          <li class={ this.index === 2 ? 'cur' : '' }/>
          <li class={ this.index === 3 ? 'cur' : '' }/>
        </ul>
      </div>
      <ul class={ 'icon i' + this.index }>
        <li class="find"/>
        <li class="circling"/>
        <li class="new"/>
        <li class="follow"/>
        <li class="my"/>
      </ul>
      <div class="arrow"
           ref="arrow">戳这里画下你的第一个圈吧~</div>
    </div>;
  }
}

export default First;
