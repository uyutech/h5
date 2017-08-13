/**
 * Created by army on 2017/6/24.
 */

let choosed = {};
let choosedL1 = {};
let choosedL2 = {};

class Tags2 extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  clickL1(e, vd, tvd) {
    e.preventDefault();
    let $ul = $(vd.element);
    let $li = $(tvd.element);
    let i = tvd.props.rel;
    if($li.hasClass('on')) {
      choosedL1[i] = false;
    }
    else {
      choosedL1[i] = true;
    }
    $li.toggleClass('on');
    let list = [];
    // 都没选为全部
    if(!$ul.find('.on')[0]) {
      this.tagList.forEach(function (item) {
        if(item.v && item.v.length) {
          list = list.concat(item.v);
        }
      });
    }
    else {
      this.tagList.forEach(function (item, i) {
        if(choosedL1[i] && item.v && item.v.length) {
          list = list.concat(item.v);
        }
      });
    }
    // 和上次没变化不改变
    let hasChange = false;
    if(list.length != this.tagList2.length) {
      hasChange = true;
    }
    else {
      for(let i = 0, len = list.length; i < len; i++) {
        if(list[i].ID != this.tagList2[i].ID) {
          hasChange = true;
          break;
        }
      }
    }
    if(hasChange) {
      this.tagList2 = list;
    }
  }
  clickL2(e, vd, tvd) {
    e.preventDefault();
    $(tvd.element).toggleClass('on');
  }
  autoWidth() {
    let $li = $(this.ref.l1.element);
    let $c = $li.find('.c');
    $c.css('width', '9999rem');
    let $ul = $c.find('ul');
    $c.css('width', $ul.width() + 1);
    this.autoWidth2();
  }
  autoWidth2() {
    let $li = $(this.ref.l2.element);
    let $c = $li.find('.c');
    $c.css('width', '9999rem');
    let $ul = $c.find('ul');
    $c.css('width', $ul.width() + 1);
  }
  get tagList() {
    return this._tagList || [];
  }
  @bind
  set tagList(v) {
    this._tagList = v;
    let list = [];
    v.forEach(function(item) {
      if(item.v && item.v.length) {
        list = list.concat(item.v);
      }
    });
    this.tagList2 = list;
  }
  get tagList2() {
    return this._tagList2 || [];
  }
  @bind
  set tagList2(v) {
    this._tagList2 = v;
    let param = v.map(function(item) {
      return {
        ID: item.ID,
        TagType: item.TagType
      };
    });
    util.postJSON('api/author/SearchWorks', { AuthorID: this.props.authorId, Parameter: JSON.stringify(param), Skip: 1, Take: 10 }, function (res) {

    });
  }
  render() {
    return <div class="tags">
      <div class="l1" ref="l1" onClick={ { li: this.clickL1 } }>
        <div class="c">
          <ul>
            {
              this.tagList.map(function(item, i) {
                return <li rel={ i }><a href="#"><span>{ item.k }</span></a></li>;
              })
            }
          </ul>
        </div>
      </div>
      <div class="l2" ref="l2" onClick={ { li: this.clickL2 } }>
        <div class="c">
          <ul>
            {
              this.tagList2.map(function(item) {
                return <li tagType={ item.TagType } id={ item.ID }><a href="#"><span>{ item.TagName }</span></a></li>;
              })
            }
          </ul>
        </div>
      </div>
    </div>;
  }
}

export default Tags2;
