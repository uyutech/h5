/**
 * Created by army8735 on 2017/8/3.
 */

import './login.html';
import './index.less';

import Login from './Login.jsx';
import Other from './Other.jsx';

import qs from 'anima-querystring';

let search = qs.parse(location.search.replace(/^\?/, ''));
let popWindow = search.popWindow;
let goto = search.goto;

jsBridge.ready(function() {
  jsBridge.on('back', function(e) {
    e.preventDefault();
    jsBridge.popWindow({
      login: true
    });
  });

  let con = migi.render(
    <div class="con">
      <div class="niang">
        <div class="bg"></div>
        <div class="tip fn-hide"></div>
      </div>
      <Login ref="login" popWindow={ popWindow }/>
    </div>,
    document.body
  );
  let login = con.find(Login);
  let $bg = $(con.element).find('.bg');
  let $tip = $(con.element).find('.tip');
  login.on('change', function() {
    $bg.toggleClass('alt');
    $tip.addClass('fn-hide');
    $tip.html('');
  });
  login.on('tip', function(ok, mes) {
    if(ok) {
      $tip.addClass('fn-hide');
      $tip.html('');
    }
    else {
      $tip.removeClass('fn-hide');
      $tip.html(mes);
    }
  });
  requestAnimationFrame(function() {
    $bg.addClass('alt');
  });

  migi.render(
    <Other popWindow={ popWindow }/>,
    document.body
  );
});
