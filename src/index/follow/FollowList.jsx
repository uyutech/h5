/**
 * Created by army on 2017/5/21.
 */

let isStart;
let isMove;
let startX;
let startY;

let hotAuthor = [
  {
    id: 0,
    img: 'http://bbs.xiguo.net/zq/zz/02.png',
    name: '司夏',
    vip: true
  },
  {
    id: 1,
    img: 'http://bbs.xiguo.net/zq/zz/01.jpg',
    name: '河图',
    vip: true
  },
  {
    id: 2,
    img: 'http://bbs.xiguo.net/zq/zz/03.png',
    name: '慕寒',
    vip: true
  },
  {
    id: 3,
    img: 'http://bbs.xiguo.net/zq/zz/07.jpg',
    name: '银临'
  },
  {
    id: 4,
    img: 'http://bbs.xiguo.net/zq/zz/04.jpg',
    name: '吾恩'
  },
  {
    id: 5,
    img: 'http://bbs.xiguo.net/zq/zz/06.jpg',
    name: '竹桑'
  },
  {
    id: 6,
    img: 'http://bbs.xiguo.net/zq/zz/05.jpg',
    name: '双笙'
  }
];

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
      
      let tags = this.ref.tags;
      let $tags = $(tags.element);
      let $tagsC = $tags.find('.c');
      let $tagsUl = $tagsC.find('ul');
      $tagsC.css('width', $tagsUl.width() + 1);
      
      let $ersLi = $ersUl.find('li');
      let $ersImg = $ersLi.find('img');
      let dx = ($ersLi.width() - $ersImg.width()) >> 1;
      $tagsC.css('padding-left', dx + 'px');
    });
  }
  start(e) {
    if(e.touches.length != 1) {
      isStart = false;
    }
    else {
      isStart = true;
      startX = e.touches[0].pageX;
      startY = e.touches[0].pageY;
      jsBridge.swipeRefresh(false);
    }
  }
  move(e) {
  }
  end() {
    jsBridge.swipeRefresh(true);
  }
  authorClick(e, vd, tvd) {
    e.preventDefault();
    let href = tvd.props.href;
    jsBridge.pushWindow(href, {
      showBack: true
    });
  }
  render() {
    return <div class="follow_list">
      <h3><span>关注列表</span></h3>
      <div class="tags" ref="tags" onTouchStart={ this.start } onTouchMove={ this.move } onTouchEnd={ this.end } onTouchCancel={ this.end }>
        <div class="c">
          <ul>
            <li>古风</li>
            <li>音乐</li>
            <li>阴阳师</li>
            <li>日漫</li>
            <li>小清新</li>
            <li>剑网3</li>
            <li>游戏</li>
          </ul>
        </div>
      </div>
      <div class="ers" ref="ers" onTouchStart={ this.start } onTouchMove={ this.move } onTouchEnd={ this.end } onTouchCancel={ this.end }>
        <div class="c">
          <ul onClick={ { a: this.authorClick } }>
            {
              hotAuthor.map(function(item) {
                return <li>
                  <a href="author.html?id=1">
                    <div class="pic">
                      <img src={ item.img }/>
                      { item.vip ? <b/> : '' }
                    </div>
                    <span>{ item.name }</span><b/>
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
