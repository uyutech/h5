/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import HotPost from '../component/hotpost/HotPost.jsx';
import HotAuthor from '../component/hotauthor/HotAuthor.jsx';
import HotUser from '../component/hotuser/HotUser.jsx';

let take = 10;
let skip = take;
let loading;
let loadEnd;
let visible;
let scrollY = 0;

class Follow extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      visible = true;
      self.init();
      migi.eventBus.on('LOGIN_OUT', function() {
        self.hasData = false;
      });
      migi.eventBus.on('LOGIN', function() {
        if(!$(self.element).hasClass('fn-hide')) {
          self.show();
        }
      });
    });
  }
  @bind hasData
  show() {
    $(this.element).removeClass('fn-hide');
    $(window).scrollTop(scrollY);
    if(!this.hasData) {
      this.init();
    }
    visible = true;
  }
  hide() {
    $(this.element).addClass('fn-hide');
    visible = false;
  }
  init() {
    let self = this;
    net.postJSON('/h5/follow/index', function(res) {
      if(res.success) {
        self.setData(res.data);
      }
      else if(res.code === 1000) {
        migi.eventBus.emit('NEED_LOGIN');
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  setData(data) {
    let self = this;

    self.hotCircle = data.hotCircle;
    self.follows = data.follows;
    self.userFollows = data.userFollows;
    self.postList = data.postList;
    loadEnd = self.postList.Size <= take;

    self.hasData = true;

    let $window = $(window);
    $window.on('scroll', function() {
      if(!visible) {
        return;
      }
      self.checkMore($window);
    });
    if(loadEnd) {
      self.ref.hostPost.message = '已经到底了';
    }
  }
  checkMore($window) {
    if(loading || loadEnd) {
      return;
    }
    let self = this;
    let WIN_HEIGHT = $window.height();
    let HEIGHT = $(document.body).height();
    scrollY = $window.scrollTop();
    let bool;
    bool = scrollY + WIN_HEIGHT + 30 > HEIGHT;
    if(bool) {
      self.load();
    }
  }
  load() {
    let self = this;
    if(loading) {
      return;
    }
    let hotPost = self.ref.hotPost;
    loading = true;
    hotPost.message = '正在加载...';
    net.postJSON('/h5/follow/postList', { skip, take }, function(res) {
      if(res.success) {
        let data = res.data;
        skip += take;
        hotPost.appendData(data.data);
        if(skip >= data.Size) {
          loadEnd = true;
          hotPost.message = '已经到底了';
        }
        else {
          hotPost.message = '';
        }
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
      loading = false;
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      loading = false;
    });
  }
  click(e) {
    e.preventDefault();
    let $this = $(this);
    let url = $this.attr('href');
    let title = $this.attr('title');
    jsBridge.pushWindow(url, {
      title,
    });
  }
  genDom() {
    let self = this;
    return <div>
      <h4>关注话题</h4>
      <ul class="circles">
        {
          (self.hotCircle || []).map(function(item) {
            return <li rel={ item.Cid }><a href={ '/circle/' + item.Cid }>{ item.CirclingName }</a></li>;
          })
        }
      </ul>
      <h4>关注作者</h4>
      <HotAuthor ref="hotAuthor"
                 dataList={ self.follows.data }
                 empty={ '你还没有关注作者哦，快去发现页看看有没有喜欢的作者吧！' }
                 more={ self.follows.Size > 10 ? '/relation.html' : '' }/>
      <h4>关注圈er</h4>
      <HotUser ref="hotuser"
               dataList={ self.userFollows.data }
               empty={ '你还没有关注的圈er哦，快去转圈页看看有没有有趣的小伙伴吧~' }
               more={ self.userFollows.Size > 10 ? '/my/relation?tag=follow' : '' }/>
      <p><small>小提示：</small>互相关注和关注我的可以在 <a href="/relation.html" title="圈关系" onClick={ this.click }>圈关系</a> 里查看</p>
      <h4>Ta们画的圈</h4>
      <HotPost ref="hotPost" dataList={ self.postList.data }/>
    </div>;
  }
  render() {
    return <div class="follow">
      {
        this.hasData
          ? this.genDom()
          : <div>
              <div class="fn-placeholder-tags"/>
              <div class="fn-placeholder-circles"/>
              <div class="fn-placeholder-circles"/>
              <div class="fn-placeholder"/>
              <div class="fn-placeholder"/>
            </div>
      }
    </div>;
  }
}

export default Follow;
