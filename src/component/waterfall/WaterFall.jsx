/**
 * Created by army8735 on 2018/1/8.
 */

'use strict';

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
      if(!self.WIDTH) {
        self.WIDTH = (screen.availWidth - 30) >> 1;
      }
      let $root = $(self.element);
      $root.on('click', '.authors a', function(e) {
        e.preventDefault();
        let $this = $(this);
        let url = $this.attr('href');
        let title = $this.attr('title');
        jsBridge.pushWindow(url, {
          title,
          transparentTitle: true,
        });
      });
      $root.on('click', '.like', function() {
        if(!$util.isLogin()) {
          migi.eventBus.emit('NEED_LOGIN');
          return;
        }
        let $b = $(this);
        if($b.hasClass('loading')) {
          return;
        }
        $b.addClass('loading');
        let id = $b.attr('rel');
        let url = $b.hasClass('liked') ? 'unLike' : 'like';
        $net.postJSON('/h5/works2/' + url, { worksId: $b.attr('worksId'), workId: id }, function(res) {
          if(res.success) {
            let data = res.data;
            data.state ? $b.addClass('liked') : $b.removeClass('liked');
            $b.text(data.count);
            self.emit('like', data);
          }
          else if(res.code === 1000) {
            migi.eventBus.emit('NEED_LOGIN');
          }
          else {
            jsBridge.toast(res.message || $util.ERROR_MESSAGE);
          }
          $b.removeClass('loading');
        }, function (res) {
          jsBridge.toast(res.message || $util.ERROR_MESSAGE);
          $b.removeClass('loading');
        });
      });
      $root.on('click', '.favor', function() {
        if(!$util.isLogin()) {
          migi.eventBus.emit('NEED_LOGIN');
          return;
        }
        let $b = $(this);
        if($b.hasClass('loading')) {
          return;
        }
        $b.addClass('loading');
        let id = $b.attr('rel');
        let url = $b.hasClass('has') ? 'unFavor' : 'favor';
        $net.postJSON('/h5/works2/' + url, { worksId: 1, workId: id }, function(res) {
          if(res.success) {
            let data = res.data;
            data.state ? $b.addClass('liked') : $b.removeClass('liked');
            $b.text(data.count);
          }
          else if(res.code === 1000) {
            migi.eventBus.emit('NEED_LOGIN');
          }
          else {
            jsBridge.toast(res.message || $util.ERROR_MESSAGE);
          }
          $b.removeClass('loading');
        }, function (res) {
          jsBridge.toast(res.message || $util.ERROR_MESSAGE);
          $b.removeClass('loading');
        });
      });
      $root.on('click', 'img', function() {
        let $img = $(this);
        let index = parseInt($img.attr('rel'));
        let copy = self.list.map((item) => {
          return {
            worksId: item.id,
            id: item.work.id,
            url: item.work.url,
            width: item.work.width,
            height: item.work.height,
            preview: item.work.preview,
            isLike: item.work.isLike,
            likeCount: item.work.likeCount,
            isFavor: item.work.isFavor,
            favorCount: item.work.favorCount,
          };
        });
        migi.eventBus.emit('IMAGE_VIEW', copy, index);
      });
      migi.eventBus.on('IMAGE_VIEW_LIKE', function(id, data) {
        let $b = $root.find('#image_' + id + ' .like');
        $b.text(data.count);
        if(data.state) {
          $b.addClass('liked');
        }
        else {
          $b.removeClass('liked');
        }
        for(let i = 0, len = self.list.length; i < len; i++) {
          let item = self.list[i];
          if(item.work.id === id) {
            item.work.isLike = data.state;
            item.work.likeCount = data.count;
            break;
          }
        }
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
      let id = data[i].work.id;
      if(self.exist[id]) {
        data.splice(i, 1);
      }
      self.exist[id] = true;
    }
    if(data.length) {
      //未知高宽的去加载图片获取高宽
      data.forEach(function(item) {
        if(!item.work.width || !item.work.height) {
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
      if(item.work.width && item.work.height) {
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
      if(item.work.width <= self.WIDTH / 2) {
        self.height2 += item.work.height;
      }
      else {
        self.height2 += item.work.height * self.WIDTH / item.work.width;
      }
    }
    else {
      target = self.ref.l1.element;
      if(item.work.width <= self.WIDTH / 2) {
        self.height1 += item.work.height;
      }
      else {
        self.height1 += item.work.height * self.WIDTH / item.work.width;
      }
    }
    self.genItem(item).appendTo(target);
  }
  genItem(item) {
    let self = this;
    let author = [];
    let hash = {};
    if(self.props.profession) {
      item.work.profession.forEach((item) => {
        author.push(item.name);
      });
    }
    else {
      item.work.author.forEach((item) => {
        item.list.forEach((at) => {
          if(!hash[at.id]) {
            hash[at.id] = true;
            author.push(at.name);
          }
        });
      });
    }
    item.work.preview = $util.img(item.work.url, 375, 0, 80);
    if(item.work.width <= self.WIDTH / 2) {
      return <li id={ 'image_' + item.work.id }>
        <img class="pic"
             src={ $util.autoSsl(item.work.preview) || '/src/common/blank.png' }
             rel={ self.index++ }
             height={ item.work.height / 2 }/>
        <div class="txt">
          <p class={ 'author' + (self.props.profession ? ' profession' : '') }>{ author.join(' ') }</p>
          <b class={ 'like' + (item.work.isLike ? ' liked' : '') }
             worksId={ item.id }
             rel={ item.work.id }>{ item.work.likeCount }</b>
        </div>
      </li>;
    }
    let height = item.work.height * self.WIDTH / item.work.width;
    return <li id={ 'image_' + item.work.id }>
      <img class="pic"
           src={ $util.autoSsl(item.work.preview) || '/src/common/blank.png' }
           rel={ self.index++ }
           height={ height }/>
      <div class="txt">
        <p class={ 'author' + (self.props.profession ? ' profession' : '') }>{ author.join(' ') }</p>
        <b class={ 'like' + (item.work.isLike ? ' liked' : '') }
           worksId={ item.id }
           rel={ item.work.id }>{ item.work.likeCount }</b>
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
    img.src = $util.img(item.work.url, 0, 0, 60);
    img.onload = function() {
      item.work.width = img.width;
      item.work.height = img.height;
      document.body.removeChild(img);
      if(uuid === self.uuid) {
        cb();
      }
    };
    img.onerror = function() {
      item.url = '//zhuanquan.xin/img/blank.png';
      item.work.width = 1;
      item.work.height = 100;
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
        <ul ref="l1"/>
        <ul ref="l2"/>
      </div>
      <div class={ 'cp-message' + (this.message ? '' : ' fn-hide') }>{ this.message }</div>
    </div>;
  }
}

export default WaterFall;
