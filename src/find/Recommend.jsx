/**
 * Created by army8735 on 2018/1/8.
 */

'use strict';

import net from "../common/net";
import util from "../common/util";

import Banner from './Banner.jsx';
import Works from './Works.jsx';
import Post from './Post.jsx';
import WorksList from './WorksList.jsx';
import AuthorList from './AuthorList.jsx';

let visible;
let scrollY = 0;
let take = 10;
let skip = take;

class Recommend extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind hasData
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
  load() {
    let self = this;
    self.on(migi.Event.DOM, function() {
      visible = true;
      net.postJSON('/h5/find/newIndex', { skip, take }, function(res) {
        if(res.success) {
          // self.setData(res.data);
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      });
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
      let cp = self.genItem(item, i === length - 1);
      if(cp) {
        cp.appendTo(list);
      }
    });

    if(self.dataList.Size <= take) {
      return;
    }
    let $window = $(window);
    let WIN_HEIGHT = $window.height();
    $window.on('scroll', function() {
      if(visible) {
        //
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
