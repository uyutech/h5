/**
 * Created by army on 2017/4/22.
 */

let loading = false;

class Step3 extends migi.Component {
  constructor(...data) {
    super(...data);
    this.isShow = this.props.isShow;
    this.list = [
      {
        "authorId": 1,
        "authorName": "asdf",
        "headUrl": "http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg",
        "isDefaultFollow": 1
      },
      {
        "authorId": 2,
        "authorName": "f是发送发送",
        "headUrl": "http://tva4.sinaimg.cn/crop.7.1.129.129.180/64319a89gw1f62p9lp7hyj203w03wq2x.jpg",
        "isDefaultFollow": 1
      },
      {
        "authorId": 3,
        "authorName": "了交水电费",
        "headUrl": "http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg",
        "isDefaultFollow": 1
      },
      {
        "authorId": 4,
        "authorName": "路上看到烦",
        "headUrl": "http://tva4.sinaimg.cn/crop.7.1.129.129.180/64319a89gw1f62p9lp7hyj203w03wq2x.jpg",
        "isDefaultFollow": 1
      },
      {
        "authorId": 5,
        "authorName": "心随风动",
        "headUrl": "http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg",
        "isDefaultFollow": 1
      },
      {
        "authorId": 6,
        "authorName": "234234",
        "headUrl": "http://tva4.sinaimg.cn/crop.7.1.129.129.180/64319a89gw1f62p9lp7hyj203w03wq2x.jpg",
        "isDefaultFollow": 1
      },
      {
        "authorId": 7,
        "authorName": "是的发顺丰",
        "headUrl": "http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg",
        "isDefaultFollow": 1
      },
      {
        "authorId": 8,
        "authorName": "斯蒂芬斯蒂芬",
        "headUrl": "http://tva4.sinaimg.cn/crop.7.1.129.129.180/64319a89gw1f62p9lp7hyj203w03wq2x.jpg",
        "isDefaultFollow": 1
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
      let $win = $(window);
      let winHeight = $win.height();
      let self = this;
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
    var $li = $(tvd.element);
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
    var $vd = $(vd.element);
    if(!$vd.hasClass('dis')) {
      this.setDis = true;
      this.emit('next');
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
    self.list = self.list.concat([
      {
        "authorId": 1,
        "authorName": "asdf",
        "headUrl": "http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg",
        "isDefaultFollow": 1
      },
      {
        "authorId": 2,
        "authorName": "f是发送发送",
        "headUrl": "http://tva4.sinaimg.cn/crop.7.1.129.129.180/64319a89gw1f62p9lp7hyj203w03wq2x.jpg",
        "isDefaultFollow": 1
      },
      {
        "authorId": 3,
        "authorName": "了交水电费",
        "headUrl": "http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg",
        "isDefaultFollow": 1
      },
      {
        "authorId": 4,
        "authorName": "路上看到烦",
        "headUrl": "http://tva4.sinaimg.cn/crop.7.1.129.129.180/64319a89gw1f62p9lp7hyj203w03wq2x.jpg",
        "isDefaultFollow": 1
      },
      {
        "authorId": 5,
        "authorName": "心随风动",
        "headUrl": "http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg",
        "isDefaultFollow": 1
      },
      {
        "authorId": 6,
        "authorName": "234234",
        "headUrl": "http://tva4.sinaimg.cn/crop.7.1.129.129.180/64319a89gw1f62p9lp7hyj203w03wq2x.jpg",
        "isDefaultFollow": 1
      },
      {
        "authorId": 7,
        "authorName": "是的发顺丰",
        "headUrl": "http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg",
        "isDefaultFollow": 1
      },
      {
        "authorId": 8,
        "authorName": "斯蒂芬斯蒂芬",
        "headUrl": "http://tva4.sinaimg.cn/crop.7.1.129.129.180/64319a89gw1f62p9lp7hyj203w03wq2x.jpg",
        "isDefaultFollow": 1
      }
    ]);
    loading = false;
    // util.getJSON('author/getSuggestAuthors.json', {
    //   uid: 1000,
    //   pageNum: 1,
    // }, function(res) {
    //
    // });
  }
  render() {
    return <div class={ 'step3' + (this.isShow ? '' : ' fn-hide') }>
      <img class="logo" src="src/guide/step2.jpg"/>
      <h2>这里有你喜欢的作者吗？</h2>
      <h4>没有也没关系，之后随时可以添加</h4>
      <ul class="list fn-clear" onClick={ { 'li': this.click } } ref="list">
        {
          this.list.map(function(item) {
            return <li authorId={ item.authorId }><img src={ item.headUrl }/><span>{ item.authorName }</span></li>;
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
