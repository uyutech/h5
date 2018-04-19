/**
 * Created by army8735 on 2018/3/11.
 */

'use strict';

let WIDTH;
let isStart;
let isMove;
let sx;
let sy;
let dx;
let pos;

class Banner extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.visible = self.props.visible;
    self.dataList = self.props.dataList || [];
    self.on(migi.Event.DOM, function() {
      let li = self.ref.list.element.querySelector('li');
      if(li) {
        WIDTH = li.clientWidth;
      }
      self.on(migi.Event.DATA, function() {
        if(WIDTH) {
          return;
        }
        let li = self.ref.list.element.querySelector('li');
        if(li) {
          WIDTH = li.clientWidth;
        }
      });
    });
  }
  @bind dataList;
  @bind index = 0;
  @bind visible
  setOffset(x) {
    let $list = $(this.ref.list.element);
    $list.css('-moz-transform', 'translateX(-' + x + 'px)');
    $list.css('-webkit-transform', 'translateX(-' + x + 'px)');
    $list.css('transform', 'translateX(-' + x + 'px)');
  }
  left() {
    this.index++;
    if(this.index >= this.dataList.length) {
      this.index = this.dataList.length - 1;
    }
    this.setOffset(Math.floor(this.index * WIDTH));
  }
  right() {
    this.index--;
    if(this.index < 0) {
      this.index = 0;
    }
    this.setOffset(Math.floor(this.index * WIDTH));
  }
  start(e) {
    if(e.touches.length === 1) {
      isStart = true;
      sx = e.touches[0].pageX;
      sy = e.touches[0].pageY;
      pos = [];
    }
  }
  move(e) {
    if(isMove) {
      e.preventDefault();
      let x = e.touches[0].pageX;
      dx = x - sx;
      pos.push({
        t: Date.now(),
        x,
      });
      if(pos.length > 5) {
        pos.shift();
      }
    }
    else if(isStart && e.touches.length === 1) {
      let x = e.touches[0].pageX;
      let y = e.touches[0].pageY;
      dx = x - sx;
      if(Math.abs(dx) > Math.abs(y - sy)) {
        e.preventDefault();
        isMove = true;
        pos.push({
          t: Date.now(),
          x,
        });
        if(pos.length > 5) {
          pos.shift();
        }
      }
      else {
        isStart = false;
      }
    }
  }
  end() {
    let self = this;
    if(!isStart || !isMove) {
      isStart = isMove = false;
      return;
    }
    isStart = isMove = false;
    let left;
    let right;
    if(dx < -WIDTH >> 1) {
      right = true;
    }
    else if(dx > WIDTH >> 1) {
      left = true;
    }
    else if(pos.length > 1 && Math.abs(dx) > 10) {
      for(let i = pos.length - 1; i > 0; i--) {
        let a = pos[i];
        let b = pos[i - 1];
        if(a.t - b.t > 30) {
          pos = pos.slice(i);
          break;
        }
      }
      if(pos.length > 1) {
        let now = Date.now();
        pos.push({
          t: now,
          x: pos[pos.length - 1].x,
        });
        let dt = Math.max(1, pos[pos.length - 1].t - pos[0].t);
        let dx2 = pos[pos.length - 1].x - pos[0].x;
        let rate = Math.abs(dx2) / dt;
        if(rate > 0.1) {
          if(dx2 > 0) {
            left = true;
          }
          else if(dx2 < 0) {
            right = true;
          }
        }
      }
    }
    if(left) {
      self.right();
    }
    else if(right) {
      self.left();
    }
  }
  click(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    let title = tvd.props.title;
    let transparentTitle = tvd.props.transparentTitle;
    jsBridge.pushWindow(url, {
      title,
      transparentTitle: transparentTitle,
    });
  }
  render() {
    return <div class={ 'mod-banner' + (this.visible ? '' : ' fn-hide') }
                onTouchStart={ this.start }
                onTouchMove={ this.move }
                onTouchEnd={ this.end }
                onTouchCancel={ this.end }>
      <ul class="list fn-clear"
          ref="list"
          style={ 'width:' + Math.max(1, this.dataList.length) * 100 + '%' }
          onClick={ { a: this.click } }>
        {
          (this.index, this.dataList).map(function(item, index) {
            return <li class={ index === this.index ? 'cur' : '' }>
              <a href={ item.url }
                 target="_blank"
                 title={ item.title }
                 transparentTitle={ item.transparentTitle }>
                <img src={ $util.img(item.cover, 750, 0, 80) || '/src/common/blank.png' }/>
              </a>
            </li>;
          }.bind(this))
        }
      </ul>
      <ul class="tags" ref="tags" onClick={ { li: this.clickTag } }>
        {
          (this.index, this.dataList).map(function(item, index) {
            return <li class={ index === this.index ? 'cur' : '' }
                       rel={ index }>{ index + 1 }</li>;
          }.bind(this))
        }
      </ul>
    </div>;
  }
}

export default Banner;
