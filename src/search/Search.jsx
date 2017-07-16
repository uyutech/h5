/**
 * Created by army on 2017/7/16.
 */
 
let $window = $(window);

class Search extends migi.Component {
  constructor(...data) {
    super(...data);
    this.scrollTop = 0;
  }
  show() {
    this.scrollTop = $window.scrollTop();
    $('html').addClass('noscroll');
    jsBridge.swipeRefresh(false);
    let $elem = $(this.element);
    $elem.addClass('show');
    setTimeout(function() {
      $elem.addClass('shows');
    }, 100);
  }
  hide() {
    $('html').removeClass('noscroll');
    jsBridge.swipeRefresh(true);
    $window.scrollTop(this.scrollTop);
    let $elem = $(this.element);
    $elem.removeClass('shows');
    setTimeout(function() {
      $elem.removeClass('show');
    }, 200);
  }
  cancel(e) {
    e.preventDefault();
    this.hide();
  }
  render() {
    return <div class="wd_search">
      <div class="ti">
        <div class="form">
          <input type="text" placeholder="河图新歌《寻常》发布"/>
        </div>
        <span onClick={ this.cancel }>取消</span>
      </div>
      <div class="c">
        <div class="history">
          <div class="ti">
            <span>搜索历史</span>
            <a href="#">清除</a>
          </div>
          <ul class="list fn-clear">
            <li>河图</li>
            <li>河图</li>
            <li>河图</li>
            <li>河图</li>
            <li>河图</li>
          </ul>
        </div>
        <div class="hot">
          <div class="ti">搜索历史</div>
          <ul class="list">
            <li>
              <span>1</span>
              <strong>关键字</strong>
              <small>· 作者</small>
            </li>
            <li>
              <span>2</span>
              <strong>关键字</strong>
              <small>· 作者</small>
            </li>
            <li>
              <span>3</span>
              <strong>关键字</strong>
              <small>· 作者</small>
            </li>
            <li>
              <span>4</span>
              <strong>关键字</strong>
              <small>· 作者</small>
            </li>
          </ul>
        </div>
      </div>
    </div>;
  }
}

export default Search;
