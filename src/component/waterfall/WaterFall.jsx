/**
 * Created by army8735 on 2018/1/8.
 */

'use strict';

import net from '../../common/net';
import util from '../../common/util';
import ImageView from '../imageview/ImageView.jsx';

let pool = [];
let list = [];
let index = 0;
let WIDTH = 0;

class WaterFall extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.message = self.props.message;
    self.on(migi.Event.DOM, function() {
      if(self.props.dataList) {
        self.appendData(self.props.dataList);
      }
      let imageView = self.ref.imageView;
      let $root = $(self.element);
      WIDTH = $root.find('ul:first-child').width();
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
                imageView.list = list;
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
        imageView.setData(list, index);
      });

      imageView.on('like', function(list, index) {
        let id = list[index].ItemID;
        let $li = $('#image_' + id);
        like.call($li.find('.like'));
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
    index = 0;
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
    let author = ((data.GroupAuthorTypeHash || {}).AuthorTypeHashlist || [])[0] || {};
    data.preview = util.autoSsl(util.img375__80(data.FileUrl));
    if(data.Width <= WIDTH * 2) {
      return <li id={ 'image_' + data.ItemID }>
        <img class="pic" src={ util.autoSsl(util.img375__80(data.FileUrl)) || '/src/common/blank.png' }
             rel={ index++ } height={ data.Height / 2 }/>
        <div class="txt">
          <div class="author">
            {
              (author.AuthorInfo || []).map(function(item) {
                return <a href={ '/author.html?authorId=' + item.AuthorID } title={ item.AuthorName }>
                  <img src={ util.autoSsl(util.img60_60_80(item.Head_url || '/src/common/head.png')) }/>
                  <span>{ item.AuthorName }</span>
                </a>
              })
            }
          </div>
          <b class={ 'like' + (data.ISLike ? ' has' : '') } itemID={ data.ItemID }/>
        </div>
      </li>;
    }
    let height = data.Height * WIDTH * 2 / data.Width;
    return <li id={ 'image_' + data.ItemID }>
      <img class="pic" src={ util.autoSsl(util.img375__80(data.FileUrl)) || '/src/common/blank.png' }
           rel={ index++ } height={ height / 2 }/>
      <div class="txt">
        <div class="authors">
          {
            (author.AuthorInfo || []).map(function(item) {
              return <a href={ '/author.html?authorId=' + item.AuthorID } title={ item.AuthorName }>
                <img src={ util.autoSsl(util.img60_60_80(item.Head_url || '/src/common/head.png')) }/>
                <span>{ item.AuthorName }</span>
              </a>
            })
          }
        </div>
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
      <ImageView ref="imageView"/>
    </div>;
  }
}

export default WaterFall;
