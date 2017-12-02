/**
 * Created by army8735 on 2017/11/30.
 */

'use strict';

import util from "../../../d/common/util";
import net from "../../../d/common/net";

let pool = [];
let list = [];
let index = 0;

class HotPic extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.message = self.props.message;
    self.on(migi.Event.DOM, function() {
      let $root = $(self.element);
      $root.on('click', '.like', function() {
        let $b = $(this);
        if($b.hasClass('loading')) {
          return;
        }
        $b.addClass('loading');
        let id = $b.attr('itemID');
        net.postJSON('/api/works/likeWork', { workID: id }, function(res) {
          if(res.success) {
            if(res.data === 211) {
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
            alert(res.message || util.ERROR_MESSAGE);
          }
          $b.removeClass('loading');
        }, function (res) {
          alert(res.message || util.ERROR_MESSAGE);
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
        let url = $b.hasClass('has') ? '/api/works/unFavorWork' : '/api/works/favorWork';
        net.postJSON(url, { workID: id }, function(res) {
          if(res.success) {
            if(url === '/api/works/favorWork') {
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
            alert(res.message || util.ERROR_MESSAGE);
          }
          $b.removeClass('loading');
        }, function (res) {
          alert(res.message || util.ERROR_MESSAGE);
          $b.removeClass('loading');
        });
      });
      $root.on('click', 'img', function(e) {
        let $img = $(this);
        let index = $img.attr('rel');
        migi.eventBus.emit('choosePic', list, index);
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
  clear() {
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
    if(data.Width <= 336) {
      return <li id={ 'photo_' + data.ItemID }>
        <img src={ util.autoSsl(util.img336__80(data.FileUrl)) || '//zhuanquan.xin/img/blank.png' }
             rel={ index++ } height={ data.Height / 2 }/>
        <b class={ 'like' + (data.ISLike ? ' has' : '') } itemID={ data.ItemID }/>
        <b class={ 'favor' + (data.ISFavor ? ' has' : '') } itemID={ data.ItemID }/>
      </li>;
    }
    let height = data.Height * 336 / data.Width;
    return <li id={ 'photo_' + data.ItemID }>
      <img src={ util.autoSsl(util.img336__80(data.FileUrl)) || '//zhuanquan.xin/img/blank.png' }
           rel={ index++ } height={ height / 2 }/>
      <b class={ 'like' + (data.ISLike ? ' has' : '') } itemID={ data.ItemID }/>
      <b class={ 'favor' + (data.ISFavor ? ' has' : '') } itemID={ data.ItemID }/>
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
    return <div class={ 'cp-hotpic' + (this.props.hidden ? ' fn-hide' : '') }>
      <div class="c">
        <div>
          <ul ref="l1"/>
        </div>
        <div>
          <ul ref="l2"/>
        </div>
      </div>
      <div class= { 'cp-message' + (this.message ? '' : 'fn-hide') }>{ this.message }</div>
    </div>;
  }
}

export default HotPic;
