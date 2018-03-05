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
let step = parseInt(search.step) || 0;
let nickName = search.nickName;
let isAuthor = !!search.isAuthor;
let authorId = search.authorId;
let authorName = search.authorName;
let authorState = parseInt(search.authorState) || 0; // 0初始状态，1为公开入驻，2为马甲入驻，3为放弃入住

/**
 * 状态0初始，作者选是否公开，公开跳11否则跳10/用户直接跳10
 * 老数据部分1的视为0
 * 状态10去改名字
 * 状态11选关注圈子
 * 状态12选关注人
 * 状态99用户完成
 * 状态100作为作者完成
 */

jsBridge.ready(function() {
  jsBridge.refreshState(false);

  let step0 = migi.render(
    <Step0 isShow={ isAuthor && authorState === 0 }
           step={ step }
           authorId={ authorId }
           authorName={ authorName }
           authorState={ authorState }/>,
    '#page'
  );
  let step1 = migi.render(
    <Step1 isShow={ (!isAuthor || authorState !== 0) && step <= 10 }
           isAuthor={ isAuthor }
           nickName={ nickName }
           authorName={ authorName }
           authorState={ authorState }/>,
    '#page'
  );
  let step2 = migi.render(
    <Step2 isShow={ (!isAuthor || authorState !== 0) && step === 11 }/>,
    '#page'
  );
  let step3 = migi.render(
    <Step3 isShow={ (!isAuthor || authorState !== 0) && step === 12 }/>,
    '#page'
  );

  step0.on('next', function(authorState) {
    step0.hide();
    // 99以上为老用户，引导已经走过了，只走入住流程
    if(step >= 99) {
      jsBridge.popWindow({
        guide: true,
      });
      return;
    }
    step1.authorState = authorState;
    step1.show();
  });
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

  window.addEventListener('scroll', function() {
    let y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    let height = document.body.clientHeight;
    if(y + screen.availHeight + 30 > height) {
      step2.loadMore();
      step3.loadMore();
    }
  });
});
