/**
 * Created by army on 2017/6/8.
 */
 
class Authors extends migi.Component {
  constructor(...data) {
    super(...data);
    let datas = [
      {
        type: '演唱',
        list: [
          {
            uid: 1,
            img: 'http://bbs.xiguo.net/zq/zz/02.png',
            name: '司夏'
          }
        ]
      },
      {
        type: '作词',
        list: [
          {
            uid: 3,
            img: 'http://bbs.xiguo.net/zq/zz/01.jpg',
            name: '沈行之'
          }
        ]
      },
      {
        type: '混音',
        list: [
          {
            uid: 5,
            img: 'http://bbs.xiguo.net/zq/zz/07.jpg',
            name: '少年E'
          }
        ]
      },
      {
        type: '视频',
        list: [
          {
            uid: 5,
            img: 'http://bbs.xiguo.net/zq/zz/03.png',
            name: '尉晓'
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
      // 最初的2个，label+用户
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
        // 当是第2行时，尝试插入占位符，一旦产生换行，循环回退一次，同时占位符替代上一次的元素，因为占位符宽度最小所以不会产生影响
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
          i++;
          temp[i].appendTo(ul);
          //换行生成新的行
          if($ul.height() > height) {
            ul = <ul class="fn-clear"/>;
            ul.appendTo(c);
            item.appendTo(ul);
            temp[i].appendTo(ul);
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
      placeholder.clean();
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
