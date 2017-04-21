/**
 * Created by army on 2017/4/18.
 */

import './guide.html';
import './index.less';

import Step1 from './Step1.jsx';
import Step2 from './Step2.jsx';

let step1 = migi.render(
  <Step1/>,
  document.body
);
let step2 = migi.render(
  <Step2/>,
  document.body
);
