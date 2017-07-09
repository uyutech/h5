/**
 * Created by army on 2017/7/1.
 */
 
let data = [
  {
    pic: 'http://bbs.xiguo.net/zq/zp/07.jpeg',
    name: '前前前世',
    intro: '《你的名字》主题曲中文版',
    type: ['video', 'audio']
  },
  {
    pic: 'http://bbs.xiguo.net/zq/zp/02.jpg',
    name: '机械之心',
    intro: '《失落的机械城2》',
    type: ['video', 'audio']
  },
  {
    pic: 'http://bbs.xiguo.net/zq/zp/01.jpg',
    name: '明月舟(with 慕寒)',
    intro: '《浮生六记》',
    type: ['audio']
  },
  {
    pic: 'http://bbs.xiguo.net/zq/zp/03.jpg',
    name: '晴时雨时',
    intro: '',
    type: ['video']
  },
  {
    pic: 'http://bbs.xiguo.net/zq/zp/04.jpg',
    name: '送郎君',
    intro: '',
    type: ['audio']
  }
];

class PlayList extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  switchType(e, vd) {
    let $ul = $(vd.element);
    $ul.toggleClass('alt');
    $ul.find('li').toggleClass('cur');
  }
  click(e, vd, tvd) {
    jsBridge.pushWindow('works.html');
  }
  render() {
    return <div class="cp_playlist">
      <div class="bar">
        <ul class="btn fn-clear">
          <li class="all">播放全部</li>
          <li class="audio"></li>
          <li class="video"></li>
        </ul>
        <ul class="type fn-clear" onClick={ this.switchType }>
          <li class="cur"><span>最热</span></li>
          <li><span>最新</span></li>
        </ul>
      </div>
      <ul class="list" onClick={ { '.pic': this.click, '.txt': this.click } }>
        {
          data.map(function(item) {
            return <li>
              <div class="pic">
                <img src={ item.pic }/>
              </div>
              <div class="txt">
                <div class="name">{ item.name }</div>
                <p class="intro">{ item.intro }</p>
              </div>
              {
                item.type.map(function(item2) {
                  return <b class={ item2 }/>;
                })
              }
            </li>;
          })
        }
      </ul>
    </div>;
  }
}

export default PlayList;
