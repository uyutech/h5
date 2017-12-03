/**
 * Created by army on 2017/4/22.
 */

let loading = false;
let fromIndex = 0;
let limit = 20;

class Step3 extends migi.Component {
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
          let authorId = $li.attr('authorId');
          $list.find(`[authorId="${authorId}"]`).removeClass('sel');
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
        if(e.target.nodeName != 'B') {
          if(last) {
            last.removeClass('sel');
          }
          let authorId = $li.attr('authorId');
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
  show() {
    this.isShow = true;
  }
  hide() {
    this.isShow = false;
  }
  click(e, vd, tvd) {
    let $li = $(tvd.element);
    let authorId = tvd.props.authorId;
    if($li.hasClass('sel')) {
      this.$list2.find(`[authorId="${authorId}"]`).remove();
    }
    else {
      this.$c.css('width', '999rem');
      let src = $li.find('img').attr('src');
      let $new = $(`<li authorId="${authorId}"><img src="${src}"/><b></b></li>`);
      this.$list2.append($new);
      this.$c.css('width', this.$list2.width() + 1);
    }
    this.autoWidth();
    $li.toggleClass('sel');
  }
  next(e, vd) {
    let self = this;
    let $vd = $(vd.element);
    if(!$vd.hasClass('dis')) {
      self.setDis = true;
      let Tag_ID = [];
      self.$list2.find('li').each(function(i, o) {
        Tag_ID.push(parseInt($(o).attr('authorId')));
      });
      util.postJSON('api/Users/SaveAuthorToUser', {
        Tag_ID: Tag_ID.join(','),
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
  autoWidth() {
    this.$c.css('width', this.$list2.width() + 1);
  }
  loadMore() {
    if (loading) {
      return;
    }
    loading = true;
    let self = this;
    util.postJSON('api/Users/GetAuthor', {
      Skip: fromIndex,
      Take: limit,
    }, function(res) {
      if(res.success) {
        let data = res.data;
        self.list = self.list.concat(data.data);
        loading = false;
        fromIndex += limit;
        data.data.forEach(function(item) {
          if(item.isDefaultFollow) {
            self.add(item.ID, item.Tag_Pic);
            self.autoWidth();
          }
        });
      }
    });
  }
  add(authorId, headUrl) {
    this.$c.css('width', '999rem');
    let $new = $(`<li authorId="${authorId}"><img src="${headUrl}"/><b></b></li>`);
    this.$list2.append($new);
    $new.css('width', $new.width() + 1);
  }
  render() {
    return <div class={ 'step3' + (this.isShow ? '' : ' fn-hide') }>
      <img class="logo" src="src/guide/step2.jpg"/>
      <h2>这里有你喜欢的作者吗？</h2>
      <h4>没有也没关系，之后随时可以添加</h4>
      <ul class="list fn-clear" onClick={ { 'li': this.click } } ref="list">
        {
          this.list.map(function(item) {
            if(item.isDefaultFollow) {
              return <li authorId={ item.ID } class="sel"><img src={ item.Tag_Pic || '/src/common/blank.png' }/><span>{ item.Tag_Name }</span></li>;
            }
            return <li authorId={ item.ID }><img src={ item.Tag_Pic || 'src/common/blank.png' }/><span>{ item.Tag_Name }</span></li>;
          })
        }
      </ul>
      <div class="choose">
        <div class="lists">
          <div class="c" ref="c">
            <ul ref="list2"></ul>
          </div>
        </div>
        <button ref="next" class={ 'sub' + (this.setDis ? ' dis' : '') } onClick={ this.next }>我选好啦!</button>
      </div>
    </div>;
  }
}

export default Step3;
