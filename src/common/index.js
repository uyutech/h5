import 'migi-es6-shim';
import 'migi';
import $ from 'anima-yocto-event';
// import './750.js';
import './index.less';
import bridge from './bridge.js';

window.bridge = bridge;
window.$ = $;
