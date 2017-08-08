/**
 * Created by army8735 on 2017/8/3.
 */

class Other extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  weibo() {
    jsBridge.showLoading('打开微博中...');
    jsBridge.loginWeibo(function(res) {
      jsBridge.hideLoading();
      console.log(JSON.stringify(res));
      if(res.success) {
        jsBridge.showLoading('登录中...');
        util.postJSON('api/Users/WeiboLogin', { mAccessTokenuid: res.openId, access_token: res.token }, function(res2) {
          console.log(JSON.stringify(res2));
          jsBridge.hideLoading();
        }, function() {
          jsBridge.hideLoading();
          jsBridge.toast('人气大爆发，请稍后再试。');
        });
      }
      else {
        jsBridge.toast(res.message);
      }
    });
  }
  render() {
    return <div class="other">
      <h5><b></b><span>其它账号登陆</span><b></b></h5>
      <ul>
        <li>
          <b class="weibo" onClick={ this.weibo }></b>
        </li>
      </ul>
    </div>;
  }
}

export default Other;
