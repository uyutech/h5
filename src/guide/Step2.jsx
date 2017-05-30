/**
 * Created by army on 2017/4/21.
 */
 
let loading = false;

class Step2 extends migi.Component {
  constructor(...data) {
    super(...data);
    this.isShow = this.props.isShow;
    this.list = [
      {
        "tagId": 1,
        "tagName": "游戏1",
        "tagType": 0,
        "isDefaultFollowed": 0
      },
      {
        "tagId": 2,
        "tagName": "拉伸到福建省客服",
        "tagType": 0,
        "isDefaultFollowed": 0
      },
      {
        "tagId": 3,
        "tagName": "拉建省客服",
        "tagType": 0,
        "isDefaultFollowed": 0
      },
      {
        "tagId": 4,
        "tagName": "12",
        "tagType": 0,
        "isDefaultFollowed": 0
      },
      {
        "tagId": 5,
        "tagName": "sdsf",
        "tagType": 0,
        "isDefaultFollowed": 0
      },
      {
        "tagId": 6,
        "tagName": "阿斯顿飞",
        "tagType": 0,
        "isDefaultFollowed": 0
      },
      {
        "tagId": 7,
        "tagName": "阿斯顿",
        "tagType": 0,
        "isDefaultFollowed": 0
      }
    ];
    this.temp = this.list.slice();
    this.list = this.list.concat(this.temp);
    this.list = this.list.concat(this.temp);
    this.list = this.list.concat(this.temp);
    this.on(migi.Event.DOM, function() {
      this.$c = $(this.ref.c.element);
      let $list2 = this.$list2 = $(this.ref.list2.element);
      let $list = $(this.ref.list.element);
      // util.getJSON('tag/getSuggestTags.json', {
      //   uid: 1000,
      //   pageNum: 1,
      // }, function(res) {
      //   console.log(res);
      // });
      let $win = $(window);
      let winHeight = $win.height();
      let self = this;
      let last;
      $win.on('scroll', function() {
        let scrollTop = $win.scrollTop();
        let bodyHeight = $(document.body).height();
        if(scrollTop + winHeight > bodyHeight - 50) {
          self.loadMore();
        }
      });
      $list2.on('click', 'b', function(e) {
        let $b = $(this);
        let $li = $b.parent();
        if($li.hasClass('sel')) {
          let tagId = $li.attr('tagId');
          $list.find(`[tagId="${tagId}"]`).removeClass('sel');
          $li.addClass('fn-hidden');
          $li.addClass('remove');
        }
      });
      $list2.on('click', 'li', function(e) {
        let $li = $(this);
        if(e.target == this) {
          if(last) {
            last.removeClass('sel');
          }
          let tagId = $li.attr('tagId');
          $li.toggleClass('sel');
          last = $li;
        }
      });
      $(document.body).on('click', function(e) {
        var $o = $(e.target);
        if(!$o.closest('.choose')[0]) {
          if(last) {
            last.removeClass('sel');
          }
          last = null;
        }
      });
    });
  }
  @bind isShow
  @bind setDis = false
  get list() {
    return this._list || [];
  }
  @bind
  set list(v) {
    this._list = v;
  }
  click(e, vd, tvd) {
    let $li = $(tvd.element);
    let tagId = tvd.props.tagId;
    if($li.hasClass('sel')) {
      this.$list2.find(`[tagId="${tagId}"]`).remove();
    }
    else {
      this.$c.css('width', '999rem');
      let $new = $(`<li tagId="${tagId}">${tvd.children[0]}<b></b></li>`);
      this.$list2.append($new);
      this.$c.css('width', this.$list2.width() + 1);
      $new.css('width', $new.width() + 1);
    }
    $li.toggleClass('sel');
  }
  next(e, vd) {
    var $vd = $(vd.element);
    if(!$vd.hasClass('dis')) {
      this.setDis = true;
      this.emit('next');
    }
  }
  enable() {
    this.setDis = false;
  }
  show() {
    this.isShow = true;
  }
  hide() {
    this.isShow = false;
  }
  loadMore() {
    if(loading) {
      return;
    }
    loading = true;
    let self = this;
    util.getJSON('tag/getSuggestTags.json', {
      uid: 1000,
      pageNum: 1,
    }, function(res) {
      self.list = self.list.concat([
        {
          "tagId": 1,
          "tagName": "游戏1",
          "tagType": 0,
          "isDefaultFollowed": 0
        },
        {
          "tagId": 2,
          "tagName": "拉伸到福建省客服",
          "tagType": 0,
          "isDefaultFollowed": 0
        },
        {
          "tagId": 3,
          "tagName": "拉建省客服",
          "tagType": 0,
          "isDefaultFollowed": 0
        },
        {
          "tagId": 4,
          "tagName": "12",
          "tagType": 0,
          "isDefaultFollowed": 0
        },
        {
          "tagId": 5,
          "tagName": "sdsf",
          "tagType": 0,
          "isDefaultFollowed": 0
        },
        {
          "tagId": 6,
          "tagName": "阿斯顿飞",
          "tagType": 0,
          "isDefaultFollowed": 0
        },
        {
          "tagId": 7,
          "tagName": "阿斯顿",
          "tagType": 0,
          "isDefaultFollowed": 0
        }
      ]);
      loading = false;
    });
  }
  render() {
    return <div class={ 'step2' + (this.isShow ? '' : ' fn-hide') }>
      <img class="logo" src="src/guide/step2.jpg"/>
      <h2>请选择你感兴趣的圈子</h2>
      <h4>以便我们呈现更适合你的内容</h4>
      <div class="list" ref="list">
        <ul class="fn-clear" onClick={ { 'li': this.click } }>
          {
            this.list.map(function(item) {
              return <li tagId={ item.tagId }>{ item.tagName }</li>;
            }.bind(this))
          }
        </ul>
      </div>
      <div class="choose">
        <div class="lists">
          <div class="c" ref="c">
            <ul ref="list2"></ul>
          </div>
        </div>
        <button ref="next" class={ 'sub' + (this.setDis ? ' dis' : '') } onClick={ this.next }>我选好啦！</button>
      </div>
    </div>;
  }
}

export default Step2;
