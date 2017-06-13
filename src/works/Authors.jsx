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
            uid: 1,
            img: 'http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg',
            name: '司夏'
          },
          {
            uid: 2,
            img: 'http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg',
            name: '司夏2'
          }
        ]
      },
      {
        type: '出品2',
        list: [
          {
            uid: 3,
            img: 'http://tva4.sinaimg.cn/crop.7.1.129.129.180/64319a89gw1f62p9lp7hyj203w03wq2x.jpg',
            name: '老司机sdf'
          },
          {
            uid: 4,
            img: 'http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg',
            name: '司夏换行'
          }
        ]
      },
      {
        type: '很长的',
        list: [
          {
            uid: 5,
            img: 'http://tva4.sinaimg.cn/crop.7.1.129.129.180/64319a89gw1f62p9lp7hyj203w03wq2x.jpg',
            name: '老司机sddf'
          },
          {
            uid: 6,
            img: 'http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg',
            name: '司夏1'
          },
          {
            uid: 7,
            img: 'http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg',
            name: '司夏2'
          },
          {
            uid: 8,
            img: 'http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg',
            name: '司夏3'
          },
          {
            uid: 9,
            img: 'http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg',
            name: '司夏4长长长长'
          },
          {
            uid: 10,
            img: 'http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg',
            name: '司夏长长长长长长长'
          }
        ]
      }
    ];
    this.on(migi.Event.DOM, function() {
      let c = this.ref.c.element;
      let $c = this.$c = $(c);
      let temp = [];
      for(let i = 0, len = datas.length; i < len; i++) {
        let item = datas[i];
        // 屏蔽空的
        if(item.list.length) {
          temp.push(<li class="label"><div><span>{ item.type }</span></div></li>);
          for (let j = 0, len = item.list.length; j < len; j++) {
            let item2 = item.list[j];
            temp.push(<li class="item" uid={ item2.uid }>
              <img src={ item2.img }/>
              <span>{ item2.name }</span>
            </li>);
          }
        }
      }
      let placeholder = <li class="placeholder"/>;
      let ul = <ul class="fn-clear"/>;
      ul.appendTo(c);
      // 最初的2个
      if(temp[0]) {
        temp[0].appendTo(ul);
      }
      if(temp[1]) {
        temp[1].appendTo(ul);
      }
      let count = 0;
      // 循环后面挨个插入判断高度换行
      for(let i = 2, len = temp.length; i < len; i++) {
        let item = temp[i];
        let $ul = $(ul.element);
        let height = $ul.height();
        // 当是第3行时，尝试插入占位符，一旦产生换行，循环回退一次，同时占位符替代上一次的元素，因为占位符宽度最小所以不会产生影响
        if(count == 1) {
          placeholder.appendTo(ul);
          if($ul.height() > height) {
            i--;
            temp[i].clean();
            continue;
          }
        }
        // 标签类型连续插入2个测试是否需要换行
        if(item.props.class == 'label') {
          item.appendTo(ul);
          temp[i+1].appendTo(ul);
          //换行生成新的行
          if($ul.height() > height) {
            ul = <ul class="fn-clear"/>;
            ul.appendTo(c);
            item.appendTo(ul);
            count++;
          }
        }
        else {
          item.appendTo(ul);
          //换行生成新的行
          if($ul.height() > height) {
            ul = <ul class="fn-clear"/>;
            ul.appendTo(c);
            item.appendTo(ul);
            count++;
          }
        }
      }
      this.firstHeight = $(this.element).height();
      $(this.element).css('height', this.firstHeight);
    });
  }
  click(e, vd, tvd) {
    this.emit('choose', tvd.props.uid, e.pageX, e.pageY);
  }
  click2() {
    this.emit('chooseNone');
  }
  alt(e, vd) {
    let $b = $(vd.element);
    let $c = $(this.ref.c.element);
    let $root = $(this.element);
    if($b.hasClass('on')) {
      $root.css('height', this.firstHeight);
    }
    else if($root.height() < $c.height()) {
      $root.css('height', $c.height());
    }
    $b.toggleClass('on');
    $root.addClass('no_max');
  }
  render() {
    return <div class="authors">
      <div class="c" ref="c" onClick={ { 'li.item': this.click, 'li.label': this.click2 } }/>
      <b class="slide" onClick={ this.alt }/>
    </div>;
  }
}

export default Authors;
