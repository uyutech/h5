/**
 * Created by army8735 on 2018/1/13.
 */

'use strict';

import net from '../../common/net';
import util from '../../common/util';

let WIDTH = $(window).width();
let isStart;
let isMove;
let sx;
let sy;
let dx;
let $c;
let $i1;
let $i2;
let $i3;
let loading;
let pos;

function setTransform(dx) {
  $c.css('-webkit-transform', `translate3d(${dx},0,0)`);
  $c.css('transform', `translate3d(${dx},0,0)`);
}
function clearTransform() {
  $c.css('-webkit-transform', 'none');
  $c.css('transform', 'none');
}

class ImageView extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.dataList = self.props.dataList || [];
    self.isLike = self.props.isLike;
    self.on(migi.Event.DOM, function() {
      let $window = $(window);
      $c = $(self.ref.c.element);
      $i1 = $(self.ref.i1.element);
      $i2 = $(self.ref.i2.element);
      $i3 = $(self.ref.i3.element);
      migi.eventBus.on('chooseImage', function(data) {
        let dataList = data.list || [];
        let index = parseInt(data.index) || 0;
        self.dataList = dataList;
        self.idx = index;
        $c.css('top', $window.scrollTop() + 'px');
        self.show();

        // 优先预览图
        self.setImg(index);
      });
    });
  }
  @bind dataList = []
  @bind idx
  @bind isLike
  show() {
    $(this.element).removeClass('fn-hide');
  }
  hide() {
    $(this.element).addClass('fn-hide');
  }
  isHide() {
    return  $(this.element).hasClass('fn-hide');
  }
  setImg(index) {
    let self = this;
    let dataList = self.dataList;
    let data = dataList[index];
    let url = util.autoSsl(data.FileUrl);
    if(data.loaded || !data.preview) {
      $i2.find('img').attr('src', url || '/src/common/blank.png');
    }
    else {
      $i2.find('img').attr('src', data.preview);
      self.loadImg(url, function(res) {
        if(res) {
          data.loaded = true;
          $i2.find('img').attr('src', url);
        }
      });
    }
    if(index) {
      if(dataList[index - 1].loaded || !dataList[index - 1].preview) {
        $i1.find('img').attr('src', dataList[index - 1].FileUrl || '/src/common/blank.png');
      }
      else {
        $i1.find('img').attr('src', dataList[index - 1].preview);
      }
    }
    else {
      $i1.find('img').attr('src', '/src/common/blank.png');
    }
    if(index < dataList.length - 1) {
      if(dataList[index + 1].loaded || !dataList[index + 1].preview) {
        $i3.find('img').attr('src', dataList[index + 1].FileUrl || '/src/common/blank.png');
      }
      else {
        $i3.find('img').attr('src', dataList[index + 1].preview);
      }
    }
    else {
      $i3.find('img').attr('src', '/src/common/blank.png');
    }
  }
  loadImg(url, cb) {
    if(!url) {
      return;
    }
    let img = document.createElement('img');
    img.style.position = 'absolute';
    img.style.left = '-9999rem;';
    img.style.top = '-9999rem';
    img.style.visibility = 'hidden';
    img.src = url;
    img.onload = function() {
      cb(true);
      document.body.removeChild(img);
    };
    img.onerror = function() {
      cb(false);
      document.body.removeChild(img);
    };
    document.body.appendChild(img);
  }
  start(e) {
    if(!loading && e.touches.length === 1) {
      isStart = true;
      sx = e.touches[0].pageX;
      sy = e.touches[0].pageY;
      $c.removeClass('transition');
      pos = [];
    }
  }
  move(e) {
    if(isMove) {
      e.preventDefault();
      let x = e.touches[0].pageX;
      dx = x - sx;
      setTransform(dx + 'px');
      pos.push({
        t: Date.now(),
        x,
      });
      if(pos.length > 2) {
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
        setTransform(dx + 'px');
        pos.push({
          t: Date.now(),
          x,
        });
        if(pos.length > 2) {
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
    isStart = isMove = false;
    let change = false;
    let i;
    if(dx < -WIDTH >> 1) {
      if(self.idx < self.dataList.length - 1) {
        change = true;
        i = ++self.idx;
      }
    }
    else if(dx > WIDTH >> 1) {
      if(self.idx) {
        change = true;
        i = --self.idx;
      }
    }
    else if(pos.length > 1 && Math.abs(dx) > 10) {
      let dt = Math.max(1, pos[1].t - pos[0].t);
      let dx2 = pos[1].x - pos[0].x;
      let rate = Math.abs(dx2) / dt;
      console.log(dt, dx2, rate);
    }
    if(change) {
      $c.addClass('transition');
      setTransform('100%');
      loading = true;
      setTimeout(function() {
        $c.removeClass('transition');
        clearTransform();
        self.setImg(i);
        loading = false;
      }, 200);
      return;
    }
    // if(dx < -WIDTH >> 1) {
    //   if(self.idx < self.dataList.length - 1) {
    //     self.idx++;
    //     let i = self.idx;
    //     $c.addClass('transition');
    //     setTransform('-100%');
    //     loading = true;
    //     setTimeout(function() {
    //       $c.removeClass('transition');
    //       clearTransform();
    //       self.setImg(i);
    //       loading = false;
    //     }, 200);
    //     return;
    //   }
    // }
    // else if(dx > WIDTH >> 1) {
    //   if(self.idx) {
    //     self.idx--;
    //     let i = self.idx;
    //     $c.addClass('transition');
    //     setTransform('100%');
    //     loading = true;
    //     setTimeout(function() {
    //       $c.removeClass('transition');
    //       clearTransform();
    //       self.setImg(i);
    //       loading = false;
    //     }, 200);
    //     return;
    //   }
    // }
    $c.addClass('transition');
    $c.css('-webkit-transform', 'none');
    $c.css('transform', 'none');
  }
  render() {
    return <div class="cp-imageview fn-hide">
      <div class="c" ref="c"
           onTouchStart={ this.start } onTouchMove={ this.move } onTouchEnd={ this.end } onTouchCancel={ this.end }>
        <div class="i1" ref="i1">
          <img src="/src/common/blank.png"/>
        </div>
        <div class="i2" ref="i2">
          <img src="/src/common/blank.png"/>
        </div>
        <div class="i3" ref="i3">
          <img src="/src/common/blank.png"/>
        </div>
      </div>
      <label>{ ((this.idx || 0) + 1) + '/' + this.dataList.length }</label>
      <b class="download" onClick={ this.clickDownload }/>
      <b class={ 'like' + (this.isLike ? ' has' : '') } onClick={ this.clickLike }/>
    </div>;
  }
}

export default ImageView;
