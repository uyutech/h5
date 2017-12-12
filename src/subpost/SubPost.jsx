/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';

const STATE = {
  LOADING: 0,
  SENDING: 1,
  LOADED: 2,
  ERROR: 3,
};
const TEXT = {
  0: '读取中...',
  1: '上传中...',
  2: '',
  3: '加载失败',
};
const MAX_IMG_NUM = 10;
const MAX_TEXT_LENGTH = 4096;

class SubPost extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.to = self.props.to ? self.props.to.slice(0) : undefined;
    self.placeholder = self.props.placeholder;
    if(self.to && self.to.length && self.props.circleID !== undefined) {
      let has = false;
      self.to.forEach(function(item) {
        if(item.TagID.toString() === (self.props.circleID || '').toString()) {
          has = true;
        }
      });
      if(has) {
        migi.sort(self.to, function(a, b) {
          if(a.TagID.toString() === (self.props.circleID || '').toString()) {
            return false;
          }
          else if(b.TagID.toString() === (self.props.circleID || '').toString()) {
            return true;
          }
        });
      }
      else {
        self.to.unshift({
          TagID: self.props.circleID,
          TagName: self.props.circleDetail.TagName,
        });
      }
    }
    self.on(migi.Event.DOM, function() {
      jsBridge.getPreference(self.getImgKey(), function(cache) {
        if(cache) {
          let temp = [];
          cache.forEach(function(item) {
            temp.push({
              state: STATE.LOADED,
              url: item,
            });
          });
          self.list = temp;
          self.imgNum = temp.length;
        }
      });
      jsBridge.getPreference(self.getContentKey(), function(cache) {
        if(cache) {
          self.value = cache.trim();
          self.input(null, self.ref.input);
          let length = self.value.trim().length;
          self.invalid = length < 3 || length > MAX_TEXT_LENGTH;
        }
      });
      let $label = $(self.ref.label.element);
      $label.on('click', 'li', function() {
        let $li = $(this);
        let len = $label.find('.cur,.on').length;
        if(!$li.hasClass('on') && !$li.hasClass('cur') && len >= 3) {
          jsBridge.toast('最多只能选择3个圈子哦~');
          return;
        }
        $li.toggleClass('on');
        if(self.activityLabel) {
          let temp = self.activityLabel['0'] || [];
          $label.find('.cur,.on').each(function(i, li) {
            let id = $(li).attr('rel');
            temp = temp.concat(self.activityLabel[id] || []);
          });
          self.tagList = temp;
        }
      });
    });
  }
  @bind placeholder
  @bind value = ''
  @bind to
  @bind invalid = true
  @bind num = 0
  @bind disableUpload
  @bind list = []
  @bind imgNum = 0
  @bind warnLength
  @bind sending
  @bind tagList = []
  @bind tagList2 = []
  input(e, vd) {
    let self = this;
    let $vd = $(vd.element);
    self.num = $vd.val().length;
    self.num = $vd.val().trim().length;
    let content = $vd.val().trim();
    self.invalid = content.length < 3 || content.length > MAX_TEXT_LENGTH;
    self.warnLength = content.length > MAX_TEXT_LENGTH;
    jsBridge.setPreference(self.getContentKey(), content);
  }
  submit(e) {
    e.preventDefault();
    let self = this;
    if(!self.sending && !self.invalid && !self.disableUpload) {
      let imgs = [];
      let widths = [];
      let heights = [];
      self.list.forEach(function(item) {
        if(item.state === STATE.LOADED) {
          imgs.push(item.url);
          widths.push(item.width || 0);
          heights.push(item.height || 0);
        }
      });
      if(self.list.length > imgs.length) {
        if(!window.confirm('尚有未上传成功的图片，继续提交吗？')) {
          return;
        }
      }
      self.sending = true;
      let circleID = [];
      $(self.ref.label.element).find('.cur,.on').each(function(i, li) {
        circleID.push($(li).attr('rel'));
      });
      net.postJSON('/h5/circle/post', { content: self.value, imgs, widths, heights, circleID: circleID.join(',') }, function(res) {
        if(res.success) {
          self.value = '';
          self.invalid = true;
          self.num = 0;
          self.list = [];
          self.clearCache();
          jsBridge.notify({
            title: '画圈成功',
            url: '/post.html?postID=' + res.data.ID,
          }, {
            title: '画圈正文'
          });
          jsBridge.popWindow();
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
        self.sending = false;
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
        self.sending = false;
      });
    }
  }
  change(e, vd) {
    let self = this;
    if(self.disableUpload) {
      return;
    }
    if(self.imgNum > MAX_IMG_NUM) {
      jsBridge('图片最多不能超过' + MAX_IMG_NUM + '张哦~');
      return;
    }
    let num = MAX_IMG_NUM - self.imgNum;
    num = Math.min(3, num);
    self.disableUpload = true;
    jsBridge.album({ num }, function(res) {
      if(res.success) {
        res = res.base64;
        if(!Array.isArray(res)) {
          res = [res];
        }
        let num = res.length;
        let count = 0;
        let hasUpload;
        res.forEach(function(img, i) {
          self.list.push({
            state: STATE.SENDING,
            url: /^data:image\/(\w+);base64,/.test(img) ? img : ('data:image/jpeg;base64,' + img),
          });
          let node = document.createElement('img');
          node.style.position = 'absolute';
          node.style.left = '-9999rem';
          node.style.top = '-9999rem';
          node.src = self.list[i + self.imgNum].url;
          node.onload = function() {
            self.list[i + self.imgNum].width = node.width;
            self.list[i + self.imgNum].height = node.height;
            document.body.removeChild(node);
          };
          document.body.appendChild(node);
          net.postJSON('/h5/my/uploadPic', { img }, function(res) {
            if(res.success) {
              let url = res.data;
              let has;
              self.list.forEach(function(item, j) {
                if(item && item.url === url) {
                  hasUpload = has = true;
                }
              });
              if(!has) {
                self.list[i + self.imgNum].state = STATE.LOADED;
                self.list[i + self.imgNum].url = url;
                self.addCache(url);
              }
              else {
                self.list[i + self.imgNum].state = STATE.ERROR;
              }
            }
            else {
              self.list[i + self.imgNum] = null;
            }
            self.list = self.list;
            count++;
            if(count === num) {
              self.disableUpload = false;
              for(let j = self.list.length - 1; j >= 0; j--) {
                if(self.list[j] === null) {
                  self.list.splice(j, 1);
                }
              }
              self.imgNum = self.list.length;
              if(hasUpload) {
                jsBridge.toast('有图片已经重复上传过啦~');
              }
            }
          }, function(res) {
            self.list[i + self.imgNum].state = STATE.ERROR;
            self.list = self.list;
            count++;
            if(count === num) {
              self.disableUpload = false;
              for(let j = self.list.length - 1; j >= 0; j--) {
                if(self.list[j] === null) {
                  self.list.splice(j, 1);
                }
              }
              self.imgNum = self.list.length;
              if(hasUpload) {
                jsBridge.toast('有图片已经重复上传过啦~');
              }
            }
          });
        });
      }
      else if(res.cancel) {
        self.disableUpload = false;
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
        self.disableUpload = false;
      }
    });
  }
  getImgKey() {
    return '_circle_img';
  }
  getContentKey() {
    return '_circle_content';
  }
  addCache(url) {
    let self = this;
    let key = self.getImgKey();
    jsBridge.getPreference(key, function(cache) {
      if(cache) {
      }
      else {
        cache = [];
      }
      cache.push(url);
      jsBridge.setPreference(key, JSON.stringify(cache));
    });
  }
  delCache(url) {
    let self = this;
    let key = self.getImgKey();
    jsBridge.getPreference(key, function(cache) {
      if(cache) {
        let i = cache.indexOf(url);
        if(i > -1) {
          cache.splice(i, 1);
          jsBridge.setPreference(key, JSON.stringify(cache));
        }
      }
    });
  }
  clearCache() {
    let self = this;
    jsBridge.setPreference(self.getImgKey(), null);
    jsBridge.setPreference(self.getContentKey(), null);
  }
  clickImg(e, vd, tvd) {
    let self = this;
    let i = tvd.props.idx;
    if(self.list[i].state === STATE.LOADED || self.list[i].state === STATE.ERROR) {
      self.delCache(tvd.props.rel);
      self.list.splice(i, 1);
      self.imgNum = self.list.length;
    }
  }
  clickClose(e) {
    let ref = document.referrer;
    if(ref && ref.indexOf(location.origin) > -1) {
      e.preventDefault();
      history.back();
    }
  }
  clickTag(e, vd, tvd) {
    if(tvd.props.class === 'more') {
      let i = tvd.props.i;
      this.tagList2 = this.tagList[i].value;
    }
    else {
      this.value += tvd.props.rel;
      this.tagList2 = [];
    }
  }
  clickTag2(e, vd, tvd) {
    this.value += tvd.props.rel;
  }
  render() {
    return <form class="mod-sub" ref="form" onSubmit={ this.submit }>
      <div class="ti">
        <div class={ 'upload' + (this.disableUpload ? ' dis' : '') } onClick={ this.change }>图片</div>
        <span class={ 'limit' + (this.warnLength ? ' warn' : '') }><strong>{ this.num }</strong> / { MAX_TEXT_LENGTH }</span>
        <input type="submit"
               class={ 'submit' + (this.sending || this.invalid || this.disableUpload ? ' dis' : '') }
               value={ this.value.trim().length
                 ? this.value.trim().length < 3
                   ? '-${n}'.replace('${n}', (3 - this.value.trim().length))
                   : '发送'
                 : '发送' }/>
      </div>
      <div class="ti2">
        <ul ref="label">
          {
            (this.to || []).map(function(item) {
              return <li rel={ item.TagID } class={ item.TagID.toString() === (this.props.circleID || '').toString() ? 'on' : '' }>{ item.TagName }</li>;
            }.bind(this))
          }
        </ul>
      </div>
      <div class={ 'ti3' + (this.tagList.length ? '' : ' fn-hide') } onClick={ { li: this.clickTag }}>
        <ul>
          {
            this.tagList.map(function(item, i) {
              return <li class={ Array.isArray(item.value) ? 'more' : '' }
                         i={ i }
                         rel={ item.value }>{ item.name }</li>;
            }.bind(this))
          }
        </ul>
      </div>
      <div class={ 'ti4' + (this.tagList2.length ? '' : ' fn-hide') } onClick={ { li: this.clickTag2 }}>
        <ul>
          {
            this.tagList2.map(function(item) {
              return <li rel={ item.value }>{ item.key }</li>;
            }.bind(this))
          }
        </ul>
      </div>
      <div class="c">
        <textarea class="text" ref="input" placeholder={ this.placeholder || '夸夸这个圈子吧' }
                  onInput={ this.input }>{ this.value }</textarea>
      </div>
      <ul class="list" onClick={ { li: this.clickImg } }>
        {
          (this.list || []).map(function(item, i) {
            return <li class={ 's' + item.state } idx={ i } rel={ item.url }
                       style={ 'background-image:url(' + util.autoSsl(util.img120_120_80(item.url)) + ')' }>
              <span>{ TEXT[item.state] }</span>
            </li>;
          })
        }
      </ul>
    </form>;
  }
}

export default SubPost;
