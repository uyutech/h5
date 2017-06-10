/**
 * Created by army on 2017/6/8.
 */
 
class Authors extends migi.Component {
  constructor(...data) {
    super(...data);
    let datas = [
      {
        type: '出品',
        list: [
          {
            img: 'http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg',
            name: '司夏'
          },
          {
            img: 'http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg',
            name: '司夏2'
          }
        ]
      },
      {
        type: '出品2',
        list: [
          {
            img: 'http://tva4.sinaimg.cn/crop.7.1.129.129.180/64319a89gw1f62p9lp7hyj203w03wq2x.jpg',
            name: '老司机sdf'
          },
          {
            img: 'http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg',
            name: '司夏换行'
          }
        ]
      },
      {
        type: '很长的',
        list: [
          {
            img: 'http://tva4.sinaimg.cn/crop.7.1.129.129.180/64319a89gw1f62p9lp7hyj203w03wq2x.jpg',
            name: '老司机sddf'
          },
          {
            img: 'http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg',
            name: '司夏1'
          },
          {
            img: 'http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg',
            name: '司夏2'
          },
          {
            img: 'http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg',
            name: '司夏3'
          },
          {
            img: 'http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg',
            name: '司夏4'
          },
          {
            img: 'http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg',
            name: '司夏长长长长长长长'
          }
        ]
      }
    ];
    this.on(migi.Event.DOM, function() {
      let c = this.ref.c.element;
      let $c = $(c);
      let temp = [];
      for(let i = 0, len = datas.length; i < len; i++) {
        let item = datas[i];
        // 屏蔽空的
        if(item.list.length) {
          temp.push(<li class="label"><div><span>{ item.type }</span></div></li>);
          for (let j = 0, len = item.list.length; j < len; j++) {
            let item2 = item.list[j];
            temp.push(<li class="item">
              <img src={ item2.img }/>
              <span>{ item2.name }</span>
            </li>);
          }
        }
      }
      let ul = <ul class="fn-clear"></ul>;
      ul.appendTo(c);
      // 最初的2个
      if(temp[0]) {
        temp[0].appendTo(ul);
      }
      if(temp[1]) {
        temp[1].appendTo(ul);
      }
      // 循环后面挨个插入判断高度换行
      for(let i = 2, len = temp.length; i < len; i++) {
        let item = temp[i];
        let $ul = $(ul.element);
        let height = $ul.height();
        // 标签类型连续插入2个测试是否需要换行
        if(item.props.class == 'label') {
          item.appendTo(ul);
          temp[i+1].appendTo(ul);
          //换行生成新的行
          if($ul.height() > height) {
            ul = <ul class="fn-clear"></ul>;
            ul.appendTo(c);
            item.appendTo(ul);
          }
        }
        else {
          item.appendTo(ul);
          //换行生成新的行
          if($ul.height() > height) {
            ul = <ul class="fn-clear"></ul>;
            ul.appendTo(c);
            item.appendTo(ul);
          }
        }
      }
    });
  }
  render() {
    return <div class="authors">
      <div class="c" ref="c">
      </div>
    </div>;
  }
}

export default Authors;
