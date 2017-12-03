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
  }
  @bind _5SingUrl
  @bind _BilibiliUrl
  @bind _BaiduUrl
  @bind _WangyiUrl
  @bind _WeiboUrl
  render() {
    return <div class="link">
      <ul>
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
      </ul>
      <p>外站主页</p>
    </div>;
  }
}

export default Link;
