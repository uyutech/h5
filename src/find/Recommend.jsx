/**
 * Created by army8735 on 2018/1/8.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';

import Banner from './Banner.jsx';
import Works from './Works.jsx';
import Post from './Post.jsx';
import WorksList from './WorksList.jsx';
import AuthorList from './AuthorList.jsx';

let visible;
let scrollY = 0;
let take = 10;
let skip = take;
let loading;
let loadEnd;
let ajax;

class Recommend extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      let $window = $(window);
      let WIN_HEIGHT = $window.height();
      $window.on('scroll', function() {
        if(!visible || loadEnd || loading) {
          return;
        }
        let HEIGHT = $(document.body).height();
        let bool;
        bool = $window.scrollTop() + WIN_HEIGHT + 30 > HEIGHT;
        if(bool) {
          self.loadMore();
        }
      });
    });
  }
  @bind hasData
  @bind message
  show() {
    $(this.element).removeClass('fn-hide');
    $(window).scrollTop(scrollY);
    visible = true;
    return this;
  }
  hide() {
    $(this.element).addClass('fn-hide');
    visible = false;
    return this;
  }
  reload() {
    skip = 0;
    loadEnd = loading = false;
    $(this.ref.list.element).html('');
    this.loadMore();
  }
  loadMore() {
    if(loading || loadEnd) {
      return;
    }
    loading = true;
    let self = this;
    self.message = '正在加载...';
    if(ajax) {
      ajax.abort();
    }
    ajax = net.postJSON('/h5/find/recommendList', { id: self.rid, skip, take }, function(res) {
      if(res.success) {
        let data = res.data;
        skip += take;
        if(skip >= data.Size) {
          loadEnd = true;
        }
        let list = self.ref.list.element;
        (data.data || []).forEach(function(item, i) {
          let cp = self.genItem(item, i === data.Size - 1);
          if(cp) {
            cp.appendTo(list);
          }
        });
        self.message = loadEnd ? '已经到底了' : '';
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
    self.bannerList = data.bannerList;
    self.dataList = data.dataList;
    self.hasData = true;

    let list = self.ref.list.element;
    let arr = (data.dataList.data || []);
    let length = arr.length;
    (data.dataList.data || []).forEach(function(item, i) {
      let cp = self.genItem(item, i === data.dataList.Size - 1);
      if(cp) {
        cp.appendTo(list);
      }
    });

    let $window = $(window);
    let WIN_HEIGHT = $window.height();
    $window.on('scroll', function() {
      if(!visible) {
        return;
      }
      scrollY = $window.scrollTop();
      if(self.dataList.Size <= take) {
        return;
      }
      let HEIGHT = $(document.body).height();
      let bool;
      bool = $window.scrollTop() + WIN_HEIGHT + 30 > HEIGHT;
      if(bool) {
        self.loadMore();
      }
    });
  }
  genDom() {
    let self = this;
    return <div>
      {
        self.bannerList && self.bannerList.length
          ? <Banner dataList={ self.bannerList }/>
          : ''
      }
      <div ref="list"/>
      <div class={ 'cp-message' + (this.message ? '' : ' fn-hide') }>{ this.message }</div>
    </div>;
  }
  genItem(item, last) {
    let type = item.Level + ',' + item.urltype;
    switch(type) {
      case '1,1':
        if(item.worklist.length) {
          return <Works data={item} last={ last }/>;
        }
        break;
      case '1,2':
        if(item.commentlist.length) {
          return <Post data={item} last={ last }/>;
        }
        break;
      case '2,1':
        if(item.worklist.length) {
          return <WorksList data={item} last={ last }/>;
        }
        break;
      case '2,3':
        if(item.authorlist.length) {
          return <AuthorList data={item} last={ last }/>;
        }
        break;
    }
  }
  render() {
    return <div>
      {
        this.hasData
          ? this.genDom()
          : <div>
              <div class="fn-placeholder-tags"/>
              <div class="fn-placeholder-pic"/>
              <div class="fn-placeholder"/>
              <div class="fn-placeholder-squares"/>
            </div>
      }
    </div>;
  }
}

export default Recommend;
