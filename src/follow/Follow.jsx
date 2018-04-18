/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import PostList from '../component/postlist/PostList.jsx';

let scrollY = 0;

let circleOffset = 0;
let loadingCircle;
let loadCircleEnd;
let circleAjax;

let loading;
let loadEnd;
let offset = 0;
let ajax;
let loading2;
let loadEnd2;
let offset2 = 0;
let ajax2;
let friendFirst = true;

let interval;
let isPause;
let lastId;

let currentPriority = 0;
let cacheKey = 'follow';

class Follow extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.type = 0;
    self._visible = self.props.visible;
    self.on(migi.Event.DOM, function() {
      self.init();
      jsBridge.on('resume', function(e) {
        if(e.data) {
          if(e.data.login) {
            self.init();
          }
          else if(e.data.loginOut) {
            jsBridge.delPreference(cacheKey);
            self.setData(null, 1);
          }
        }
      });
      migi.eventBus.on('LOGIN', function() {
        self.init();
      });
    });
  }
  get visible() {
    return this._visible;
  }
  @bind
  set visible(v) {
    this._visible = v;
    util.scrollY(scrollY);
    if(v && !util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
    }
  }
  @bind personList
  @bind type
  @bind circleList
  init() {
    let self = this;
    if(!util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    if(ajax) {
      ajax.abort();
    }
    if(ajax2) {
      ajax.abort();
    }
    if(circleAjax) {
      circleAjax.abort();
    }
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        try {
          self.setData(cache, 0);
        }
        catch(e) {}
      }
    });
    ajax = net.postJSON('/h5/follow2/index', function(res) {
      if(res.success) {
        let data = res.data;
        jsBridge.setPreference(cacheKey, data);
        self.setData(data, 1);

        window.addEventListener('scroll', function() {
          if(self.visible) {
            self.checkMore();
            scrollY = util.scrollY();
          }
        });
        return;
        interval = setInterval(function() {
          if(isPause) {
            return;
          }
          net.postJSON('/h5/follow/postList', { skip: 0, take: 1 }, function(res) {
            if(res.success) {
              if((res.data.data[0] || {}).ID !== lastId) {
                migi.eventBus.emit('FOLLOW_UPDATE');
              }
            }
          });
        }, 10000);
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
  setData(data, priority) {
    priority = priority || 0;
    if(priority < currentPriority) {
      return;
    }
    currentPriority = priority;

    let self = this;
    let postList = self.ref.postList;

    if(data) {
      self.personList = data.personList.data;

      circleOffset = data.circleList.limit;
      self.circleList = data.circleList.data;

      postList.setData(data.postList.data);
      offset = data.postList.limit;
      loadEnd = offset >= data.postList.count;
    }
    else {
      self.personList = null;

      circleOffset = 0;
      self.circleList = null;

      postList.clearData();
      offset = 0;
      loadEnd = false;
    }
  }
  checkMore() {
    let self = this;
    if(self.type === 0) {
      if(loading || loadEnd) {
        return;
      }
    }
    else {
      if(loading2 || loadEnd2) {
        return;
      }
    }
    if(util.isBottom()) {
      self.type === 0 ? self.load() : self.load2();
    }
  }
  load() {
    let self = this;
    if(ajax) {
      ajax.abort();
    }
    let postList = self.ref.postList;
    loading = true;
    ajax = net.postJSON('/h5/follow2/postList', { offset }, function(res) {
      if(res.success) {
        let data = res.data;
        postList.appendData(data.data);
        offset += data.limit;
        if(offset >= data.count) {
          loadEnd = true;
          postList.message = '已经到底了';
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
  load2() {
    let self = this;
    if(ajax) {
      ajax.abort();
    }
    let postList = self.ref.postList2;
    loading2 = true;
    ajax = net.postJSON('/h5/follow2/friendPostList', { offset: offset2 }, function(res) {
      if(res.success) {
        let data = res.data;
        postList.appendData(data.data);
        offset2 += data.limit;
        if(offset >= data.count) {
          loadEnd2 = true;
          postList.message = '已经到底了';
        }
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
      loading2 = false;
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      loading2 = false;
    });
  }
  scroll(e, vd) {
    let self = this;
    let el = vd.element;
    if(loadingCircle || loadCircleEnd) {
      return;
    }
    if(el.scrollLeft + el.offsetWidth + 30 > el.scrollWidth) {
      loadingCircle = true;
      if(circleAjax) {
        circleAjax.abort();
      }
      circleAjax = net.postJSON('/h5/follow2/circle', { offset: circleOffset }, function(res) {
        if(res.success) {
          let data = res.data;
          self.circleList = self.circleList.concat(data.data);
          circleOffset += data.limit;
          if(circleOffset >= data.count) {
            loadCircleEnd = true;
          }
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
        loadingCircle = false;
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
        loadingCircle = false;
      });
    }
  }
  refresh() {
    this.init();
  }
  clickTag(e, vd, tvd) {
    let id = tvd.props.rel;
    let title = tvd.props.title;
    jsBridge.pushWindow('/circle.html?id=' + id, {
      title,
      transparentTitle: true,
    });
  }
  clickPerson(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    let title = tvd.props.title;
    jsBridge.pushWindow(url, {
      title,
      transparentTitle: true,
    });
  }
  clickMore(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    let title = tvd.props.title;
    jsBridge.pushWindow(url, {
      title,
    });
  }
  clickType(e, vd, tvd) {
    let self = this;
    if(tvd.props.rel === self.type) {
      return;
    }
    self.type = tvd.props.rel;
    if(self.type === 1 && friendFirst) {
      friendFirst = false;
      self.load2();
    }
  }
  render() {
    return <div class={ 'follow' + (this.visible ? '' : ' fn-hide') }>
      <div class="person">
        <h4>关注的人</h4>
        <ul onClick={ { '.pic': this.clickPerson, '.more': this.clickMore } }>
          {
            (this.personList || []).map(function(item) {
              return <li>
                <a class="pic"
                   title={ item.name || item.nickname }
                   href={ item.isAuthor ? ('/author.html?id=' + item.id) : ('/user.html?id=' + item.id) }>
                  <img src={ util.autoSsl(util.img(item.headUrl, 120, 120, 80)) || '/src/common/head.png' }/>
                </a>
              </li>;
            })
          }
          <li>
            <a class="more"
               href="/myrelation.html"
               title="圈关系">查看更多</a>
          </li>
        </ul>
      </div>
      <div class="circle">
        <ul onScroll={ this.scroll }
            onClick={ this.clickTag }>
          {
            (this.circleList || []).map(function(item) {
              return <li rel={ item.id }
                         title={ item.name }>{ item.name }</li>;
            })
          }
        </ul>
      </div>
      <ul class="type"
          onClick={ { li: this.clickType } }>
        <li class={ this.type === 0 ? 'cur': '' } rel={ 0 }>全部</li>
        <li class={ this.type === 1 ? 'cur': '' } rel={ 1 }>圈友</li>
      </ul>
      <PostList ref="postList"
                @visible={ this.type === 0 }
                message="正在加载..."/>
      <PostList ref="postList2"
                @visible={ this.type === 1 }
                message="正在加载..."/>
    </div>;
  }
}

export default Follow;
