/**
 * Created by army8735 on 2017/8/3.
 */

import './login.html';
import './index.less';

import Login from './Login.jsx';
import Other from './Other.jsx';

jsBridge.ready(function() {
  let con = migi.render(
    <div class="con">
      <div class="niang">
        <div class="bg"></div>
        <div class="tip">{ history.length }<span>b</span></div>
      </div>
      <Login ref="login"/>
    </div>,
    document.body
  );
  let login = con.find(Login);
  let $bg = $(con.element).find('.bg');
  let niang = con.find('.niang');
  login.on('change', function() {
    $bg.toggleClass('alt');
  });
  requestAnimationFrame(function() {
    $bg.addClass('alt');
  });
  migi.render(
    <Other/>,
    document.body
  );
});
