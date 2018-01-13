/**
 * Created by army8735 on 2018/1/8.
 */

'use strict';

import net from '../../common/net';
import util from '../../common/util';

let pool = [];
let list = [];
let index = 0;

class WaterFall extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.message = self.props.message;
    self.on(migi.Event.DOM, function() {
      if(self.props.dataList) {
        self.appendData(self.props.dataList);
      }
      let $root = $(self.element);
      $root.on('click', '.like', function() {
        let $b = $(this);
        if($b.hasClass('loading')) {
          return;
        }
        $b.addClass('loading');
        let id = $b.attr('itemID');
        net.postJSON('/h5/works/likeWork', { workID: id }, function(res) {
          if(res.success) {
            if(res.data === 211 || res.data.State === 'likeWordsUser') {
              $b.addClass('has');
            }
            else {
              $b.removeClass('has');
            }
          }
          else if(res.code === 1000) {
            migi.eventBus.emit('NEED_LOGIN');
          }
          else {
            jsBridge.toast(res.message || util.ERROR_MESSAGE);
          }
          $b.removeClass('loading');
        }, function (res) {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
          $b.removeClass('loading');
        });
      });
      $root.on('click', '.favor', function() {
        let $b = $(this);
        if($b.hasClass('loading')) {
          return;
        }
        $b.addClass('loading');
        let id = $b.attr('itemID');
        let url = $b.hasClass('has') ? '/h5/works/unFavorWork' : '/h5/works/favorWork';
        net.postJSON(url, { workID: id }, function(res) {
          if(res.success) {
            if(url === '/h5/works/favorWork') {
              $b.addClass('has');
            }
            else {
              $b.removeClass('has');
            }
          }
          else if(res.code === 1000) {
            migi.eventBus.emit('NEED_LOGIN');
          }
          else {
            jsBridge.toast(res.message || util.ERROR_MESSAGE);
          }
          $b.removeClass('loading');
        }, function (res) {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
          $b.removeClass('loading');
        });
      });
      $root.on('click', 'img', function(e) {
        let $img = $(this);
        let index = $img.attr('rel');
        migi.eventBus.emit('chooseImage', {
          list,
          index,
        });
      });
    });
  }
  @bind message
  show() {
    $(this.element).removeClass('fn-hide');
  }
  hide() {
    $(this.element).addClass('fn-hide');
  }
  clearData() {
    let self = this;
    let $l1 = $(self.ref.l1.element);
    let $l2 = $(self.ref.l2.element);
    $l1.html('');
    $l2.html('');
    pool = [];
    list = [];
  }
  appendData(data) {
    let self = this;
    if(!Array.isArray(data)) {
      data = [data];
    }
    if(data.length) {
      //未知高宽的去加载图片获取高宽
      data.forEach(function(item) {
        if(!item.Width || !item.Height) {
          self.loadImgSize(item, self.checkPool.bind(self));
        }
      });
      pool = pool.concat(data);
      list = list.concat(data);
      self.checkPool();
    }
  }
  checkPool() {
    let self = this;
    while(pool.length) {
      let item = pool[0];
      if(item.Width && item.Height) {
        let li = self.genItem(item);
        self.append(li);
        pool.shift();
      }
      else {
        return;
      }
    }
    this.emit('poolEnd');
  }
  append(li) {
    let self = this;
    let $l1 = $(self.ref.l1.element);
    let $l2 = $(self.ref.l2.element);
    let $min = $l1;
    if($l2.height() < $min.height()) {
      $min = $l2;
    }
    li.appendTo($min[0]);
  }
  genItem(data) {
    data.preview = util.autoSsl(util.img360__80(data.FileUrl));
    if(data.Width <= 360) {
      return <li id={ 'image_' + data.ItemID }>
        <img class="pic" src={ util.autoSsl(util.img360__80(data.FileUrl)) || '/src/common/blank.png' }
             rel={ index++ } height={ data.Height / 2 }/>
        <div class="txt">
          <a href="">
            <img src="//zhuanquan.xyz/pic/3fc9dc8f4aa54ccfae45294dd689e820.jpg"/>
            <span>名字</span>
          </a>
          <b class={ 'like' + (data.ISLike ? ' has' : '') } itemID={ data.ItemID }/>
        </div>
      </li>;
    }
    let height = data.Height * 360 / data.Width;
    return <li id={ 'image_' + data.ItemID }>
      <img class="pic" src={ util.autoSsl(util.img360__80(data.FileUrl)) || '/src/common/blank.png' }
           rel={ index++ } height={ height / 2 }/>
      <div class="txt">
        <a href="">
          <img src="//zhuanquan.xyz/pic/3fc9dc8f4aa54ccfae45294dd689e820.jpg"/>
          <span>名字</span>
        </a>
        <b class={ 'like' + (data.ISLike ? ' has' : '') } itemID={ data.ItemID }/>
      </div>
    </li>;
  }
  loadImgSize(data, cb) {
    let img = document.createElement('img');
    img.style.position = 'absolute';
    img.style.left = '-9999rem;';
    img.style.top = '-9999rem';
    img.style.visibility = 'hidden';
    img.src = util.autoSsl(util.img__60(data.FileUrl));
    img.onload = function() {
      data.Width = img.width;
      data.Height = img.height;
      cb();
      document.body.removeChild(img);
    };
    img.onerror = function() {
      data.FileUrl = '//zhuanquan.xin/img/blank.png';
      data.Width = 1;
      data.Height = 100;
      cb();
      document.body.removeChild(img);
    };
    document.body.appendChild(img);
  }
  render() {
    return <div class="cp-waterfall">
      <div class="c">
        <div>
          <ul ref="l1"/>
        </div>
        <div>
          <ul ref="l2"/>
        </div>
      </div>
      <div class={ 'cp-message' + (this.message ? '' : ' fn-hide') }>{ this.message }</div>
    </div>;
  }
}

export default WaterFall;
