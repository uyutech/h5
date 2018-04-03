/**
 * Created by army on 2017/6/16.
 */

import util from "../common/util";
import net from "../common/net";

let hash = {};

class Nav extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.loading = true;
    self.on(migi.Event.DOM, function() {
      jsBridge.on('optionMenu1', function() {
        migi.eventBus.emit('BOT_FN', {
          canFn: true,
          canFavor: true,
          favorText: '关注',
          favoredText: '已关注',
          isFavor: self.like,
          canBlock: true,
          canReport: true,
          blockText: '加入黑名单',
          canShare: true,
          canShareWb: true,
          canShareLink: true,
          clickFavor: function(botFn) {
            self.follow(function() {
              botFn.isFavor = self.like;
            });
          },
          clickBlock: function(botFn) {
            self.block(self.authorId, function() {
              jsBridge.toast('屏蔽成功');
              botFn.cancel();
            });
          },
          clickReport: function(botFn) {
            self.report(self.authorId, function() {
              jsBridge.toast('举报成功');
              botFn.cancel();
            });
          },
          clickShareWb: function() {
            let url = window.ROOT_DOMAIN + '/author/' + self.authorId;
            let text = self.authorName + ' 来欣赏【' + self.authorName + '】的作品吧~ ';
            text += ' #转圈circling# ';
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
          },
          clickShareLink: function() {
            util.setClipboard(window.ROOT_DOMAIN + '/author/' + self.authorId);
          },
        });
      });
    });
  }
  @bind authorId
  @bind name
  @bind aliases
  @bind sign
  @bind authorType = []
  @bind headUrl
  @bind fansCount
  @bind like
  @bind loading
  @bind settled
  @bind outsides
  @bind isFollow
  setData(data, aliases, fansCount, outsides, isFollow) {
    let self = this;
    self.authorId = data.id;
    self.name = data.name;
    self.headUrl = data.headUrl;
    self.sign = data.sign;
    self.aliases = aliases;
    self.fansCount = fansCount;
    self.outsides = outsides;
    self.isFollow = isFollow;
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
        net.postJSON('/h5/author2/unFollow', { authorId: self.authorId }, function(res) {
          if(res.success) {
            self.isFollow = false;
            self.fansCount = res.data.count;
            cb && cb();
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
      net.postJSON('/h5/author2/follow', { authorId: self.authorId } , function(res) {
        if(res.success) {
          self.isFollow = true;
          self.fansCount = res.data.count;
          cb && cb();
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
  block(id, cb) {
    if(!util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    jsBridge.confirm('确认屏蔽吗？', function(res) {
      if(!res) {
        return;
      }
      net.postJSON('/h5/report/index', { reportType: 5, businessId: id }, function(res) {
        if(res.success) {
          cb && cb();
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      });
    });
  }
  report(id, cb) {
    jsBridge.confirm('确认举报吗？', function(res) {
      if(!res) {
        return;
      }
      net.postJSON('/h5/report/index', { reportType: 2, businessId: id }, function(res) {
        if(res.success) {
          cb && cb();
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      });
    });
  }
  render() {
    return <div class="nav">
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
          </div>
          <p class={ 'alias' + (this.aliases ? '' : ' fn-hide') }>别名：{ (this.aliases || []).map(function(item) {
            return item.alias;
          }).join(' ') }</p>
        </div>
        <button class={ (this.isFollow ? 'un-follow' : 'follow') + (this.loading ? ' loading' : '') }
                onClick={ this.clickFollow }>{ this.isFollow ? '已关注' : '关 注' }</button>
      </div>
      <ul class="plus">
        <li class="fans">粉丝<strong>{ this.fansCount || '0' }</strong></li>
        <li class="outsides" onClick={ { a: this.clickOut } }>
          <span>外站</span>
          {
            (this.outsides || []).map(function(item) {
              return <a target="_blank" href={ item.url } class={ 't' + item.type }/>;
            })
          }
        </li>
      </ul>
    </div>;
  }
}

export default Nav;
