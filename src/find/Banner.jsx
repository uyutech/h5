/**
 * Created by army8735 on 2017/11/30.
 */

'use strict';

import util from '../common/util';

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
    self.list = self.props.list || [];
    self.index = 0;
    self.on(migi.Event.DOM, function() {
      WIDTH = screen.availWidth;
      self.addInterval();
    });
  }
  @bind list
  @bind index
  setData(data) {
    this.list = data || [];
  }
  clickTag(e, vd, tvd) {
    this.index = tvd.props.rel;
    this.setOffset(Math.floor(this.index * WIDTH));
    this.addInterval();
  }
  setOffset(x) {
    let $list = $(this.ref.list.element);
    $list.css('-moz-transform', 'translateX(-' + x + 'px)');
    $list.css('-webkit-transform', 'translateX(-' + x + 'px)');
    $list.css('transform', 'translateX(-' + x + 'px)');
  }
  addInterval() {
    let self = this;
    if(self.interval) {
      clearInterval(self.interval);
    }
    self.interval = setInterval(function() {
      self.index++;
      if(self.index >= self.list.length) {
        self.index = 0;
      }
      self.setOffset(self.index * WIDTH);
    }, 3000);
  }
  left() {
    this.index++;
    if(this.index >= this.list.length) {
      this.index = this.list.length - 1;
    }
    this.setOffset(Math.floor(this.index * WIDTH));
    this.addInterval();
  }
  right() {
    this.index--;
    if(this.index < 0) {
      this.index = 0;
    }
    this.setOffset(Math.floor(this.index * WIDTH));
    this.addInterval();
  }
  click(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    let title = tvd.props.title;
    switch(tvd.props.class) {
      case 'works':
        jsBridge.pushWindow(url, {
          title,
          transparentTitle: true,
        });
        break;
      case 'author':
        util.openAuthor({
          url,
          title,
        });
        break;
      default:
        jsBridge.pushWindow(url, {
          title,
        });
        break;
    }
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
  render() {
    return <div class={ 'mod-banner' + (this.list.length ? '' : ' fn-hide') }
                onTouchStart={ this.start }
                onTouchMove={ this.move }
                onTouchEnd={ this.end }
                onTouchCancel={ this.end }
                onClick={ { a: this.click } }>
      <ul class="list"
          ref="list"
          style={ 'width:' + Math.max(1, this.list.length) * 100 + '%' }>
        {
          this.list.map(function(item) {
            let url = '';
            switch(item.type) {
              case 1:
                url = '/works.html?id=' + item.targetId;
                break;
              case 2:
                url = '/author.html?id=' + item.targetId;
                break;
              case 3:
                url = '/user.html?id=' + item.targetId;
                break;
              case 4:
                url = '/post.html?id=' + item.targetId;
                break;
            }
            return <li>
              <a href={ url }
                 title={ item.title }>
                <img src={ util.autoSsl(util.img750__80(item.pic)) || '/src/common/blank.png' }/>
              </a>
            </li>;
          })
        }
      </ul>
      <ul class="tags"
          ref="tags"
          onClick={ { li: this.clickTag } }>
        {
          (this.index, this.list).map((item, index) => {
            return <li class={ index === this.index ? 'cur' : '' }
                       rel={ index }>{ index + 1 }</li>;
          })
        }
      </ul>
    </div>;
  }
}

export default Banner;
