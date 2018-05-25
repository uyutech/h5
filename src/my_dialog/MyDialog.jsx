/**
 * Created by army8735 on 2018/5/25.
 */

'use strict';

import Dialog from './Dialog.jsx';

let offset = 0;
let loading;
let loadEnd;
let ajax;

class MyDialog extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  init(id) {
    let self = this;
    if(ajax) {
      ajax.abort();
    }
    self.id = id;
    ajax = $net.postJSON('/h5/my/dialogList', { id: self.id }, function(res) {
      if(res.success) {
        let data = res.data;
        self.setData(data);

        window.addEventListener('scroll', function() {
          self.checkMore();
        });
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
    });
  }
  setData(data) {
    let self = this;
    let dialog = self.ref.dialog;
    data.data.forEach((item) => {
      item.userInfo = data.userInfo;
      item.targetInfo = data.targetInfo;
    });
    dialog.setData(data.data);
    offset = data.limit;
    if(data.count === 0) {
      loadEnd = true;
      dialog.message = '暂无消息';
    }
    else if(offset >= data.count) {
      loadEnd = true;
      dialog.message = '已经到底了';
    }
  }
  checkMore() {
    let self = this;
    if(loading || loadEnd) {
      return;
    }
    if($util.isBottom()) {
      self.load();
    }
  }
  load() {
    let self = this;
    if(ajax) {
      ajax.abort();
    }
    let dialog = self.ref.dialog;
    loading = true;
    ajax = $net.postJSON('/h5/my/dialogList', { id: self.id, offset }, function(res) {
      if(res.success) {
        let data = res.data;
        data.data.forEach((item) => {
          item.userInfo = data.userInfo;
          item.targetInfo = data.targetInfo;
        });
        dialog.appendData(data.data);
        offset += data.limit;
        if(offset >= data.count) {
          loadEnd = true;
          dialog.message = '已经到底了';
        }
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
      loading = false;
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      loading = false;
    });
  }
  render() {
    return <div class="my-dialog">
      <Dialog ref="dialog"
              message={ '正在加载...' }/>
    </div>;
  }
}

export default MyDialog;
