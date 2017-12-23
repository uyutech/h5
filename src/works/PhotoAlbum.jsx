/**
 * Created by army8735 on 2017/10/28.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import HotPic from '../component/hotpic/HotPic.jsx';

let skip = 0;
let take = 12;
let sortType = 0;
let tagName = '';
let loading;
let loadEnd;
let ajax;

class PhotoAlbum extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      let $window = $(window);
      $window.on('scroll', function() {
        self.checkMore($window);
      });
      if(!$(self.element).hasClass('fn-hide')) {
        self.load();
      }

      let $hotPic = $(self.ref.hotPic.element);
      $hotPic.on('click', 'img', function() {});
      self.ref.hotPic.on('poolEnd', function() {
        loading = false;
        self.ref.hotPic.message = skip >= take ? '已经到底了' : '';
      });

      migi.eventBus.on('photoLike', function(data) {
        let $li = $('#photo_' + data.ItemID);
        if(data.ISLike) {
          $li.find('.like').addClass('has');
        }
        else {
          $li.find('.like').removeClass('has');
        }
      });
      migi.eventBus.on('photoFavor', function(data) {
        let $li = $('#photo_' + data.ItemID);
        if(data.ISFavor) {
          $li.find('.favor').addClass('has');
        }
        else {
          $li.find('.favor').removeClass('has');
        }
      });
    });
  }
  load() {
    let self = this;
    if(loading) {
      return;
    }
    loading = true;
    let hotPic = self.ref.hotPic;
    hotPic.message = '正在加载...';
    if(ajax) {
      ajax.abort();
    }
    ajax = net.postJSON('/h5/works/photoList', { worksID: this.props.worksID, skip, take, sortType, tagName }, function(res) {
      if(res.success) {
        let data = res.data;
        skip += take;
        if(skip >= data.Size) {
          loadEnd = true;
          hotPic.message = '已经到底了';
        }
        else {
          hotPic.message = '正在渲染图片...';
        }
        self.ref.hotPic.appendData(data.data);
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
      loading = false;
    }, function (res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      loading = false;
    });
  }
  checkMore($window) {
    let self = this;
    if($(self.element).hasClass('fn-hide')) {
      return;
    }
    let WIN_HEIGHT = $window.height();
    let HEIGHT = $(document.body).height();
    let bool;
    bool = $window.scrollTop() + WIN_HEIGHT + 30 > HEIGHT;
    if(!loading && !loadEnd && bool) {
      self.load($window);
    }
  }
  clear() {
    this.ref.hotPic.clear();
    skip = 0;
    loadEnd = false;
  }
  switchType(e, vd) {
    let $ul = $(vd.element);
    $ul.toggleClass('alt');
    $ul.find('li').toggleClass('cur');
    let rel = $ul.find('cur').attr('rel');
    sortType = rel;
    skip = 0;
    this.clear();
    this.load($(window));
  }
  switchType2(e, vd, tvd) {
    let $li = $(tvd.element);
    if(!$li.hasClass('cur')) {
      $(vd.element).find('.cur').removeClass('cur');
      $li.addClass('cur');
      tagName = tvd.props.rel;
      this.clear();
      this.load($(window));
    }
  }
  render() {
    return <div class={ 'mod mod-photoalbum' + (this.props.hidden ? ' fn-hide' : '') }>
      <div class="fn">
        <ul class="type fn-clear" onClick={ { li: this.switchType2 } }>
          <li class="cur" rel="">全部</li>
          {
            (this.props.labelList || []).map(function(item) {
              return <li rel={ item.Tag_Name }>{ item.Tag_Name }</li>;
            })
          }
        </ul>
        <ul class="type2 fn-clear" onClick={ this.switchType }>
          <li class="cur" rel="0">最新</li>
          <li rel="1">最热</li>
        </ul>
      </div>
      <HotPic ref="hotPic"/>
    </div>;
  }
}

export default PhotoAlbum;
