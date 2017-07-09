/**
 * Created by army on 2017/7/2.
 */

let list = [
  {
    imgs: [
      'http://bbs.xiguo.net/zq/zz/03.png',
      'http://bbs.xiguo.net/zq/zz/02.png'
    ],
    pic: 'http://bbs.xiguo.net/zq/zp/01.jpg',
    names: ['慕寒', '司夏'],
    time: '1小时前',
    type: 'song',
    action: '发布了歌曲',
    song: '《明月舟》'
  },
  {
    imgs: [
      'http://bbs.xiguo.net/zq/zz/02.png'
    ],
    pic: 'http://bbs.xiguo.net/zq/zp/04.jpg',
    names: ['司夏'],
    time: '1天前',
    type: 'song',
    action: '发布了歌曲',
    song: '《送郎君》'
  },
  {
    imgs: [
      'http://bbs.xiguo.net/zq/zz/01.jpg'
    ],
    pic: 'http://bbs.xiguo.net/zq/zp/04.jpg',
    names: ['河图'],
    time: '3天前',
    type: 'weibo',
    action: '发布了微博',
    txt: '加油，天下都是你和我的'
  }
];

class Dynamics extends migi.Component {
  constructor(...data) {
    super(...data);
    this.list = this.props.list;
  }
  render() {
    return <div class="cp_dynamic">
      <ul>
        {
          this.list.map(function(item) {
            let info;
            let preview;
            if(item.type == 'song') {
              info = <p class="info"><b class="zq"/>{ item.action }<a href="#">{ item.song }</a></p>;
              preview = <div class="preview">
                <img src={ item.pic }/>
              </div>;
            }
            else if(item.type == 'weibo') {
              info = <p class="info"><b class="wb"/>{ item.action }<a href="#">{ item.txt }</a></p>
            }
            return <li>
              <div class="con">
                <div class="user">
                  <div class={ `head n${item.imgs.length} fn-clear` }>
                    {
                      item.imgs.map(function(item2) {
                        return <img src={ item2 }/>;
                      })
                    }
                  </div>
                  <div class="name">
                    <p>{ item.names.join('、')}</p>
                    <small>{ item.time }</small>
                  </div>
                </div>
                { info }
              </div>
              { preview }
            </li>;
          })
        }
      </ul>
    </div>;
  }
}

export default Dynamics;
