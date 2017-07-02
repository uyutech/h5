/**
 * Created by army on 2017/6/24.
 */

import HotWorks from '../index/find/HotWorks.jsx';
import HotAlbum from '../index/find/HotAlbum.jsx';
import HotAuthor from '../index/find/HotAuthor.jsx';
import Dynamic from '../component/dynamic/Dynamic.jsx';

let hotWorks = [
  {
    id: 1,
    img: 'http://bbs.xiguo.net/zq/zp/02.jpg',
    name: '机械之心',
    num: '66w'
  },
  {
    id: 2,
    img: 'http://bbs.xiguo.net/zq/zp/08.jpeg',
    name: '化鹤归',
    num: '60w'
  },
  {
    id: 3,
    img: 'http://bbs.xiguo.net/zq/zp/04.jpg',
    name: '送郎君',
    num: '48w'
  },
  {
    id: 4,
    img: 'http://bbs.xiguo.net/zq/zp/05.jpg',
    name: '千岁暖',
    num: '47w'
  },
  {
    id: 5,
    img: 'http://bbs.xiguo.net/zq/zp/06.jpg',
    name: '汐',
    num: '36w'
  },
  {
    id: 6,
    img: 'http://bbs.xiguo.net/zq/zp/03.jpg',
    name: '晴时雨时',
    num: '34w'
  }
];
let hotAlbum = [
  {
    id: 1,
    img: 'http://bbs.xiguo.net/zq/zj/z002.jpg',
    name: '漱愿记',
    num: '33w'
  }
];
let hotAuthor = [
  {
    id: 1,
    img: 'http://bbs.xiguo.net/zq/zz/01.jpg',
    name: '河图',
    info: '合作16次'
  },
  {
    id: 2,
    img: 'http://bbs.xiguo.net/zq/zz/03.png',
    name: '慕寒',
    info: '合作10次'
  },
  {
    id: 3,
    img: 'http://bbs.xiguo.net/zq/zz/07.jpg',
    name: '银临',
    info: '合作6次'
  },
  {
    id: 4,
    img: 'http://bbs.xiguo.net/zq/zz/04.jpg',
    name: '吾恩',
    info: '合作4次'
  },
  {
    id: 5,
    img: 'http://bbs.xiguo.net/zq/zz/06.jpg',
    name: '竹桑',
    info: '合作3次'
  },
  {
    id: 6,
    img: 'http://bbs.xiguo.net/zq/zz/05.jpg',
    name: '双笙',
    info: '合作1次'
  }
];

class Home extends migi.Component {
  constructor(...data) {
    super(...data);
    this.on(migi.Event.DOM, function() {
      this.ref.hotAlbum.autoWidth();
    });
  }
  show() {
    this.element.style.display = 'block';
  }
  hide() {
    this.element.style.display = 'none';
  }
  render() {
    return <div class="home">
      <HotWorks ref="hotWorks" list={ hotWorks }/>
      <HotAlbum ref="hotAlbum" list={ hotAlbum } title="专辑"/>
      <HotAuthor ref="hotAuthor" list={ hotAuthor } title="关系"/>
      <h5 class="dynamic">作者动态</h5>
      <Dynamic/>
    </div>;
  }
}

export default Home;
