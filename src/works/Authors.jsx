/**
 * Created by army on 2017/6/8.
 */

import authorTemplate from '../component/author/authorTemplate';

class Authors extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  setAuthor(authorList) {
    let self = this;
    let c = self.ref.c.element;
    let $c = $(c);
    $c.html('');
    let count = -1;
    let placeholder = <li class="placeholder"/>;
    let ul;
    let $ul;
    let temp;
    authorList.forEach(function(authors) {
      ul = <ul class="fn-clear"/>;
      count++;
      temp = [];
      for(let i = 0, len = authors.length; i < len; i++) {
        let item = authors[i];
        temp.push(<li class="label"><span>{ authorTemplate(item.type).name }</span></li>);
        for(let j = 0, len = item.list.length; j < len; j++) {
          let item2 = item.list[j];
          temp.push(<li class="item" uid={ item2.ID }>{ item2.AuthName }</li>);
        }
      }
      ul.appendTo(c);
      // 最初的2个，label和用户
      if(temp[0]) {
        temp[0].appendTo(ul);
      }
      if(temp[1]) {
        temp[1].appendTo(ul);
      }
      // 当是第1行时，先插入占位符
      if(count == 0) {
        placeholder.appendTo(ul);
      }
      // 循环后面挨个插入判断高度换行
      for(let i = 2, len = temp.length; i < len; i++) {
        let item = temp[i];
        $ul = $(ul.element);
        let height = $ul.height();
        // 标签类型，连续插入第2个非标签作者，再测试是否需要换行
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
            // 当是第2行时，先插入占位符
            if(count == 1) {
              placeholder.appendTo(ul);
            }
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
            // 当是第2行时，先插入占位符
            if(count == 1) {
              placeholder.appendTo(ul);
            }
          }
        }
      }
    });
    // 最后一行且超过2行时，插入占位符判断是否需要换行
    if(count > 1) {
      let height = $ul.height();
      placeholder.appendTo(ul);
      if($ul.height() > height) {
        let last = temp[temp.length - 1];
        let last2 = temp[temp.length - 2];
        ul = <ul class="fn-clear"/>;
        ul.appendTo(c);
        if(last2.props.class == 'label') {
          last2.appendTo(ul);
          last.appendTo(ul);
        }
        else {
          last.appendTo(ul);
        }
      }
    }
    placeholder.clean();
    $(self.element).css('height', 'auto');
    self.firstHeight = $(self.element).height();
    $(self.element).css('height', self.firstHeight);
    if(count > 1) {
      let $slide = $(self.ref.slide.element);
      $slide.removeClass('fn-hide');
    }
  }
  click(e, vd, tvd) {
    location.href = 'author.html?id=' + tvd.props.uid;
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
      <div class="c" ref="c" onClick={ { 'li.item': this.click } }/>
      <b class="slide fn-hide" ref="slide" onClick={ this.alt }/>
    </div>;
  }
}

export default Authors;
