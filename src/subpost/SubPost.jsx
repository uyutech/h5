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

let tagHash = {};
let timeout;
let ajax;

class SubPost extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.to = self.props.to ? self.props.to.slice(0) : undefined;
    self.placeholder = self.props.placeholder;
    if(self.props.workId) {
      self.workData = {
        type: self.props.workType.charAt(0),
        cover: self.props.cover,
        workId: self.props.workId,
      };
    }
    self.on(migi.Event.DOM, function() {
      jsBridge.setOptionMenu('发布');
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
      jsBridge.on('resume', function(e) {
        let data = e.data;
        if(data && data.tag) {
          self.value += data.tag;
          self.input(null, self.ref.input);
          let length = self.value.trim().length;
          self.invalid = length < 3 || length > MAX_TEXT_LENGTH;
        }
      });
      jsBridge.on('optionMenu', function() {
        if(self.value.trim().length < 3) {
          jsBridge.toast('字数不能少于3个字~');
          return;
        }
        self.submit();
      });
      jsBridge.on('back', function() {
        self.ref.input.element.blur();
      });
    });
  }
  @bind workData
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
  @bind isAuthor
  @bind userName
  @bind userHead
  @bind authorName
  @bind authorHead
  @bind isPublic
  init(circleID, tag) {
    let self = this;
    net.postJSON('/h5/subpost/index', { circleID }, function(res) {
      if(res.success) {
        let data = res.data;
        self.userName = data.uname;
        self.userHead = data.head;
        self.isPublic = data.isPublic;
        self.authorName = data.authorName;
        self.authorHead = data.authorHead;
        self.isAuthor = !!data.authorId;
        let to = data.myCircleList;
        if(to && to.length && circleID !== undefined) {
          let has = false;
          to.forEach(function(item) {
            if(item.CirclingID.toString() === (circleID || '').toString()) {
              has = true;
            }
          });
          if(has) {
            migi.sort(to, function(a, b) {
              if(a.CirclingID.toString() === (circleID || '').toString()) {
                return false;
              }
              else if(b.CirclingID.toString() === (circleID || '').toString()) {
                return true;
              }
            });
          }
          else {
            to.unshift({
              CirclingID: circleID,
              CirclingName: data.circleDetail.TagName,
            });
          }
        }
        self.to = to;
        let activityLabel = data.activityLabel || [];
        if(tag) {
          activityLabel.unshift({
            TagName: tag,
          });
        }
        self.activityLabel = activityLabel;
        self.tagList = (data.tagList || []).concat(activityLabel);
        if(circleID && data.tagList) {
          self.setCache(circleID, data.tagList);
        }
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  clickAlt() {
    let self = this;
    let old = self.isPublic;
    self.isPublic = !old;
    if(ajax) {
      ajax.abort();
    }
    ajax = net.postJSON('/h5/my/altIdentity', { public: self.isPublic }, function(res) {
      if(!res.success) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
        self.isPublic = old;
      }
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  input(e, vd) {
    let self = this;
    let $vd = $(vd.element);
    self.num = $vd.val().length;
    self.num = $vd.val().trim().length;
    let content = $vd.val().trim();
    let oldInvalid = self.invalid;
    self.invalid = content.length < 3 || content.length > MAX_TEXT_LENGTH;
    if(oldInvalid !== self.invalid) {
      if(self.invalid) {
        jsBridge.setOptionMenu({
          text: '发布',
          textColor: '#333333',
        });
      }
      else {
        jsBridge.setOptionMenu({
          text: '发布',
          textColor: '#8BBDE1',
        });
      }
    }
    self.warnLength = content.length > MAX_TEXT_LENGTH;
    jsBridge.setPreference(self.getContentKey(), content);
  }
  submit(e) {
    e && e.preventDefault();
    if(!util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
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
      jsBridge.showLoading();
      let circleID = [];
      $(self.ref.circle.element).find('.on').each(function(i, li) {
        circleID.push($(li).attr('rel'));
      });
      if(self.props.circleID && circleID.indexOf(self.props.circleID) === -1) {
        circleID.push(self.props.circleID);
      }
      net.postJSON('/h5/circle/post', { content: self.value, imgs, widths, heights, circleID: circleID.join(','), workId: self.workData && self.workData.workId, }, function(res) {
        jsBridge.hideLoading();
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
          jsBridge.popWindow({ data: res.data, type: 'subPost' });
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
        self.sending = false;
      }, function(res) {
        jsBridge.hideLoading();
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
    if(self.imgNum >= MAX_IMG_NUM) {
      jsBridge('图片最多不能超过' + MAX_IMG_NUM + '张哦~');
      return;
    }
    self.disableUpload = true;
    jsBridge.album(function(res) {
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
      jsBridge.setPreference(key, cache);
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
          jsBridge.setPreference(key, cache);
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
    if(tvd.props.class === 'share') {
      self.workData = null;
    }
    else if(self.list[i].state === STATE.LOADED || self.list[i].state === STATE.ERROR) {
      self.delCache(tvd.props.rel);
      self.list.splice(i, 1);
      self.imgNum = self.list.length;
    }
  }
  clickCircle(e, vd, tvd) {
    let self = this;
    let circleID = tvd.props.rel;
    let $ul = $(vd.element);
    let $li = $(tvd.element);
    let $lis = $ul.find('.on');
    let len = $lis.length;
    if(!$li.hasClass('on') && len >= 3) {
      jsBridge.toast('最多只能选择3个圈子哦~');
      return;
    }
    let on = $li.hasClass('on');
    $li.toggleClass('on');
    let temp = self.activityLabel;
    if(on) {
      $ul.find('.on').each(function(i, o) {
        let $o = $(o);
        let tags = tagHash[$o.attr('rel')];
        temp = temp.concat(tags);
      });
      self.tagList = temp;
    }
    else if(tagHash[circleID]) {
      $lis.each(function(i, o) {
        let $o = $(o);
        let id = $o.attr('rel');
        if(id === circleID) {
          return;
        }
        let tags = tagHash[$o.attr('rel')];
        temp = temp.concat(tags);
      });
      self.tagList = tagHash[circleID].concat(temp);
    }
    else {
      net.postJSON('/h5/subpost/tag', { circleID }, function(res) {
        if(res.success) {
          tagHash[circleID] = res.data || [];
          $lis.each(function(i, o) {
            let $o = $(o);
            let id = $o.attr('rel');
            if(id === circleID) {
              return;
            }
            let tags = tagHash[$o.attr('rel')];
            temp = temp.concat(tags);
          });
          self.tagList = tagHash[circleID].concat(temp);
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      });
    }
  }
  clickTag(e, vd, tvd) {
    let self = this;
    if(tvd.props.class === 'more') {
      jsBridge.pushWindow('/more_tag.html', {
        title: tvd.props.rel,
      });
    }
    else {
      self.value += tvd.props.rel;
      self.input(null, self.ref.input);
      let desc = tvd.props.desc;
      if(desc) {
        let $tip = $(self.ref.tip.element);
        $tip.text(desc);
        $tip.removeClass('fn-hide');
        if(timeout) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(function() {
          $tip.addClass('fn-hide');
        }, 3000);
      }
    }
  }
  clickTip(e, vd) {
    let $tip = $(vd.element);
    if($tip.text()) {
      $tip.removeClass('fn-hide');
      if(timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(function() {
        $tip.addClass('fn-hide');
      }, 3000);
    }
  }
  setCache(circleID, tagList) {
    tagHash[circleID] = tagList;
  }
  render() {
    return <form class="mod-sub" ref="form" onSubmit={ this.submit }>
      <div class="circle" ref="circle">
        <label>圈子</label>
        <ul onClick={ { li: this.clickCircle } }>
        {
          (this.to || []).map(function(item) {
            return <li rel={ item.CirclingID }
                       class={ item.CirclingID.toString() === (this.props.circleID || '').toString()
                         ? 'on' : '' }>{ item.CirclingName }圈</li>;
          }.bind(this))
        }
        </ul>
      </div>
      <div class="tag">
        <label>话题</label>
        <ul onClick={ { li: this.clickTag } }>
        {
          this.tagList.map(function(item, i) {
            return <li class={ item.more ? 'more' : '' }
                       i={ i }
                       rel={ item.value || ('#' + item.TagName + '#') }
                       desc={ item.Describe || '' }>{ item.TagName }</li>;
          }.bind(this))
        }
        </ul>
      </div>
      <div class="c">
        <textarea class="text" ref="input" placeholder={ this.placeholder || '夸夸这个圈子吧' }
                  onInput={ this.input }>{ this.value }</textarea>
        <div class={ 'limit' + (this.warnLength ? ' warn' : '') }>
          <strong>{ this.num }</strong> / { MAX_TEXT_LENGTH }
          <div class={ 'alt' + (this.isAuthor ? '' : ' fn-hide') }
               onClick={ this.clickAlt }>
            <b/>
            <img src={ util.img48_48_80((this.isPublic ? this.authorHead : this.userHead) || '/src/common/head.png') }/>
            <span>{ this.isPublic ? this.authorName : this.userName }</span>
          </div>
        </div>
      </div>
      <ul class="list" onClick={ { li: this.clickImg } }>
      {
        this.workData
          ? <li class="share"
                style={ 'background-image:url(' + this.workData.cover || '/src/common/blank.png' + ')' }></li>
          : ''
      }
      {
        (this.list || []).map(function(item, i) {
          return <li class={ 's' + item.state } idx={ i } rel={ item.url }
                     style={ 'background-image:url(' + util.autoSsl(util.img120_120_80(item.url)) + ')' }>
            <span>{ TEXT[item.state] }</span>
          </li>;
        })
      }
      </ul>
      <ul class="btn">
        <li class="tip">
          <div ref="tip" class="fn-hide" onClick={ this.clickTip }/>
        </li>
        <li class="pic" onClick={ this.change }/>
      </ul>
    </form>;
  }
}

export default SubPost;
