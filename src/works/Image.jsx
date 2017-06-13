/**
 * Created by army on 2017/6/12.
 */
 
class Image extends migi.Component {
  constructor(...data) {
    super(...data);
    let datas = this.props.images;
    this.on(migi.Event.DOM, function() {
      let $list = $(this.ref.list.element);
      let imgs = this.ref.imgs;
      let $imgs = $list.find('.imgs');
      let height = Math.floor($imgs.height());
      datas.forEach(function(item, i) {
        let img = <img index={ i } src={ item } style={ `width:${height}px` }/>;
        img.appendTo(imgs);
      });
      $list.css('width', (height + 2) * datas.length + 2);
    });
  }
  click(e, vd, tvd) {
    this.emit('show', tvd.props.index);
  }
  render() {
    return <div class="image">
      <div class="list" ref="list">
        <div class="imgs" ref="imgs" onClick={ { img: this.click } }/>
      </div>
    </div>;
  }
}

export default Image;
