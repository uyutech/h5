/**
 * Created by army8735 on 2017/8/3.
 */

class Other extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  weibo() {
    let self = this;
    jsBridge.showLoading('打开微博中...');
    jsBridge.loginWeibo(function(res) {
      jsBridge.hideLoading();
      if(res.success) {
        jsBridge.showLoading('登录中...');
        util.postJSON('api/Users/WeiboLogin', { mAccessTokenuid: res.openId, access_token: res.token }, function(res2) {
          jsBridge.hideLoading();
          if(res2.success) {
            let sessionid = res2.data.sessionid;
            jsBridge.setCookie('sessionid', sessionid, function() {
              let regStat = res2.data.User_Reg_Stat;
              if(regStat >= 4) {
                let goto = self.props.goto;
                if(goto) {
                  location.replace(goto);
                  return;
                }
                location.replace('index.html');
              }
              else {
                let authorName = res2.data.AuthorName;
                location.replace('guide.html?step=' + regStat + '&authorName=' + encodeURIComponent(authorName));
              }
            });
          }
          else {
            jsBridge.toast(res2.message || util.ERROR_MESSAGE);
          }
        }, function() {
          jsBridge.hideLoading();
          jsBridge.toast(util.ERROR_MESSAGE);
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
