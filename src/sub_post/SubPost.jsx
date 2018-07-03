/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

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

let activity;
let circleHash = {};

let currentPriority = 0;
let cacheKey = 'subPost';
let uploading;
let uuid = 0;

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
      jsBridge.getPreference('my', function(my) {
        if(my) {
          self.myInfo = my;
          self.isAuthor = my.author && my.author.length;
          if(self.isAuthor) {
            jsBridge.getPreference('useAuthor', function(useAuthor) {
              self.useAuthor = useAuthor;
              if(useAuthor) {
                self.headUrl = my.author[0].headUrl;
                self.name = my.author[0].name;
              }
              else {
                self.headUrl = my.user.headUrl;
                self.name = my.user.nickname;
              }
            });
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
  @bind value
  @bind invalid
  @bind num
  @bind worksId
  @bind workId
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
    self.cover = data.cover;
    self.worksId = data.worksId;
    self.workId = data.workId;
    self.circleId = data.circleId;
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        try {
          self.setData(cache, 0);
        }
        catch(e) {}
      }
    });
    $net.postJSON('/h5/subPost/index2', { circleId: self.circleId }, function(res) {
      if(res.success) {
        let data = res.data;
        jsBridge.setPreference(cacheKey, data);
        self.setData(data, 1);
        self.circleId = null;
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
    });
  }
  setData(data, priority) {
    if(priority < currentPriority) {
      return;
    }
    currentPriority = priority;

    let self = this;
    activity = data.activity;
    let tagList = activity.slice();
    self.circleList = data.circleList;
    self.tagList = tagList;
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
        self.headUrl = self.myInfo.user.headUrl;
        self.name = self.myInfo.user.nickname;
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
    if(!$util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    let self = this;
    if(!self.sending && !self.invalid && !uploading) {
      let image = [];
      migi.sort(self.list, function(a, b) {
        return a.weight > b.weight;
      });
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
        jsBridge.confirm('尚有未上传成功的图片，继续提交吗？', function(res) {
          if(!res) {
            return;
          }
          self.submitConfirm(image);
        });
      }
      else {
        self.submitConfirm(image);
      }
    }
  }
  submitConfirm(image) {
    let self = this;
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
    $net.postJSON('/h5/subPost/sub', {
      content: self.value,
      image: JSON.stringify(image),
      circleId: circleId.join(','),
      authorId,
      worksId: self.worksId,
      workId: self.workId,
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
          url: '/post.html?id=' + res.data.id,
        }, {
          title: '画圈正文'
        });
        jsBridge.popWindow({ data: res.data, type: 'subPost' });
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
      self.sending = false;
    }, function(res) {
      jsBridge.hideLoading();
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      self.sending = false;
    });
  }
  clickFile(e) {
    let self = this;
    if(!$util.isLogin()) {
      e.preventDefault();
      migi.eventBus.emit('NEED_LOGIN');
    }
    if(self.imgNum >= MAX_IMG_NUM) {
      e.preventDefault();
      jsBridge.toast('图片最多不能超过' + MAX_IMG_NUM + '张哦~');
    }
  }
  change(e) {
    let self = this;
    if(uploading) {
      return;
    }
    if(!$util.isLogin()) {
      e.preventDefault();
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    if(self.imgNum >= MAX_IMG_NUM) {
      e.preventDefault();
      jsBridge.toast('图片最多不能超过' + MAX_IMG_NUM + '张哦~');
      return;
    }
    uploading = true;
    let files = e.target.files;
    let count = 0;
    let all = files.length;
    for(let i = 0, len = all; i < len; i++) {
      if(i + self.imgNum >= MAX_IMG_NUM) {
        all = i;
        jsBridge.toast('图片最多不能超过' + MAX_IMG_NUM + '张哦~超出部分将自动忽略~');
        return;
      }
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
      if(size && size <= 10485760) {
        let fileReader = new FileReader();
        let weight = uuid++;
        fileReader.onload = function() {
          let spark = new SparkMd5();
          spark.append(fileReader.result);
          let md5 = spark.end();
          let has;
          for(let j = 0, len = self.list.length; j < len; j++) {
            if(self.list[j].md5 === md5) {
              has = true;
              break;
            }
          }
          if(has) {
            jsBridge.toast('选择的图片已存在');
            return;
          }
          let index = 0;
          let find;
          for(let j = 0, len = self.list.length; j < len; j++) {
            if(self.list[j].weight > weight) {
              index = j;
              find = true;
              break;
            }
          }
          if(!find) {
            index = self.list.length;
          }
          self.list.splice(index, 0, {
            weight,
            url: fileReader.result,
            state: STATE.LOADING,
          });
          let node = document.createElement('img');
          node.style.position = 'absolute';
          node.style.left = '-9999rem';
          node.style.top = '-9999rem';
          node.src = fileReader.result;
          node.onload = function() {
            for(let j = 0, len = self.list.length; j < len; j++) {
              if(self.list[j] === weight) {
                self.list[j].width = node.width;
                self.list[j].height = node.height;
                document.body.removeChild(node);
                break;
              }
            }
          };
          document.body.appendChild(node);
          $net.postJSON('/h5/my/sts', { name: md5 + suffix }, function(res) {
            if(res.success) {
              let data = res.data;
              if(data.exist) {
                for(let j = 0, len = self.list.length; j < len; j++) {
                  if(self.list[j].weight === weight) {
                    self.list[j].url = '//zhuanquan.xyz/pic/' + md5 + suffix;
                    self.list[j].state = STATE.LOADED;
                    self.list = self.list;
                    count++;
                    if(count === all) {
                      uploading = false;
                      self.imgNum = self.list.length;
                    }
                    break;
                  }
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
                  for(let j = 0, len = self.list.length; j < len; j++) {
                    if(self.list[j].weight === weight) {
                      self.list[j].url = '//zhuanquan.xyz/pic/' + md5 + suffix;
                      self.list[j].state = STATE.LOADED;
                      self.list = self.list;
                      count++;
                      if(count === all) {
                        uploading = false;
                        self.imgNum = self.list.length;
                      }
                      break;
                    }
                  }
                }
              };
              xhr.send(form);
            }
            else {
              jsBridge.toast(res.message || $util.ERROR_MESSAGE);
            }
          }, function(res) {
            jsBridge.toast(res.message || $util.ERROR_MESSAGE);
          });
        };
        fileReader.readAsDataURL(file);
      }
      else {
        all--;
        if(count === all) {
          uploading = false;
          self.imgNum = self.list.length;
        }
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
      self.workId = self.worksId = self.cover = null;
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
    let circleIdHash = [];
    $ul.find('.on').each((i, o) => {
      let $o = $(o);
      circleIdHash[$o.attr('rel')] = true;
    });
    let list = [];
    self.circleList.forEach((item) => {
      if(circleIdHash[item.id] && item.tag) {
        list = list.concat(item.tag);
      }
    });
    self.tagList = list.concat(activity);
  }
  clickTag(e, vd, tvd) {
    let self = this;
    self.value += tvd.props.rel + ' ';
    self.input(null, self.ref.input);
    let describe = tvd.props.describe;
    if(describe) {
      let $tip = $(self.ref.tip.element);
      $tip.text(describe);
      $tip.removeClass('fn-hide');
      setTimeout(function() {
        $tip.addClass('fn-hide');
      }, 3000);
    }
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
            return <li class={ item.id === this.circleId ? 'on' : '' }
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
            return <li rel={ item.value || ('#' + item.name + '#') }
                       describe={ item.describe }>{ item.name }</li>;
          })
        }
        </ul>
      </div>
      <div class={ 'limit' + (this.warnLength ? ' warn' : '') }>
        <strong>{ this.num }</strong> / { MAX_TEXT_LENGTH }
        <div class={ 'alt' + (this.isAuthor ? '' : ' fn-hide') + (this.useAuthor ? ' author' : '') }
             onClick={ this.clickAlt }>
          <img src={ $util.img(this.headUrl, 48, 48, 80) || '/src/common/head.png' }/>
          <span>{ this.name }</span>
        </div>
      </div>
      <div class="c">
        <textarea class="text"
                  ref="input"
                  placeholder="画个圈记录你的生活吧~"
                  onInput={ this.input }
                  maxLength={ MAX_TEXT_LENGTH }>{ this.value }</textarea>
      </div>
      <ul class="list"
          onClick={ { li: this.clickImg } }>
      {
        this.workId && this.worksId
          ? <li class="share"
                style={ 'background-image:url(' + ($util.img(this.cover, 120, 120, 80) || '/src/common/blank.png') + ')' }/>
          : ''
      }
      {
        (this.list || []).map(function(item, i) {
          return <li class={ 's' + item.state } idx={ i } rel={ item.url }
                     style={ 'background-image:url(' + $util.img(item.url, 120, 120, 80) + ')' }>
            <span>{ TEXT[item.state] }</span>
          </li>;
        })
      }
      </ul>
      <ul class="btn">
        <li class="tip">
          <div ref="tip"
               class="fn-hide"/>
        </li>
        <li class="pic"
            onClick={ this.album }>
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
