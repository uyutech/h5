/**
 * Created by army on 2017/6/18.
 */
 
class Link extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self._5SingUrl = self.props.authorDetail._5SingUrl;
    self._BilibiliUrl = self.props.authorDetail._BilibiliUrl;
    self._BaiduUrl = self.props.authorDetail._BaiduUrl;
    self._WangyiUrl = self.props.authorDetail._WangyiUrl;
    self._WeiboUrl = self.props.authorDetail._WeiboUrl;
    self.HuabanUrl = self.props.authorDetail.HuabanUrl;
    self.LofterUrl = self.props.authorDetail.LofterUrl;
    self.POCOUrl = self.props.authorDetail.POCOUrl;
    self.ZcooUrl = self.props.authorDetail.ZcooUrl;
  }
  @bind _5SingUrl
  @bind _BilibiliUrl
  @bind _BaiduUrl
  @bind _WangyiUrl
  @bind _WeiboUrl
  @bind HuabanUrl
  @bind LofterUrl
  @bind POCOUrl
  @bind ZcooUrl
  click(e, vd, tvd) {
    e.preventDefault();
    jsBridge.confirm('即将离开前往站外，确认吗？', function(res) {
      if(res) {
        jsBridge.openUri(tvd.props.href);
      }
    });
  }
  render() {
    return <div class="link">
      <ul onClick={ { a: this.click } }>
        {
          this._5SingUrl ? <li><a target="_blank" href={ this._5SingUrl } class="sing5">5sing</a></li> : ''
        }
        {
          this._BilibiliUrl ? <li><a target="_blank" href={ this._BilibiliUrl } class="bilibili">b站</a></li> : ''
        }
        {
          this._BaiduUrl ? <li><a target="_blank" href={ this._BaiduUrl } class="baidu">百度</a></li> : ''
        }
        {
          this._WangyiUrl ? <li><a target="_blank" href={ this._WangyiUrl } class="wangyi">网易</a></li> : ''
        }
        {
          this._WeiboUrl ? <li><a target="_blank" href={ this._WeiboUrl } class="weibo">微博</a></li> : ''
        }
        {
          this.HuabanUrl ? <li><a target="_blank" href={ this.HuabanUrl } class="huaban">花瓣</a></li> : ''
        }
        {
          this.LofterUrl ? <li><a target="_blank" href={ this.LofterUrl } class="lofter">lofter</a></li> : ''
        }
        {
          this.POCOUrl ? <li><a target="_blank" href={ this.POCOUrl } class="poco">poco</a></li> : ''
        }
        {
          this.ZcooUrl ? <li><a target="_blank" href={ this.ZcooUrl } class="zcoo">站酷</a></li> : ''
        }
      </ul>
      <p>外站主页</p>
    </div>;
  }
}

export default Link;
