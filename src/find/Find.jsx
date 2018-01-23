/**
 * Created by army8735 on 2017/11/28.
 */


'use strict';

import net from '../common/net';
import util from '../common/util';
import Nav from './Nav.jsx';
import Recommend from "./Recommend.jsx";
import ItemList from './ItemList.jsx';

let visible;
let scrollY = 0;
let last;

class Find extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      visible = true;
      net.postJSON('/h5/find/newIndex', { skip: 0, take: 10 }, function(res) {
        if(res.success) {
          self.setData(res.data);
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      });

      last = self.ref.recommend;
      self.ref.nav.on('change', function(id) {
        id = parseInt(id);
        last && last.hide();
        if(id === 1) {
          last = self.ref.recommend.show();
        }
        else if(Array.isArray(self.ref.itemList)) {
          last = self.ref.itemList[id - 2].show();
        }
        else {
          last = self.ref.itemList.show();
        }
      });
    });
  }
  @bind tagList
  show() {
    $(this.element).removeClass('fn-hide');
    $(window).scrollTop(scrollY);
    visible = true;
  }
  hide() {
    $(this.element).addClass('fn-hide');
    visible = false;
  }
  refresh() {
    this.ref.recommend.reload();
  }
  setData(data) {
    let self = this;

    self.tagList = data.tagList;
    self.ref.nav.dataList = data.tagList;
    self.ref.recommend.setData(data);
    self.ref.recommend.rid = (data.tagList[0] || {}).ID;
  }
  render() {
    return <div class="find">
      <Nav ref="nav"/>
      <Recommend ref="recommend"/>
      {
        (this.tagList || []).map(function(item, i) {
          if(i) {
            return <ItemList ref="itemList" tag={ item }/>;
          }
        })
      }
    </div>;
  }
}

export default Find;
