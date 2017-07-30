/**
 * Created by army on 2017/6/18.
 */
 
import Banner from './Banner.jsx';
import Tags from './Tags.jsx';
import HotWorks from './HotWorks.jsx';
import HotAlbum from './HotAlbum.jsx';
import HotAuthor from './HotAuthor.jsx';
import PlayList from '../../component/playlist/PlayList.jsx';

let first = true;

let hotWorks = [
  {
    id: 1,
    img: 'http://bbs.xiguo.net/zq/zp/07.jpeg',
    name: '前前前世',
    num: '66w',
    author: '司夏'
  },
  {
    id: 2,
    img: 'http://bbs.xiguo.net/zq/zp/m01.jpg',
    name: '一生',
    num: '60w',
    author: '慕寒'
  },
  {
    id: 3,
    img: 'http://bbs.xiguo.net/zq/zp/y01.jpg',
    name: '山海侧',
    num: '48w',
    author: '银临'
  },
  {
    id: 4,
    img: 'http://bbs.xiguo.net/zq/zp/05.jpg',
    name: '千岁暖',
    num: '47w',
    author: '司夏'
  },
  {
    id: 5,
    img: 'http://bbs.xiguo.net/zq/zp/z04.jpg',
    name: '九曜',
    num: '36w',
    author: '慕寒'
  },
  {
    id: 6,
    img: 'http://bbs.xiguo.net/zq/zp/03.jpg',
    name: '晴时雨时',
    num: '34w',
    author: '司夏'
  }
];
let hotAlbum = [
  {
    id: 1,
    img: 'http://bbs.xiguo.net/zq/zj/z001.jpeg',
    name: '倾尽天下',
    num: '250w',
    author: '河图'
  },
  {
    id: 2,
    img: 'http://bbs.xiguo.net/zq/zj/z03.jpeg',
    name: '夏花秋实',
    num: '121w',
    author: '五色石南叶'
  },
  {
    id: 3,
    img: 'http://bbs.xiguo.net/zq/zj/z05.jpeg',
    name: '人间词话',
    num: '55w',
    author: '汐音社'
  },
  {
    id: 4,
    img: 'http://bbs.xiguo.net/zq/zj/z002.jpg',
    name: '漱愿记',
    num: '33w',
    author: '司夏'
  },
  {
    id: 5,
    img: 'http://bbs.xiguo.net/zq/zj/z04.jpeg',
    name: '千里丹心',
    num: '15w',
    author: '汐音社'
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

class FindCard extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  show() {
    $(this.element).show();
    if(first) {
      first = false;
      this.ref.tags.autoWidth();
      this.ref.hotWorks.autoWidth();
      this.ref.hotAlbum.autoWidth();
      this.ref.hotAuthor.autoWidth();
    }
  }
  hide() {
    $(this.element).hide();
  }
  render() {
    return <div class="find_card">
      <Banner/>
      <Tags ref="tags"/>
      <HotWorks ref="hotWorks" list={ hotWorks }/>
      <HotAlbum ref="hotAlbum" list={ hotAlbum } title="热门专辑"/>
      <HotAuthor ref="hotAuthor" list={ hotAuthor } title="热门作者"/>
      <PlayList/>
    </div>;
  }
}

export default FindCard;
