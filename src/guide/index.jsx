/**
 * Created by army on 2017/4/18.
 */

import qs from 'anima-querystring';

import './guide.html';
import './index.less';

import Step0 from './Step0.jsx';
import Step1 from './Step1.jsx';
import Step2 from './Step2.jsx';
import Step3 from './Step3.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let step = parseInt(search.step);
let nickName = search.nickName;

if(!step) {
  step = 0;
}

// let step0 = migi.render(
//   <Step0 isShow={ step == 0 } authorName={ authorName }/>,
//   '#page'
// );

jsBridge.ready(function() {
  jsBridge.refreshState(false);

  let step1 = migi.render(
    <Step1 isShow={ !step || step < 10 } nickName={ nickName }/>,
    '#page'
  );
  let step2 = migi.render(
    <Step2 isShow={ step === 10 }/>,
    '#page'
  );
  let step3 = migi.render(
    <Step3 isShow={ step === 11 }/>,
    '#page'
  );

  step1.on('next', function() {
    step1.hide();
    step2.show();
    step2.loadMore();
  });
  step2.on('next', function() {
    step2.hide();
    step3.show();
    step3.loadMore();
  });
  step3.on('next', function() {
    jsBridge.popWindow({
      guide: true,
    });
  });
});
