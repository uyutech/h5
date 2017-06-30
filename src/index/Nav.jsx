/**
 * Created by army on 2017/6/11.
 */
 
class Nav extends migi.Component {
  constructor(...data) {
    super(...data);
    this.on(migi.Event.DOM, function() {
      let $window = $(window);
      let bg = this.ref.bg.element;
      $window.on('scroll', function() {
        let top = $window.scrollTop();
        let opacity = top / 100;
        if(opacity > 1) {
          opacity = 1;
        }
        bg.style.opacity = opacity;
      });
    });
  }
  render() {
    return <div class="nav">
      <div class="bg" ref="bg"/>
      <div class="form">
        <input type="text" placeholder="河图新歌发布"/>
      </div>
      <b class="comment"/>
      <b class="play"/>
    </div>;
  }
}

export default Nav;
