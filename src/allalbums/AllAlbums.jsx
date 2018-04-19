/**
 * Created by army8735 on 2017/12/9.
 */

'use strict';


import util from '../common/util';

let take = 30;
let skip = 0;
let loading;
let loadEnd;

class AllAlbums extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      $net.postJSON('/h5/find/allAlbums', { skip, take }, function(res) {
        if(res.success) {
          skip += take;
          self.setData(res.data);
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      });
    });
  }
  @bind hasData
  @bind message
  setData(data) {
    let self = this;
    self.workList = data.data;
    loadEnd = skip >= data.Size;
    self.hasData = true;

    $(self.ref.list.element).on('click', 'a', function(e) {
      e.preventDefault();
      let $this = $(this);
      let url = $this.attr('href');
      let title = $this.attr('title');
      if(!url) {
        throw new Error('allalbums url is null');
      }
      jsBridge.pushWindow(url, {
        title,
      });
    });

    if(loadEnd) {
      self.message = '已经到底了';
      return;
    }
    let $window = $(window);
    $window.on('scroll', function() {
      self.checkMore($window);
    });
  }
  checkMore($window) {
    if(loading || loadEnd) {
      return;
    }
    let self = this;
    let WIN_HEIGHT = $window.height();
    let HEIGHT = $(document.body).height();
    let scrollY = $window.scrollTop();
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
    loading = true;
    self.message = '正在加载...';
    $net.postJSON('/h5/find/allAlbums', { skip, take }, function(res) {
      if(res.success) {
        let data = res.data;
        skip += take;
        self.appendData(data.data);
        if(skip >= data.Size) {
          loadEnd = true;
          self.message = '已经到底了';
        }
        else {
          self.message = '';
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
  appendData(data) {
    let self = this;
    let s = '';
    (data || []).forEach(function(item) {
      s += self.genItem(item);
    });
    $(self.ref.list.element).append(s);
  }
  genItem(item) {
    let url = `/works.html?worksID=${item.WorksID}`;
    return <li>
      <a href={ url } class="pic" title={ item.Title }>
        <img src={ util.autoSsl(util.img200_200_80(item.cover_Pic)) || '/src/common/blank.png' }/>
        <span class="type">原创音乐</span>
        <span class="num">{ util.abbrNum(item.Popular) }</span>
        {
          item.WorkState === 2 || item.WorkState === 3
            ? <span class="state">填坑中</span>
            : ''
        }
      </a>
      <a href={ url } class="txt" title={ item.Title }>
        <span>{ item.Title }</span>
        <span class="author">{ (item.SingerName || []).join(' ') }</span>
      </a>
    </li>;
  }
  genDom() {
    let self = this;
    return <ul ref="list" class="fn-clear">
      {
        self.workList.map(function(item) {
          return self.genItem(item);
        })
      }
    </ul>;
  }
  render() {
    return <div class="all-albums">
      {
        this.hasData
          ? this.genDom()
          : <div>
              <div class="fn-placeholder-squares"/>
              <div class="fn-placeholder"/>
            </div>
      }
      <div class="cp-message">{ this.message }</div>
    </div>;
  }
}

export default AllAlbums;
