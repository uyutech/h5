/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import HotPost from '../component/hotpost/HotPost.jsx';
import People from './People.jsx';
import Circles from './Circles.jsx';

let take = 10;
let skip = take;
let loading;
let loadEnd;
let ajax;
let visible;
let scrollY = 0;
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
    self.visible = self.props.visible;
    self.on(migi.Event.DOM, function() {
      self.init();
      // migi.eventBus.on('LOGIN_OUT', function() {
      //   let people = self.ref.people;
      //   people.list = [];
      //
      //   let circles = self.ref.circles;
      //   circles.dataList = [];
      //
      //   let hotPost = self.ref.hotPost;
      //   hotPost.clearData();
      //
      //   self.type = '0';
      // });
      // migi.eventBus.on('LOGIN', function() {
      //   if(visible) {
      //     self.init();
      //   }
      // });
      // jsBridge.on('pause', function() {
      //   isPause = true;
      // });
      // jsBridge.on('resume', function() {
      //   isPause = false;
      // });
    });
  }
  get visible() {
    return this._visible;
  }
  @bind
  set visible(v) {
    this._visible = v;
    util.scrollY(scrollY);
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
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        self.setData(cache, 0);
      }
    });
    net.postJSON('/h5/follow2/index', function(res) {
      if(res.success) {
        let data = res.data;
        self.setData(data, 1);
        jsBridge.setPreference(cacheKey, data);

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
    let people = self.ref.people;

    self.personList = data.personList.data;
    self.circleList = data.circleList.data;
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
    if(ajax) {
      ajax.abort();
    }
    ajax = net.postJSON('/h5/follow/postList', { skip, take, type: self.type }, function(res) {
      if(res.success) {
        let data = res.data;
        lastId = (data.data[0] || {}).ID;
        migi.eventBus.emit('FOLLOW_UPDATED');
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
  clickType(e, vd, tvd) {
    let self = this;
    if(tvd.props.rel === self.type) {
      return;
    }
    self.type = tvd.props.rel;
    skip = 0;
    loading = loadEnd = false;
    self.ref.hotPost.clearData();
    self.load();
  }
  render() {
    return <div class="follow">
      <div class="person">
        <h4>关注的人</h4>
        <ul>
          {
            (this.personList || []).map(function(item) {
              return <li>
                <a class="pic">
                  <img src={ util.autoSsl(util.img(item.headUrl, 120, 120, 80)) || '/src/common/head.png' }/>
                </a>
              </li>;
            })
          }
          <li>
            <a class="more"
               href="/relation.html"
               title="圈关系">查看更多</a>
          </li>
        </ul>
      </div>
      <div class="circle">
        <ul onScroll={ this.scroll }
            onClick={ this.clickTag }>
          {
            (this.circleList || []).map(function(item) {
              return <li rel={ item.id }>{ item.name }</li>;
            })
          }
        </ul>
      </div>
      <ul class="type"
          onClick={ { li: this.clickType } }>
        <li class={ this.type === '0' ? 'cur': '' } rel="0">全部</li>
        <li class={ this.type === '1' ? 'cur': '' } rel="1">圈友</li>
      </ul>
      <HotPost ref="hotPost"/>
    </div>;
  }
}

export default Follow;
