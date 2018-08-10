/**
 * Created by army8735 on 2018/2/24.
 */

'use strict';

let uploading;

class Nav extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.checkIn = {};
    self.on(migi.Event.DOM, function() {
      jsBridge.on('resume', function(e) {
        if(e && e.data && e.data.settle) {
          self.authorId = e.data.author[0].id;
        }
      });
    });
  }
  @bind userId
  @bind nickname
  @bind headUrl
  @bind sex
  @bind sign
  @bind isFollow
  @bind followPersonCount
  @bind isFans
  @bind fansCount
  @bind authorId
  @bind checkIn
  @bind isChecking
  setData(data, author, followPersonCount, fansCount, checkIn) {
    data = data || {};
    author = author || {};
    let self = this;
    self.data = data;
    self.author = author;
    self.userId = data.id;
    self.headUrl = data.headUrl;
    self.nickname = data.nickname;
    self.sex = data.sex;
    self.sign = data.sign;
    self.followPersonCount = followPersonCount;
    self.fansCount = fansCount;
    self.checkIn = checkIn || {};
    if(author && author.length) {
      self.authorId = author[0].id;
    }
    else {
      self.authorId = null;
    }
  }
  clickPic(e) {
    if(!$util.isLogin()) {
      e.preventDefault();
    }
  }
  change(e) {
    let self = this;
    if(uploading) {
      jsBridge.toast('有头像正在上传中...');
      return;
    }
    if(!$util.isLogin()) {
      e.preventDefault();
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    uploading = true;
    let files = e.target.files;
    if(files.length > 1) {
      jsBridge.toast('只能选择一张图片作为头像哦~');
      return;
    }
    let file = files[0];
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
      fileReader.onload = function() {
        let spark = new SparkMd5();
        spark.append(fileReader.result);
        let md5 = spark.end();
        $net.postJSON('/h5/my/sts', { name: md5 + suffix }, function(res) {
          if(res.success) {
            let data = res.data;
            if(data.exist) {
              self.headUrl = '//zhuanquan.xyz/pic/' + md5 + suffix;
              $net.postJSON('/h5/my/headUrl', { value: self.headUrl }, function(res) {
                if(res.success) {
                  jsBridge.getPreference(self.props.cacheKey, function(data) {
                    if(data) {
                      data.user.headUrl = self.headUrl;
                      jsBridge.setPreference(self.props.cacheKey, data);
                    }
                  });
                }
                else {
                  jsBridge.toast(res.message || $util.ERROR_MESSAGE);
                }
                uploading = false;
              }, function(res) {
                jsBridge.toast(res.message || $util.ERROR_MESSAGE);
              });
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
                self.headUrl = '//zhuanquan.xyz/pic/' + md5 + suffix;
                $net.postJSON('/h5/my/headUrl', { value: self.headUrl }, function(res) {
                  if(res.success) {
                    jsBridge.getPreference(self.props.cacheKey, function(data) {
                      if(data) {
                        data.user.headUrl = self.headUrl;
                        jsBridge.setPreference(self.props.cacheKey, data);
                      }
                    });
                  }
                  else {
                    jsBridge.toast(res.message || $util.ERROR_MESSAGE);
                  }
                  uploading = false;
                }, function(res) {
                  jsBridge.toast(res.message || $util.ERROR_MESSAGE);
                });
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
      jsBridge.toast('图片体积太大了，不能超过10m！');
    }
  }
  clickName() {
    let self = this;
    jsBridge.prompt(self.nickname, function(res) {
      if(res.success) {
        let nickname = res.value;
        let length = nickname.length;
        if(length < 2 || length > 8) {
          jsBridge.toast('昵称长度需要在2~8个字之间哦~');
          return;
        }
        if(nickname !== self.nickname) {
          $net.postJSON('/h5/my/nickname', { value: nickname }, function(res) {
            if(res.success) {
              self.nickname = nickname;
              jsBridge.getPreference(self.props.cacheKey, function(data) {
                if(data) {
                  data.nickname = nickname;
                  jsBridge.setPreference(self.props.cacheKey, data);
                }
              });
            }
            else {
              jsBridge.toast(res.message || $util.ERROR_MESSAGE);
            }
          }, function(res) {
            jsBridge.toast(res.message || $util.ERROR_MESSAGE);
          });
        }
      }
    });
  }
  clickSign() {
    let self = this;
    jsBridge.prompt(self.sign, function(res) {
      if(res.success) {
        let sign = res.value;
        let length = sign.length;
        if(length > 45) {
          jsBridge.toast('签名长度不能超过45个字哦~');
          return;
        }
        if(sign !== self.sign) {
          $net.postJSON('/h5/my/sign', { value: sign }, function(res) {
            if(res.success) {
              self.sign = sign;
              jsBridge.getPreference(self.props.cacheKey, function(data) {
                if(data) {
                  data.info.sign = sign;
                  jsBridge.setPreference(self.props.cacheKey, data);
                }
              });
            }
            else {
              jsBridge.toast(res.message || $util.ERROR_MESSAGE);
            }
          }, function(res) {
            jsBridge.toast(res.message || $util.ERROR_MESSAGE);
          });
        }
      }
    });
  }
  clickPersonal() {
    jsBridge.pushWindow('/user.html?id=' + this.userId, {
      transparentTitle: true,
    });
  }
  clickAuthor() {
    if(this.authorId) {
      jsBridge.pushWindow('/author.html?id=' + this.authorId, {
        transparentTitle: true,
      });
    }
    else {
      jsBridge.pushWindow('/settle.html', {
        title: '申请作者',
      });
    }
  }
  clickFollow() {
    jsBridge.pushWindow('/my_relation.html?tag=' + 1, {
      title: '圈关系',
    });
  }
  clickFans() {
    jsBridge.pushWindow('/my_relation.html?tag=' + 2, {
      title: '圈关系',
    });
  }
  clickCheckIn() {
    let self = this;
    if(self.isChecking) {
      return;
    }
    self.isChecking = true;
    $net.postJSON('/h5/my/checkIn', function(res) {
      if(res.success) {
        self.checkIn = {
          num: res.data,
          state: true,
        };
        jsBridge.toast(`转圈打卡第${res.data}天，圈儿奉上圈币10枚！`);
        self.emit('incrementCoins', 10);
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
        self.isChecking = false;
      }
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      self.isChecking = false;
    });
  }
  render() {
    return <div class="nav">
      <div class="profile">
        <div class="pic">
          <img src={ $util.img(this.headUrl, 200, 200, 80) || '/src/common/head.png' }/>
          <input type="file"
                 onClick={ this.clickPic }
                 onChange={ this.change }/>
        </div>
        <div class="txt">
          <div class="n">
            <h3>{ this.nickname }</h3>
            <b class={ 'edit' + (this.userId ? '' : ' fn-hide') }
               onClick={ this.clickName }/>
          </div>
          <p>uid: { (this.userId ? this.userId.toString() : '').replace(/^20180*/, '') }</p>
        </div>
        <button class={ this.userId ? '' : ' fn-hide' }
                onClick={ this.clickPersonal }>个人主页</button>
        <button class={ 'author' + (this.userId ? '' : ' fn-hide') }
                onClick={ this.clickAuthor }>{ this.authorId ? '作者主页' : '申请作者' }</button>
      </div>
      <ul class="num">
        <li onClick={ this.clickFollow }>关注<strong>{ this.followPersonCount || 0 }</strong></li>
        <li onClick={ this.clickFans }>粉丝<strong>{ this.fansCount || 0 }</strong></li>
      </ul>
      <div class="sign">
        <label>签名</label>
        <span>{ this.sign || '暂时还没有签名哦~' }</span>
        <b class={ 'edit' + (this.userId ? '' : ' fn-hide') }
           onClick={ this.clickSign }/>
      </div>
      <p class="check-in">已连续签到<strong>{ this.checkIn.num || 0 }</strong>天。
      <span class={ this.isChecking || this.checkIn.state ? 'ing' : '' }
            onClick={ this.clickCheckIn }>{ this.checkIn.state ? '已签' : '签到' }</span>
      </p>
    </div>;
  }
}

export default Nav;
