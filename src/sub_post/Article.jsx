/**
 * Created by army8735 on 2018/7/27.
 */

'use strict';

import Step0 from './Step0.jsx';
import Step1 from './Step1.jsx';
import Step2 from './Step2.jsx';
import Step3 from './Step3.jsx';

let first = true;
let currentPriority = 0;
let cacheKey = 'article';
let workType;
let professionList = [];
let useAuthor;
let myInfo;

class Article extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.visible = self.props.visible;
    self.step = 0;
    migi.eventBus.on('useAuthor', function(res) {
      useAuthor = res;
    });
    migi.eventBus.on('myInfo', function(res) {
      myInfo = res;
    });
  }
  get visible() {
    return this._visible;
  }
  @bind
  set visible(v) {
    this._visible = v;
    if(first && v) {
      first = false;
      this.init();
    }
  }
  @bind step
  init() {
    let self = this;
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        try {
          self.setData(cache, 0);
        }
        catch(e) {}
      }
    });
    $net.postJSON('/h5/article/index', function(res) {
      if(res.success) {
        let data = res.data;
        jsBridge.setPreference(cacheKey, data);
        self.setData(data, 1);
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
    });
  }
  setData(data, priority) {
    if(priority < currentPriority) {
      return;
    }
    currentPriority = priority;

    let self = this;
    self.ref.step0.list = data;
  }
  next0(list, data) {
    let self = this;
    let upload = 0;
    workType = data;
    list.forEach((item) => {
      if(item && item.upload === 1) {
        upload = 1;
      }
    });
    if(list.length === 0) {
      self.step = 3;
    }
    else if(upload === 1) {
      self.ref.step1.list = list.filter((item) => {
        return item.upload !== 2;
      });
      self.step = 1;
    }
    else {
      jsBridge.showLoading();
      let idList = list.map((item) => {
        return item.workType;
      });
      $net.postJSON('/h5/article/profession', { idList }, function(res) {
        jsBridge.hideLoading();
        if(res.success) {
          self.next1(list);
        }
        else {
          jsBridge.toast(res.message || $util.ERROR_MESSAGE);
        }
      }, function(res) {
        jsBridge.hideLoading();
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      });
    }
  }
  next1(list) {
    let self = this;
    let list1 = [];
    let list2 = [];
    let hash = {};
    list.forEach((arr) => {
      arr.forEach((item) => {
        if(!hash[item.id]) {
          hash[item.id] = true;
          if(item.show) {
            list1.push(item);
          }
          else {
            list2.push(item);
          }
        }
      });
    });
    self.ref.step2.list1 = list1;
    self.ref.step2.list2 = list2;
    self.ref.step2.hasMore = !!list2.length;
    self.step = 2;
  }
  next2(list1, list2) {
    let self = this;
    list1 = list1 || [];
    list2 = list2 || [];
    professionList = list1.concat(list2);
    self.step = 3;
  }
  next3(text) {
    if(!$util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    let self = this;
    let p = professionList.map((item) => {
      return '#' + item.name + '#';
    });
    let content = `#${workType.name}#招募${p.join('、')}啦！\n${text}`;
    let authorId;
    if(useAuthor && myInfo && myInfo.author && myInfo.author.length) {
      authorId = myInfo.author[0].id;
    }
    jsBridge.showLoading();
    $net.postJSON('/h5/subPost/sub', {
      content,
      authorId,
      circleId: 2019000000008345,
    }, function(res) {
      jsBridge.hideLoading();
      if(res.success) {
        jsBridge.toast('恭喜你在成功发布了约稿~请留意信箱中的评论提醒哦！');
        jsBridge.popWindow();
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
        self.ref.step3.finish = false;
      }
    }, function(res) {
      jsBridge.hideLoading();
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
    });
  }
  render() {
    return <div class={ 'mod-article' + (this.visible ? '' : ' fn-hide') }>
      <Step0 ref="step0"
             on-next={ this.next0 }
             @visible={ this.step === 0 }/>
      <Step1 ref="step1"
             on-next={ this.next1 }
             @visible={ this.step === 1 }/>
      <Step2 ref="step2"
             on-next={ this.next2 }
             @visible={ this.step === 2 }/>
      <Step3 ref="step3"
             on-next={ this.next3 }
             @visible={ this.step === 3 }/>
    </div>
  }
}

export default Article;
