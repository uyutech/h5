/**
 * Created by army on 2017/6/18.
 */
 
class Link extends migi.Component {
  constructor(...data) {
    super(...data);
    this.on(migi.Event.DOM, function() {
      this.autoWidth();
    });
  }
  autoWidth() {
    let $root = $(this.element);
    let $c = $root.find('.c');
    let $ul = $c.find('ul');
    $c.css('width', $ul.width() + 1);
  }
  @bind _5SingUrl
  @bind _BilibiliUrl
  @bind _BaiduUrl
  @bind _WangyiUrl
  @bind _WeiboUrl
  click(e, vd, tvd) {
    e.preventDefault();
    let href = tvd.props.href;
    jsBridge.pushWindow(href);
  }
  render() {
    return <div class="link">
      <div class="c">
        <ul onClick={ { a: this.click } }>
          <li><a href={ this._5SingUrl } class={ this._5SingUrl ? '' : 'fn-hide' }><span>5sing</span></a></li>
          <li><a href={ this._BilibiliUrl } class={ this._BilibiliUrl ? 'bili' : 'fn-hide' }><span>b站</span></a></li>
          <li><a href={ this._BaiduUrl } class={ this._BaiduUrl ? 'baidu' : 'fn-hide' }><span>百度</span></a></li>
          <li><a href={ this._WangyiUrl } class={ this._WangyiUrl ? 'wangyi' : 'fn-hide' }><span>网易</span></a></li>
          <li><a href={ this._WeiboUrl } class={ this._WeiboUrl ? 'weibo' : 'fn-hide' }><span>微博</span></a></li>
        </ul>
      </div>
    </div>;
  }
}

export default Link;
