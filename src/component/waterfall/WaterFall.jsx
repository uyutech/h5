/**
 * Created by army8735 on 2018/1/8.
 */

'use strict';

import net from '../../common/net';
import util from '../../common/util';

let uuid = 0;

class WaterFall extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.message = self.props.message;
    self.visible = self.props.visible;
    self.pool = [];
    self.exist = {};
    self.list = [];
    self.index = 0;
    self.height1 = self.height2 = 0;
    self.WIDTH = self.props.WIDTH;
    self.on(migi.Event.DOM, function() {
      let $root = $(self.element);
      $root.on('click', '.authors a', function(e) {
        e.preventDefault();
        let $this = $(this);
        let url = $this.attr('href');
        let title = $this.attr('title');
        util.openAuthor({
          url,
          title,
        });
      });

      function like() {
        if(!util.isLogin()) {
          migi.eventBus.emit('NEED_LOGIN');
          return;
        }
        let $b = $(this);
        if($b.hasClass('loading')) {
          return;
        }
        $b.addClass('loading');
        let id = $b.attr('itemID');
        net.postJSON('/h5/works/likeWork', { workID: id }, function(res) {
          if(res.success) {
            if(res.data.State === 'likeWordsUser') {
              $b.addClass('has');
            }
            else {
              $b.removeClass('has');
            }
            for(let i = 0, len = list.length; i < len; i++) {
              if(id.toString() === list[i].ItemID.toString()) {
                list[i].ISLike = res.data.State === 'likeWordsUser';
                // imageView.list = list;
                break;
              }
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
      }
      $root.on('click', '.like', like);

      function favor() {
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
      }
      $root.on('click', '.favor', favor);

      $root.on('click', 'img', function() {
        let $img = $(this);
        let index = $img.attr('rel');
        // imageView.setData(list, index);
      });
    });
  }
  @bind message
  @bind visible
  show() {
    this.visible = true;
  }
  hide() {
    this.visible = false;
  }
  clearData() {
    let self = this;
    self.ref.l1.element.innerHTML = '';
    self.ref.l2.element.innerHTML = '';
    self.pool = [];
    self.list = [];
    self.index = 0;
    self.height1 = self.height2 = 0;
    self.exist = {};
    self.uuid = uuid++; //重新加载时防止未完成异步图片加载再次显示
  }
  setData(data) {
    this.clearData();
    this.appendData(data);
  }
  appendData(data) {
    let self = this;
    if(!data) {
      return;
    }
    if(!Array.isArray(data)) {
      data = [data];
    }
    for(let i = data.length - 1; i >= 0; i--) {
      let id = data[i].id;
      if(self.exist[id]) {
        data.splice(i, 1);
      }
      self.exist[id] = true;
    }
    if(data.length) {
      //未知高宽的去加载图片获取高宽
      data.forEach(function(item) {
        if(!item.width || !item.height) {
          self.loadImgSize(item, self.checkPool.bind(self), self.uuid);
        }
      });
      self.pool = self.pool.concat(data);
      self.list = self.list.concat(data);
      self.checkPool();
    }
  }
  checkPool() {
    let self = this;
    while(self.pool && self.pool.length) {
      let item = self.pool[0];
      if(item.width && item.height) {
        self.append(item);
        self.pool.shift();
      }
      else {
        return;
      }
    }
  }
  append(item) {
    let self = this;
    let target;
    if(self.height1 > self.height2) {
      target = self.ref.l2.element;
      self.height2 += item.height;
    }
    else {
      target = self.ref.l1.element;
      self.height1 += item.height;
    }
    self.genItem(item).appendTo(target);
  }
  genItem(item) {
    let self = this;
    let author = [];
    let hash = {};
    if(self.props.profession) {
      (item.profession || []).forEach((item) => {
        author.push(item.name);
      });
    }
    else {
      (item.author || []).forEach((list) => {
        list.list.forEach((at) => {
          if(!hash[at.id]) {
            hash[at.id] = true;
            author.push(at.name);
          }
        });
      });
    }
    item.preview = util.autoSsl(util.img375__80(item.url));
    if(item.width <= self.WIDTH) {
      return <li id={ 'image_' + item.id }>
        <img class="pic"
             src={ util.autoSsl(item.preview) || '/src/common/blank.png' }
             rel={ self.index++ }
             height={ item.height / 2 }/>
        <div class="txt">
          <p class={ 'author' + (self.props.profession ? ' profession' : '') }>{ author.join(' ') }</p>
          <b class={ 'like' }/>
        </div>
      </li>;
    }
    let height = item.height * self.WIDTH * 2 / item.width;
    return <li id={ 'image_' + item.id }>
      <img class="pic"
           src={ util.autoSsl(item.preview) || '/src/common/blank.png' }
           rel={ self.index++ }
           height={ height / 2 }/>
      <div class="txt">
        <p class={ 'author' + (self.props.profession ? ' profession' : '') }>{ author.join(' ') }</p>
        <b class={ 'like' + (item.isLike ? ' liked' : '') }>{ item.likeCount }</b>
      </div>
    </li>;
  }
  loadImgSize(item, cb, uuid) {
    let self = this;
    let img = document.createElement('img');
    img.style.position = 'absolute';
    img.style.left = '-9999rem;';
    img.style.top = '-9999rem';
    img.style.visibility = 'hidden';
    img.src = util.autoSsl(util.img__60(item.url));
    img.onload = function() {
      item.width = img.width;
      item.height = img.height;
      document.body.removeChild(img);
      if(uuid === self.uuid) {
        cb();
      }
    };
    img.onerror = function() {
      item.url = '//zhuanquan.xin/img/blank.png';
      item.width = 1;
      item.height = 100;
      document.body.removeChild(img);
      if(uuid === self.uuid) {
        cb();
      }
    };
    document.body.appendChild(img);
  }
  render() {
    return <div class={ 'cp-waterfall' + (this.visible ? '' : ' fn-hide') }>
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
