/**
 * Created by army on 2017/6/13.
 */
 
let winWidth = $(window).width();

class ImageView extends migi.Component {
  constructor(...data) {
    super(...data);
    let datas = this.props.images;
    this.length = datas.length;
    this.on(migi.Event.DOM, function() {
      let list = this.ref.list.element;
      let $list = this.$list = $(list);
      datas.forEach(function(item, i) {
        let img = <img index={ i } src={ item } style={ `width:${winWidth}px;height:${winWidth}px` }/>;
        img.appendTo(list);
      });
    });
  }
  @bind index = 0
  @bind length = 0
  start(e) {
    e.preventDefault();
  }
  left() {
    if(this.index < this.length - 1) {
      this.index++;
      this.$list.css('-webkit-transform', `translate3d(-${this.index*winWidth}px,0,0)`);
      this.$list.css('transform', `translate3d(-${this.index*winWidth}px,0,0)`);
    }
  }
  right() {
    if(this.index > 0) {
      this.index--;
      this.$list.css('-webkit-transform', `translate3d(-${this.index*winWidth}px,0,0)`);
      this.$list.css('transform', `translate3d(-${this.index*winWidth}px,0,0)`);
    }
  }
  show(i) {
    this.index = i;
    this.$list.css('-webkit-transform', `translate3d(-${this.index*winWidth}px,0,0)`);
    this.$list.css('transform', `translate3d(-${this.index*winWidth}px,0,0)`);
    $(this.element).show();
  }
  click() {
    $(this.element).hide();
  }
  render() {
    return <div class="image_view" onTouchStart={ this.start } onSwipeLeft={ this.left } onSwipeRight={ this.right } onClick={ this.click }>
      <div class="num">{ this.index + 1}/{ this.length }</div>
      <div class="list fn-clear" ref="list" style={ `width:${this.length}00%;` }/>
    </div>;
  }
}

export default ImageView;
