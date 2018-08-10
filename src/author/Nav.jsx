/**
 * Created by army on 2017/6/16.
 */

class Nav extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      jsBridge.on('optionMenu1', function() {
        let list = [
          [
            {
              class: 'share',
              name: '分享',
              click: function(botPanel) {
                if(!$util.isLogin()) {
                  migi.eventBus.emit('NEED_LOGIN');
                  return;
                }
                botPanel.cancel();
                jsBridge.pushWindow('/sub_post.html?content=' + encodeURIComponent('@/author/' + self.id), {
                  title: '画圈',
                });
              },
            },
            {
              class: 'wb',
              name: '微博',
              click: function(botPanel) {
                let url = window.ROOT_DOMAIN + '/author/' + self.id;
                let text = '来欣赏【' + self.name + '】的作品吧~ ';
                text += '#转圈circling# ';
                text += url;
                jsBridge.shareWb({
                  text,
                }, function(res) {
                  if(res.success) {
                    jsBridge.toast("分享成功");
                  }
                  else if(res.cancel) {
                    jsBridge.toast("取消分享");
                  }
                  else {
                    jsBridge.toast("分享失败");
                  }
                });
                botPanel.cancel();
              },
            },
            {
              class: 'link',
              name: '复制链接',
              click: function(botPanel) {
                $util.setClipboard(window.ROOT_DOMAIN + '/author/' + self.id);
                botPanel.cancel();
              },
            }
          ],
          [
            {
              class: 'block',
              name: '黑名单',
              click: function(botPanel) {
                let id = self.id;
                jsBridge.confirm('确认加入黑名单吗？', function(res) {
                  if(!res) {
                    return;
                  }
                  $net.postJSON('/h5/author/black', { id }, function(res) {
                    if(res.success) {
                      jsBridge.toast('加入黑名单成功');
                    }
                    else if(res.code === 1000) {
                      migi.eventBus.emit('NEED_LOGIN');
                    }
                    else {
                      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
                    }
                    botPanel.cancel();
                  }, function(res) {
                    jsBridge.toast(res.message || $util.ERROR_MESSAGE);
                    botPanel.cancel();
                  });
                });
              },
            },
            {
              class: 'report',
              name: '举报',
              click: function(botPanel) {
                let id = self.id;
                jsBridge.confirm('确认举报吗？', function(res) {
                  if(!res) {
                    return;
                  }
                  $net.postJSON('/h5/author/report', { id }, function(res) {
                    if(res.success) {
                      jsBridge.toast('举报成功');
                    }
                    else {
                      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
                    }
                    botPanel.cancel();
                  }, function(res) {
                    jsBridge.toast(res.message || $util.ERROR_MESSAGE);
                    botPanel.cancel();
                  });
                });
              },
            }
          ]
        ];
        migi.eventBus.emit('BOT_PANEL', list);
      });
    });
  }
  @bind id
  @bind name
  @bind aliases
  @bind headUrl
  @bind fansCount
  @bind like
  @bind loading
  @bind isSettle
  @bind outside
  @bind isFollow
  setData(data, aliases, outside, isFollow) {
    let self = this;
    self.id = data.id;
    self.name = data.name;
    self.headUrl = data.headUrl;
    self.fansCount = data.fansCount;
    self.isSettle = data.isSettle;
    self.aliases = aliases;
    self.outside = outside;
    self.isFollow = isFollow;
    self.loading = false;
  }
  clickFollow() {
    this.follow();
  }
  clickOut(e, vd, tvd) {
    e.preventDefault();
    jsBridge.confirm('即将前往站外链接，确定吗？', function(res) {
      if(!res) {
        return;
      }
      let url = tvd.props.href;
      jsBridge.openUri(url);
    });
  }
  follow(cb) {
    if(!$util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    let self = this;
    if(self.isFollow) {
      jsBridge.confirm('确定取关吗？', function(res) {
        if(!res) {
          return;
        }
        self.loading = true;
        $net.postJSON('/h5/author/unFollow', { id: self.id }, function(res) {
          if(res.success) {
            let data = res.data;
            self.isFollow = data.state;
            self.fansCount = data.count;
            cb && cb();
            self.emit('follow', data);
          }
          else if(res.code === 1000) {
            migi.eventBus.emit('NEED_LOGIN');
          }
          else {
            jsBridge.toast(res.message || $util.ERROR_MESSAGE);
          }
          self.loading = false;
        }, function(res) {
          jsBridge.toast(res.message || $util.ERROR_MESSAGE);
          self.loading = false;
        });
      });
    }
    else {
      self.loading = true;
      $net.postJSON('/h5/author/follow', { id: self.id } , function(res) {
        if(res.success) {
          let data = res.data;
          self.isFollow = data.state;
          self.fansCount = data.count;
          cb && cb();
          self.emit('follow', data);
        }
        else if(res.code === 1000) {
          migi.eventBus.emit('NEED_LOGIN');
        }
        else {
          jsBridge.toast(res.message || $util.ERROR_MESSAGE);
        }
        self.loading = false;
      }, function(res) {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
        self.loading = false;
      });
    }
  }
  render() {
    return <div class="mod-nav">
      <div class="profile">
        <div class="pic">
          <img src={ $util.img(this.headUrl, 288, 288, 80) || '/src/common/head.png' }/>
          {
            this.isSettle
              ? <b class="settle"
                   title="已入驻"
                   onClick={ function() { jsBridge.toast('已入驻') } }/>
              : ''
          }
        </div>
        <div class="txt">
          <div class="n">
            <h3>{ this.name }</h3>
            <ul class="skill">
            {
              (this.skill || []).map((item) => {
                return <li class={ item.code }
                           rel={ item.point }>{ item.name }</li>;
              })
            }
            </ul>
          </div>
          <p class={ 'aliases' + (this.aliases && this.aliases.length ? '' : ' fn-hide') }>别名：{ (this.aliases || []).map(function(item) {
            return item;
          }).join(' ') }</p>
        </div>
        <button class={ (this.isFollow ? 'un-follow' : 'follow') + (this.loading ? ' loading' : '') }
                onClick={ this.clickFollow }>{ this.isFollow ? '已关注' : '关 注' }</button>
      </div>
      <ul class="plus">
        <li class="fans">粉丝<strong>{ this.fansCount || '0' }</strong></li>
        <li class="outside"
            onClick={ { a: this.clickOut } }>
          <span>外站</span>
          {
            (this.outside || []).map(function(item) {
              return <a class={ 't' + item.type }
                        target="_blank"
                        href={ item.url }/>;
            })
          }
        </li>
      </ul>
    </div>;
  }
}

export default Nav;
