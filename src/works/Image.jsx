/**
 * Created by army on 2017/6/12.
 */
 
class Image extends migi.Component {
  constructor(...data) {
    super(...data);
    let datas = [
      'http://mu1.sinaimg.cn/square.240/weiyinyue.music.sina.com.cn/wpp_cover/100388475.jpg',
      'http://mu1.sinaimg.cn/square.240/weiyinyue.music.sina.com.cn/wpp_cover/100222800.jpg',
      'http://mu1.sinaimg.cn/square.240/weiyinyue.music.sina.com.cn/wpp_cover/100393706.jpg'
    ];
    this.on(migi.Event.DOM, function() {
      let $list = $(this.ref.list.element);
      let imgs = this.ref.imgs;
      let $imgs = $list.find('.imgs');
      let height = Math.floor($imgs.height());
      datas.forEach(function(item) {
        let img = <img src={ item } style={ `width:${height}px` }/>;
        img.appendTo(imgs);
      });
      console.log($imgs.width(), height, datas.length, (height + 2) * datas.length);
      $list.css('width', (height + 2) * datas.length + 2);
    });
  }
  render() {
    return <div class="image">
      <div class="list" ref="list">
        <div class="imgs" ref="imgs">
        </div>
      </div>
    </div>;
  }
}

export default Image;
