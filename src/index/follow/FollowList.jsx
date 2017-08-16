/**
 * Created by army on 2017/5/21.
 */

let isStart;
let isMove;
let startX;
let startY;

class FollowList extends migi.Component {
  constructor(...data) {
    super(...data);
    this.on(migi.Event.DOM, function() {
      let ers = this.ref.ers;
      let $ers = $(ers.element);
      let $ersC = $ers.find('.c');
      let $ersUl = $ersC.find('ul');
      let perWidth = Math.round($ers.width() / 4.5);
      let style = document.createElement('style');
      style.innerText = `.follow_list .ers ul li{width:${perWidth}px}`;
      document.head.appendChild(style);
      $ersC.css('width', $ersUl.width() + 1);
    });
  }
  start(e) {
    // if(e.touches.length != 1) {
    //   isStart = false;
    // }
    // else {
    //   isStart = true;
    //   startX = e.touches[0].pageX;
    //   startY = e.touches[0].pageY;
    // }
  }
  move(e) {
    // if(isMove) {}
    // else if(isStart) {
    //   isMove = true;
    //   let x = e.touches[0].pageX;
    //   let y = e.touches[0].pageY;console.log(y + ':' + startY);
    //   if(y < startY && Math.abs(y - startY) > Math.abs(x - startX)) {
    //     jsBridge.swipeRefresh($(window).scrollTop() === 0);
    //   }
    //   else {
    //     jsBridge.swipeRefresh(false);
    //   }
    // }
  }
  end() {
    // isStart = isMove = false;
  }
  authorClick(e, vd, tvd) {
    e.preventDefault();
    let href = tvd.props.href;
    jsBridge.pushWindow(href, {
      transparentTitle: true
    });
  }
  get list1() {
    return this._list1 || [];
  }
  @bind
  set list1(v) {
    this._list1 = v;
    let $tags = $(this.ref.tags.element);
    let $tagsC = $tags.find('.c');
    $tagsC.css('width', '9999rem');
  }
  autoWidth1() {
    let $tags = $(this.ref.tags.element);
    let $tagsC = $tags.find('.c');
    let $tagsUl = $tagsC.find('ul');
    $tagsC.css('width', $tagsUl.width() + 1);
  }
  get list2() {
    return this._list2 || [];
  }
  @bind
  set list2(v) {
    this._list2 = v;
    let $ers = $(this.ref.ers.element);
    let $ersC = $ers.find('.c');
    $ersC.css('width', '9999rem');
  }
  autoWidth2() {
    let $ers = $(this.ref.ers.element);
    let $ersC = $ers.find('.c');
    let $ersUl = $ersC.find('ul');
    $ersC.css('width', $ersUl.width() + 1);
  }
  render() {
    return <div class="follow_list">
      <h3><span>关注列表</span></h3>
      <div class="tags" ref="tags">
        <div class="c">
          <ul>
            {
              this.list1.map(function(item) {
                return <li>{ item.Tag_Name }</li>;
              })
            }
          </ul>
        </div>
      </div>
      <div class="ers" ref="ers">
        <div class="c">
          <ul onClick={ { a: this.authorClick } }>
            {
              this.list2.map(function(item) {
                return <li>
                  <a href={ `author.html?id=${item.ID}` }>
                    <div class="pic">
                      <img src={ item.Tag_Pic || 'src/common/blank.png' }/>
                      { item.vip ? <b/> : '' }
                    </div>
                    <span>{ item.Tag_Name }</span><b/>
                  </a>
                </li>;
              })
            }
          </ul>
        </div>
      </div>
    </div>;
  }
}

export default FollowList;
