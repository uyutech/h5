/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import Spark from 'spark-md5';

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
const MAX_IMG_NUM = 9;
const MAX_TEXT_LENGTH = 4096;

let currentPriority = 0;
let cacheKey = 'subpost';

class SubPost extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.value = '';
    self.invalid = true;
    self.num = 0;
    self.imgNum = 0;
    self.list = [];
    self.on(migi.Event.DOM, function() {
      jsBridge.setOptionMenu('发布');
      if(!jsBridge.isInApp) {
        document.querySelector('li.submit.fn-hide').classList.remove('fn-hide');
      }
      jsBridge.getCache(['my', 'useAuthor'], (data, useAuthor) => {
        if(data) {
          self.myInfo = data;
          self.isAuthor = data.author && data.author.length;
          self.useAuthor = useAuthor;
          if(self.isAuthor) {
            if(useAuthor) {
              self.headUrl = data.author[0].headUrl;
              self.name = data.author[0].name;
            }
            else {
              self.headUrl = data.info.headUrl;
              self.name = data.info.nickname;
            }
          }
        }
      });
      jsBridge.getPreference(self.getImgKey(), (cache) => {
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
      jsBridge.getPreference(self.getContentKey(), (cache) => {
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
  @bind circleList
  @bind tagList
  @bind workData
  @bind value
  @bind invalid
  @bind num
  @bind uploading
  @bind list
  @bind imgNum
  @bind warnLength
  @bind sending
  @bind name
  @bind headUrl
  @bind isAuthor
  @bind useAuthor
  init(data) {
    let self = this;
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        self.setData(cache, 0);
      }
    });
    net.postJSON('/h5/subpost2/index', function(res) {
      if(res.success) {
        let data = res.data;
        self.setData(data, 1);
        jsBridge.setPreference(cacheKey, data);
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  setData(data, priority) {
    if(priority < currentPriority) {
      return;
    }
    currentPriority = priority;

    let self = this;
    self.circleList = data.circleList.data;
    self.circleHash = {};
    self.circleList.forEach((item) => {
      self.circleHash[item.id] = item;
    });
    self.tagList = self.activity = data.activity;
  }
  clickAlt() {
    let self = this;
    if(self.myInfo) {
      self.useAuthor = !self.useAuthor;
      if(self.useAuthor) {
        self.headUrl = self.myInfo.author[0].headUrl;
        self.name = self.myInfo.author[0].name;
      }
      else {
        self.headUrl = self.myInfo.info.headUrl;
        self.name = self.myInfo.info.nickname;
      }
      jsBridge.setPreference('useAuthor', self.useAuthor);
    }
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
    if(!self.sending && !self.invalid && !self.uploading) {
      let image = [];
      self.list.forEach(function(item) {
        if(item.state === STATE.LOADED) {
          image.push({
            url: item.url,
            width: item.width || 0,
            height: item.height || 0,
          });
        }
      });
      if(self.list.length > image.length) {
        if(!window.confirm('尚有未上传成功的图片，继续提交吗？')) {
          return;
        }
      }
      self.sending = true;
      jsBridge.showLoading();
      let circleId = [];
      $(self.ref.circle.element).find('.on').each(function(i, li) {
        circleId.push($(li).attr('rel'));
      });
      let authorId;
      if(self.useAuthor && self.myInfo && self.myInfo.author && self.myInfo.author.length) {
        authorId = self.myInfo.author[0].id;
      }
      net.postJSON('/h5/subpost2/sub', {
        content: self.value,
        image: JSON.stringify(image),
        circleId: circleId.join(','),
        authorId,
        // workId: self.workData && self.workData.workId,
      }, function(res) {
        jsBridge.hideLoading();
        if(res.success) {
          self.value = '';
          self.invalid = true;
          self.num = 0;
          self.list = [];
          self.clearCache();
          jsBridge.notify({
            title: '画圈成功',
            url: '/post.html?postId=' + res.data.id,
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
  clickFile(e) {
    if(!util.isLogin()) {
      e.preventDefault();
      migi.eventBus.emit('NEED_LOGIN');
    }
  }
  change(e) {
    let self = this;
    if(self.uploading) {
      return;
    }
    if(!util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    if(self.imgNum >= MAX_IMG_NUM) {
      jsBridge('图片最多不能超过' + MAX_IMG_NUM + '张哦~');
      return;
    }
    self.uploading = true;
    let files = e.target.files;
    let count = 0;
    for(let i = 0, len = files.length; i < len; i++) {
      let file = files[i];
      let size = file.size;
      let suffix;
      switch(file.type) {
        case 'image/png':
          suffix = '.png';
          break;
        case 'image/gif':
          suffix = '.gif';
          break;
        case 'image/jpeg':
          suffix = '.jpg';
          break;
      }
      if(size && size !== 0 && size <= 10485760) {
        let fileReader = new FileReader();
        fileReader.onload = function() {
          let spark = new Spark();
          spark.append(fileReader.result);
          let md5 = spark.end();
          let has;
          for(let i = 0, len = self.list.length; i < len; i++) {
            if(self.list[i].md5 === md5) {
              has = true;
              break;
            }
          }
          if(has) {
            jsBridge.toast('选择的图片已存在');
            return;
          }
          let index = self.list.length;
          self.list.push({
            url: fileReader.result,
            state: STATE.LOADING,
          });
          let node = document.createElement('img');
          node.style.position = 'absolute';
          node.style.left = '-9999rem';
          node.style.top = '-9999rem';
          node.src = self.list[index].url;
          node.onload = function() {
            self.list[index].width = node.width;
            self.list[index].height = node.height;
            document.body.removeChild(node);
          };
          document.body.appendChild(node);
          net.postJSON('/h5/my/sts', { name: md5 + suffix }, function(res) {
            if(res.success) {
              let data = res.data;
              if(data.exist) {
                self.list[index].url = '//zhuanquan.xyz/pic/' + md5 + suffix;
                self.list[index].state = STATE.LOADED;
                self.list = self.list;
                count++;
                if(count === len) {
                  self.uploading = false;
                  self.imgNum = self.list.length;
                }
                return;
              }
              let name = md5 + suffix;
              let key = data.prefix + name;
              let policy = data.policy;
              let signature = data.signature;
              let host = data.host;
              let accessKeyId = data.accessKeyId;
              let form = new FormData();
              form.append('key', key);
              form.append('OSSAccessKeyId', accessKeyId);
              form.append('success_action_status', 200);
              form.append('policy', policy);
              form.append('signature', signature);
              form.append('file', file);
              let xhr = new XMLHttpRequest();
              xhr.open('post', host, true);
              xhr.onload = function() {
                if(xhr.status === 200) {
                  self.list[index].url = '//zhuanquan.xyz/pic/' + md5 + suffix;
                  self.list[index].state = STATE.LOADED;
                  self.list = self.list;
                  count++;
                  if(count === len) {
                    self.uploading = false;
                    self.imgNum = self.list.length;
                  }
                }
              };
              xhr.send(form);
            }
            else {
              jsBridge.toast(res.message || util.ERROR_MESSAGE);
            }
          }, function(res) {
            jsBridge.toast(res.message || util.ERROR_MESSAGE);
          });
        };
        fileReader.readAsDataURL(file);
      }
      else {
        jsBridge.toast('图片体积太大了，不能超过10m！');
      }
    }
  }
  getImgKey() {
    return '_subpost_img';
  }
  getContentKey() {
    return '_subpost_content';
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
    let $ul = $(vd.element);
    let $li = $(tvd.element);
    let $lis = $ul.find('.on');
    let len = $lis.length;
    if(!$li.hasClass('on') && len >= 3) {
      jsBridge.toast('最多只能选择3个圈子哦~');
      return;
    }
    $li.toggleClass('on');
    let temp = [];
    $ul.find('.on').each((i, o) => {
      let $o = $(o);
      let circleId = $o.attr('rel');
      temp = temp.concat(self.circleHash[circleId].tag);
    });
    temp = temp.concat(self.activity);
    self.tagList = temp;
  }
  clickTag(e, vd, tvd) {
    let self = this;
    self.value += tvd.props.rel + ' ';
    self.input(null, self.ref.input);
  }
  render() {
    return <form class="mod-sub"
                 ref="form"
                 onSubmit={ this.submit }>
      <div class="circle"
           ref="circle">
        <label>圈子</label>
        <ul onClick={ { li: this.clickCircle } }>
        {
          (this.circleList || []).map((item) => {
            return <li class={ item.id === this.props.circleId ? 'on' : '' }
                       rel={ item.id }>{ item.name }</li>;
          })
        }
        </ul>
      </div>
      <div class="tag">
        <label>话题</label>
        <ul onClick={ { li: this.clickTag } }>
        {
          (this.tagList || []).map((item) => {
            return <li rel={ item.value || ('#' + item.name + '#') }>{ item.name }</li>;
          })
        }
        </ul>
      </div>
      <div class="c">
        <textarea class="text"
                  ref="input"
                  placeholder="在转圈画个圈吧"
                  onInput={ this.input }
                  maxLength={ MAX_TEXT_LENGTH }>{ this.value }</textarea>
        <div class={ 'limit' + (this.warnLength ? ' warn' : '') }>
          <strong>{ this.num }</strong> / { MAX_TEXT_LENGTH }
          <div class={ 'alt' + (this.isAuthor ? '' : ' fn-hide') + (this.useAuthor ? ' author' : '') }
               onClick={ this.clickAlt }>
            <img src={ util.img(this.headUrl, 48, 48, 80) || '/src/common/head.png' }/>
            <span>{ this.name }</span>
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
        <li class="tip"><div ref="tip" class="fn-hide"/></li>
        <li class="pic" onClick={ this.album }>
          <input type="file"
                 onClick={ this.clickFile }
                 onChange={ this.change }/>
        </li>
        <li class="submit fn-hide">
          <input type="submit"
                 value="提交"
                 disabled={ this.invalid }/>
        </li>
      </ul>
    </form>;
  }
}

export default SubPost;
