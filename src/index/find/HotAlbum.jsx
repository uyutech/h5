/**
 * Created by army on 2017/6/21.
 */

let isStart;
let startX;

class HotAlbum extends migi.Component {
  constructor(...data) {
    super(...data);
    this.list2 = this.props.list || [];
  }
  autoWidth() {
    this.$root = $(this.element);
    this.list = this.ref.list.element;
    this.$list = $(this.list);
    let $c = this.$list.find('.c');
    $c.width('css', '9999rem');
    let $ul = $c.find('ul');
    $c.css('width', $ul.width() + 1);
  }
  start(e) {
    if(e.touches.length != 1) {
      isStart = false;
    }
    else {
      isStart = true;
      startX = e.touches[0].pageX;
      this.$list.addClass('no_trans');
      this.$list.removeAttr('style');
      jsBridge.swipeRefresh(false);
    }
  }
  move(e) {
    if(isStart) {
      let x = e.touches[0].pageX;
      if(x > startX) {
        let left = this.list.scrollLeft;
        if(left == 0) {
          e.preventDefault();
          let diff = x - startX;
          this.$list.css('transform', `translate3d(${diff}px,0,0)`);
          this.$list.css('-webkit-transform', `translate3d(${diff}px,0,0)`);
        }
      }
    }
  }
  end(e) {
    this.$list.removeClass('no_trans');
    this.$list.removeAttr('style');
    jsBridge.swipeRefresh(true);
  }
  @bind list2
  render() {
    return <div class="hot_album">
      <h3>{ this.props.title }</h3>
      <div class="list" ref="list">
        <div class="c">
          <ul>
            {
              this.list2.map(function(item) {
                if(item.type == 'audio') {
                  return <li>
                    <div class="pic">
                      <div class="bg3"/>
                      <div class="bg2"/>
                      <div class="bg"/>
                      <div class="mask"/>
                      <div class="num"><b class="audio"/>66w</div>
                      <div class="ath">{ item.author }</div>
                    </div>
                    <p class="txt">名字</p>
                  </li>;
                }
                return <li>
                  <div class="pic">
                    <div class="bg3"/>
                    <div class="bg2"/>
                    <div class="bg"/>
                    <img src={ item.img }/>
                    <div class="mask"/>
                    <div class="num"><b class="video"/>{ item.num }</div>
                    <div class="ath">{ item.author }</div>
                  </div>
                  <p class="txt">{ item.name }</p>
                </li>;
              })
            }
          </ul>
        </div>
      </div>
    </div>;
  }
}

export default HotAlbum;
