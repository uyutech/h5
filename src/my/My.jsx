/**
 * Created by army8735 on 2017/11/28.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';

class My extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {return;
      net.postJSON('/h5/my/index', function(res) {
        if(res.success) {
          self.setData(res.data);
        }
        else if(res.code === 1000) {
          //
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      });
    });
  }
  @bind hasData
  @bind isLogin
  show() {
    $(this.element).removeClass('fn-hide');
  }
  hide() {
    $(this.element).addClass('fn-hide');
  }
  setData(data) {}
  render() {
    return <div class="my">
      {
        this.hasData
          ? <div class="login">
              <span class="weibo" onClick={ this.clickWeibo }>微博登录</span>
            </div>
          : <div class="fn-placeholder"/>
      }
    </div>;
  }
}

export default My;
