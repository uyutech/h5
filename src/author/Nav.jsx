/**
 * Created by army on 2017/6/16.
 */

import Profile from './Profile.jsx';
import Link from './Link.jsx';
import authorTemplate from "../component/author/authorTemplate";
import util from "../common/util";
import net from "../common/net";

class Nav extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.authorId = self.props.authorId;
    self.loading = true;
    if(self.props.authorDetail) {
      self.setData(self.props.authorDetail);
    }
  }
  @bind authorId
  @bind authorName
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
  setData(data) {
    let self = this;
    self.authorName = data.AuthorName;
    self.sign = data.Sign;
    self.headUrl = data.Head_url;
    self.fansNumber = data.FansNumber;
    self.like = data.IsLike;
    self.settled = data.ISSettled;
    self.type = data.Authortype;
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
  set type(v) {
    v = v || [];
    let hash = {};
    v.forEach(function(item) {
      let css = (authorTemplate.code2Data[item.AuthorTypeID] || {}).css || '';
      hash[css] = true;
    });
    this.authorType = Object.keys(hash);
  }
  clickFollow(e) {
    e.preventDefault();
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
              this.authorType.map(function(item) {
                return <span class={ `cp-author-type-${item}` }/>;
              })
            }
          </div>
        </div>
        <button class={ (this.like ? 'un-follow' : 'follow') + (this.loading ? ' loading' : '') }
                onClick={ this.clickFollow }>{ this.like ? '已关注' : '关 注' }</button>
      </div>
      <ul class="plus">
        <li class="fans">粉丝<strong>{ this.fansNumber || '0' }</strong></li>
        <li class="outside">
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
