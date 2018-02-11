/**
 * Created by army on 2017/6/16.
 */

import authorTemplate from "../component/author/authorTemplate";
import util from "../common/util";
import net from "../common/net";

let currentPriority = 0;
let hash = {};

class Nav extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.loading = true;
    self.on(migi.Event.DOM, function() {
      jsBridge.on('optionMenu1', function() {
        migi.eventBus.emit('BOT_FN', {
          canFavor: true,
          favorText: '关注',
          favoredText: '已关注',
          isFavor: self.like,
          canBlock: true,
          canReport: true,
          blockText: '加入黑名单',
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
        });
      });
    });
  }
  @bind authorId
  @bind authorName
  @bind authorAliasName
  @bind sign
  @bind authorType = []
  @bind headUrl
  @bind fansNumber
  @bind like
  @bind loading
  @bind settled
  @bind _5SingUrl
  @bind _BilibiliUrl
  @bind _BaiduUrl
  @bind _WangyiUrl
  @bind _WeiboUrl
  @bind HuabanUrl
  @bind LofterUrl
  @bind POCOUrl
  @bind ZcooUrl
  setData(data, priority) {
    priority = priority || 0;
    if(priority < currentPriority) {
      return;
    }
    let self = this;
    hash = {};
    jsBridge.setPreference('authorPageNav_' + self.authorId, data);
    self.authorName = data.AuthorName;
    self.authorAliasName = data.AuthorAliasName;
    self.sign = data.Sign;
    self.headUrl = data.Head_url;
    self.fansNumber = data.FansNumber;
    self.like = data.IsLike;
    self.settled = data.ISSettled;
    self.authorType = data.Authortype;
    self._5SingUrl = data._5SingUrl;
    self._BilibiliUrl = data._BilibiliUrl;
    self._BaiduUrl = data._BaiduUrl;
    self._WangyiUrl = data._WangyiUrl;
    self._WeiboUrl = data._WeiboUrl;
    self.HuabanUrl = data.HuabanUrl;
    self.LofterUrl = data.LofterUrl;
    self.POCOUrl = data.POCOUrl;
    self.ZcooUrl = data.ZcooUrl;
    self.loading = false;
  }
  clickFollow(e) {
    e.preventDefault();
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
    if(self.like) {
      jsBridge.confirm('确定取关吗？', function(res) {
        if(!res) {
          return;
        }
        self.loading = true;
        net.postJSON('/h5/author/unFollow', { authorID: self.authorId }, function(res) {
          if(res.success) {
            self.like = false;
            self.fansNumber = res.data.followCount;
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
      net.postJSON('/h5/author/follow', { authorID: self.authorId } , function(res) {
        if(res.success) {
          self.like = true;
          self.fansNumber = res.data.followCount;
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
            this.settled ? <b class="settled" title="已入驻" onClick={ function() { jsBridge.toast('已入驻') } }/> : ''
          }
        </div>
        <div class="txt">
          <div class="n">
            <h3>{ this.authorName }</h3>
            {
              (this.authorType || []).map(function(item) {
                let css = authorTemplate.code2css[item.NewAuthorTypeID];
                if(hash[css]) {
                  return;
                }
                hash[css] = true;
                return <span class={ `cp-author-type-${css}` }/>;
              })
            }
          </div>
          <p class={ 'alias' + (this.authorAliasName ? '' : ' fn-hide') }>别名：{ this.authorAliasName }</p>
        </div>
        <button class={ (this.like ? 'un-follow' : 'follow') + (this.loading ? ' loading' : '') }
                onClick={ this.clickFollow }>{ this.like ? '已关注' : '关 注' }</button>
      </div>
      <ul class="plus">
        <li class="fans">粉丝<strong>{ this.fansNumber || '0' }</strong></li>
        <li class="outside" onClick={ { a: this.clickOut } }>
          <span>外站</span>
          {
            this._5SingUrl ? <a target="_blank" href={ this._5SingUrl } class="sing5"/> : ''
          }
          {
            this._BilibiliUrl ? <a target="_blank" href={ this._BilibiliUrl } class="bilibili"/> : ''
          }
          {
            this._BaiduUrl ? <a target="_blank" href={ this._BaiduUrl } class="baidu"/> : ''
          }
          {
            this._WangyiUrl ? <a target="_blank" href={ this._WangyiUrl } class="wangyi"/> : ''
          }
          {
            this._WeiboUrl ? <a target="_blank" href={ this._WeiboUrl } class="weibo"/> : ''
          }
          {
            this.HuabanUrl ? <a target="_blank" href={ this.HuabanUrl } class="huaban"/> : ''
          }
          {
            this.LofterUrl ? <a target="_blank" href={ this.LofterUrl } class="lofter"/> : ''
          }
          {
            this.POCOUrl ? <a target="_blank" href={ this.POCOUrl } class="poco"/> : ''
          }
          {
            this.ZcooUrl ? <a target="_blank" href={ this.ZcooUrl } class="zcoo"/> : ''
          }
        </li>
      </ul>
    </div>;
  }
}

export default Nav;
