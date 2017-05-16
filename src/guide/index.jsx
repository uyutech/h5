/**
 * Created by army on 2017/4/18.
 */

import qs from 'anima-querystring';

import './guide.html';
import './index.less';

import Step1 from './Step1.jsx';
import Step2 from './Step2.jsx';
import Step3 from './Step3.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let step = parseInt(search.step) || 0;

let step1 = migi.render(
  <Step1/>,
  document.body
);
let step2 = migi.render(
  <Step2/>,
  document.body
);
let step3 = migi.render(
  <Step3/>,
  document.body
);

step1.on('next', function() {
  step1.hide();
  step2.show();
  step++;
  step1.enable();
});
step2.on('next', function() {
  step2.hide();
  step3.show();
  step++;
  step2.enable();
});
step3.on('next', function() {
  //
});

switch (step) {
  case 2:
    step3.show();
    break;
  case 1:
    step2.show();
    break;
  default:
    step1.show();
    break;
}

jsBridge.ready(function() {
  jsBridge.on('back', function(e) {
    if(step) {
      e.preventDefault();
      console.log(step);
      switch (step) {
        case 2:
          step3.hide();
          step2.show();
          step--;
          break;
        case 1:
          step2.hide();
          step1.show();
          step--;
          break;
      }
    }
  });
});
