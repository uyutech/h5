/**
 * Created by army on 2017/4/21.
 */
 
let loading = false;
let fromIndex = 0;
let limit = 30;

class Step2 extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.isShow = self.props.isShow;
    self.on(migi.Event.DOM, function() {
      self.$c = $(self.ref.c.element);
      let $list2 = self.$list2 = $(self.ref.list2.element);
      let $list = $(self.ref.list.element);
      let $win = $(window);
      let winHeight = $win.height();
      let last;
      $win.on('scroll', function() {
        if(self.isShow) {
          let scrollTop = $win.scrollTop();
          let bodyHeight = $(document.body).height();
          if (scrollTop + winHeight > bodyHeight - 50) {
            self.loadMore();
          }
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
          setTimeout(function() {
            $li.remove();
            self.autoWidth();
          }, 200);
        }
      });
      $list2.on('click', 'li', function(e) {
        let $li = $(this);
        if(e.target == this) {
          if($li.hasClass('sel')) {
            $li.removeClass('sel');
            last = null;
          }
          else {
            if (last) {
              last.removeClass('sel');
            }
            $li.toggleClass('sel');
            last = $li;
          }
        }
      });
      $(document.body).on('click', function(e) {
        let $o = $(e.target);
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
      this.add(tagId, tvd.children[0]);
    }
    this.autoWidth();
    $li.toggleClass('sel');
  }
  next(e, vd) {
    let self = this;
    let $vd = $(vd.element);
    if(!$vd.hasClass('dis')) {
      self.setDis = true;
      let tagIds = [];
      self.$list2.find('li').each(function(i, o) {
        tagIds.push(parseInt($(o).attr('tagId')));
      });
      util.getJSON('register/setFollowTagsOnRegister.json', {
        uid: 1000,
        tagIds: JSON.stringify(tagIds),
      }, function(res) {
        self.emit('next');
      }, function(res) {
        self.setDis = false;
        jsBridge.toast(res.message || '网络错误请稍后再试');
      });
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
  autoWidth() {
    this.$c.css('width', this.$list2.width() + 1);
  }
  loadMore() {
    if(loading) {
      return;
    }
    loading = true;
    let self = this;
    util.getJSON('tag/getSuggestTags.json', {
      uid: 1000,
      fromIndex,
      limit,
    }, function(res) {
      if(res.dataList && res.dataList.length) {
        self.list = self.list.concat(res.dataList);
        loading = false;
        fromIndex += limit;
        res.dataList.forEach(function(item) {
          if(item.isDefaultFollowed) {
            self.add(item.tagId, item.tagName);
            self.autoWidth();
          }
        });
      }
    });
  }
  add(tagId, txt) {
    this.$c.css('width', '999rem');
    let $new = $(`<li tagId="${tagId}">${txt}<b></b></li>`);
    this.$list2.append($new);
    $new.css('width', $new.width() + 1);
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
              if(item.isDefaultFollowed) {
                return <li tagId={ item.tagId } class="sel">{ item.tagName }</li>;
              }
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
