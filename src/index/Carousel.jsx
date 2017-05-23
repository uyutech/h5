/**
 * Created by army on 2017/5/21.
 */

let screenWidth = window.screen.availWidth;
let itemWidth;
let isStart;
let startX;
let curX;
let lastX;

class Carousel extends migi.Component {
  constructor(...data) {
    super(...data);
    this.on(migi.Event.DOM, function() {
      let screen = this.ref.screen;
      let $screen = $(screen.element);
      let $ul = this.$ul = $screen.find('ul');
      let $lis = $ul.find('li');
      itemWidth = $lis.eq(0).width();
      $screen.css('-webkit-transform', `translateX(${(screenWidth - itemWidth) / 2}px)`);
      $screen.css('transform', `translateX(${(screenWidth - itemWidth) / 2}px)`);
      $lis.eq(0).addClass('cur');
    });
  }
  start(e) {
    if(e.touches.length != 1) {
      isStart = false;
    }
    else {
      isStart = true;
      startX = e.touches[0].pageX;
      this.$ul.addClass('no_trans');
    }
  }
  move(e) {
    if(isStart) {
      lastX = curX = e.touches[0].pageX;
      let diff = curX - startX;
      this.$ul.css('-webkit-transform', `translateX(${diff}px)`);
      this.$ul.css('transform', `translateX(${diff}px)`);
    }
  }
  end(e) {
    if(isStart) {
      isStart = false;
      console.log(curX);
      this.$ul.removeClass('no_trans');
    }
  }
  render() {
    return <div class="carousel">
      <div class="screen" ref="screen">
        <ul onTouchStart={ this.start } onTouchMove={ this.move } onTouchEnd={ this.end } onTouchCancel={ this.end }>
          <li><img src="http://mu1.sinaimg.cn/square.240/weiyinyue.music.sina.com.cn/wpp_cover/100397440.jpg"/></li>
          <li><img src="http://mu1.sinaimg.cn/square.240/weiyinyue.music.sina.com.cn/wpp_cover/100388475.jpg"/></li>
          <li><img src="http://mu1.sinaimg.cn/square.240/weiyinyue.music.sina.com.cn/wpp_cover/100222800.jpg"/></li>
          <li><img src="http://mu1.sinaimg.cn/square.240/weiyinyue.music.sina.com.cn/wpp_cover/100393706.jpg"/></li>
          <li><img src="http://mu1.sinaimg.cn/square.240/weiyinyue.music.sina.com.cn/wpp_cover/100388475.jpg"/></li>
        </ul>
      </div>
      <div class="tag">
        <ul>
          <li class="cur">1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
          <li>5</li>
        </ul>
      </div>
    </div>;
  }
}

export default Carousel;
