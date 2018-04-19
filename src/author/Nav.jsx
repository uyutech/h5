/**
 * Created by army on 2017/6/16.
 */

import util from "../common/util";
import net from "../common/net";

class Nav extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      jsBridge.on('optionMenu1', function() {
        migi.eventBus.emit('BOT_FN', {
          canFn: true,
          canBlock: true,
          canReport: true,
          blockText: '加入黑名单',
          clickBlock: function(botFn) {
            if(!util.isLogin()) {
              migi.eventBus.emit('NEED_LOGIN');
              return;
            }
            let id = self.id;
            jsBridge.confirm('确认加入黑名单吗？', function(res) {
              if(!res) {
                return;
              }
              net.postJSON('/h5/author2/black', { id }, function(res) {
                if(res.success) {
                  jsBridge.toast('加入黑名单成功');
                }
                else if(res.code === 1000) {
                  migi.eventBus.emit('NEED_LOGIN');
                }
                else {
                  jsBridge.toast(res.message || util.ERROR_MESSAGE);
                }
                botFn.cancel();
              }, function(res) {
                jsBridge.toast(res.message || util.ERROR_MESSAGE);
                botFn.cancel();
              });
            });
          },
          clickReport: function(botFn) {
            let id = self.id;
            jsBridge.confirm('确认举报吗？', function(res) {
              if(!res) {
                return;
              }
              net.postJSON('/h5/author2/report', { id }, function(res) {
                if(res.success) {
                  jsBridge.toast('举报成功');
                }
                else {
                  jsBridge.toast(res.message || util.ERROR_MESSAGE);
                }
                botFn.cancel();
              }, function(res) {
                jsBridge.toast(res.message || util.ERROR_MESSAGE);
                botFn.cancel();
              });
            });
          },
        });
      });
    });
  }
  @bind id
  @bind name
  @bind aliases
  @bind skill
  @bind headUrl
  @bind fansCount
  @bind like
  @bind loading
  @bind settled
  @bind outside
  @bind isFollow
  setData(data, aliases, skill, outside, isFollow) {
    let self = this;
    self.id = data.id;
    self.name = data.name;
    self.headUrl = data.headUrl;
    self.fansCount = data.fansCount;
    self.aliases = aliases;
    self.skill = skill;
    self.outside = outside;
    self.isFollow = isFollow;
    self.loading = false;
  }
  clickFollow() {
    this.follow();
  }
  clickOut(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    jsBridge.openUri(url);
  }
  follow(cb) {
    if(!util.isLogin()) {
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
        net.postJSON('/h5/author2/unFollow', { id: self.id }, function(res) {
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
            jsBridge.toast(res.message || util.ERROR_MESSAGE);
          }
          self.loading = false;
        }, function(res) {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
          self.loading = false;
        });
      });
    }
    else {
      self.loading = true;
      net.postJSON('/h5/author2/follow', { id: self.id } , function(res) {
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
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
        self.loading = false;
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
        self.loading = false;
      });
    }
  }
  render() {
    return <div class="mod-nav">
      <div class="profile">
        <div class="pic">
          <img src={ util.autoSsl(util.img288_288_80(this.headUrl || '/src/common/head.png')) }/>
          {
            this.isSettle
              ? <b class="settled"
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
                return <li class={ 's' + item.id }
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
